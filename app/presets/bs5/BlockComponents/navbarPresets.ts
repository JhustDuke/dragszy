import type { CanvasElem } from "~/types";

//placeholder ids everywhere - createClone regenerates every one of these

//the moment a preset is actually placed, so these values never reach the canvas

//1. Top navbar - full navigation on large screens, compact navigation on smaller screens.

const topNavbarPreset: CanvasElem = {
	id: "preset-navbar-top",
	elemType: "nav",
	textContent: "",
	cssClasses: ["navbar", "navbar-expand-lg", "navbar-light", "bg-light"],
	props: {},
	customStyles: {},
	children: [
		{
			id: "preset-navbar-top-container",
			elemType: "div",
			textContent: "",
			cssClasses: ["container-fluid"],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-navbar-top-brand",
					elemType: "a",
					textContent: "Brand",
					cssClasses: ["navbar-brand"],
					props: { href: "#" },
					customStyles: {},
					children: [],
				},
				{
					id: "preset-navbar-top-links",
					elemType: "div",
					textContent: "",
					cssClasses: ["navbar-nav", "ms-auto", "flex-row", "gap-2"],
					props: {},
					customStyles: {},
					children: [
						{
							id: "preset-navbar-top-home",
							elemType: "a",
							textContent: "",
							cssClasses: ["nav-link", "active"],
							props: { href: "#" },
							customStyles: {},
							children: [
								{
									id: "preset-navbar-top-home-icon",
									elemType: "span",
									textContent: "",
									cssClasses: ["fa", "fa-home", "me-1"],
									props: {},
									customStyles: {},
									children: [],
								},
								{
									id: "preset-navbar-top-home-text",
									elemType: "span",
									textContent: "Home",
									cssClasses: ["d-none", "d-md-inline"],
									props: {},
									customStyles: {},
									children: [],
								},
							],
						},
						{
							id: "preset-navbar-top-about",
							elemType: "a",
							textContent: "",
							cssClasses: ["nav-link"],
							props: { href: "#" },
							customStyles: {},
							children: [
								{
									id: "preset-navbar-top-about-icon",
									elemType: "span",
									textContent: "",
									cssClasses: ["fa", "fa-info-circle", "me-1"],
									props: {},
									customStyles: {},
									children: [],
								},
								{
									id: "preset-navbar-top-about-text",
									elemType: "span",
									textContent: "About",
									cssClasses: ["d-none", "d-md-inline"],
									props: {},
									customStyles: {},
									children: [],
								},
							],
						},
						{
							id: "preset-navbar-top-contact",
							elemType: "a",
							textContent: "",
							cssClasses: ["nav-link"],
							props: { href: "#" },
							customStyles: {},
							children: [
								{
									id: "preset-navbar-top-contact-icon",
									elemType: "span",
									textContent: "",
									cssClasses: ["fa", "fa-envelope", "me-1"],
									props: {},
									customStyles: {},
									children: [],
								},
								{
									id: "preset-navbar-top-contact-text",
									elemType: "span",
									textContent: "Contact",
									cssClasses: ["d-none", "d-md-inline"],
									props: {},
									customStyles: {},
									children: [],
								},
							],
						},
					],
				},
			],
		},
	],
};

//2. Bottom navbar - app-style navigation with labels hidden on smaller screens.

const bottomNavbarPreset: CanvasElem = {
	id: "preset-navbar-bottom",
	elemType: "nav",
	textContent: "",
	cssClasses: ["navbar", "navbar-dark", "bg-dark", "fixed-bottom"],
	props: {},
	customStyles: {},
	children: [
		{
			id: "preset-navbar-bottom-container",
			elemType: "div",
			textContent: "",
			cssClasses: ["container-fluid", "justify-content-center"],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-navbar-bottom-links",
					elemType: "div",
					textContent: "",
					cssClasses: ["navbar-nav", "flex-row", "gap-4"],
					props: {},
					customStyles: {},
					children: [
						{
							id: "preset-navbar-bottom-home",
							elemType: "a",
							textContent: "",
							cssClasses: ["nav-link", "active", "text-center"],
							props: { href: "#" },
							customStyles: {},
							children: [
								{
									id: "preset-navbar-bottom-home-icon",
									elemType: "span",
									textContent: "",
									cssClasses: ["fa", "fa-home", "me-1"],
									props: {},
									customStyles: {},
									children: [],
								},
								{
									id: "preset-navbar-bottom-home-text",
									elemType: "span",
									textContent: "Home",
									cssClasses: ["d-inline"],
									props: {},
									customStyles: {},
									children: [],
								},
							],
						},
						{
							id: "preset-navbar-bottom-services",
							elemType: "a",
							textContent: "",
							cssClasses: ["nav-link", "text-center"],
							props: { href: "#" },
							customStyles: {},
							children: [
								{
									id: "preset-navbar-bottom-services-icon",
									elemType: "span",
									textContent: "",
									cssClasses: ["fa", "fa-th-large", "me-1"],
									props: {},
									customStyles: {},
									children: [],
								},
								{
									id: "preset-navbar-bottom-services-text",
									elemType: "span",
									textContent: "Services",
									cssClasses: ["d-inline"],
									props: {},
									customStyles: {},
									children: [],
								},
							],
						},
						{
							id: "preset-navbar-bottom-profile",
							elemType: "a",
							textContent: "",
							cssClasses: ["nav-link", "text-center"],
							props: { href: "#" },
							customStyles: {},
							children: [
								{
									id: "preset-navbar-bottom-profile-icon",
									elemType: "span",
									textContent: "",
									cssClasses: ["fa", "fa-user", "me-1"],
									props: {},
									customStyles: {},
									children: [],
								},
								{
									id: "preset-navbar-bottom-profile-text",
									elemType: "span",
									textContent: "Profile",
									cssClasses: ["d-inline"],
									props: {},
									customStyles: {},
									children: [],
								},
							],
						},
					],
				},
			],
		},
	],
};

