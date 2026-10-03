import { useArgs } from "@storybook/preview-api";
import React, { useCallback } from "react";
import TagInput from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { component } from "./docs";

const Template = args => {
	const [ { tags }, updateArgs ] = useArgs();
	const addTag = useCallback( tag => {
		updateArgs( { tags: [ ...tags, tag ] } );
	}, [ tags, updateArgs ] );
	const removeTag = useCallback( index => {
		updateArgs( { tags: [ ...tags.slice( 0, index ), ...tags.slice( index + 1 ) ] } );
	}, [ tags, updateArgs ] );

	return (
		<TagInput { ...args } tags={ tags || [] } onAddTag={ addTag } onRemoveTag={ removeTag } />
	);
};

export const Factory = {
	render: Template.bind( {} ),
	parameters: {
		controls: { disable: false },
	},
};

export default {
	title: "1) Elements/Tag input",
	component: TagInput,
	parameters: {
		docs: {
			description: { component },
			page: InteractiveDocsPage,
		},
	},
	argTypes: {
		children: {
			control: "text",
			description: "Overrides `tags`. You can pass Tag subcomponent instead (e.g. `TagInput.Tag`).",
			table: { type: { summary: "JSX.node" } },
		},
		tags: { description: "Array of options to display." },
		tag: {
			control: "text",
			description: "[`TagInput.Tag`] The tag (label).",
			table: { type: { summary: "string" } },
		},
		index: {
			description: "[`TagInput.Tag`] The tag index.",
			control: "number",
			table: { type: { summary: "number" } },
		},
		disabled: {
			control: "boolean",
			description: "Also for `TagInput.Tag`.",
			table: { type: { summary: "boolean" }, defaultValue: { summary: false } },
		},
		onAddTag: {
			control: "func",
			description: "Callback when a tag is added.",
			table: { type: { required: true, summary: "func" } },
		},
		onRemoveTag: {
			control: "func",
			description: "Callback when a tag is removed. Also for `TagInput.Tag`.",
			table: { type: { required: true, summary: "func" } },
		},
		onSetTags: {
			control: "func",
			description: "Sets the tags to the given array.",
			table: { type: { required: true, summary: "func" } },
		},
		onBlur: {
			control: "func",
			description: "Callback when the input lost focus. A tag will be created from the current input value.",
			table: { type: { required: true, summary: "func" } },
		},
		screenReaderRemoveTag: {
			description: "[`TagInput.Tag`] The screen reader text for the remove tag button.",
			control: "text",
			table: { type: { summary: "string" } },
		},
	},
	args: {
		tags: [
			"These are",
			"hopefully",
			"enough",
			"tags",
			"to show",
			"that",
			"this component",
			"will",
			"wrap around",
			"and",
			"continue",
			"on the next line.",
			"This is a longer tag that includes spaces!",
		],
	},
};
