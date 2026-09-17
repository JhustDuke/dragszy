import type { CanvasElem } from "~/types";

//placeholder ids everywhere - createClone regenerates every one of these

//the moment a preset is actually placed, so these values never reach the canvas

//1. Stat card - single number, label, trend. Meant to be placed 2-4 across as a stat row.

const statCardPreset: CanvasElem = {
	id: "preset-dashboard-stat",
	elemType: "div",
	textContent: "",
	cssClasses: ["card", "p-3", "flex-fill"],
	props: {},
	customStyles: { minWidth: "0" },
	children: [
		{
			id: "preset-dashboard-stat-label",
			elemType: "p",
			textContent: "Active Students",
			cssClasses: ["text-muted", "small", "mb-1"],
			props: {},
			customStyles: {},
			children: [],
		},
		{
			id: "preset-dashboard-stat-value",
			elemType: "h3",
			textContent: "1,204",
			cssClasses: ["fw-bold", "mb-1"],
			props: {},
			customStyles: {},
			children: [],
		},
		{
			id: "preset-dashboard-stat-trend",
			elemType: "p",
			textContent: "↑ 8% this week",
			cssClasses: ["text-success", "small", "mb-0"],
			props: {},
			customStyles: {},
			children: [],
		},
	],
};

//2. Stat row - 4 stat cards wired together side by side, wraps on mobile.

