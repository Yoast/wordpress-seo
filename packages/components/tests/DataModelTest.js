import React from "react";
import { render } from "@testing-library/react";

import DataModel from "../src/data-model/DataModel";

describe( "DataModel", () => {
	it( "should render with only the required props", () => {
		const { container } = render( <DataModel
			items={ [ {
				name: "test",
				width: 60,
				number: 60,
			} ] }
		/> );

		expect( container.firstChild ).toMatchSnapshot();
	} );
} );
