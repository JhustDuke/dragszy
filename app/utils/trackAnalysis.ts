import { usePostHog } from "#imports";

// tracks one user action e.g. trackAnalytics("export", { format: "vue" })
export function trackAnalytics(
	actionName: string,
	actionDetails?: Record<string, string | number | boolean>
) {
	const posthog = usePostHog();

	// posthog is undefined during ssr so the ? skips it there
	posthog?.capture(actionName, actionDetails);
}
