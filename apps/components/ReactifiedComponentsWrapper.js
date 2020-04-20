import React from "react";
import TextInput from "@yoast/components/src/inputs/TextInput";
import TextArea from "@yoast/components/src/inputs/TextArea";
import CheckboxGroup from "@yoast/components/src/checkbox/CheckboxGroup";
import RadioButtonGroup from "@yoast/components/src/radiobutton/RadioButtonGroup";
import { MultiSelect, Select } from "@yoast/components/src/select/Select";
import Toggle from "@yoast/components/src/toggle/Toggle";

/**
 * Function that displays all the reactified components that we currently have.
 *
 * @returns {React.Component} A wrapper for all the new reactified components.
 */
const ReactifiedComponentsWrapper = () => {
	return (
		<div className="yoast">
			<TextInput
				label="This is the input label"
				value="This is the input value"
				type="text"
			/>
			<TextInput
				label="This input has a description"
				description="Great description!"
				type="text"
				placeholder="The best placeholder ev4h"
			/>
			<TextInput
				label="This is a number input"
				description="The minimum number is 3 and the maximum is 6 (if you use arrow keys)."
				type="number"
				min={ 3 }
				max={ 6 }
			/>
			<TextInput
				label="This is a email input without description where the help links to google.com"
				type="email"
				linkTo="https://www.google.com"
			/>
			<TextInput
				label="This is a password input"
				type="password"
				linkTo="https://www.google.com"
			/>
			<TextArea
				label="This is a textarea"
				placeholder="Ugly placeholder"
				value="Wow, what happens now??"
				description="The greatest textarea ever!!1!"
			/>
			<CheckboxGroup
				label="Heya best checkboxes"
				options={ [
					{
						label: "Fancy label",
						id: "fancy-checkbox",
					},
					{
						label: "option with id 1",
						id: "horizontal-check-1",
					},
				] }
				checked={ [ "fancy-checkbox" ] }
			/>
			<CheckboxGroup
				label="Horizontal checkboxes"
				vertical={ false }
				options={ [
					{
						label: "Nice 1",
						id: "id1",
					},
					{
						label: "option with id 3",
						id: "id3",
					},
				] }
				checked={ [ "id1" ] }
				onChange={ console.warn }
			/>
			<RadioButtonGroup
				options={ [
					{
						value: "hey-value",
						label: "Hey there!",
					},
					{
						value: "hi-value",
						label: "Hi there!",
					},
				] }
				label="Horizontal radiobutton group"
				groupName="group1"
				selected="hi"
			/>
			<RadioButtonGroup
				options={ [
					{
						value: "haha-value",
						label: "Haha, that's funny!",
					},
					{
						value: "hoho-value",
						label: "Hohoho, I'm santa!",
					},
				] }
				label="Vertical radiobutton group"
				vertical={ true }
				groupName="group2"
			/>
			<MultiSelect
				label="This is a styled multiselect"
				id="my-awesome-multiselect"
				name="my-selection"
				options={
					[
						{ name: "option 1", value: "opt1" },
						{ name: "option 2", value: "opt2" },
						{ name: "option 3", value: "opt3" },
						{ name: "option 4", value: "opt4" },
					]
				}
				selected={ [ "opt1", "opt3" ] }
			/>
			<Select
				label="This is a styled select"
				id="my-awesome-multiselect"
				name="my-selection"
				options={
					[
						{ name: "option 1", value: "opt1" },
						{ name: "option 2", value: "opt2" },
						{ name: "option 3", value: "opt3" },
						{ name: "option 4", value: "opt4" },
					]
				}
				selected={ "opt1" }
			/>
			<Toggle
				label="React Toggle"
				offText="off"
				onText="on"
				name="toggle"
				id="weird-id-that-is-unique"
				onChange={ console.warn }
			/>
		</div>
	);
};
export default ReactifiedComponentsWrapper;
