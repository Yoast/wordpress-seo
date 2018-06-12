import { shallow } from "enzyme";
import ReplacementVariableEditor from "../components/ReplacementVariableEditor";
import React from "react";

jest.mock( "draft-js/lib/generateRandomKey", () => () => {
	let randomKey = global._testDraftJSRandomNumber;

	if ( ! randomKey ) {
		randomKey = 0;
	}

	randomKey++;
	global._testDraftJSRandomNumber = randomKey;

	return randomKey + "";
} );

describe( "ReplacementVariableEditor", () => {
	it( "wraps a Draft.js editor instance", () => {
		const editor = shallow(
			<ReplacementVariableEditor
				replacementVariables={ [] }
				content="Dummy content"
				onChange={ () => {} }
				ariaLabelledBy="id"
			/>
		);

		expect( editor ).toMatchSnapshot();
	} );
} );

describe( "replacementVariablesFilter", () => {
	let searchValue, replacementVariables, replacementVariablesEditor, expected;

	beforeEach( () => {
		searchValue = "cat";
		replacementVariables = [
			{
				name: "category",
				value: "uncategorized",
			},
			{
				name: "primary_category",
				value: "uncategorized",
			},
			{
				name: "category_description",
				value: "uncategorized",
			},
			{
				name: "date",
				value: "May 30, 2018",
			},
		];

		const props = {
			content: "Dummy content",
			onChange: () => {},
			ariaLabelledBy: "id",
		};

		replacementVariablesEditor = new ReplacementVariableEditor( props );

		expected = [
			{
				name: "category",
				value: "uncategorized",
			},
			{
				name: "category_description",
				value: "uncategorized",
			},
		];
	} );

	it( "Returns only the replacement variables where the start of the name matches with the search value.", () => {
		const actual = replacementVariablesEditor.replacementVariablesFilter( searchValue, replacementVariables );

		expect( actual ).toEqual( expected );
	} );

	it( "Returns the matching replacement variables, regardless of upper- or lowercase in the search value.", () => {
		searchValue = "Cat";

		const actual = replacementVariablesEditor.replacementVariablesFilter( searchValue, replacementVariables );

		expect( actual ).toEqual( expected );
	} );
} );
