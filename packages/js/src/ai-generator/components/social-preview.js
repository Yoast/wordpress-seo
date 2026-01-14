import { useSelect } from "@wordpress/data";
import { FacebookPreview } from "../../../../social-metadata-previews/src";
import { noop } from "lodash";
import PropTypes from "prop-types";
import { STORE_NAME_EDITOR } from "../constants";

/**
 * @param {string} title The raw title.
 * @param {string} description The raw description.
 * @returns {JSX.Element} The element.
 */
export const SocialPreview = ( { title, description } ) => {
	const siteUrl = useSelect( select => select( STORE_NAME_EDITOR ).getSiteUrl(), [] );
	const imageUrl = useSelect( select => select( STORE_NAME_EDITOR ).getFacebookImageUrl(), [] );
	const imageFallbackUrl = useSelect( select => select( STORE_NAME_EDITOR ).getEditorDataImageFallback(), [] );
	const alt = useSelect( select => select( STORE_NAME_EDITOR ).getFacebookAltText(), [] );

	return (
		<div className="yst-ai-generator-preview-section">
			<FacebookPreview
				title={ title }
				description={ description }
				siteUrl={ siteUrl }
				imageUrl={ imageUrl }
				imageFallbackUrl={ imageFallbackUrl }
				alt={ alt }
				onSelect={ noop }
				onImageClick={ noop }
				onMouseHover={ noop }
			/>
		</div>
	);
};
SocialPreview.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
};
