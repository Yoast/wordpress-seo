import { noop } from "lodash";
import { createContext } from "react";

export const ImageSelectContext = createContext( {
	buttonLabel: "Select image",
	imageUrl: "",
	onSelectImage: noop,
	isDisabled: false,
	id: "yst-image-select",
	isLoading: false,
} );
