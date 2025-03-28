import { __ } from "@wordpress/i18n";

/**
 * @param {string} [className="yst-mt-4"] The class name.
 * @returns {JSX.Element} The element.
 */
export const NoDataParagraph = ( { className = "yst-mt-4" } ) => (
	<p className={ className }>
		{ __( "No data to display: Your site hasn't received any visitors yet.", "wordpress-seo" ) }
	</p>
);
