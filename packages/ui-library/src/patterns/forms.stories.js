import { noop } from "lodash";
import React from "react";
import { Autocomplete, AutocompleteField, Button, Checkbox, Code, SelectField, TagField, TextField, Title } from "..";

export const BasicForm = {
	name: "Basic form",
	render: () => (
		<>
			<Title className="yst-mb-3">Basic form</Title>

			<p>
				A form will usually start with a header + description first, between which we maintain a 12px vertical spacing
				(<Code>yst-mb-3</Code>).
			</p>

			<div className="yst-space-y-8 yst-mt-4">
				<TextField id="story1-1" label="Text field 1" onChange={ noop } />
				<TextField id="story1-2" label="Text field 2" onChange={ noop } />
				<Checkbox id="story1-3" label="I am a checkbox." name="name" value="value" />

				<Button type="button">Submit</Button>
			</div>
		</>
	),
};

export const AligningFields = {
	name: "Aligning fields",
	render: () => (
		<>
			<Title size="2" className="yst-mb-3">Aligning text fields</Title>
			<div className="yst-space-y-8 yst-mt-4">
				<div className="yst-flex yst-gap-x-6">
					<TextField className="yst-grow" id="story2-1" label="First name" onChange={ noop } />
					<TextField className="yst-grow" id="story2-2" label="Last name" onChange={ noop } />
				</div>
				<div className="yst-flex yst-gap-x-6">
					<TextField className="yst-grow" id="story2-3" label="Street" onChange={ noop } />
					<TextField id="story2-4" label="Number" onChange={ noop } />
				</div>
				<div className="yst-flex yst-items-end yst-mt-2 yst-gap-x-2">
					<TextField className="yst-grow" id="story2-5" label="Email address" onChange={ noop } />
					<Button type="button" size="large">Sign up</Button>
				</div>
				<div className="yst-flex yst-mt-2 yst-gap-x-3">
					<Button type="button">Save changes</Button>
					<Button type="button" variant="secondary">Discard changes</Button>
				</div>
			</div>
		</>
	),
};

export const AligningWithButtons = {
	name: "Aligning with buttons",
	render: () => (
		<>
			<Title size="2" className="yst-mb-3">Aligning fields with buttons</Title>

			<div className="yst-space-y-8 yst-mt-4">
				<div className="yst-flex yst-items-end yst-mt-2 yst-gap-2">
					<TextField className="yst-grow" id="story3-1" label="A text input next to a button" onChange={ noop } />
					<Button type="button" size="large">Submit text</Button>
				</div>

				<div>
					<div className="yst-flex yst-items-end yst-gap-2 yst-mt-2">
						<SelectField
							label="A select next to a button"
							id="story3-2"
							className="yst-grow"
							selectedLabel="Option 1"
							value="1"
							onChange={ noop }
						>
							<SelectField.Option label="Option 1" value="1" />
							<SelectField.Option label="Option 2" value="2" />
						</SelectField>
						<Button type="button" size="large">Submit selected</Button>
					</div>
				</div>

				<div>
					<div className="yst-flex yst-items-end yst-gap-2 yst-mt-2">
						<AutocompleteField
							id="story3-3"
							className="yst-grow"
							label="An autocomplete next to a button"
							placeholder="Type to complete"
							value="1"
							onQueryChange={ noop }
							onChange={ noop }
						>
							<Autocomplete.Option value="1">Option 1</Autocomplete.Option>
							<Autocomplete.Option value="2">Option 2</Autocomplete.Option>
						</AutocompleteField>
						<Button type="button" size="large">Submit completed</Button>
					</div>
				</div>

				<div>
					<div className="yst-flex yst-items-end yst-gap-2 yst-mt-2">
						<TagField
							id="story3-4"
							className="yst-grow"
							label="A tag input next to a button"
							onAddTag={ noop }
							onRemoveTag={ noop }
							onSetTags={ noop }
							tags={ [ "Apple", "Banana", "Pineapple" ] }
						/>
						<Button type="button" size="large">Submit tags</Button>
					</div>
				</div>
			</div>
		</>
	),
};

export default {
	title: "3) Patterns/Forms",
	// The forms.mdx page is this pattern's documentation, so skip the generated docs page.
	tags: [ "!autodocs" ],
};
