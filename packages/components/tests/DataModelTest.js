import React, { act } from "react";
import renderer from "react-test-renderer";

import DataModel from "../src/data-model/DataModel";

describe( "DataModel", () => {
	it( "should render with only the required props", () => {
		let component;
		act( () => {
			component = renderer.create( <DataModel
				items={ [ {
					name: "test",
					width: 60,
					number: 60,
				} ] }
			/> );
		} );
		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
