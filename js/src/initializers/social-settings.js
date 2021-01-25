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
			/>
			<ImageSelectPortal
				label="Image"
				hasPreview={ true }
				target="yoast-og-default-image-select"
				hiddenField="og_default_image"
			/>
		</Fragment>,
		element
	);
}
