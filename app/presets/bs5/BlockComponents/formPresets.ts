import type { CanvasElem } from "~/types";

//placeholder ids everywhere - createClone regenerates every one of these

//the moment a preset is actually placed, so these values never reach the canvas

//1. Login form - email, password, submit. The default "just a login" option.

const loginFormPreset: CanvasElem = {
	id: "preset-form-login",
	elemType: "form",
	textContent: "",
	cssClasses: ["card", "p-4", "w-100", "mx-auto"],
	props: {},
	customStyles: { maxWidth: "360px" },
	children: [
		{
			id: "preset-form-login-title",
			elemType: "h5",
			textContent: "Log In",
			cssClasses: ["mb-3"],
			props: {},
			customStyles: {},
			children: [],
		},
		{
			id: "preset-form-login-email-group",
			elemType: "div",
			textContent: "",
			cssClasses: ["mb-3"],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-form-login-email-label",
					elemType: "label",
					textContent: "Email address",
					cssClasses: ["form-label"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-form-login-email-input",
					elemType: "input",
					textContent: "",
					cssClasses: ["form-control"],
					props: { type: "email", placeholder: "you@example.com" },
					customStyles: {},
					children: [],
				},
			],
		},
		{
			id: "preset-form-login-password-group",
			elemType: "div",
			textContent: "",
			cssClasses: ["mb-3"],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-form-login-password-label",
					elemType: "label",
					textContent: "Password",
					cssClasses: ["form-label"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-form-login-password-input",
					elemType: "input",
					textContent: "",
					cssClasses: ["form-control"],
					props: { type: "password", placeholder: "••••••••" },
					customStyles: {},
					children: [],
				},
			],
		},
		{
			id: "preset-form-login-submit",
			elemType: "button",
			textContent: "Log In",
			cssClasses: ["btn", "btn-primary", "w-100"],
			props: { type: "submit" },
			customStyles: {},
			children: [],
		},
	],
};

//2. Signup form - name, email, password, confirm password, submit.

const signupFormPreset: CanvasElem = {
	id: "preset-form-signup",
	elemType: "form",
	textContent: "",
	cssClasses: ["card", "p-4", "w-100", "mx-auto"],
	props: {},
	customStyles: { maxWidth: "360px" },
	children: [
		{
			id: "preset-form-signup-title",
			elemType: "h5",
			textContent: "Create Account",
			cssClasses: ["mb-3"],
			props: {},
			customStyles: {},
			children: [],
		},
		{
			id: "preset-form-signup-name-group",
			elemType: "div",
			textContent: "",
			cssClasses: ["mb-3"],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-form-signup-name-label",
					elemType: "label",
					textContent: "Full Name",
					cssClasses: ["form-label"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-form-signup-name-input",
					elemType: "input",
					textContent: "",
					cssClasses: ["form-control"],
					props: { type: "text", placeholder: "Jane Doe" },
					customStyles: {},
					children: [],
				},
			],
		},
		{
			id: "preset-form-signup-email-group",
			elemType: "div",
			textContent: "",
			cssClasses: ["mb-3"],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-form-signup-email-label",
					elemType: "label",
					textContent: "Email address",
					cssClasses: ["form-label"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-form-signup-email-input",
					elemType: "input",
					textContent: "",
					cssClasses: ["form-control"],
					props: { type: "email", placeholder: "you@example.com" },
					customStyles: {},
					children: [],
				},
			],
		},
		{
			id: "preset-form-signup-password-group",
			elemType: "div",
			textContent: "",
			cssClasses: ["mb-3"],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-form-signup-password-label",
					elemType: "label",
					textContent: "Password",
					cssClasses: ["form-label"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-form-signup-password-input",
					elemType: "input",
					textContent: "",
					cssClasses: ["form-control"],
					props: { type: "password", placeholder: "••••••••" },
					customStyles: {},
					children: [],
				},
			],
		},
		{
			id: "preset-form-signup-confirm-group",
			elemType: "div",
			textContent: "",
			cssClasses: ["mb-3"],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-form-signup-confirm-label",
					elemType: "label",
					textContent: "Confirm Password",
					cssClasses: ["form-label"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-form-signup-confirm-input",
					elemType: "input",
					textContent: "",
					cssClasses: ["form-control"],
					props: { type: "password", placeholder: "••••••••" },
					customStyles: {},
					children: [],
				},
			],
		},
		{
			id: "preset-form-signup-submit",
			elemType: "button",
			textContent: "Sign Up",
			cssClasses: ["btn", "btn-primary", "w-100"],
			props: { type: "submit" },
			customStyles: {},
			children: [],
		},
	],
};

//3. Contact form - name, email, message, submit. Common "get in touch" shape.

