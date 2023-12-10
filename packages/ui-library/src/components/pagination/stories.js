import React, { useState } from "react";
import Pagination from ".";

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
		},
	},
};

export const Factory = ( args ) => {
	const [ current, setCurrent ] = useState( args.current );
	return <Pagination { ...args } current={ current } onNavigate={ setCurrent } />;
};
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	current: 1,
	total: 10,
	screenReaderTextPrevious: "Previous",
	screenReaderTextNext: "Next",
};

export const VariantText = ( args ) => {
	const [ current, setCurrent ] = useState( args.current );
	return <Pagination { ...args } current={ current } onNavigate={ setCurrent } />;
};
VariantText.storyName = "Variant text";
VariantText.parameters = {
	controls: { disable: false },
};
VariantText.args = {
	current: 1,
	total: 10,
	screenReaderTextPrevious: "Previous",
	screenReaderTextNext: "Next",
	variant: "text",
};
