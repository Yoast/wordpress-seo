import { shallow } from "enzyme";
import ReplacementVariableEditorStandalone, { ReplacementVariableEditorStandaloneInnerComponent }
	from "../components/ReplacementVariableEditorStandalone";
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
			<ReplacementVariableEditorStandalone
				replacementVariables={ [] }
				content="Dummy content"
				onChange={ () => {} }
				ariaLabelledBy="id"
				theme={ { isRtl: "false" } }
			/>
		);

		expect( editor ).toMatchSnapshot();
	} );
} );

describe( "suggestionsFilter", () => {
	let searchValue, replacementVariables, suggestions, replacementVariablesEditor, expected;

	beforeEach( () => {
		searchValue = "cat";
		replacementVariables = [
			{
				name: "category",
				label: "Category",
				value: "uncategorized",
			},
			{
				name: "primary_category",
				label: "Primary category",
				value: "uncategorized",
			},
			{
				name: "category_description",
				label: "Category description",
				value: "uncategorized",
			},
			{
				name: "date",
				label: "Date",
				value: "May 30, 2018",
			},
		];

		const props = {
			replacementVariables,
			content: "Dummy content",
			onChange: () => {},
			ariaLabelledBy: "id",
		};

		replacementVariablesEditor = new ReplacementVariableEditorStandaloneInnerComponent( props );

		suggestions = replacementVariablesEditor.mapReplacementVariablesToSuggestions( props.replacementVariables );

		expected = [
			{
				replaceName: "category",
				label: "Category",
				name: "Category",
				value: "uncategorized",
			},
			{
				replaceName: "category_description",
				label: "Category description",
				name: "Category description",
				value: "uncategorized",
			},
		];
	} );

	it( "Replacement variables are correctly mapped to suggestions by mapReplacementVariablesToSuggestions.", () => {
		const expected = [
			{
				replaceName: "category",
				label: "Category",
				name: "Category",
				value: "uncategorized",
			},
			{
				replaceName: "primary_category",
				label: "Primary category",
				name: "Primary category",
				value: "uncategorized",
			},
			{
				replaceName: "category_description",
				label: "Category description",
				name: "Category description",
				value: "uncategorized",
			},
			{
				replaceName: "date",
				label: "Date",
				name: "Date",
				value: "May 30, 2018",
			},
		];

		const actual = replacementVariablesEditor.mapReplacementVariablesToSuggestions( replacementVariables );

		expect( actual ).toEqual( expected );
	} );

	it( "Returns only the replacement variables where the start of the name matches with the search value.", () => {
		const actual = replacementVariablesEditor.suggestionsFilter( searchValue, suggestions );

		expect( actual ).toEqual( expected );
	} );

	it( "Returns the matching replacement variables, regardless of upper- or lowercase in the search value.", () => {
		searchValue = "Cat";

		const actual = replacementVariablesEditor.suggestionsFilter( searchValue, suggestions );

		expect( actual ).toEqual( expected );
	} );
} );
