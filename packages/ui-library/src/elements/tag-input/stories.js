import { StoryComponent } from ".";
import { useCallback, useState } from "@wordpress/element";

export default {
	title: "1) Elements/Tag input",
	component: StoryComponent,
	parameters: {
		docs: {
			description: {
				component: "A simple tag input component.",
			},
		},
	},
	argTypes: {
		children: {
			control: "text",
			description: "`children`, override `tags`. You can pass Tag subcomponent instead (`TagInput.Tag`).",
			table: { type: { summary: "JSX.node" } },
		},
		tags: { description: "Array of options to display." },
		tag: {
			control: "text",
			description: "`TagInput.Tag` prop (tag label).",
			table: { type: { summary: "string" } },
		},
		index: {
			description: "`TagInput.Tag` prop",
			control: "number",
			table: { type: { summary: "number" } },
		},
		disabled: {
			control: "boolean",
			description: "`TagInput.Tag` prop",
			table: { type: { summary: "boolean" }, defaultValue: { summary: false } },
		},
		onRemoveTag: {
			control: "function",
			description: "`TagInput.Tag` prop",
			table: { type: { required: true, summary: "function"  } },
		},
		onSetTags: {
			control: "function",
			description: "Sets the tags to the given array.",
			table: { type: { required: true, summary: "function"  } },
		},
		screenReaderRemoveTag: {
			description: "`TagInput.Tag` prop",
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

const Template = args => {
	const [ tags, setTags ] = useState( args?.tags || [] );
	const addTag = useCallback( tag => {
		setTags( [ ...tags, tag ] );
	}, [ tags, setTags ] );
	const removeTag = useCallback( index => {
		setTags( [ ...tags.slice( 0, index ), ...tags.slice( index + 1 ) ] );
	}, [ tags, setTags ] );
	return (
		<StoryComponent { ...args } tags={ tags } onAddTag={ addTag } onRemoveTag={ removeTag } onSetTags={ setTags } />
	);
};

export const Factory = Template.bind( {} );

Factory.parameters = {
	controls: { disable: false },
};
