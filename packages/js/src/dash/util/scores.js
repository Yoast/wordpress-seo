import { __ } from "@wordpress/i18n";
export const SCORES = {
	good: {
		label: __( "Good", "wordpress-seo" ),
		color: "yst-bg-analysis-good",
		hex: "#7ad03a",
	},
	ok: {
		label: __( "OK", "wordpress-seo" ),
		color: "yst-bg-analysis-ok",
		hex: "#ee7c1b",
	},
	bad: {
		label: __( "Needs improvement", "wordpress-seo" ),
		color: "yst-bg-analysis-bad",
		hex: "#dc3232",
	},
	notAnalyzed: {
		label: __( "Not analyzed", "wordpress-seo" ),
		color: "yst-bg-analysis-na",
		hex: "#cbd5e1",
	},
};
