import { createInterpolateElement } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Alert, Link } from "@yoast/ui-library";

/**
 * The notice shown in place of the table when no content type is available to the bulk editor,
 * e.g. because "Enable SEO controls and assessments" is off for every post type.
 *
 * @param {Object} props             The props.
 * @param {string} props.settingsUrl The URL of the Yoast SEO settings page, where the toggle lives.
 *
 * @returns {JSX.Element} The no-content-types notice.
 */
export const NoContentTypesNotice = ( { settingsUrl } ) => (
	<div className="yst-p-8">
		<Alert variant="warning" as="div" role="status" className="yst-max-w-screen-sm">
			<div className="yst-flex yst-flex-col yst-gap-1">
				<span className="yst-block yst-font-medium">{ __( "No content types are available for the bulk editor", "wordpress-seo" ) }</span>
				<span className="yst-font-normal">
					{ createInterpolateElement(
						__( "Enable SEO controls and assessments for at least one content type in <link>Settings</link>.", "wordpress-seo" ),
						// The placeholder child satisfies Link's required children; interpolation replaces it with the label.
						{ link: <Link href={ settingsUrl }> </Link> }
					) }
				</span>
			</div>
		</Alert>
	</div>
);
