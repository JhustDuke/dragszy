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

    HTML STRUCTURE RULES:
    - Never return an element with id="app-root".
    - Never create or preserve a wrapper element with id="app-root".
    - The provided selected element may be inside the builder's app-root, but app-root itself is not part of the element being edited.
    - Return only the HTML for the edited element and its contents.
    - If the generated children need a parent container so they can be grouped, styled, positioned, or behave in a particular way together, create an appropriate new parent element instead of using or recreating #app-root.
    - That parent should have a meaningful element type and, when necessary, appropriate classes or inline styles.
    
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
