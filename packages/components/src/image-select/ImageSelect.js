import React, { Fragment } from "react";
import ImageSelectButtons from "./ImageSelectButtons";
import PropTypes from "prop-types";
import FieldGroup from "../field-group/FieldGroup";
import TextInput from "../inputs/TextInput";

/**
 * Renders ImageSelect.
 *
 * @param {Object} props The Props object.
 *
 * @returns {React.Component} The ImageSelect.
 */
function ImageSelect( props ) {
	const imageSelected = props.imageUrl !== "";
	const imageSelectButtonsProps = {
		imageSelected: imageSelected,
		onClick: props.onClick,
		onRemoveImageClick: props.onRemoveImageClick,
		selectImageButtonId: props.selectImageButtonId,
		replaceImageButtonId: props.replaceImageButtonId,
		removeImageButtonId: props.removeImageButtonId,
	};
	const imageClassName = imageSelected
		? "yoast-image-select__preview" : "yoast-image-select__preview yoast-image-select__preview--no-preview";
	return (
		<div className="yoast-image-select">
			{ props.hasPreview
				? <FieldGroup
					label={ props.label }
					wrapperClassName={ "yoast-field-group__image-select" }
				>
					<button className={ imageClassName } onClick={ props.onClick } type="button">
						{ imageSelected &&
						<img src={ props.imageUrl } alt={ props.imageAltText } className="yoast-image-select__preview--image" /> }
					</button>
					<ImageSelectButtons { ...imageSelectButtonsProps } />
				</FieldGroup>
				: <Fragment>
					<TextInput
						wrapperClassName={ "yoast-field-group__image-select" }
						label={ props.label } type="url"
						value={ props.imageUrl } readOnly={ true }
					/>
					<ImageSelectButtons { ...imageSelectButtonsProps } />
				</Fragment>
			}
		</div>
	);
}

export default ImageSelect;

ImageSelect.propTypes = {
	imageUrl: PropTypes.string,
	imageAltText: PropTypes.string,
	hasPreview: PropTypes.bool.isRequired,
	label: PropTypes.string.isRequired,
	onClick: PropTypes.func,
	onRemoveImageClick: PropTypes.func,
	selectImageButtonId: PropTypes.string,
	replaceImageButtonId: PropTypes.string,
	removeImageButtonId: PropTypes.string,
};

ImageSelect.defaultProps = {
	imageUrl: "",
	imageAltText: "",
	onClick: () => {},
	onRemoveImageClick: () => {},
	selectImageButtonId: "",
	replaceImageButtonId: "",
	removeImageButtonId: "",
};