const statRowPreset: CanvasElem = {
	id: "preset-dashboard-stat-row",
	elemType: "div",
	textContent: "",
	cssClasses: ["d-flex", "flex-column", "flex-md-row", "gap-3", "w-100"],
	props: {},
	customStyles: {},
	children: [
		{
			id: "preset-dashboard-stat-row-1",
			elemType: "div",
			textContent: "",
			cssClasses: ["card", "p-3", "flex-fill"],
			props: {},
			customStyles: { minWidth: "0" },
			children: [
				{
					id: "preset-dashboard-stat-row-1-label",
					elemType: "p",
					textContent: "Active Students",
					cssClasses: ["text-muted", "small", "mb-1"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-dashboard-stat-row-1-value",
					elemType: "h3",
					textContent: "1,204",
					cssClasses: ["fw-bold", "mb-0"],
					props: {},
					customStyles: {},
					children: [],
				},
			],
		},
		{
			id: "preset-dashboard-stat-row-2",
			elemType: "div",
			textContent: "",
			cssClasses: ["card", "p-3", "flex-fill"],
			props: {},
			customStyles: { minWidth: "0" },
			children: [
				{
					id: "preset-dashboard-stat-row-2-label",
					elemType: "p",
					textContent: "Exams This Week",
					cssClasses: ["text-muted", "small", "mb-1"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-dashboard-stat-row-2-value",
					elemType: "h3",
					textContent: "342",
					cssClasses: ["fw-bold", "mb-0"],
					props: {},
					customStyles: {},
					children: [],
				},
			],
		},
		{
			id: "preset-dashboard-stat-row-3",
			elemType: "div",
			textContent: "",
			cssClasses: ["card", "p-3", "flex-fill"],
			props: {},
			customStyles: { minWidth: "0" },
			children: [
				{
					id: "preset-dashboard-stat-row-3-label",
					elemType: "p",
					textContent: "Average Score",
					cssClasses: ["text-muted", "small", "mb-1"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-dashboard-stat-row-3-value",
					elemType: "h3",
					textContent: "76%",
					cssClasses: ["fw-bold", "mb-0"],
					props: {},
					customStyles: {},
					children: [],
				},
			],
		},
		{
			id: "preset-dashboard-stat-row-4",
			elemType: "div",
			textContent: "",
			cssClasses: ["card", "p-3", "flex-fill"],
			props: {},
			customStyles: { minWidth: "0" },
			children: [
				{
					id: "preset-dashboard-stat-row-4-label",
					elemType: "p",
					textContent: "Pass Rate",
					cssClasses: ["text-muted", "small", "mb-1"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-dashboard-stat-row-4-value",
					elemType: "h3",
					textContent: "89%",
					cssClasses: ["fw-bold", "mb-0"],
					props: {},
					customStyles: {},
					children: [],
				},
			],
		},
	],
};

//3. Activity feed item - single row: icon, description, timestamp. Meant to be duplicated
//to build a feed list.

const activityFeedItemPreset: CanvasElem = {
	id: "preset-dashboard-activity-item",
	elemType: "div",
	textContent: "",
	cssClasses: ["d-flex", "align-items-start", "gap-2", "py-2", "border-bottom"],
	props: {},
	customStyles: {},
	children: [
		{
			id: "preset-dashboard-activity-item-icon",
			elemType: "span",
			textContent: "",
			cssClasses: ["fa", "fa-check-circle", "text-success", "mt-1"],
			props: {},
			customStyles: {},
			children: [],
		},
		{
			id: "preset-dashboard-activity-item-content",
			elemType: "div",
			textContent: "",
			cssClasses: ["flex-fill"],
			props: {},
			customStyles: { minWidth: "0" },
			children: [
				{
					id: "preset-dashboard-activity-item-text",
					elemType: "p",
					textContent: "Jane Doe completed Physics mock exam, scored 78%",
					cssClasses: ["mb-0", "small"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-dashboard-activity-item-time",
					elemType: "p",
					textContent: "2 minutes ago",
					cssClasses: ["text-muted", "small", "mb-0"],
					props: {},
					customStyles: {},
					children: [],
				},
			],
		},
	],
};

//4. Activity feed - card wrapper with a title + 3 activity items stacked. Table-free list.

const activityFeedPreset: CanvasElem = {
	id: "preset-dashboard-activity-feed",
	elemType: "div",
	textContent: "",
	cssClasses: ["card", "p-3", "w-100"],
	props: {},
	customStyles: {},
	children: [
		{
			id: "preset-dashboard-activity-feed-title",
			elemType: "h6",
			textContent: "Recent Activity",
			cssClasses: ["fw-bold", "mb-2"],
			props: {},
			customStyles: {},
			children: [],
		},
		{
			id: "preset-dashboard-activity-feed-item-1",
			elemType: "div",
			textContent: "",
			cssClasses: [
				"d-flex",
				"align-items-start",
				"gap-2",
				"py-2",
				"border-bottom",
			],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-dashboard-activity-feed-item-1-icon",
					elemType: "span",
					textContent: "",
					cssClasses: ["fa", "fa-check-circle", "text-success", "mt-1"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-dashboard-activity-feed-item-1-content",
					elemType: "div",
					textContent: "",
					cssClasses: ["flex-fill"],
					props: {},
					customStyles: { minWidth: "0" },
					children: [
						{
							id: "preset-dashboard-activity-feed-item-1-text",
							elemType: "p",
							textContent: "Jane Doe completed Physics mock exam, scored 78%",
							cssClasses: ["mb-0", "small"],
							props: {},
							customStyles: {},
							children: [],
						},
						{
							id: "preset-dashboard-activity-feed-item-1-time",
							elemType: "p",
							textContent: "2 minutes ago",
							cssClasses: ["text-muted", "small", "mb-0"],
							props: {},
							customStyles: {},
							children: [],
						},
					],
				},
			],
		},
		{
			id: "preset-dashboard-activity-feed-item-2",
			elemType: "div",
			textContent: "",
			cssClasses: [
				"d-flex",
				"align-items-start",
				"gap-2",
				"py-2",
				"border-bottom",
			],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-dashboard-activity-feed-item-2-icon",
					elemType: "span",
					textContent: "",
					cssClasses: ["fa", "fa-user-plus", "text-primary", "mt-1"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-dashboard-activity-feed-item-2-content",
					elemType: "div",
					textContent: "",
					cssClasses: ["flex-fill"],
					props: {},
					customStyles: { minWidth: "0" },
					children: [
						{
							id: "preset-dashboard-activity-feed-item-2-text",
							elemType: "p",
							textContent: "New student registered: John Smith",
							cssClasses: ["mb-0", "small"],
							props: {},
							customStyles: {},
							children: [],
						},
						{
							id: "preset-dashboard-activity-feed-item-2-time",
							elemType: "p",
							textContent: "1 hour ago",
							cssClasses: ["text-muted", "small", "mb-0"],
							props: {},
							customStyles: {},
							children: [],
						},
					],
				},
			],
		},
		{
			id: "preset-dashboard-activity-feed-item-3",
			elemType: "div",
			textContent: "",
			cssClasses: ["d-flex", "align-items-start", "gap-2", "py-2"],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-dashboard-activity-feed-item-3-icon",
					elemType: "span",
					textContent: "",
					cssClasses: ["fa", "fa-exclamation-circle", "text-warning", "mt-1"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-dashboard-activity-feed-item-3-content",
					elemType: "div",
					textContent: "",
					cssClasses: ["flex-fill"],
					props: {},
					customStyles: { minWidth: "0" },
					children: [
						{
							id: "preset-dashboard-activity-feed-item-3-text",
							elemType: "p",
							textContent: "Exam grading pending for Chemistry - Grade 10",
							cssClasses: ["mb-0", "small"],
							props: {},
							customStyles: {},
							children: [],
						},
						{
							id: "preset-dashboard-activity-feed-item-3-time",
							elemType: "p",
							textContent: "3 hours ago",
							cssClasses: ["text-muted", "small", "mb-0"],
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

//5. Data row - single row styled like a table row using flex, NOT a <tr>. Meant to be
//duplicated to build a list. Columns: name, meta, status badge.

const dataRowPreset: CanvasElem = {
	id: "preset-dashboard-data-row",
	elemType: "div",
	textContent: "",
	cssClasses: [
		"d-flex",
		"align-items-center",
		"justify-content-between",
		"gap-3",
		"py-2",
		"px-2",
		"border-bottom",
	],
	props: {},
	customStyles: {},
	children: [
		{
			id: "preset-dashboard-data-row-name",
			elemType: "p",
			textContent: "Jane Doe",
			cssClasses: ["mb-0", "fw-bold", "small", "flex-fill"],
			props: {},
			customStyles: { minWidth: "0" },
			children: [],
		},
		{
			id: "preset-dashboard-data-row-meta",
			elemType: "p",
			textContent: "Grade 10",
			cssClasses: ["mb-0", "text-muted", "small", "flex-fill"],
			props: {},
			customStyles: { minWidth: "0" },
			children: [],
		},
		{
			id: "preset-dashboard-data-row-status",
			elemType: "span",
			textContent: "Active",
			cssClasses: ["badge", "text-bg-success"],
			props: {},
			customStyles: {},
			children: [],
		},
	],
};

//6. Data list - card wrapper with a title + 3 data rows stacked. Table-free list view.

const dataListPreset: CanvasElem = {
	id: "preset-dashboard-data-list",
	elemType: "div",
	textContent: "",
	cssClasses: ["card", "p-3", "w-100"],
	props: {},
	customStyles: {},
	children: [
		{
			id: "preset-dashboard-data-list-title",
			elemType: "h6",
			textContent: "Students",
			cssClasses: ["fw-bold", "mb-2"],
			props: {},
			customStyles: {},
			children: [],
		},
		{
			id: "preset-dashboard-data-list-row-1",
			elemType: "div",
			textContent: "",
			cssClasses: [
				"d-flex",
				"align-items-center",
				"justify-content-between",
				"gap-3",
				"py-2",
				"border-bottom",
			],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-dashboard-data-list-row-1-name",
					elemType: "p",
					textContent: "Jane Doe",
					cssClasses: ["mb-0", "fw-bold", "small", "flex-fill"],
					props: {},
					customStyles: { minWidth: "0" },
					children: [],
				},
				{
					id: "preset-dashboard-data-list-row-1-meta",
					elemType: "p",
					textContent: "Grade 10",
					cssClasses: ["mb-0", "text-muted", "small", "flex-fill"],
					props: {},
					customStyles: { minWidth: "0" },
					children: [],
				},
				{
					id: "preset-dashboard-data-list-row-1-status",
					elemType: "span",
					textContent: "Active",
					cssClasses: ["badge", "text-bg-success"],
					props: {},
					customStyles: {},
					children: [],
				},
			],
		},
		{
			id: "preset-dashboard-data-list-row-2",
			elemType: "div",
			textContent: "",
			cssClasses: [
				"d-flex",
				"align-items-center",
				"justify-content-between",
				"gap-3",
				"py-2",
				"border-bottom",
			],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-dashboard-data-list-row-2-name",
					elemType: "p",
					textContent: "John Smith",
					cssClasses: ["mb-0", "fw-bold", "small", "flex-fill"],
					props: {},
					customStyles: { minWidth: "0" },
					children: [],
				},
				{
					id: "preset-dashboard-data-list-row-2-meta",
					elemType: "p",
					textContent: "Grade 9",
					cssClasses: ["mb-0", "text-muted", "small", "flex-fill"],
					props: {},
					customStyles: { minWidth: "0" },
					children: [],
				},
				{
					id: "preset-dashboard-data-list-row-2-status",
					elemType: "span",
					textContent: "Pending",
					cssClasses: ["badge", "text-bg-warning"],
					props: {},
					customStyles: {},
					children: [],
				},
			],
		},
		{
			id: "preset-dashboard-data-list-row-3",
			elemType: "div",
			textContent: "",
			cssClasses: [
				"d-flex",
				"align-items-center",
				"justify-content-between",
				"gap-3",
				"py-2",
			],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-dashboard-data-list-row-3-name",
					elemType: "p",
					textContent: "Amara Okafor",
					cssClasses: ["mb-0", "fw-bold", "small", "flex-fill"],
					props: {},
					customStyles: { minWidth: "0" },
					children: [],
				},
				{
					id: "preset-dashboard-data-list-row-3-meta",
					elemType: "p",
					textContent: "Grade 11",
					cssClasses: ["mb-0", "text-muted", "small", "flex-fill"],
					props: {},
					customStyles: { minWidth: "0" },
					children: [],
				},
				{
					id: "preset-dashboard-data-list-row-3-status",
					elemType: "span",
					textContent: "Inactive",
					cssClasses: ["badge", "text-bg-secondary"],
					props: {},
					customStyles: {},
					children: [],
				},
			],
		},
	],
};

//7. Chart placeholder - titled card with a fixed-height empty area, meant as a drop-in
//spot for a real chart library's mount target later. Purely visual/structural.

const chartPlaceholderPreset: CanvasElem = {
	id: "preset-dashboard-chart",
	elemType: "div",
	textContent: "",
	cssClasses: ["card", "p-3", "w-100"],
	props: {},
	customStyles: {},
	children: [
		{
			id: "preset-dashboard-chart-title",
			elemType: "h6",
			textContent: "Score Trends",
			cssClasses: ["fw-bold", "mb-3"],
			props: {},
			customStyles: {},
			children: [],
		},
		{
			id: "preset-dashboard-chart-area",
			elemType: "div",
			textContent: "Chart goes here",
			cssClasses: [
				"d-flex",
				"align-items-center",
				"justify-content-center",
				"bg-light",
				"text-muted",
				"rounded",
			],
			props: {},
			customStyles: { minHeight: "220px" },
			children: [],
		},
	],
};

//8. Quick actions panel - card wrapper with a title + a few action buttons stacked.

const quickActionsPreset: CanvasElem = {
	id: "preset-dashboard-quick-actions",
	elemType: "div",
	textContent: "",
	cssClasses: ["card", "p-3", "w-100"],
	props: {},
	customStyles: {},
	children: [
		{
			id: "preset-dashboard-quick-actions-title",
			elemType: "h6",
			textContent: "Quick Actions",
			cssClasses: ["fw-bold", "mb-3"],
			props: {},
			customStyles: {},
			children: [],
		},
		{
			id: "preset-dashboard-quick-actions-list",
			elemType: "div",
			textContent: "",
			cssClasses: ["d-flex", "flex-column", "gap-2"],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-dashboard-quick-actions-btn-1",
					elemType: "button",
					textContent: "Create New Exam",
					cssClasses: ["btn", "btn-primary", "btn-sm"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-dashboard-quick-actions-btn-2",
					elemType: "button",
					textContent: "Add Student",
					cssClasses: ["btn", "btn-outline-primary", "btn-sm"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-dashboard-quick-actions-btn-3",
					elemType: "button",
					textContent: "Generate Report",
					cssClasses: ["btn", "btn-outline-secondary", "btn-sm"],
					props: {},
					customStyles: {},
					children: [],
				},
			],
		},
	],
};

//9. Alert banner - dismissible notification bar.

const alertBannerPreset: CanvasElem = {
	id: "preset-dashboard-alert",
	elemType: "div",
	textContent: "",
	cssClasses: [
		"alert",
		"alert-success",
		"alert-dismissible",
		"d-flex",
		"align-items-center",
		"justify-content-between",
		"w-100",
	],
	props: {},
	customStyles: {},
	children: [
		{
			id: "preset-dashboard-alert-text",
			elemType: "span",
			textContent: "Changes saved successfully.",
			cssClasses: [],
			props: {},
			customStyles: {},
			children: [],
		},
		{
			id: "preset-dashboard-alert-close",
			elemType: "button",
			textContent: "×",
			cssClasses: ["btn-close"],
			props: { type: "button" },
			customStyles: {},
			children: [],
		},
	],
};

//10. User welcome banner - personal greeting and school session.

const userWelcomePreset: CanvasElem = {
	id: "preset-dashboard-user-welcome",
	elemType: "div",
	textContent: "",
	cssClasses: ["card", "p-4", "w-100", "bg-primary", "text-white"],
	props: {},
	customStyles: {},
	children: [
		{
			id: "preset-dashboard-user-welcome-title",
			elemType: "h4",
			textContent: "How far, Student! 👋",
			cssClasses: ["fw-bold", "mb-2"],
			props: {},
			customStyles: {},
			children: [],
		},
		{
			id: "preset-dashboard-user-welcome-text",
			elemType: "p",
			textContent: "Welcome back! Make we see how your school journey dey go.",
			cssClasses: ["mb-2"],
			props: {},
			customStyles: {},
			children: [],
		},
		{
			id: "preset-dashboard-user-welcome-session",
			elemType: "p",
			textContent: "2026/2027 Session • First Term",
			cssClasses: ["small", "mb-0"],
			props: {},
			customStyles: {},
			children: [],
		},
	],
};

//11. User stats - personal academic overview.

const userStatsPreset: CanvasElem = {
	id: "preset-dashboard-user-stats",
	elemType: "div",
	textContent: "",
	cssClasses: ["d-flex", "flex-column", "flex-md-row", "gap-3", "w-100"],
	props: {},
	customStyles: {},
	children: [
		{
			id: "preset-dashboard-user-stats-attendance",
			elemType: "div",
			textContent: "",
			cssClasses: ["card", "p-3", "flex-fill"],
			props: {},
			customStyles: { minWidth: "0" },
			children: [
				{
					id: "preset-dashboard-user-stats-attendance-label",
					elemType: "p",
					textContent: "My Attendance",
					cssClasses: ["text-muted", "small", "mb-1"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-dashboard-user-stats-attendance-value",
					elemType: "h3",
					textContent: "94%",
					cssClasses: ["fw-bold", "mb-0"],
					props: {},
					customStyles: {},
					children: [],
				},
			],
		},
		{
			id: "preset-dashboard-user-stats-assignments",
			elemType: "div",
			textContent: "",
			cssClasses: ["card", "p-3", "flex-fill"],
			props: {},
			customStyles: { minWidth: "0" },
			children: [
				{
					id: "preset-dashboard-user-stats-assignments-label",
					elemType: "p",
					textContent: "Assignments Due",
					cssClasses: ["text-muted", "small", "mb-1"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-dashboard-user-stats-assignments-value",
					elemType: "h3",
					textContent: "5",
					cssClasses: ["fw-bold", "mb-0"],
					props: {},
					customStyles: {},
					children: [],
				},
			],
		},
		{
			id: "preset-dashboard-user-stats-average",
			elemType: "div",
			textContent: "",
			cssClasses: ["card", "p-3", "flex-fill"],
			props: {},
			customStyles: { minWidth: "0" },
			children: [
				{
					id: "preset-dashboard-user-stats-average-label",
					elemType: "p",
					textContent: "My Average Score",
					cssClasses: ["text-muted", "small", "mb-1"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-dashboard-user-stats-average-value",
					elemType: "h3",
					textContent: "76%",
					cssClasses: ["fw-bold", "mb-0"],
					props: {},
					customStyles: {},
					children: [],
				},
			],
		},
	],
};

//12. Assignment list - personal schoolwork.

const userAssignmentsPreset: CanvasElem = {
	id: "preset-dashboard-user-assignments",
	elemType: "div",
	textContent: "",
	cssClasses: ["card", "p-3", "w-100"],
	props: {},
	customStyles: {},
	children: [
		{
			id: "preset-dashboard-user-assignments-title",
			elemType: "h6",
			textContent: "My Assignments",
			cssClasses: ["fw-bold", "mb-3"],
			props: {},
			customStyles: {},
			children: [],
		},
		{
			id: "preset-dashboard-user-assignments-item-1",
			elemType: "div",
			textContent: "",
			cssClasses: [
				"d-flex",
				"justify-content-between",
				"align-items-center",
				"gap-2",
				"py-2",
				"border-bottom",
			],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-dashboard-user-assignments-item-1-name",
					elemType: "p",
					textContent: "Mathematics Assignment",
					cssClasses: ["mb-0", "small", "fw-bold", "flex-fill"],
					props: {},
					customStyles: { minWidth: "0" },
					children: [],
				},
				{
					id: "preset-dashboard-user-assignments-item-1-status",
					elemType: "span",
					textContent: "Due Tomorrow",
					cssClasses: ["badge", "text-bg-warning"],
					props: {},
					customStyles: {},
					children: [],
				},
			],
		},
		{
			id: "preset-dashboard-user-assignments-item-2",
			elemType: "div",
			textContent: "",
			cssClasses: [
				"d-flex",
				"justify-content-between",
				"align-items-center",
				"gap-2",
				"py-2",
				"border-bottom",
			],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-dashboard-user-assignments-item-2-name",
					elemType: "p",
					textContent: "Physics Practical Report",
					cssClasses: ["mb-0", "small", "fw-bold", "flex-fill"],
					props: {},
					customStyles: { minWidth: "0" },
					children: [],
				},
				{
					id: "preset-dashboard-user-assignments-item-2-status",
					elemType: "span",
					textContent: "Submitted",
					cssClasses: ["badge", "text-bg-success"],
					props: {},
					customStyles: {},
					children: [],
				},
			],
		},
		{
			id: "preset-dashboard-user-assignments-item-3",
			elemType: "div",
			textContent: "",
			cssClasses: [
				"d-flex",
				"justify-content-between",
				"align-items-center",
				"gap-2",
				"py-2",
			],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-dashboard-user-assignments-item-3-name",
					elemType: "p",
					textContent: "English Essay",
					cssClasses: ["mb-0", "small", "fw-bold", "flex-fill"],
					props: {},
					customStyles: { minWidth: "0" },
					children: [],
				},
				{
					id: "preset-dashboard-user-assignments-item-3-status",
					elemType: "span",
					textContent: "Pending",
					cssClasses: ["badge", "text-bg-secondary"],
					props: {},
					customStyles: {},
					children: [],
				},
			],
		},
	],
};

