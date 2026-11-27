import React from "react";
import { render } from "@testing-library/react";

import CheckboxGroup from "../src/checkbox/CheckboxGroup";

describe( "CheckboxGroup", () => {
	it( "should render with only the required props", () => {
		const { container } = render( <CheckboxGroup
			id="test-id"
			label="Nice label"
			options={ [ { label: "Hi", id: "hi" }, { label: "Hello", id: "hello" } ] }
		/> );

		expect( container.firstChild ).toMatchSnapshot();
	} );
} );
