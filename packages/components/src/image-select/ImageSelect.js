import React from "react";
import { __ } from "@wordpress/i18n";
import ImageSelectButtons from "./ImageSelectButtons";
import PropTypes from "prop-types";
import FieldGroup from "../field-group/FieldGroup";
import Alert from "../Alert";

/**
 * Renders ImageSelect component.
 *
 * @param {Object} props The props.
 *
 * @returns {React.Component} The ImageSelect.
 */
function ImageSelect( props ) {
	const imageSelected = props.imageUrl !== "";
	const previewImageUrl = props.imageUrl || props.defaultImageUrl || "";
	const showWarnings = props.warnings.length > 0 && imageSelected;

	let imageClassName = showWarnings ? "yoast-image-select__preview yoast-image-select__preview-has-warnings" : "yoast-image-select__preview";
	if ( previewImageUrl === "" ) {
		imageClassName = "yoast-image-select__preview yoast-image-select__preview--no-preview";
	}

	const imageSelectButtonsProps = {
		imageSelected: imageSelected,
		onClick: props.onClick,
		onRemoveImageClick: props.onRemoveImageClick,
		selectImageButtonId: props.selectImageButtonId,
		replaceImageButtonId: props.replaceImageButtonId,
		removeImageButtonId: props.removeImageButtonId,
		isDisabled: props.isDisabled,
	};

	/**
	 * @returns {JSXElement} returns a text for screen readers.
	 */
	const ScreenReaderText = () => {
		return (
			<span className="screen-reader-text">
				{
					imageSelected
						? __( "Replace image", "wordpress-seo" )
						: __( "Select image", "wordpress-seo" )
				}
			</span>
		);
	};

	return (
		<div
			className="yoast-image-select"
			onMouseEnter={ props.onMouseEnter }
			onMouseLeave={ props.onMouseLeave }
		>
			<FieldGroup
				label={ props.label }
				hasNewBadge={ props.hasNewBadge }
				hasPremiumBadge={ props.hasPremiumBadge }
			>
				{ props.hasPreview &&
					<button
						className={ imageClassName }
						onClick={ props.onClick }
						type="button"
						disabled={ props.isDisabled }
					>
						{ previewImageUrl !== "" &&
							<img src={ previewImageUrl } alt={ props.imageAltText } className="yoast-image-select__preview--image" />
						}
						<ScreenReaderText />
					</button>
				}
				{
					showWarnings && <div role="alert">
						{
							props.warnings.map( ( warning, index ) => <Alert key={ `warning${ index }` } type="warning">
								{ warning }
							</Alert> )
						}
					</div>
				}
				<ImageSelectButtons { ...imageSelectButtonsProps } />
			</FieldGroup>
		</div>
	);
}

export default ImageSelect;

ImageSelect.propTypes = {
	defaultImageUrl: PropTypes.string,
	imageUrl: PropTypes.string,
	imageAltText: PropTypes.string.isRequired,
	hasPreview: PropTypes.bool.isRequired,
	label: PropTypes.string.isRequired,
	onClick: PropTypes.func,
	onMouseEnter: PropTypes.func,
	onMouseLeave: PropTypes.func,
	onRemoveImageClick: PropTypes.func,
	selectImageButtonId: PropTypes.string,
	replaceImageButtonId: PropTypes.string,
	removeImageButtonId: PropTypes.string,
	warnings: PropTypes.arrayOf( PropTypes.string ),
	hasNewBadge: PropTypes.bool,
	isDisabled: PropTypes.bool,
	hasPremiumBadge: PropTypes.bool,
};

ImageSelect.defaultProps = {
	defaultImageUrl: "",
	imageUrl: "",
	onClick: () => {},
	onMouseEnter: () => {},
	onMouseLeave: () => {},
	onRemoveImageClick: () => {},
	selectImageButtonId: "",
	replaceImageButtonId: "",
	removeImageButtonId: "",
	warnings: [],
	hasNewBadge: false,
	isDisabled: false,
	hasPremiumBadge: false,
};
