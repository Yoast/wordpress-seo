import React, { Fragment } from "react";
import TextInput from "@yoast/components/src/inputs/TextInput";
import TextArea from "@yoast/components/src/inputs/TextArea";
import CheckboxGroup from "@yoast/components/src/checkbox/CheckboxGroup";
import RadioButtonGroup from "@yoast/components/src/radiobutton/RadioButtonGroup";
import { MultiSelect, Select } from "@yoast/components/src/select/Select";
import Toggle from "@yoast/components/src/toggle/Toggle";
import DataModel from "@yoast/components/src/data-model/DataModel";
import {
	NewButton as Button,
	ButtonStyledLink,
	CloseButton,
} from "@yoast/components/src/button";

/**
 * Temporary onclick function.
 *
 * @returns {void}
 */
function clickerDiClick() {
	console.log( "You are an exceptional clicker!" );
}

const buttonRef = React.createRef();
const buttonStyledLinkRef = React.createRef();

const focusButtonRef = () => {
	buttonRef.current.focus();
};

const focusLinkRef = () => {
	buttonStyledLinkRef.current.focus();
};

const buttonGrouping = <Fragment>
	<h3>"primary" variant (default)</h3>
	<Button onClick={ clickerDiClick } title="Testing whether other props are also passed, like this tooltip">Default button</Button>
	<Button variant="primary" onClick={ clickerDiClick }>Primary button</Button>
	<Button variant="primary" disabled={ true } onClick={ clickerDiClick }>Primary disabled button</Button>
	<Button variant="primary" small={ true } onClick={ clickerDiClick }>Primary small button</Button>
	<Button variant="primary" small={ true } disabled={ true } onClick={ clickerDiClick }>Primary small disabled button</Button>
	<ButtonStyledLink variant="primary" href={ "#" }>Primary link</ButtonStyledLink>
	<ButtonStyledLink variant="primary" small={ true } href={ "#" }>Primary small link</ButtonStyledLink>

	<h3>"secondary" variant</h3>
	<Button variant="secondary" onClick={ clickerDiClick }>Secondary button</Button>
	<Button variant="secondary" disabled={ true } onClick={ clickerDiClick }>Secondary disabled button</Button>
	<Button variant="secondary" small={ true } onClick={ clickerDiClick }>Secondary small button</Button>
	<Button variant="secondary" small={ true }  disabled={ true } onClick={ clickerDiClick }>Secondary small disabled button</Button>
	<ButtonStyledLink variant="secondary" href={ "#" }>Secondary link</ButtonStyledLink>
	<ButtonStyledLink variant="secondary" small={ true } href={ "#" }>Secondary small link</ButtonStyledLink>

	<h3>With Ref!</h3>
	<Button variant="secondary" buttonRef={ buttonRef } small={ true } onClick={ clickerDiClick }>This Button has a Ref!</Button>
	<button onClick={ focusButtonRef }>focus test</button>
	<ButtonStyledLink variant="secondary" buttonRef={ buttonStyledLinkRef } small={ true } href={ "#" }>This ButtonStyledLink has a Ref!</ButtonStyledLink>
	<button onClick={ focusLinkRef }>focus test</button>

	<h3>"buy" variant (or "upsell")</h3>
	<Button variant="upsell" onClick={ clickerDiClick }>Buy button</Button>
	<Button variant="upsell" disabled={ true } onClick={ clickerDiClick }>Buy disabled button</Button>
	<Button variant="upsell" small={ true } onClick={ clickerDiClick }>Buy small button</Button>
	<Button variant="upsell" small={ true } disabled={ true } onClick={ clickerDiClick }>Buy small disabled button</Button>
	<ButtonStyledLink variant="upsell" href="#">Buy Link</ButtonStyledLink>
	<ButtonStyledLink variant="upsell" small={ true } href="#">Buy small Link</ButtonStyledLink>

	<h3>"hide" and "remove" variants</h3>
	<Button variant="hide" onClick={ clickerDiClick }>Hide button</Button>
	<Button variant="remove" onClick={ clickerDiClick }>Remove button</Button>
	<ButtonStyledLink variant="hide" href="#">Hide Link</ButtonStyledLink>
	<ButtonStyledLink variant="remove" href="#">Remove Link</ButtonStyledLink>

	<h3>"edit" variant</h3>
	<Button variant="edit" onClick={ clickerDiClick }>Edit button</Button>
	<ButtonStyledLink variant="edit" href="#">Edit Link</ButtonStyledLink>

	<h3>CloseButton (not a variant due its different characteristics)</h3>
	<CloseButton onClick={ clickerDiClick } />
</Fragment>;

/**
 * Function that displays all the reactified components that we currently have.
 *
 * @returns {*} A div with all reactified components.
 */
const ReactifiedComponentsWrapper = () => {
	return (
		<div className="yoast">

			<h2>Buttons and ButtonStyledLinks</h2>
			<p>
				The buttons come in some variants, and can be a Button or a link styled as a button.
				They can also be big, or small, and can contain icons before and/or after.
				They also pass regular props, like disabled for buttons.
			</p>
			<div
				style={ {
					padding: "24px",
				} }
			>
				{ buttonGrouping }
			</div>
			<hr />

			<h2>Inputs</h2>
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
						{ name: "Option 1", value: "opt1" },
						{ name: "Option 2", value: "opt2" },
						{ name: "Option 3", value: "opt3" },
						{ name: "Option 4", value: "opt4" },
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
				linkTo="https://yoast.com"
				linkText="A helpful link!"
				onChange={ console.warn }
			/>
			<hr />

			<h2>DataModel</h2>
			<DataModel
				items={ [
					{
						width: 100,
						name: "brand",
						number: 66,
					},
					{
						width: 77,
						name: "strategie",
						number: 66,
					},
					{
						width: 45,
						name: "tip",
						number: 66,
					},
					{
						width: 35,
						name: "logo",
						number: 66,
					},
					{
						width: 30,
						name: "name",
						number: 66,
					},
					{
						width: 20,
						name: "SEO",
						number: 66,
					},
					{
						width: 10,
						name: "people",
						number: 66,
					},
					{
						width: 5,
						name: "image",
						number: 66,
					},
					{
						width: 1,
						name: "post",
						number: 66,
					},
				] }
			/>
		</div>
	);
};
export default ReactifiedComponentsWrapper;
