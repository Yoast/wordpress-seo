/* eslint-disable complexity */
import { __ } from "@wordpress/i18n";
import React, { useCallback } from "react";
import { noop } from "lodash";
import { Alert, Root, ImageSelect } from "@yoast/ui-library";

/**
 * Renders ImageSelect component.
 *
 * @param {string}   [imageAltText=""] The alt text for the selected image.
 * @param {boolean}  [hasPreview] Whether to show the image preview.
 * @param {boolean} [usingFallback=false] Whether the default/fallback image is being used.
 * @param {string} [imageUrl=""] The URL of the selected image.
 * @param {string} [defaultImageUrl=""] The URL of the default/fallback image.
 * @param {string[]} [warnings=[]] Warnings to display.
 * @param {Function} [onClick=noop] Callback called when the "Select image" or "Replace image" button is clicked.
 * @param {Function} [onRemoveImageClick=noop] Callback called when the "Remove image" button is clicked.
 * @param {boolean} [isDisabled=false] Whether the buttons are disabled.
 * @param {Function} [onMouseEnter=noop] Callback called when the mouse enters the component.
 * @param {Function} [onMouseLeave=noop] Callback called when the mouse leaves the component.
 * @param {string} label The label that is displayed above the selection button.
 * @param {string} id The ID for the component.
 *
 * @returns {React.Component} The ImageSelect.
 */
function SocialImageSelect( {
	imageAltText = "",
	hasPreview,
	usingFallback = false,
	imageUrl = "",
	defaultImageUrl = "",
	warnings = [],
	onClick = noop,
	onRemoveImageClick = noop,
	isDisabled = false,
	onMouseEnter = noop,
	onMouseLeave = noop,
	label,
	id,
} ) {
	const imageSelected = usingFallback === false && imageUrl !== "";
	const previewImageUrl = imageUrl || defaultImageUrl || "";
	const showWarnings = warnings.length > 0 && ( imageSelected || usingFallback );

	const removeImage = useCallback( ( event ) => {
		event.target.previousElementSibling?.focus();
		onRemoveImageClick();
	}, [ onRemoveImageClick ] );

	return (
		<div
			onMouseEnter={ onMouseEnter }
			onMouseLeave={ onMouseLeave }
		>
			<Root>
				<ImageSelect
					label={ label }
					imageUrl={ previewImageUrl }
					selectButtonLabel={ __( "Select image", "wordpress-seo" ) }
					replaceButtonLabel={ __( "Replace image", "wordpress-seo" ) }
					onSelectImage={ onClick }
					isDisabled={ isDisabled }
					id={ id }
				>
					{ hasPreview &&
					<ImageSelect.Preview
						imageAltText={ imageAltText }
					/>
					}
					{
						showWarnings && <div role="alert" className="yst-mt-4">
							{
								warnings.map( ( warning, index ) => <Alert key={ `warning${ index }` } variant="warning">
									{ warning }
								</Alert> )
							}
						</div>
					}
					<ImageSelect.Buttons
						removeLabel={ __( "Remove image", "wordpress-seo" ) }
						onRemoveImage={ removeImage }
					/>
				</ImageSelect>
			</Root>
		</div>
	);
}


export default SocialImageSelect;
