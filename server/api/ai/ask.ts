import { defineEventHandler, readBody } from "h3";
import type { AiRequestFormat, AiResponseFormat } from "~/types";

export default defineEventHandler(async function (
	event
): Promise<AiResponseFormat> {
	const requestBody = await readBody<AiRequestFormat>(event);

	return new Promise<AiResponseFormat>(function (resolveWithMessage) {
		setTimeout(function () {
			// after 4 seconds, resolve with the final answer
			resolveWithMessage({
				aiResponse: `Mock AI response to: "${requestBody.userPrompt}"`,
				aiMarkup: "",
			});
		}, 4000);
	});
});
