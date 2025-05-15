import { useSelect } from "@wordpress/data";
import { TwitterPreview as PureTwitterPreview } from "@yoast/social-metadata-previews";
import { noop } from "lodash";
import PropTypes from "prop-types";
import { STORE_NAME_EDITOR } from "../../shared-admin/constants";

/**
 * @param {string} title The raw title.
 * @param {string} description The raw description.
 * @returns {JSX.Element} The element.
 */
export const TwitterPreview = ( { title, description } ) => {
	const siteUrl = useSelect( select => select( STORE_NAME_EDITOR.free ).getSiteUrl(), [] );
	const imageUrl = useSelect( select => select( STORE_NAME_EDITOR.free ).getTwitterImageUrl(), [] );
	const facebookImagekUrl = useSelect( select => select( STORE_NAME_EDITOR.free ).getFacebookImageUrl(), [] );
	const imageFallbackUrl = useSelect( select => select( STORE_NAME_EDITOR.free ).getEditorDataImageFallback(), [] );
	const twitterImageType = useSelect( select => select( STORE_NAME_EDITOR.free ).getTwitterImageType(), [] );
	const alt = useSelect( select => select( STORE_NAME_EDITOR.free ).getTwitterAltText(), [] );

	return (
		<div className="yst-bg-slate-200 yst-p-2 yst--mx-6">
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
