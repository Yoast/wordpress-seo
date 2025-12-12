import { noop } from "lodash";
import { createContext, useContext } from "react";

export const ImageSelectContext = createContext( {
	buttonLabel: "Select image",
	imageUrl: "",
	onSelectImage: noop,
	isDisabled: false,
	id: "yst-image-select",
} );

/**
 * @returns {Object} The ImageSelect context.
 */
export const useImageSelectContext = () => useContext( ImageSelectContext );
