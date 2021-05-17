import React from "react";
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

	let imageClassName = "yoast-image-select__preview";
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
			>
				{ props.hasPreview &&
					<button className={ imageClassName } onClick={ props.onClick } type="button">
						{ previewImageUrl !== "" &&
							<img src={ previewImageUrl } alt={ props.imageAltText } className="yoast-image-select__preview--image" />
						}
					</button>
				}
				{
					props.warnings.length > 0 && imageSelected &&
					props.warnings.map( ( warning, index ) => <Alert key={ `warning${ index }` } type="warning">
						{ warning }
					</Alert> )
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
	imageAltText: PropTypes.string,
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
};

ImageSelect.defaultProps = {
	defaultImageUrl: "",
	imageUrl: "",
	imageAltText: "",
	onClick: () => {},
	onMouseEnter: () => {},
	onMouseLeave: () => {},
	onRemoveImageClick: () => {},
	selectImageButtonId: "",
	replaceImageButtonId: "",
	removeImageButtonId: "",
	warnings: [],
	hasNewBadge: false,
};