// Export all dashboard presets.

export const dashboardPresets = {
	dashboard: {
		variant: [
			// Previous presets
			{
				label: "Stat Card — Single Number, Label & Trend",
				preset: statCardPreset,
			},
			{
				label: "Stat Row — 4 Stats Side by Side",
				preset: statRowPreset,
			},
			{
				label: "Activity Item — Single Feed Row",
				preset: activityFeedItemPreset,
			},
			{
				label: "Activity Feed — Titled Card with 3 Items",
				preset: activityFeedPreset,
			},
			{
				label: "Data Row — Single Table-Free List Row",
				preset: dataRowPreset,
			},
			{
				label: "Data List — Titled Card with 3 Rows",
				preset: dataListPreset,
			},
			{
				label: "Chart Placeholder — Titled Card, Empty Chart Area",
				preset: chartPlaceholderPreset,
			},
			{
				label: "Quick Actions — Titled Card with Action Buttons",
				preset: quickActionsPreset,
			},
			{
				label: "Alert Banner — Dismissible Notification",
				preset: alertBannerPreset,
			},

			// New user-focused presets
			{
				label: "User Welcome Banner — Student Greeting",
				preset: userWelcomePreset,
			},
			{
				label: "User Stats — Attendance, Assignments & Average",
				preset: userStatsPreset,
			},
			{
				label: "User Assignments — Personal Schoolwork List",
				preset: userAssignmentsPreset,
			},
		],
	},
};
