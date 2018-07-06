import {
	pushNewReplaceVar, decodeSeparatorVariable, mapCustomFields, mapCustomTaxonomies, prepareCustomFieldForDispatch,
	prepareCustomTaxonomyForDispatch,
	replaceSpaces,
} from "../../src/helpers/replacementVariableHelpers";
import { UPDATE_REPLACEMENT_VARIABLE } from "../../src/redux/actions/snippetEditor";

describe( "decodeSeparatorVariable", () => {
	it( "decodes &ndashes from the replacementvariables object from a code to a symbol.", () => {
		const replacementVariables = {
			date: "May 15, 2018",
			sep: "&ndash;",
		};

		const expected = {
			date: "May 15, 2018",
			sep: "–",
		};

		const actual = decodeSeparatorVariable( replacementVariables );

		expect( actual ).toEqual( expected );
	} );

	it( "decodes the seperator from the replacementvariables object from a code to a symbol.", () => {
		const replacementVariables = {
			date: "May 15, 2018",
			sep: "&#8902;",
		};

		const expected = {
			date: "May 15, 2018",
			sep: "⋆",
		};

		const actual = decodeSeparatorVariable( replacementVariables );

		expect( actual ).toEqual( expected );
	} );

	it( "returns the passed object when no sep variable was present in the replacement variables object", () => {
		const replacementVariables = {
			date: "May 15, 2018",
		};

		const expected = {
			date: "May 15, 2018",
		};

		const actual = decodeSeparatorVariable( replacementVariables );

		expect( actual ).toEqual( expected );
	} );
} );

describe( "replaceSpaces", () => {
	it( "replaces single spaces in a string with underscores", () => {
		const spaceString = "I have single spaces between my words";

		const expected = "I_have_single_spaces_between_my_words";

		const actual = replaceSpaces( spaceString );

		expect( actual ).toEqual( expected );
	} );

	it( "replaces multiple spaces in a string with the same number of underscores", () => {
		const spaceString = "Two  Three   Four    spaces";

		const expected = "Two__Three___Four____spaces";

		const actual = replaceSpaces( spaceString );

		expect( actual ).toEqual( expected );
	} );

	it( "replaces leading and trailing spaces in a string with the same number of underscores", () => {
		const spaceString = "  two spaces before and three spaces after   ";

		const expected = "__two_spaces_before_and_three_spaces_after___";

		const actual = replaceSpaces( spaceString );

		expect( actual ).toEqual( expected );
	} );
} );

describe( "prepareCustomFieldForDispatch", () => {
	it( "returns an object containing a name and a label", () => {
		const nameString = "custom field name";

		const expected = [ "name", "label" ].sort();

		const actual = prepareCustomFieldForDispatch( nameString );

		expect( typeof actual ).toEqual( "object" );
		expect( Object.keys( actual ).sort() ).toEqual( expected );
	} );

	it( "returns a name that is prefixed with 'cf_'", () => {
		const nameString = "custom field name";

		const expected = "cf_custom_field_name";

		const { name: actual } = prepareCustomFieldForDispatch( nameString );

		expect( actual ).toEqual( expected );
	} );

	it( "returns a label with the first letter capitalized, no replaced spaces, and appended with (custom field)", () => {
		const nameString = "custom field name";

		const expected = "Custom field name (custom field)";

		const { label: actual } = prepareCustomFieldForDispatch( nameString );

		expect( actual ).toEqual( expected );
	} );
} );

describe( "prepareCustomTaxonomyForDispatch", () => {
	it( "returns an object containing a name, label, descriptionName and a descriptionLabel", () => {
		const nameString = "custom taxonomy name";

		const expected = [ "name", "label", "descriptionName", "descriptionLabel" ].sort();

		const actual = prepareCustomTaxonomyForDispatch( nameString );

		expect( typeof actual ).toEqual( "object" );
		expect( Object.keys( actual ).sort() ).toEqual( expected );
	} );

	it( "returns a name that is prefixed with 'ct_'", () => {
		const nameString = "custom taxonomy name";

		const expected = "ct_custom_taxonomy_name";

		const { name: actual } = prepareCustomTaxonomyForDispatch( nameString );

		expect( actual ).toEqual( expected );
	} );

	it( "returns a label with the first letter capitalized, no replaced spaces, and appended with (custom taxonomy)", () => {
		const nameString = "custom taxonomy name";

		const expected = "Custom taxonomy name (custom taxonomy)";

		const { label: actual } = prepareCustomTaxonomyForDispatch( nameString );

		expect( actual ).toEqual( expected );
	} );

	it( "returns a name for the description that is prefixed with 'ct_desc_'", () => {
		const nameString = "custom taxonomy name";

		const expected = "ct_custom_taxonomy_name";

		const { name: actual } = prepareCustomTaxonomyForDispatch( nameString );

		expect( actual ).toEqual( expected );
	} );

	it( "returns a label with the first letter capitalized, no replaced spaces, and appended with (custom taxonomy)", () => {
		const nameString = "custom taxonomy name";

		const expected = "Custom taxonomy name (custom taxonomy)";

		const { label: actual } = prepareCustomTaxonomyForDispatch( nameString );

		expect( actual ).toEqual( expected );
	} );
} );

