import PropTypes from "prop-types";

import ImageSelectComponent from "../ImageSelectComponent";
import Portal from "./Portal";

/**
 *
 * @param {string}  target A target element ID in which to render the portal.
 * @param {string}  label The label for the Image Select component.
 * @param {Boolean} hasPreview A boolean to determine if a preview should be rendered.
 * @returns {null|wp.Element} The element.
 * @constructor
 */
export default function ImageSelectPortal( { target, label, hasPreview, hiddenField, hiddenFieldImageId } ) {
	return (
		<Portal target={ target }>
			<ImageSelectComponent
				label={ label }
				hasPreview={ hasPreview }
				hiddenField={ hiddenField }
				hiddenFieldImageId={ hiddenFieldImageId }
			/>
		</Portal>
	);
}

ImageSelectPortal.propTypes = {
	target: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	hasPreview: PropTypes.bool.isRequired,
	hiddenField: PropTypes.string.isRequired,
};
