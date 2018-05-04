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
		const editor = shallow( <ReplacementVariableEditor content="Dummy content" onChange={ () => {} } ariaLabelledBy="id" /> );

		expect( editor ).toMatchSnapshot();
	} );
} );
