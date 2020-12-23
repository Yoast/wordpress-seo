import React from "react";
import ImageSelectButtons from "./ImageSelectButtons";
import PropTypes from "prop-types";


/**
 * Renders the ImageSelect component.
 *
 * @param {Object} props The props.
 *
 * @returns {Element} The ImageSelect component.
 */
function ImageSelect( props ) {
	const {
		imageUrl,
		imageAltText,
		onSelectImageClick,
		...imageSelectButtonsProps
	} = props;

	const imageClassName = props.imageSelected
		? "yoast-image-select__preview" : "yoast-image-select__preview yoast-image-select__preview--no-preview";

	return (
		<div className="yoast-image-select">
			<button className={ imageClassName } onClick={ onSelectImageClick }>
				{ props.imageSelected && <img src={ imageUrl } alt={ imageAltText } className="yoast-image-select__preview--image" /> }
			</button>
			<ImageSelectButtons { ...imageSelectButtonsProps } />
		</div>
	);
};

export default ImageSelect;

ImageSelect.propTypes = {
	imageUrl: PropTypes.string,
	imageAltText: PropTypes.string,
	imageSelected: PropTypes.bool,
	onSelectImageClick: () => {},
}
