import { __ } from "@wordpress/i18n";
/**
 * @type {import("../index").Scores} Scores
 */

/**
 * @param {Scores|null} scores The SEO scores.
 * @returns {JSX.Element}
 */
export const ContentStatusDescription = ( { scores } ) => {
	if ( ! scores ) {
		return <p className="yst-my-6">{ __( "No scores could be retrieved Or maybe loading??", "wordpress-seo" ) }</p>;
	}
	return <p className="yst-my-6">{ __( "description placeholder", "wordpress-seo" ) }</p>;
};
