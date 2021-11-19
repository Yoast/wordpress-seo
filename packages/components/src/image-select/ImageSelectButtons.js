import React from "react";
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
		isDisabled,
	 } = props;

	return (
		<div className="yoast-image-select-buttons">
			<Button
				variant="secondary"
				id={ imageSelected ? replaceImageButtonId : selectImageButtonId }
				onClick={ onClick }
				disabled={ isDisabled }
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
					disabled={ isDisabled }
				>
					{ __( "Remove image", "yoast-components" ) }
				</Button>
			}
		</div>
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
	isDisabled: PropTypes.bool,
};

ImageSelectButtons.defaultProps = {
	imageSelected: false,
	onClick: () => {},
	onRemoveImageClick: () => {},
	selectImageButtonId: "",
	replaceImageButtonId: "",
	removeImageButtonId: "",
	isDisabled: false,
};