const contactFormPreset: CanvasElem = {
	id: "preset-form-contact",
	elemType: "form",
	textContent: "",
	cssClasses: ["card", "p-4", "w-100", "mx-auto"],
	props: {},
	customStyles: { maxWidth: "480px" },
	children: [
		{
			id: "preset-form-contact-title",
			elemType: "h5",
			textContent: "Get In Touch",
			cssClasses: ["mb-3"],
			props: {},
			customStyles: {},
			children: [],
		},
		{
			id: "preset-form-contact-name-group",
			elemType: "div",
			textContent: "",
			cssClasses: ["mb-3"],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-form-contact-name-label",
					elemType: "label",
					textContent: "Name",
					cssClasses: ["form-label"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-form-contact-name-input",
					elemType: "input",
					textContent: "",
					cssClasses: ["form-control"],
					props: { type: "text", placeholder: "Your name" },
					customStyles: {},
					children: [],
				},
			],
		},
		{
			id: "preset-form-contact-email-group",
			elemType: "div",
			textContent: "",
			cssClasses: ["mb-3"],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-form-contact-email-label",
					elemType: "label",
					textContent: "Email",
					cssClasses: ["form-label"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-form-contact-email-input",
					elemType: "input",
					textContent: "",
					cssClasses: ["form-control"],
					props: { type: "email", placeholder: "you@example.com" },
					customStyles: {},
					children: [],
				},
			],
		},
		{
			id: "preset-form-contact-message-group",
			elemType: "div",
			textContent: "",
			cssClasses: ["mb-3"],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-form-contact-message-label",
					elemType: "label",
					textContent: "Message",
					cssClasses: ["form-label"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-form-contact-message-input",
					elemType: "textarea",
					textContent: "",
					cssClasses: ["form-control"],
					props: { rows: "4", placeholder: "Your message..." },
					customStyles: {},
					children: [],
				},
			],
		},
		{
			id: "preset-form-contact-submit",
			elemType: "button",
			textContent: "Send Message",
			cssClasses: ["btn", "btn-primary", "w-100"],
			props: { type: "submit" },
			customStyles: {},
			children: [],
		},
	],
};

//4. Newsletter form - single email input + submit, inline row. Common footer/landing-page shape.

const newsletterFormPreset: CanvasElem = {
	id: "preset-form-newsletter",
	elemType: "form",
	textContent: "",
	cssClasses: ["d-flex", "gap-2", "w-100", "mx-auto"],
	props: {},
	customStyles: { maxWidth: "480px" },
	children: [
		{
			id: "preset-form-newsletter-input",
			elemType: "input",
			textContent: "",
			cssClasses: ["form-control"],
			props: { type: "email", placeholder: "Enter your email" },
			customStyles: {},
			children: [],
		},
		{
			id: "preset-form-newsletter-submit",
			elemType: "button",
			textContent: "Subscribe",
			cssClasses: ["btn", "btn-primary", "text-nowrap"],
			props: { type: "submit" },
			customStyles: {},
			children: [],
		},
	],
};

//5. Search form - single search input + icon button, inline row.

const searchFormPreset: CanvasElem = {
	id: "preset-form-search",
	elemType: "form",
	textContent: "",
	cssClasses: ["d-flex", "gap-2", "w-100", "mx-auto"],
	props: {},
	customStyles: { maxWidth: "360px" },
	children: [
		{
			id: "preset-form-search-input",
			elemType: "input",
			textContent: "",
			cssClasses: ["form-control"],
			props: { type: "search", placeholder: "Search..." },
			customStyles: {},
			children: [],
		},
		{
			id: "preset-form-search-submit",
			elemType: "button",
			textContent: "",
			cssClasses: ["btn", "btn-outline-secondary"],
			props: { type: "submit" },
			customStyles: {},
			children: [
				{
					id: "preset-form-search-submit-icon",
					elemType: "span",
					textContent: "",
					cssClasses: ["fa", "fa-search"],
					props: {},
					customStyles: {},
					children: [],
				},
			],
		},
	],
};

//6. Blank form - just the form surface, no fields. Lets the user build their own fields from scratch.

const blankFormPreset: CanvasElem = {
	id: "preset-form-blank",
	elemType: "form",
	textContent: "",
	cssClasses: ["card", "p-4", "w-100", "mx-auto"],
	props: {},
	customStyles: { maxWidth: "360px", minHeight: "150px" },
	children: [],
};

//the ONE public export - keyed by category name, matching

//blockPresets.form.variant. mirrors cardsPresets.ts / navbarPresets.ts exactly.

export const formPresets = {
	form: {
		variant: [
			{ label: "Login Form — Email & Password", preset: loginFormPreset },
			{
				label: "Signup Form — Name, Email & Password",
				preset: signupFormPreset,
			},
			{
				label: "Contact Form — Name, Email & Message",
				preset: contactFormPreset,
			},
			{
				label: "Newsletter Form — Inline Email & Subscribe",
				preset: newsletterFormPreset,
			},
			{ label: "Search Form — Input & Icon Button", preset: searchFormPreset },
			{
				label: "Blank Form — Just the Surface, Build Your Own",
				preset: blankFormPreset,
			},
		],
	},
};
