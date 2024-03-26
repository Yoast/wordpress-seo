import { useArgs } from "@storybook/preview-api";
import { map, noop } from "lodash";
import React, { useCallback } from "react";
import TagField from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { VALIDATION_VARIANTS } from "../../constants";

const Template = args => {
	const [ { tags }, updateArgs ] = useArgs();
	const addTag = useCallback( tag => {
		updateArgs( { tags: [ ...tags, tag ] } );
	}, [ tags, updateArgs ] );
	const removeTag = useCallback( index => {
		updateArgs( { tags: [ ...tags.slice( 0, index ), ...tags.slice( index + 1 ) ] } );
	}, [ tags, updateArgs ] );

	return (
		<TagField { ...args } tags={ tags || [] } onAddTag={ addTag } onRemoveTag={ removeTag } />
	);
};

export const Factory = {
	render: Template.bind( {} ),
	parameters: {
		controls: { disable: false },
	},
};

export const WithLabelAndDescription = {
	render: Template.bind( {} ),
	name: "With label and description",
	parameters: {
		controls: { disable: false },
	},
	args: {
		id: "tag-field-1",
		label: "Tag field with a label",
		description: "Tag field with a description.",
	},
};

export const Validation = () => (
	<div className="yst-space-y-8">
		{ map( VALIDATION_VARIANTS, variant => (
			<TagField
				key={ variant }
				id={ `validation-${ variant }` }
				name={ `validation-${ variant }` }
				label={ `With validation of variant ${ variant }` }
				value="The quick brown fox jumps over the lazy dog"
				onChange={ noop }
				validation={ {
					variant,
					message: {
						success: "Looks like you are nailing it!",
						warning: "Looks like you could do better!",
						info: <>Looks like you could use some <a href="https://yoast.com" target="_blank" rel="noreferrer">more info</a>!</>,
						error: "Looks like you are doing it wrong!",
					}[ variant ],
				} }
			/>
		) ) }
	</div>
);

export default {
	title: "2) Components/Tag field",
	component: TagField,
	parameters: {
		docs: {
			description: {
				component: "A simple tag field component.",
			},
			page: () => <InteractiveDocsPage stories={ [ WithLabelAndDescription, Validation ] } />,
		},
	},
	argTypes: {
		labelSuffix: { control: "text" },
		description: { control: "text" },
	},
	args: {
		id: "tag-field",
		label: "A tag field",
		tags: [ "Here", "are", "some", "tags" ],
	},
};
