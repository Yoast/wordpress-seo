import React from "react";
import ImageSelectButtons from "./ImageSelectButtons";
import PropTypes from "prop-types";
import FieldGroup from "../field-group/FieldGroup";
import TextInput from "../inputs/TextInput";

class ImageSelect extends React.Component {
	/**
	 * Returns ImageSelect with a preview or inputfield depending on Free or Premium
	 *
	 * @returns {Element} ImageSelectElement
	 */
	getImageSelect() {
		const imageSelectButtonsProps = this.props;
		const imageClassName = this.props.imageSelected
			? "yoast-image-select__preview" : "yoast-image-select__preview yoast-image-select__preview--no-preview";
		return (
			<div className="yoast-image-select">
				{ this.props.isPremium
					? <button className={ imageClassName } onClick={ this.props.onClick } type="button">
						{ this.props.imageSelected &&
						<img src={ this.props.imageUrl } alt={ this.props.imageAltText } className="yoast-image-select__preview--image" /> }
					</button>
					: <TextInput type="url" value={ this.props.imageUrl } />
				}
				<ImageSelectButtons { ...imageSelectButtonsProps } />
			</div>
		);
	}
	/**
	 * Returns the rendered HTML.
	 *
	 * @returns {React.Component} The ImageSelect.
	 */
	render() {
		return (
			<FieldGroup
				label={ this.props.label }
				wrapperClassName={ "yoast-field-group__image-select" }
			>
				{ this.getImageSelect() }
			</FieldGroup>
		);
	}
}

export default ImageSelect;

ImageSelect.propTypes = {
	imageUrl: PropTypes.string,
	imageAltText: PropTypes.string,
	imageSelected: PropTypes.bool,
	isPremium: PropTypes.bool.isRequired,
	label: PropTypes.string.isRequired,
	onClick: () => {},
}
