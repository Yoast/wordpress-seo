import { __ } from "@wordpress/i18n";

/**
 * @type {import("../index").AnalysisType} AnalysisType
 * @type {import("../index").ScoreType} ScoreType
 */

/**
 * @type {Object.<ScoreType,{label: string, color: string, hex: string, tooltip?: string}>} The meta data.
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
		tooltip: __( "We haven’t analyzed this content yet. Please open it in your editor, ensure a focus keyphrase is entered, and save it so we can start the analysis.", "wordpress-seo" ),
	},
};

/**
 * @type {Object.<AnalysisType,Object.<ScoreType,string>>} The descriptions.
 */
export const SCORE_DESCRIPTIONS = {
	seo: {
		good: __( "Most of your content has a good SEO score. Well done!", "wordpress-seo" ),
		ok: __( "Your content has an average SEO score. Time to find opportunities for improvement!", "wordpress-seo" ),
		bad: __( "Some of your content could use a little extra care. Take a look and start improving!", "wordpress-seo" ),
		notAnalyzed: __( "Some of your content hasn't been analyzed yet. Please open it in your editor, ensure a focus keyphrase is entered, and save it so we can start the analysis.", "wordpress-seo" ),
	},
	readability: {
		good: __( "Most of your content has a good readability score. Well done!", "wordpress-seo" ),
		ok: __( "Your content has an average readability score. Time to find opportunities for improvement!", "wordpress-seo" ),
		bad: __( "Some of your content could use a little extra care. Take a look and start improving!", "wordpress-seo" ),
		notAnalyzed: __( "Some of your content hasn't been analyzed yet. Please open it and save it in your editor so we can start the analysis.", "wordpress-seo" ),
	},
};
