import { useRuntimeConfig } from "#imports";
import { GoogleGenAI } from "@google/genai";

import type { AiRequestFormat } from "~/types";

export async function geminiAi({
	userPrompt,
	userMarkup = "",
	stylingFramework = "bs5",
}: AiRequestFormat) {
	const client = new GoogleGenAI({
		apiKey: useRuntimeConfig().geminiKey,
	});

	const stylingInstruction =
		stylingFramework === "tw"
			? "Use Tailwind CSS as the primary styling method."
			: "Use Bootstrap 5 as the primary styling method.";

	const response = await client.models.generateContent({
		model: "gemini-3.1-flash-lite", // use the Gemini model name you already had working
		contents: userPrompt + "\n\nSelected element HTML:\n" + userMarkup,
		config: {
			systemInstruction: `
				You edit HTML for a visual builder.

				${stylingInstruction}
				Use inline styles only when necessary.
				Do not use style tags.
				Do not use script tags.
				Do not use event attributes.
				Keep the markup about the same size.
			`,
			responseMimeType: "application/json",
			responseJsonSchema: {
				type: "object",
				properties: {
					aiResponse: { type: "string" },
					aiMarkup: { type: "string" },
				},
				required: ["aiResponse", "aiMarkup"],
			},
		},
	});

	return response.text;
}
