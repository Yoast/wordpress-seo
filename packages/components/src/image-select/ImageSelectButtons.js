import React, { useCallback } from "react";
import { NewButton as Button } from "../button";
import { __ } from "@wordpress/i18n";
import { noop } from "lodash";

/**
 * The ImageSelectButtons component.
 *
 * @param {Object} props The props object.
 * @param {boolean} [props.imageSelected=false] Whether an image is selected.
 * @param {Function} [props.onClick=noop] The function to call when the select or replace image button is clicked.
 * @param {Function} [props.onRemoveImageClick=noop] The function to call when the remove image button is clicked.
 * @param {string} [props.selectImageButtonId=""] The id of the select image button.
 * @param {string} [props.replaceImageButtonId=""] The id of the replace image button.
 * @param {string} [props.removeImageButtonId=""] The id of the remove image button.
 * @param {boolean} [props.isDisabled=false] Whether the buttons are disabled.
 *
 * @returns {Element} The ImageSelectButtons component;
 */
const ImageSelectButtons = ( {
	imageSelected = false,
	onClick = noop,
	onRemoveImageClick = noop,
	selectImageButtonId = "",
	replaceImageButtonId = "",
	removeImageButtonId = "",
	isDisabled = false,
} ) => {
	const removeImage = useCallback( ( event ) => {
		event.target.previousElementSibling.focus();
		onRemoveImageClick();
	}, [ onRemoveImageClick ] );

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
						? __( "Replace image", "wordpress-seo" )
						: __( "Select image", "wordpress-seo" )
				}
			</Button>
			{
				imageSelected && <Button
					variant="remove"
					id={ removeImageButtonId }
					onClick={ removeImage }
					disabled={ isDisabled }
				>
					{ __( "Remove image", "wordpress-seo" ) }
				</Button>
			}
		</div>
	);
};

export default ImageSelectButtons;
