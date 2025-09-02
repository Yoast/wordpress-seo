/* eslint-disable complexity */
import PropTypes from "prop-types";

import ImageSelectComponent from "../ImageSelectComponent";
import Portal from "./Portal";

/**
 * @param {string} target The target element ID in which to render the portal.
 * @param {string} label The label for the Image Select component.
 * @param {boolean} hasPreview A boolean to determine if a preview should be rendered.
 * @param {string} hiddenField A hidden field to save the image.
 * @param {string} [hiddenFieldImageId=""] The ID for the hidden field.
 * @param {string} [hiddenFieldFallbackImageId=""] The ID for the hidden fallback image field.
 * @param {string} [selectImageButtonId=""] The ID for the image select button.
 * @param {string} [replaceImageButtonId=""] The ID for the image replace button.
 * @param {string} [removeImageButtonId=""] The ID for the image remove button.
 * @param {boolean} [hasNewBadge=false] Whether the ImageSelectComponent has a 'New' badge.
 * @param {boolean} [isDisabled=false] Whether the ImageSelectComponent is disabled.
 * @param {boolean} [hasPremiumBadge=false] Whether the ImageSelectComponent has a 'Premium' badge.
 * @param {boolean} [hasImageValidation=false] Whether the uploaded image uses validation.
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

ImageSelectPortal.propTypes = {
	target: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	hasPreview: PropTypes.bool.isRequired,
	hiddenField: PropTypes.string.isRequired,
	hiddenFieldImageId: PropTypes.string,
	hiddenFieldFallbackImageId: PropTypes.string,
	selectImageButtonId: PropTypes.string,
	replaceImageButtonId: PropTypes.string,
	removeImageButtonId: PropTypes.string,
	hasNewBadge: PropTypes.bool,
	isDisabled: PropTypes.bool,
	hasPremiumBadge: PropTypes.bool,
	hasImageValidation: PropTypes.bool,
};
