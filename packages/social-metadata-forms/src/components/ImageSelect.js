/* eslint-disable complexity */
import { __ } from "@wordpress/i18n";
import React, { useCallback } from "react";
import classNames from "classnames";
import { noop } from "lodash";
import { Alert, Button, Link, Root } from "@yoast/ui-library";
import { PhotographIcon } from "@heroicons/react/outline";

/**
 * Renders ImageSelect component.
 *
 * @param {boolean} [usingFallback=false] Whether the default/fallback image is being used.
 * @param {string} [imageUrl=""] The URL of the selected image.
 * @param {string} [defaultImageUrl=""] The URL of the default/fallback image.
 * @param {string[]} [warnings=[]] Warnings to display.
 * @param {Function} [onClick=noop] Callback called when the "Select image" or "Replace image" button is clicked.
 * @param {Function} [onRemoveImageClick=noop] Callback called when the "Remove image" button is clicked.
 * @param {string} [selectImageButtonId=""] The ID for the select image button.
 * @param {string} [replaceImageButtonId=""] The ID for the replace image button.
 * @param {string} [removeImageButtonId=""] The ID for the remove image button.
 * @param {boolean} [isDisabled=false] Whether the buttons are disabled.
 * @param {Function} [onMouseEnter=noop] Callback called when the mouse enters the component.
 * @param {Function} [onMouseLeave=noop] Callback called when the mouse leaves the component.
 * @param {string} label The label that is displayed above the selection button.
 *
 * @returns {React.Component} The ImageSelect.
 */
function ImageSelect( {
	label,
	onClick = noop,
	onRemoveImageClick = noop,
	warnings = [],
	onMouseEnter = noop,
	onMouseLeave = noop,
	imageUrl = "",
	usingFallback = false,
	imageAltText = "",
	hasPreview,
	imageUrlInputId = "",
	selectImageButtonId = "",
	replaceImageButtonId = "",
	removeImageButtonId = "",
	isDisabled = false,
	defaultImageUrl = "",
} ) {
	const imageSelected = usingFallback === false && imageUrl !== "";
	const previewImageUrl = imageUrl || defaultImageUrl || "";
	const showWarnings = warnings.length > 0 && ( imageSelected || usingFallback );

	const removeImage = useCallback( ( event ) => {
		event.target.previousElementSibling?.focus();
		onRemoveImageClick();
	}, [ onRemoveImageClick ] );

	const buttonLabel = imageSelected ? __( "Replace image", "wordpress-seo" ) : __( "Select image", "wordpress-seo" );

	return (
		<Root>
			<div
				className="yoast-image-select"
				onMouseEnter={ onMouseEnter }
				onMouseLeave={ onMouseLeave }
			>

				<div>
					<div className="yst-mb-2 yst-text-slate-900">
						<b>{ label }</b>
					</div>
					{ hasPreview &&
					<button
						className={ classNames( "yst-border-slate-300 yst-flex yst-justify-center yst-items-center yst-overflow-hidden yst-rounded-md yst-border",
							"focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-primary-500",
							previewImageUrl ? "" : "yst-border-2 yst-border-dashed"
						) }
						id={ imageUrlInputId }
						onClick={ onClick }
						type="button"
						disabled={ isDisabled }
						style={ {
							width: "130px",
							minHeight: "72px",
							maxHeight: "130px",
						} }
					>
						{ previewImageUrl ? <img src={ previewImageUrl } alt={ imageAltText } className="yst-object-cover yst-object-center yst-min-h-full yst-min-w-full" /> : <PhotographIcon className="yst-mx-auto yst-h-12 yst-w-12 yst-text-slate-400 yst-stroke-1" aria-hidden="true" />
						}
						<span className="screen-reader-text">
							{ buttonLabel }
						</span>
					</button>
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
					<div className="yst-mt-3 yst-flex yst-gap-4 yst-justify-start">
						<Button
							variant="secondary"
							id={ imageSelected ? replaceImageButtonId : selectImageButtonId }
							onClick={ onClick }
							disabled={ isDisabled }
						>
							{ buttonLabel }
						</Button>
						{ imageSelected && (
							<Link
								as="button"
								id={ removeImageButtonId }
								onClick={ removeImage }
								disabled={ isDisabled }
								className="yst-text-red-600"
							>
								{ __( "Remove image", "wordpress-seo" ) }
							</Link>
						) }
					</div>
				</div>
			</div>
		</Root>
	);
}


export default ImageSelect;
