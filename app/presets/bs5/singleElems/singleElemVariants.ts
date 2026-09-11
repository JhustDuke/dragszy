import { buildSingleElemPresets } from "../../utils";

export const bootstrapElemVariants = buildSingleElemPresets({
	div: [
		{ label: "Container", classes: ["container"] },
		{ label: "Container Fluid", classes: ["container-fluid"] },
		{ label: "Centered", classes: ["mx-auto"] },
		{ label: "Flex Row", classes: ["d-flex", "flex-row"] },
		{ label: "Flex Column", classes: ["d-flex", "flex-column"] },
		{ label: "Grid Row", classes: ["row"] },
		{ label: "Card", classes: ["card", "p-3"] },
		{ label: "Bordered", classes: ["border", "rounded", "p-3"] },
	],

	span: [
		{ label: "Muted", classes: ["text-muted"] },
		{ label: "Primary", classes: ["text-primary"] },
		{ label: "Success", classes: ["text-success"] },
		{ label: "Badge", classes: ["badge", "text-bg-primary"] },
	],

	p: [
		{ label: "Lead", classes: ["lead"] },
		{ label: "Muted", classes: ["text-muted"] },
		{ label: "Small", classes: ["small"] },
		{ label: "Centered", classes: ["text-center"] },
	],

	a: [
		{ label: "Link", classes: ["link-primary"] },
		{ label: "Button", classes: ["btn", "btn-primary"] },
		{ label: "Outline Button", classes: ["btn", "btn-outline-primary"] },
		{ label: "Muted Link", classes: ["link-secondary"] },
	],

	button: [
		{ label: "Primary", classes: ["btn", "btn-primary"] },
		{ label: "Secondary", classes: ["btn", "btn-secondary"] },
		{ label: "Success", classes: ["btn", "btn-success"] },
		{ label: "Danger", classes: ["btn", "btn-danger"] },
		{ label: "Warning", classes: ["btn", "btn-warning"] },
		{ label: "Outline Primary", classes: ["btn", "btn-outline-primary"] },
		{ label: "Small", classes: ["btn", "btn-primary", "btn-sm"] },
		{ label: "Large", classes: ["btn", "btn-primary", "btn-lg"] },
	],

	ul: [
		{ label: "List Group", classes: ["list-group"] },
		{ label: "Numbered", classes: ["list-group", "list-group-numbered"] },
		{ label: "Horizontal", classes: ["list-group", "list-group-horizontal"] },
	],

	li: [
		{ label: "List Item", classes: ["list-group-item"] },
		{ label: "Active", classes: ["list-group-item", "active"] },
		{ label: "Disabled", classes: ["list-group-item", "disabled"] },
	],

	form: [
		{
			label: "Inline",
			classes: ["row", "row-cols-lg-auto", "g-3", "align-items-center"],
		},
		{ label: "Bordered", classes: ["border", "rounded", "p-3"] },
		{ label: "Card Form", classes: ["card", "card-body"] },
	],

	label: [
		{ label: "Form Label", classes: ["form-label"] },
		{ label: "Inline Label", classes: ["col-form-label"] },
	],

	input: [
		{ label: "Text Input", classes: ["form-control"] },
		{ label: "Small Input", classes: ["form-control", "form-control-sm"] },
		{ label: "Large Input", classes: ["form-control", "form-control-lg"] },
		{ label: "Checkbox", classes: ["form-check-input"] },
		{ label: "Switch", classes: ["form-check-input"] },
	],

	textarea: [
		{ label: "Text Area", classes: ["form-control"] },
		{ label: "Small", classes: ["form-control", "form-control-sm"] },
		{ label: "Large", classes: ["form-control", "form-control-lg"] },
	],

	select: [
		{ label: "Select", classes: ["form-select"] },
		{ label: "Small Select", classes: ["form-select", "form-select-sm"] },
		{ label: "Large Select", classes: ["form-select", "form-select-lg"] },
	],

	option: [{ label: "Default", classes: [] }],

	img: [
		{ label: "Fluid", classes: ["img-fluid"] },
		{ label: "Rounded", classes: ["img-fluid", "rounded"] },
		{ label: "Circle", classes: ["img-fluid", "rounded-circle"] },
		{ label: "Thumbnail", classes: ["img-fluid", "img-thumbnail"] },
		{ label: "Shadow", classes: ["img-fluid", "shadow"] },
		{
			label: "Responsive Rounded",
			classes: ["img-fluid", "rounded", "shadow"],
		},
	],
});
