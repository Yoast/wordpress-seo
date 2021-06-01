/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import App from "../App";

describe( "App", () => {
	it( "renders without problems", () => {
		const tree = renderer
			.create( <App /> )
			.toJSON();

		expect( tree ).toMatchSnapshot();
	} );
} );

