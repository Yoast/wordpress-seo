import { __ } from "@wordpress/i18n";
import { Alert } from "@yoast/ui-library";

/**
 * The notice shown in place of the table when no content type is available to the bulk editor,
 * e.g. because "Enable SEO controls and assessments" is off for every post type.
 *
 * @returns {JSX.Element} The no-content-types notice.
 */
export const NoContentTypesNotice = () => (
	<div className="yst-p-8">
		<Alert variant="error" as="div" role="alert">
			{ __( "No content types are available for the bulk editor. Enable SEO controls and assessments for at least one content type in Settings.", "wordpress-seo" ) }
		</Alert>
	</div>
);
