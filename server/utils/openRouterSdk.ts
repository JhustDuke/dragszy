import { useRuntimeConfig } from "#imports";
import type { AiRequestFormat } from "~/types";
import { OpenRouter } from "@openrouter/sdk";

const client = new OpenRouter({
	apiKey: useRuntimeConfig().openRouterKey,
});

const nvidiaModel = "nvidia/nemotron-3-ultra-550b-a55b:free";
export async function openRouterAi({
	userPrompt,
	userMarkup = "",
	stylingFramework = "bs5",
}: AiRequestFormat) {
	const stylingInstruction =
		stylingFramework === "tw"
			? "Use Tailwind CSS as the primary styling method."
			: "Use Bootstrap 5 as the primary styling method.";

	const response = await client.chat.send({
		chatRequest: {
			model: nvidiaModel,

			messages: [
				{
					role: "system",
					content: `
						You edit HTML for a visual builder.

						${stylingInstruction}
						Use inline styles only when necessary.
						Do not use style tags.
						Do not use script tags.
						Do not use event attributes.
						Keep the markup about the same size.
					`,
				},
				{
					role: "user",
					content: userPrompt + "\n\nSelected element HTML:\n" + userMarkup,
				},
			],

			responseFormat: {
				type: "json_schema",
				jsonSchema: {
					name: "dragzy_ai_response",
					strict: true,
					schema: {
						type: "object",
						properties: {
							aiResponse: {
								type: "string",
							},
							aiMarkup: {
								type: "string",
							},
						},
						required: ["aiResponse", "aiMarkup"],
						additionalProperties: false,
					},
				},
			},
		},
	});

	if (response instanceof ReadableStream) {
		throw new Error("Expected a non-streaming response");
	}

	return response.choices[0]?.message.content;
}