describe( "mapCustomFields", () => {
	const replaceVars = {
		replaceVar1: "replaceValue1",
		replaceVar2: "replaceValue2",
		replaceVar3: "replaceValue3",
		custom_fields: {
			"i only have spaces": "value1",
			"i_only_have_underscores": "value2",
		},
	};

	const store = {
		dispatch: jest.fn(),
	};

	it( "dispatches the SNIPPET_EDITOR_UPDATE_REPLACEMENT_VARIABLE action to redux", () => {
		mapCustomFields( replaceVars, store );

		expect( store.dispatch ).toHaveBeenCalledWith( expect.objectContaining( {
			type: UPDATE_REPLACEMENT_VARIABLE,
		} ) );
	} );

	it( "passes a label that contains ' (custom fields)'", () => {
		mapCustomFields( replaceVars, store );

		expect( store.dispatch ).toHaveBeenCalledWith( expect.objectContaining( {
			label: expect.stringContaining( " (custom field)" ),
		} ) );
	} );

	it( "passes a name that is prefixed with 'cf_'", () => {
		mapCustomFields( replaceVars, store );

		expect( store.dispatch ).toHaveBeenCalledWith( expect.objectContaining( {
			name: expect.stringContaining( "cf_" ),
		} ) );
	} );

	it( "removes the old custom_fields object from the replace_vars", () => {
		const actual = mapCustomFields( replaceVars, store );

		expect( actual ).not.toBe( expect.objectContaining( {
			custom_fields: expect.any( Object ),
		} ) );
	} );
} );

describe( "mapCustomTaxonomies", () => {
	const replaceVars = {
		replaceVar1: "replaceValue1",
		replaceVar2: "replaceValue2",
		replaceVar3: "replaceValue3",
		custom_taxonomies: {
			customTaxOne: {
				name: "customTaxOne",
				description: "customTaxOneDescription",
			},
			customTaxTwo: {
				name: "customTaxTwo",
				description: "customTaxTwoDescription",
			},
		},
	};

	const store = {
		dispatch: jest.fn(),
	};

	it( "dispatches the SNIPPET_EDITOR_UPDATE_REPLACEMENT_VARIABLE action to redux twice per custom taxonomy", () => {
		const numberOfCustomTaxonomies = Object.keys( replaceVars.custom_taxonomies ).length;

		mapCustomTaxonomies( replaceVars, store );

		expect( store.dispatch ).toHaveBeenCalledWith( expect.objectContaining( {
			type: UPDATE_REPLACEMENT_VARIABLE,
		} ) );
		expect( store.dispatch ).toHaveBeenCalledTimes( numberOfCustomTaxonomies * 2 );
	} );

	it( "passes a label that contains ' (custom taxonomies)'", () => {
		mapCustomTaxonomies( replaceVars, store );

		expect( store.dispatch ).toHaveBeenCalledWith( expect.objectContaining( {
			label: expect.stringContaining( " (custom taxonomy)" ),
		} ) );
	} );

	it( "passes a name that is prefixed with 'ct_'", () => {
		mapCustomTaxonomies( replaceVars, store );

		expect( store.dispatch ).toHaveBeenCalledWith( expect.objectContaining( {
			name: expect.stringContaining( "ct_" ),
		} ) );
	} );

	it( "removes the old custom_taxonomies object from the replace_vars", () => {
		const actual = mapCustomTaxonomies( replaceVars, store );

		expect( actual ).not.toBe( expect.objectContaining( {
			custom_taxonomies: expect.any( Object ),
		} ) );
	} );
} );

describe( "pushNewReplaceVar", () => {
	it( "pushes an action to an array", () => {
		const oldArray = [ { name: "object1" } ];
		const action = {
			name: "test_name",
			label: "Nice custom label",
			value: "testValue",
		};

		const expected =  [
			{
				name: "object1",
			},
			{
				name: "test_name",
				label: "Nice custom label",
				value: "testValue",
			},
		];

		const actual = pushNewReplaceVar( oldArray, action );

		expect( actual ).toEqual( expected );
	} );

	it( "calls createLabelFromName if no label was supplied in the action", () => {
		const oldArray = [ { name: "object1" } ];
		const action = {
			name: "test_name",
			label: "",
			value: "testValue",
		};

		const expected =  [
			{
				name: "object1",
			},
			{
				name: "test_name",
				label: "Test name",
				value: "testValue",
			},
		];

		const actual = pushNewReplaceVar( oldArray, action );

		expect( actual ).toEqual( expected );
	} );
} );
