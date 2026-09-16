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

//4. Search navbar - brand, links, and a search input on the right (large screens only).

const searchNavbarPreset: CanvasElem = {
	id: "preset-navbar-search",
	elemType: "nav",
	textContent: "",
	cssClasses: ["navbar", "navbar-expand-lg", "navbar-light", "bg-light"],
	props: {},
	customStyles: {},
	children: [
		{
			id: "preset-navbar-search-container",
			elemType: "div",
			textContent: "",
			cssClasses: ["container-fluid"],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-navbar-search-brand",
					elemType: "a",
					textContent: "Brand",
					cssClasses: ["navbar-brand"],
					props: { href: "#" },
					customStyles: {},
					children: [],
				},
				{
					id: "preset-navbar-search-links",
					elemType: "div",
					textContent: "",
					cssClasses: ["navbar-nav", "flex-row", "gap-2", "me-auto"],
					props: {},
					customStyles: {},
					children: [
						{
							id: "preset-navbar-search-home",
							elemType: "a",
							textContent: "Home",
							cssClasses: ["nav-link", "active"],
							props: { href: "#" },
							customStyles: {},
							children: [],
						},
						{
							id: "preset-navbar-search-about",
							elemType: "a",
							textContent: "About",
							cssClasses: ["nav-link", "d-none", "d-md-block"],
							props: { href: "#" },
							customStyles: {},
							children: [],
						},
					],
				},
				{
					id: "preset-navbar-search-input",
					elemType: "input",
					textContent: "",
					cssClasses: ["form-control", "d-none", "d-lg-block"],
					props: { type: "search", placeholder: "Search..." },
					customStyles: { maxWidth: "220px" },
					children: [],
				},
			],
		},
	],
};

//5. Sidebar navbar - vertical stack of icon + label links, meant for a fixed side column layout.

const sidebarNavbarPreset: CanvasElem = {
	id: "preset-navbar-sidebar",
	elemType: "nav",
	textContent: "",
	cssClasses: [
		"navbar",
		"navbar-dark",
		"bg-dark",
		"flex-column",
		"p-3",
		"h-100",
	],
	props: {},
	customStyles: { width: "220px" },
	children: [
		{
			id: "preset-navbar-sidebar-brand",
			elemType: "a",
			textContent: "Brand",
			cssClasses: ["navbar-brand", "mb-3"],
			props: { href: "#" },
			customStyles: {},
			children: [],
		},
		{
			id: "preset-navbar-sidebar-links",
			elemType: "div",
			textContent: "",
			cssClasses: ["navbar-nav", "flex-column", "gap-2", "w-100"],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-navbar-sidebar-home",
					elemType: "a",
					textContent: "",
					cssClasses: ["nav-link", "active"],
					props: { href: "#" },
					customStyles: {},
					children: [
						{
							id: "preset-navbar-sidebar-home-icon",
							elemType: "span",
							textContent: "",
							cssClasses: ["fa", "fa-home", "me-2"],
							props: {},
							customStyles: {},
							children: [],
						},
						{
							id: "preset-navbar-sidebar-home-text",
							elemType: "span",
							textContent: "Home",
							cssClasses: [],
							props: {},
							customStyles: {},
							children: [],
						},
					],
				},
				{
					id: "preset-navbar-sidebar-services",
					elemType: "a",
					textContent: "",
					cssClasses: ["nav-link"],
					props: { href: "#" },
					customStyles: {},
					children: [
						{
							id: "preset-navbar-sidebar-services-icon",
							elemType: "span",
							textContent: "",
							cssClasses: ["fa", "fa-th-large", "me-2"],
							props: {},
							customStyles: {},
							children: [],
						},
						{
							id: "preset-navbar-sidebar-services-text",
							elemType: "span",
							textContent: "Services",
							cssClasses: [],
							props: {},
							customStyles: {},
							children: [],
						},
					],
				},
				{
					id: "preset-navbar-sidebar-profile",
					elemType: "a",
					textContent: "",
					cssClasses: ["nav-link"],
					props: { href: "#" },
					customStyles: {},
					children: [
						{
							id: "preset-navbar-sidebar-profile-icon",
							elemType: "span",
							textContent: "",
							cssClasses: ["fa", "fa-user", "me-2"],
							props: {},
							customStyles: {},
							children: [],
						},
						{
							id: "preset-navbar-sidebar-profile-text",
							elemType: "span",
							textContent: "Profile",
							cssClasses: [],
							props: {},
							customStyles: {},
							children: [],
						},
					],
				},
			],
		},
	],
};

//6. Blank navbar - just the nav surface with a brand, no link structure. Lets the user build their own nav items from scratch.

const blankNavbarPreset: CanvasElem = {
	id: "preset-navbar-blank",
	elemType: "nav",
	textContent: "",
	cssClasses: ["navbar", "navbar-light", "bg-light", "p-2"],
	props: {},
	customStyles: {},
	children: [
		{
			id: "preset-navbar-blank-brand",
			elemType: "a",
			textContent: "Brand",
			cssClasses: ["navbar-brand"],
			props: { href: "#" },
			customStyles: {},
			children: [],
		},
	],
};

//the ONE public export - keyed by category name, matching

//blockPresets.navbar.variant. mirrors cardsPresets.ts exactly.

export const navbarPresets = {
	navbar: {
		variant: [
			{
				label: "Top Navbar — Brand & Links, Collapses on Mobile",
				preset: topNavbarPreset,
			},
			{
				label: "Bottom Navbar — Fixed App-Style Tab Bar",
				preset: bottomNavbarPreset,
			},
			{
				label: "Centered Navbar — Centered Brand & Links",
				preset: centeredNavbarPreset,
			},
			{
				label: "Search Navbar — Brand, Links & Search Input",
				preset: searchNavbarPreset,
			},
			{
				label: "Sidebar Navbar — Vertical Icon + Label Links",
				preset: sidebarNavbarPreset,
			},
			{
				label: "Blank Navbar — Just the Brand, Build Your Own",
				preset: blankNavbarPreset,
			},
		],
	},
};
//the ONE public export - keyed by category name, matching

//blockPresets.navbar.variant. mirrors cardsPresets.ts exactly.
