import { __ } from "@wordpress/i18n";
import { Label } from "@yoast/ui-library";
import { SocialPreview, SocialPreviewSkeleton } from ".";

/**
 * @param {Object} props Component props.
 * @param {string} props.title The title.
 * @param {string} props.description The description.
 * @param {boolean} props.showPreviewSkeleton Whether to show the preview skeleton or the actual preview.
 *
 * @returns {JSX.Element} The element.
 */
export const SocialContent = ( { title, description, showPreviewSkeleton } ) => (
	<div>
		<div className="yst-flex yst-mb-6">
			<Label as="span" className="yst-flex-grow yst-cursor-default">
				{ __( "Social preview", "wordpress-seo" ) }
			</Label>
		</div>
		{ showPreviewSkeleton
			? <SocialPreviewSkeleton />
			: <SocialPreview title={ title } description={ description } />
		}
	</div>
);
