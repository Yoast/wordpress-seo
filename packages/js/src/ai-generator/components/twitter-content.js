import { __ } from "@wordpress/i18n";
import { Label } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { TwitterPreview, TwitterPreviewSkeleton } from ".";

/**
 * @param {string} title The title.
 * @param {string} description The description.
 * @param {string} status The fetch status.
 * @param {boolean} showPreviewSkeleton Whether to show the preview skeleton or the actual preview.
 * @returns {JSX.Element} The element.
 */
export const TwitterContent = ( { title, description, showPreviewSkeleton } ) => (
	<div>
		<div className="yst-flex yst-mb-6">
			<Label as="span" className="yst-flex-grow yst-cursor-default">
				{ __( "X preview", "wordpress-seo-premium" ) }
			</Label>
		</div>
		{ showPreviewSkeleton
			? <TwitterPreviewSkeleton />
			: <TwitterPreview title={ title } description={ description } />
		}
	</div>
);
TwitterContent.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	showPreviewSkeleton: PropTypes.bool.isRequired,
};
