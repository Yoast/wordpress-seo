/* eslint-disable complexity */

import ImageSelectComponent from "../ImageSelectComponent";
import Portal from "./Portal";

/**
 * @param {Object} props Component props.
 * @param {string} props.target The target element ID in which to render the portal.
 * @param {string} props.label The label for the Image Select component.
 * @param {boolean} props.hasPreview A boolean to determine if a preview should be rendered.
 * @param {string} props.hiddenField A hidden field to save the image.
 * @param {string} [props.hiddenFieldImageId=""] The ID for the hidden field.
 * @param {string} [props.hiddenFieldFallbackImageId=""] The ID for the hidden fallback image field.
 * @param {string} [props.selectImageButtonId=""] The ID for the image select button.
 * @param {string} [props.replaceImageButtonId=""] The ID for the image replace button.
 * @param {string} [props.removeImageButtonId=""] The ID for the image remove button.
 * @param {boolean} [props.hasNewBadge=false] Whether the ImageSelectComponent has a 'New' badge.
 * @param {boolean} [props.isDisabled=false] Whether the ImageSelectComponent is disabled.
 * @param {boolean} [props.hasPremiumBadge=false] Whether the ImageSelectComponent has a 'Premium' badge.
 * @param {boolean} [props.hasImageValidation=false] Whether the uploaded image uses validation.
 *
 * @returns {React.ReactNode} The element.
 */
export default function ImageSelectPortal( {
	target,
	label,
	hasPreview,
	hiddenField,
	hiddenFieldImageId = "",
	hiddenFieldFallbackImageId = "",
	selectImageButtonId = "",
	replaceImageButtonId = "",
	removeImageButtonId = "",
	hasNewBadge = false,
	isDisabled = false,
	hasPremiumBadge = false,
	hasImageValidation = false,
} ) {
	return (
		<Portal target={ target }>
			<ImageSelectComponent
				label={ label }
				hasPreview={ hasPreview }
				hiddenField={ hiddenField }
				hiddenFieldImageId={ hiddenFieldImageId }
				hiddenFieldFallbackImageId={ hiddenFieldFallbackImageId }
				selectImageButtonId={ selectImageButtonId }
				replaceImageButtonId={ replaceImageButtonId }
				removeImageButtonId={ removeImageButtonId }
				hasNewBadge={ hasNewBadge }
				isDisabled={ isDisabled }
				hasPremiumBadge={ hasPremiumBadge }
				hasImageValidation={ hasImageValidation }
			/>
		</Portal>
	);
}
