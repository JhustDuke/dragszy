import { defineEventHandler, readBody, createError } from "h3";
import type { AiRequestFormat, AiResponseFormat } from "~/types";
import { openRouterAi, geminiAi } from "../../utils";

export default defineEventHandler(async function (
	event
): Promise<AiResponseFormat> {
	const requestBody = await readBody<AiRequestFormat>(event);

	let aiRawContent;

	try {
		aiRawContent = await geminiAi({
			userPrompt: requestBody.userPrompt,
			userMarkup: requestBody.userMarkup,
			stylingFramework: requestBody.stylingFramework,
		});
	} catch (aiRequestError) {
		console.error(aiRequestError); // still logs in terminal
		throw createError({
			statusCode: 502,
			statusMessage: "AI request failed",
			data: import.meta.dev ? String(aiRequestError) : undefined, // details only in dev
		});
	}

	// content is empty or not a plain string
	if (typeof aiRawContent !== "string" || aiRawContent === "") {
		throw createError({
			statusCode: 502,
			statusMessage: "AI returned an empty response",
		});
	}

	try {
		return JSON.parse(aiRawContent);
	} catch (parseError) {
		// model returned malformed JSON
		throw createError({
			statusCode: 502,
			statusMessage: "AI returned invalid JSON",
		});
	}
});
