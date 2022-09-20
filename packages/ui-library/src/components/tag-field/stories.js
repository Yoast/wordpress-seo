import { useCallback, useState } from "@wordpress/element";
import TagField from ".";

export default {
	title: "2. Components/Tag Field",
	component: TagField,
	parameters: {
		docs: {
			description: {
				component: "A simple tag field component.",
			},
		},
	},
	argTypes: {
		labelSuffix: { control: "text" },
		description: { control: "text" },
		error: { control: "text" },
	},
	args: {
		id: "tag-field",
		label: "A tag field",
		tags: [ "Here", "are", "some", "tags" ],
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
		<TagField { ...args } tags={ tags } onAddTag={ addTag } onRemoveTag={ removeTag } />
	);
};

export const Factory = Template.bind( {} );
Factory.parameters = {
	controls: { disable: false },
};

export const WithLabelAndDescription = Template.bind( {} );
WithLabelAndDescription.args = {
	id: "tag-field-1",
	label: "Tag field with a label",
	description: "Tag field with a description.",
};

export const WithError = Template.bind( {} );
WithError.args = {
	id: "tag-field-2",
	label: "Tag field with a label",
	description: "Tag field with a description.",
	error: "This is what the error message looks like!",
};
