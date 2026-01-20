import React, { useCallback } from "react";
import { ImageSelect } from "./index";
import { noop } from "lodash";
import { useArgs } from "@storybook/preview-api";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	render: ( {
		className,
		label,
		selectButtonLabel,
		replaceButtonLabel,
		isDisabled,
		id,
		imageAltText,
		removeLabel,
	} ) => {
		const [ { imageUrl, isLoading }, updateArgs ] = useArgs();
		const handleOnSelectImage = useCallback( () => {
			updateArgs( {
				imageUrl: "https://yoast.com/app/uploads/2021/01/yoast_logo_rgb_optm.svg",
				isLoading: true,
			} );
			setTimeout( () => {
				updateArgs( {
					isLoading: false,
				} );
			}, 2000 );
		}, [] );
		const handleOnRemoveImage = useCallback( () => {
			updateArgs( { imageUrl: "", isLoading: false } );
		}, [] );
		return <ImageSelect
			className={ className }
			label={ label }
			imageUrl={ imageUrl }
			selectButtonLabel={ selectButtonLabel }
			replaceButtonLabel={ replaceButtonLabel }
			onSelectImage={ handleOnSelectImage }
			isDisabled={ isDisabled }
			isLoading={ isLoading }
			id={ id }
		>
			<ImageSelect.Preview imageAltText={ imageAltText } />
			<ImageSelect.Buttons removeLabel={ removeLabel } onRemoveImage={ handleOnRemoveImage } />
		</ImageSelect>;
	},
};

export default {
	title: "2) Components/ImageSelect",
	component: ImageSelect,
	args: {
		label: "Social image",
		imageUrl: "",
		selectButtonLabel: "Select image",
		replaceButtonLabel: "Replace image",
		onSelectImage: noop,
		isDisabled: false,
		isLoading: false,
		id: "yst-image-select",
		imageAltText: "Selected image preview",
		removeLabel: "Remove image",
		onRemoveImage: noop,
	},
	argTypes: {
		label: {
			description: "The label displayed above the image selector.",
		},
		imageUrl: {
			description: "The URL of the selected image.",
		},
		selectButtonLabel: {
			description: "The label for the select image button.",
		},
		replaceButtonLabel: {
			description: "The label for the replace image button.",
		},
		onSelectImage: {
			description: "Callback called when the select or replace image button is clicked.",
		},
		isDisabled: {
			description: "Whether the image selector and buttons are disabled.",
		},
		isLoading: {
			description: "Whether the image is currently loading.",
		},
		id: {
			description: "The ID for the image URL input and root element.",
		},
		imageAltText: {
			description: "The alt text for the image preview.",
		},
		removeLabel: {
			description: "The label for the remove image button.",
		},
		onRemoveImage: {
			description: "Callback called when the remove image button is clicked.",
		},
	},
	parameters: {
		docs: {
			description: {
				component: "An ImageSelect component allows users to select and preview images. The components consists of a preview area and buttons to select or remove the image.",
			},
		},
	},
};
