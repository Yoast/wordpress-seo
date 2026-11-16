import React from "react";
import { __ } from "@wordpress/i18n";
import ImageSelectButtons from "./ImageSelectButtons";
import { noop } from "lodash";
import FieldGroup from "../field-group/FieldGroup";
import Alert from "../Alert";

// Stable reference matching the old defaultProps single instance, so it keeps a constant identity across renders.
const DEFAULT_WARNINGS = [];

/* eslint-disable complexity */
/**
 * Renders ImageSelect component.
 *
 * @param {Object} props The props.
 * @param {string} [props.defaultImageUrl=""] The URL of the image to show when no image is selected.
 * @param {string} [props.imageUrl=""] The URL of the selected image.
 * @param {string} [props.imageAltText=""] The alt text of the preview image.
 * @param {boolean} props.hasPreview Whether to show the image preview.
 * @param {string} props.label The label of the field.
 * @param {Function} [props.onClick=noop] The function to call when the select or replace image button is clicked.
 * @param {Function} [props.onMouseEnter=noop] The function to call when the mouse enters the component.
 * @param {Function} [props.onMouseLeave=noop] The function to call when the mouse leaves the component.
 * @param {Function} [props.onRemoveImageClick=noop] The function to call when the remove image button is clicked.
 * @param {string} [props.selectImageButtonId=""] The id of the select image button.
 * @param {string} [props.replaceImageButtonId=""] The id of the replace image button.
 * @param {string} [props.removeImageButtonId=""] The id of the remove image button.
 * @param {string[]} [props.warnings] The warnings to show for the image.
 * @param {boolean} [props.hasNewBadge=false] Whether the field has a 'New' badge.
 * @param {boolean} [props.isDisabled=false] Whether the buttons are disabled.
 * @param {boolean} [props.usingFallback=false] Whether a fallback image is used.
 * @param {boolean} [props.hasPremiumBadge=false] Whether the field has a 'Premium' badge.
 *
 * @returns {React.Component} The ImageSelect.
 */
function ImageSelect( {
	defaultImageUrl = "",
	imageUrl = "",
	imageAltText = "",
	onClick = noop,
	onMouseEnter = noop,
	onMouseLeave = noop,
	onRemoveImageClick = noop,
	selectImageButtonId = "",
	replaceImageButtonId = "",
	removeImageButtonId = "",
	warnings = DEFAULT_WARNINGS,
	hasNewBadge = false,
	isDisabled = false,
	usingFallback = false,
	hasPremiumBadge = false,
	...props
} ) {
	const imageSelected = usingFallback === false && imageUrl !== "";
	const previewImageUrl = imageUrl || defaultImageUrl || "";
	const showWarnings = warnings.length > 0 && ( imageSelected || usingFallback );
	const imageClassNames = [ "yoast-image-select__preview" ];
	if ( previewImageUrl === "" ) {
		imageClassNames.push( "yoast-image-select__preview--no-preview" );
	}
	if ( showWarnings ) {
		imageClassNames.push( "yoast-image-select__preview-has-warnings" );
	}


	const imageSelectButtonsProps = {
		imageSelected: imageSelected,
		onClick: onClick,
		onRemoveImageClick: onRemoveImageClick,
		selectImageButtonId: selectImageButtonId,
		replaceImageButtonId: replaceImageButtonId,
		removeImageButtonId: removeImageButtonId,
		isDisabled: isDisabled,
	};

	/**
	 * @returns {JSXElement} returns a text for screen readers.
	 */
	const ScreenReaderText = () => {
		return (
			<span className="screen-reader-text">
				{
					/* translators: Hidden accessibility text. */
					imageSelected ? __( "Replace image", "wordpress-seo" ) : __( "Select image", "wordpress-seo" )
				}
			</span>
		);
	};

	return (
		<div
			className="yoast-image-select"
			onMouseEnter={ onMouseEnter }
			onMouseLeave={ onMouseLeave }
		>
			<FieldGroup
				label={ props.label }
				hasNewBadge={ hasNewBadge }
				hasPremiumBadge={ hasPremiumBadge }
			>
				{ props.hasPreview &&
					<button
						className={ imageClassNames.join( " " ) }
						onClick={ onClick }
						type="button"
						disabled={ isDisabled }
					>
						{ previewImageUrl !== "" &&
							<img src={ previewImageUrl } alt={ imageAltText } className="yoast-image-select__preview--image" />
						}
						<ScreenReaderText />
					</button>
				}
				{
					showWarnings && <div role="alert">
						{
							warnings.map( ( warning, index ) => <Alert key={ `warning${ index }` } type="warning">
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

/* eslint-enable complexity */

export default ImageSelect;
