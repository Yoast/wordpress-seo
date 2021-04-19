import { render, Fragment } from "@wordpress/element";
import ImageSelectPortal from "../components/portals/ImageSelectPortal";

/**
 * @summary Initializes the search appearance settings script.
 * @returns {void}
 */
export default function initSocialSettings() {
	const element = document.createElement( "div" );
	document.body.appendChild( element );

	render(
		<Fragment>
			<ImageSelectPortal
				label="Image"
				hasPreview={ true }
				target="yoast-og-frontpage-image-select"
				hiddenField="og_frontpage_image"
				hiddenFieldImageId="og_frontpage_image_id"
				selectImageButtonId="yoast-og-frontpage-image-select-button"
				replaceImageButtonId="yoast-og-frontpage-image-replace-button"
				removeImageButtonId="yoast-og-frontpage-image-remove-button"
			/>
			<ImageSelectPortal
				label="Image"
				hasPreview={ true }
				target="yoast-og-default-image-select"
				hiddenField="og_default_image"
				hiddenFieldImageId="og_default_image_id"
				selectImageButtonId="yoast-og-default-image-select-button"
				replaceImageButtonId="yoast-og-default-image-replace-button"
				removeImageButtonId="yoast-og-default-image-remove-button"
			/>
		</Fragment>,
		element
	);
}
