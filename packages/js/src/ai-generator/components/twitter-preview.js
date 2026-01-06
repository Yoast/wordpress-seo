import { useSelect } from "@wordpress/data";
import { TwitterPreview as PureTwitterPreview } from "../../../../social-metadata-previews/src";
import { noop } from "lodash";
import PropTypes from "prop-types";
import { STORE_NAME_EDITOR } from "../constants";

/**
 * @param {string} title The raw title.
 * @param {string} description The raw description.
 * @returns {JSX.Element} The element.
 */
export const TwitterPreview = ( { title, description } ) => {
	const siteUrl = useSelect( select => select( STORE_NAME_EDITOR ).getSiteUrl(), [] );
	const imageUrl = useSelect( select => select( STORE_NAME_EDITOR ).getTwitterImageUrl(), [] );
	const facebookImagekUrl = useSelect( select => select( STORE_NAME_EDITOR ).getFacebookImageUrl(), [] );
	const imageFallbackUrl = useSelect( select => select( STORE_NAME_EDITOR ).getEditorDataImageFallback(), [] );
	const twitterImageType = useSelect( select => select( STORE_NAME_EDITOR ).getTwitterImageType(), [] );
	const alt = useSelect( select => select( STORE_NAME_EDITOR ).getTwitterAltText(), [] );

	return (
		<div className="yst-ai-generator-preview-section yst-p-2">
			<PureTwitterPreview
				title={ title }
				description={ description }
				siteUrl={ siteUrl }
				imageUrl={ imageUrl }
				imageFallbackUrl={ facebookImagekUrl || imageFallbackUrl }
				isLarge={ twitterImageType !== "summary" }
				alt={ alt }
				onSelect={ noop }
				onImageClick={ noop }
				onMouseHover={ noop }
			/>
		</div>
	);
};
TwitterPreview.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
};
