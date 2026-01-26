import React, { forwardRef } from "react";
import { useImageSelectContext } from "./hooks";
import { ImageSelectContext } from "./context";
import classNames from "classnames";
import { PhotographIcon } from "@heroicons/react/outline";
import { Button, Link, useSvgAria } from "../../index";

/**
 * @param {JSX.node} children The children components.
 * @param {string} [className] Additional class names.
 * @param {string} label The label that is displayed above the selection button.
 * @param {string} imageUrl The URL of the selected image.
 * @param {string} selectButtonLabel The label for the select image button.
 * @param {string} replaceButtonLabel The label for the replace image button.
 * @param {Function} onSelectImage Callback called when the "Select image" or "Replace image" button is clicked.
 * @param {boolean} isDisabled Whether the buttons are disabled.
 * @param {boolean} isLoading Whether the image is loading.
 * @param {string} id The ID for the image URL input.
 *
 * @returns {JSX.Element} The ImageSelect component.
 */
export const ImageSelect = forwardRef( ( {
	children,
	className = "",
	label,
	imageUrl,
	selectButtonLabel,
	replaceButtonLabel,
	onSelectImage,
	isDisabled,
	isLoading,
	id,
}, ref ) => {
	const buttonLabel = imageUrl && ! isLoading ? replaceButtonLabel : selectButtonLabel;
	return (
		<ImageSelectContext.Provider
			value={ {
				imageUrl,
				buttonLabel,
				onSelectImage,
				id,
				isDisabled,
				isLoading }
			}
		>
			<div className={ classNames( "yst-image-select", className ) } ref={ ref } id={ id }>
				<div className="yst-mb-2 yst-text-slate-900 yst-font-semibold" id={ `${ id }-label` }>{ label }</div>
				{ children }
			</div>
		</ImageSelectContext.Provider>
	);
} );

/**
 * Preview component for the ImageSelect.
 *
 * @param {string} imageAltText The alt text for the image.
 * @param {string} className Additional class names.
 * @param {string} selectDescription The description for the select image preview box.
 *
 * @returns {JSX.Element} The Preview component.
 */
export const Preview = ( { imageAltText, className, selectDescription } ) => {
	const { id, isDisabled, buttonLabel, imageUrl, onSelectImage, isLoading } = useImageSelectContext();
	const svgAriaProps = useSvgAria();

	return <button
		className={ classNames( "yst-image-select-preview",
			imageUrl ? "" : "yst-border-2 yst-border-dashed",
			isLoading && "yst-cursor-wait",
			className,
		) }
		id={ `${ id }-preview` }
		aria-labelledby={ `${ id }-label ${ id }-preview` }
		onClick={ onSelectImage }
		type="button"
		disabled={ isDisabled || isLoading }
	>
		{ imageUrl ? <img src={ imageUrl } alt={ imageAltText } className={ classNames( "yst-image-select-preview-image", isLoading && "yst-image-select-preview-image--loading" ) } /> : <div>
			<PhotographIcon className="yst-image-select-preview-icon" { ... svgAriaProps } />
			{ selectDescription && <p className="yst-text-xs yst-text-slate-600 yst-text-center yst-mt-1 yst-px-8 yst-max-w-48">{ selectDescription }</p> }
		</div>
		}
		<span className="yst-sr-only">
			{ buttonLabel }
		</span>
	</button>;
};

/**
 * Buttons component for the ImageSelect.
 *
 * @param {string} removeLabel The label for the remove button.
 * @param {Function} onRemoveImage The function to call when the remove button is clicked.
 *
 * @returns {JSX.Element} The Buttons component.
 */
export const Buttons = ( { removeLabel, onRemoveImage } ) => {
	const { isDisabled, buttonLabel, imageUrl, onSelectImage, id, isLoading } = useImageSelectContext();

	return <div className="yst-mt-3 yst-flex yst-gap-4 yst-justify-start">
		<Button
			variant="secondary"
			id={ imageUrl ? `${ id }-replace-button` : `${ id }-select-button` }
			onClick={ onSelectImage }
			disabled={ isDisabled }
			isLoading={ isLoading }
		>
			{ buttonLabel }
		</Button>
		{ imageUrl && (
			<Link
				as="button"
				id={ `${ id }-remove-button` }
				onClick={ onRemoveImage }
				disabled={ isDisabled }
				className="yst-text-red-600"
			>
				{ removeLabel }
			</Link>
		) }
	</div>;
};


ImageSelect.displayName = "ImageSelect";
ImageSelect.Preview = Preview;
ImageSelect.Preview.displayName = "ImageSelect.Preview";
ImageSelect.Buttons = Buttons;
ImageSelect.Buttons.displayName = "ImageSelect.Buttons";
