import PropTypes from "prop-types";

import ImageSelectComponent from "../ImageSelectComponent";
import Portal from "./Portal";

export default function ImageSelectPortal( { target, label, hasPreview } ) {
	return (
		<Portal target={ target }>
			<ImageSelectComponent label={ label } hasPreview={ hasPreview } />
		</Portal>
	);
}

ImageSelectPortal.propTypes = {
	target: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	hasPreview: PropTypes.bool.isRequired,
};
