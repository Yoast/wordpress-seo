import React, { Fragment } from "react";
import { NewButton as Button } from "../button";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

/**
 * The ImageSelectButtons component.
 *
 * @param {Object} props The props object.
 *
 * @returns {Element} The ImageSelectButtons component;
 */
const ImageSelectButtons = ( props ) => {
	const {
		imageSelected,
		onClick,
		onRemoveImageClick,
		selectImageButtonId,
		replaceImageButtonId,
		removeImageButtonId,
	 } = props;

	return (
		<Fragment>
			<Button
				variant="secondary"
				id={ imageSelected ? replaceImageButtonId : selectImageButtonId }
				onClick={ onClick }
			>
				{
					imageSelected
						? __( "Replace image", "yoast-components" )
						: __( "Select image", "yoast-components" )
				}
			</Button>
			{
				imageSelected && <Button
					variant="remove"
					id={ removeImageButtonId }
					onClick={ onRemoveImageClick }
				>
					{ __( "Remove image", "yoast-components" ) }
				</Button>
			}
		</Fragment>
	);
};

export default ImageSelectButtons;

ImageSelectButtons.propTypes = {
	imageSelected: PropTypes.bool,
	onClick: PropTypes.func,
	onRemoveImageClick: PropTypes.func,
	selectImageButtonId: PropTypes.string,
	replaceImageButtonId: PropTypes.string,
	removeImageButtonId: PropTypes.string,
};

ImageSelectButtons.defaultProps = {
	imageSelected: false,
	onClick: () => {},
	onRemoveImageClick: () => {},
	selectImageButtonId: "",
	replaceImageButtonId: "",
	removeImageButtonId: "",
};
