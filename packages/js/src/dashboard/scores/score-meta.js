import { __ } from "@wordpress/i18n";

/**
 * @type {import("../index").AnalysisType} AnalysisType
 * @type {import("../index").ScoreType} ScoreType
 */

/**
 * @type {Object.<ScoreType,{label: string, color: string, hex: string}>} The meta data.
 */
export const SCORE_META = {
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

/**
 * @type {Object.<AnalysisType,Object.<ScoreType,string>>} The descriptions.
 */
export const SCORE_DESCRIPTIONS = {
	seo: {
		good: __( "Most of your content has a good SEO score. Well done!", "wordpress-seo" ),
		ok: __( "Your content has an average SEO score. Find opportunities for enhancement.", "wordpress-seo" ),
		bad: __( "Some of your content needs attention. Identify and address areas for improvement.", "wordpress-seo" ),
		notAnalyzed: __( "Some of your content hasn't been analyzed yet. Please open it in your editor so we can analyze it.", "wordpress-seo" ),
	},
	readability: {
		good: __( "Most of your content has a good Readability score. Well done!", "wordpress-seo" ),
		ok: __( "Your content has an average Readability score. Find opportunities for enhancement.", "wordpress-seo" ),
		bad: __( "Some of your content needs attention. Identify and address areas for improvement.", "wordpress-seo" ),
		notAnalyzed: __( "Some of your content hasn't been analyzed yet. Please open it in your editor so we can analyze it.", "wordpress-seo" ),
	},
};
