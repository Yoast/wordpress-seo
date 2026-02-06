import React, { useCallback } from "react";
import { ImageSelect } from "./index";
import { noop } from "lodash";
import { useArgs } from "@storybook/preview-api";
import { component } from "./docs";

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
		selectDescription,
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
			label={ label }
			imageUrl={ imageUrl }
			selectButtonLabel={ selectButtonLabel }
			replaceButtonLabel={ replaceButtonLabel }
			onSelectImage={ handleOnSelectImage }
			isDisabled={ isDisabled }
			isLoading={ isLoading }
			id={ id }
		>
			<ImageSelect.Preview imageAltText={ imageAltText } selectDescription={ selectDescription } className={ className } />
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
		className: "yst-h-48 yst-w-96",
		selectDescription: "No image selected",
	},
	argTypes: {
		label: {
			description: "The label displayed above the image selector.",
			table: { type: { summary: "string" } },
		},
		imageUrl: {
			description: "The URL of the selected image.",
			table: { type: { summary: "string" } },
		},
		selectButtonLabel: {
			description: "The label for the select image button.",
			table: { type: { summary: "string" } },
		},
		replaceButtonLabel: {
			description: "The label for the replace image button.",
			table: { type: { summary: "string" } },
		},
		onSelectImage: {
			description: "Callback called when the select or replace image button is clicked.",
			table: { type: { summary: "function" } },
		},
		isDisabled: {
			description: "Whether the image selector and buttons are disabled.",
			table: { type: { summary: "boolean" } },
		},
		isLoading: {
			description: "Whether the image is currently loading.",
			table: { type: { summary: "boolean" } },
		},
		id: {
			description: "The ID for the image URL input and root element.",
			table: { type: { summary: "string" } },
		},
		imageAltText: {
			description: "The alt text for the image preview.",
			table: { type: { summary: "string" } },
		},
		removeLabel: {
			description: "The label for the remove image button.",
			table: { type: { summary: "string" } },
		},
		onRemoveImage: {
			description: "Callback called when the remove image button is clicked.",
			table: { type: { summary: "function" } },
		},
		className: {
			description: "Additional class names to apply to the select image preview box. Default in component: \"yst-max-h-32 yst-w-32 yst-min-h-20\".",
			table: { type: { summary: "string" }, defaultValue: { summary: "\"yst-max-h-32 yst-w-32 yst-min-h-20\"" } },
			control: {
				type: "select",
				options: [
					"yst-max-h-32 yst-w-32 yst-min-h-20",
					"yst-h-40 yst-w-40",
					"yst-h-48 yst-w-96",
					"yst-h-64 yst-w-64",
					"yst-h-48 yst-w-full",
					"yst-h-64 yst-w-48",
				],
			},
			options: [
				"yst-max-h-32 yst-w-32 yst-min-h-20",
				"yst-h-40 yst-w-40",
				"yst-h-48 yst-w-96",
				"yst-h-64 yst-w-64",
				"yst-h-48 yst-w-full",
				"yst-h-64 yst-w-48",
			],
			mapping: {
				"Default (8rem square)": "yst-max-h-32 yst-w-32 yst-min-h-20",
				"Medium square (10rem)": "yst-h-40 yst-w-40",
				"Large rectangle (12rem × 24rem)": "yst-h-48 yst-w-96",
				"Large square (16rem)": "yst-h-64 yst-w-64",
				"Full width (12rem height)": "yst-h-48 yst-w-full",
				"Portrait (16rem × 12rem)": "yst-h-64 yst-w-48",
			},
		},
		selectDescription: {
			description: "The description for the select image preview box (optional).",
			table: { type: { summary: "string" } },
		},
	},
	parameters: {
		docs: {
			description: { component },
		},
	},
};