//3. Centered navbar - centered brand on large screens, compact centered navigation on smaller screens.

const centeredNavbarPreset: CanvasElem = {
	id: "preset-navbar-centered",
	elemType: "nav",
	textContent: "",
	cssClasses: ["navbar", "navbar-light", "bg-light"],
	props: {},
	customStyles: {},
	children: [
		{
			id: "preset-navbar-centered-container",
			elemType: "div",
			textContent: "",
			cssClasses: ["container", "justify-content-center"],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-navbar-centered-brand",
					elemType: "a",
					textContent: "Brand",
					cssClasses: ["navbar-brand", "me-4"],
					props: { href: "#" },
					customStyles: {},
					children: [],
				},
				{
					id: "preset-navbar-centered-links",
					elemType: "div",
					textContent: "",
					cssClasses: ["navbar-nav", "flex-row", "gap-3"],
					props: {},
					customStyles: {},
					children: [
						{
							id: "preset-navbar-centered-home",
							elemType: "a",
							textContent: "",
							cssClasses: ["nav-link", "active"],
							props: { href: "#" },
							customStyles: {},
							children: [
								{
									id: "preset-navbar-centered-home-icon",
									elemType: "span",
									textContent: "",
									cssClasses: ["fa", "fa-home", "me-1"],
									props: {},
									customStyles: {},
									children: [],
								},
								{
									id: "preset-navbar-centered-home-text",
									elemType: "span",
									textContent: "Home",
									cssClasses: ["d-inline"],
									props: {},
									customStyles: {},
									children: [],
								},
							],
						},
						{
							id: "preset-navbar-centered-about",
							elemType: "a",
							textContent: "",
							cssClasses: ["nav-link", "d-none", "d-md-block"],
							props: { href: "#" },
							customStyles: {},
							children: [
								{
									id: "preset-navbar-centered-about-icon",
									elemType: "span",
									textContent: "",
									cssClasses: ["fa", "fa-info-circle", "me-1"],
									props: {},
									customStyles: {},
									children: [],
								},
								{
									id: "preset-navbar-centered-about-text",
									elemType: "span",
									textContent: "About",
									cssClasses: ["d-inline"],
									props: {},
									customStyles: {},
									children: [],
								},
							],
						},
						{
							id: "preset-navbar-centered-contact",
							elemType: "a",
							textContent: "",
							cssClasses: ["nav-link", "d-none", "d-lg-block"],
							props: { href: "#" },
							customStyles: {},
							children: [
								{
									id: "preset-navbar-centered-contact-icon",
									elemType: "span",
									textContent: "",
									cssClasses: ["fa", "fa-envelope", "me-1"],
									props: {},
									customStyles: {},
									children: [],
								},
								{
									id: "preset-navbar-centered-contact-text",
									elemType: "span",
									textContent: "Contact",
									cssClasses: ["d-inline"],
									props: {},
									customStyles: {},
									children: [],
								},
							],
						},
					],
				},
			],
		},
	],
};

//the ONE public export - keyed by category name, matching

//blockPresets.navbar.variant. mirrors cardsPresets.ts exactly.

export const navbarPresets = {
	navbar: {
		variant: [
			{ label: "Top Navbar", preset: topNavbarPreset },
			{
				label: "Bottom Navbar",
				preset: bottomNavbarPreset,
			},
			{
				label: "Centered Navbar",
				preset: centeredNavbarPreset,
			},
		],
	},
};
//the ONE public export - keyed by category name, matching

//blockPresets.navbar.variant. mirrors cardsPresets.ts exactly.
