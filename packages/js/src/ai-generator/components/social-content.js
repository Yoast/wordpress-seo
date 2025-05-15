import { __ } from "@wordpress/i18n";
import { Label } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { SocialPreview, SocialPreviewSkeleton } from ".";

/**
 * @param {string} title The title.
 * @param {string} description The description.
 * @param {string} status The fetch status.
 * @param {boolean} showPreviewSkeleton Whether to show the preview skeleton or the actual preview.
 * @returns {JSX.Element} The element.
 */
export const SocialContent = ( { title, description, showPreviewSkeleton } ) => (
	<div>
		<div className="yst-flex yst-mb-6">
			<Label as="span" className="yst-flex-grow yst-cursor-default">
				{ __( "Social preview", "wordpress-seo-premium" ) }
			</Label>
		</div>
		{ showPreviewSkeleton
			? <SocialPreviewSkeleton />
			: <SocialPreview title={ title } description={ description } />
		}
	</div>
);
SocialContent.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	showPreviewSkeleton: PropTypes.bool.isRequired,
};
