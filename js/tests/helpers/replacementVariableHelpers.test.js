import {
	createLabelFromName,
	decodeSeparatorVariable, pushNewReplaceVar,
} from "../../src/helpers/replacementVariableHelpers";

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

		expect( expected ).toEqual( actual );
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

		expect( expected ).toEqual( actual );
	} );

	it( "returns the passed object when no sep variable was present in the replacement variables object", () => {
		const replacementVariables = {
			date: "May 15, 2018",
		};

		const expected = {
			date: "May 15, 2018",
		};

		const actual = decodeSeparatorVariable( replacementVariables );

		expect( expected ).toEqual( actual );
	} );
} );
describe( "pushNewReplaceVar", () => {
	const oldArray = [ { name: "object1" } ];
	it( "pushes an action to an array", () => {
		const action = {
			name: "testName",
			label: "testLabel",
			value: "testValue",
		};

		const expected =  [
			{
				name: "object1",
			},
			{
				name: "testName",
				label: "testLabel",
				value: "testValue",
			},
		];

		const actual = pushNewReplaceVar( oldArray, action );
	} );
} );
replacementVariables.push( {
	name: action.name,
	label: action.label || createLabelFromName( action.name ),
	value: action.value,
} );