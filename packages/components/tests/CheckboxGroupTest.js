import React from "react";
import renderer from "react-test-renderer";

import CheckboxGroup from "../src/checkbox/CheckboxGroup";

describe( "CheckboxGroup", () => {
	it( "should render with only the required props", () => {
		const component = renderer.create( <CheckboxGroup
			id="test-id"
			label="Nice label"
			options={ [ { label: "Hi", id: "hi" }, { label: "Hello", id: "hello" } ] }
		/> );
		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
