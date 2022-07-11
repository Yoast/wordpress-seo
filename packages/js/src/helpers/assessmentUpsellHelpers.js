import { languageProcessing, helpers } from "yoastseo";

/**
 * Checks if the content language has Word complexity assessment support.
 *
 * @returns {boolean} Returns true if Word complexity assessment is supported for the current locale.
 */
export function isWordComplexitySupported() {
	const languagesWithSupport = helpers.getLanguagesWithWordComplexity();
	const locale = window.wpseoScriptData.metabox.contentLocale;
	const language = languageProcessing.getLanguage( locale );

	console.log(  languagesWithSupport.includes( language ), "word complexity" );

	return languagesWithSupport.includes( language );
}
