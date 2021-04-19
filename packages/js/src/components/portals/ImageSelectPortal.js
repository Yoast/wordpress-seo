import PropTypes from "prop-types";

import ImageSelectComponent from "../ImageSelectComponent";
import Portal from "./Portal";

/**
 *
 * @param {string}  target A target element ID in which to render the portal.
 * @param {string}  label The label for the Image Select component.
 * @param {Boolean} hasPreview A boolean to determine if a preview should be rendered.
 * @param {string}  hiddenField A hidden field to save the image.
 * @param {string}  hiddenFieldImageId The ID for the hidden field.
 * @param {string}  selectImageButtonId The ID for the image select button.
 * @param {string}  replaceImageButtonId The ID for the image replace button.
 * @param {string}  removeImageButtonId The ID for the image remove button.
 * @returns {null|wp.Element} The element.
 * @constructor
 */
export default function ImageSelectPortal(
	{ target,
		label,
		hasPreview,
		hiddenField,
		hiddenFieldImageId,
		selectImageButtonId,
		replaceImageButtonId,
		removeImageButtonId,
	} ) {
	return (
		<Portal target={ target }>
			<ImageSelectComponent
				label={ label }
				hasPreview={ hasPreview }
				hiddenField={ hiddenField }
				hiddenFieldImageId={ hiddenFieldImageId }
				selectImageButtonId={ selectImageButtonId }
				replaceImageButtonId={ replaceImageButtonId }
				removeImageButtonId={ removeImageButtonId }
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
	selectImageButtonId: PropTypes.string,
	replaceImageButtonId: PropTypes.string,
	removeImageButtonId: PropTypes.string,
};

ImageSelectPortal.defaultProps = {
	hiddenFieldImageId: "",
	selectImageButtonId: "",
	replaceImageButtonId: "",
	removeImageButtonId: "",
};
