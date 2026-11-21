import { useArgs } from "@storybook/preview-api";
import React, { useCallback } from "react";
import Pagination from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";

const Template = ( args ) => {
	const [ , updateArgs ] = useArgs();
	const handleNavigate = useCallback( newCurrent => updateArgs( { current: newCurrent } ), [ updateArgs ] );

	return <Pagination { ...args } onNavigate={ handleNavigate } />;
};

export const Factory = {
	render: Template.bind( {} ),
	parameters: {
		controls: { disable: false },
	},
	args: {
		current: 1,
		total: 10,
		screenReaderTextPrevious: "Previous",
		screenReaderTextNext: "Next",
	},
};

export const VariantText = {
	render: Template.bind( {} ),
	name: "Variant text",
	parameters: {
		controls: { disable: false },
	},
	args: {
		current: 1,
		total: 10,
		screenReaderTextPrevious: "Previous",
		screenReaderTextNext: "Next",
		variant: "text",
	},
};

export default {
	title: "2) Components/Pagination",
	component: Pagination,
	argTypes: {
		current: { control: { type: "number", min: 1 } },
		total: { control: { type: "number", min: 1 } },
	},
	parameters: {
		docs: {
			description: {
				component: "The Pagination component offers navigation controls for one or more pages.",
			},
			page: () => <InteractiveDocsPage stories={ [ VariantText ] } />,
		},
	},
};
