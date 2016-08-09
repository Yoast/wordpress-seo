jest.unmock( "../js/components/input" );

import React from "react";
import TestUtils from "react-addons-test-utils";
import Input from "../js/components/input";

describe( "a input component", () => {

	//TODO write tests for input component
	it( "has correct props", () => {

		let inputProps = {
			label: "label",
			placeholder: "text here..",
			type: "radio",
			name: "text_input",
			data: "test data",
			properties: {
				label: "title",
			}
		}

		let renderer = TestUtils.createRenderer();
		renderer.render( <Input {...inputProps} /> );

		renderer.getRenderOutput();

		expect( true );
	} )

} );