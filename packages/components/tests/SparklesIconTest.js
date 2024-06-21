import React from "react";
import renderer from "react-test-renderer";
import { SparklesIcon } from "../src/SparklesIcon";

const testCases = [
	{
		name: "pressed is false",
		pressed: false,
	},
	{
		name: "pressed is true",
		pressed: true,
	},
];

describe.each( testCases )( "SparklesIcon", ( { name, pressed } ) => {
	test( `should render the SparklesIcon component when ${name}`, () => {
		// Mock Math.random to return a constant value for the gradient id.
		jest.spyOn( global.Math, "random" ).mockReturnValue( "000kdmaht" );

		const component = renderer.create(
			<SparklesIcon pressed={ pressed } />
		);
		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();

		// Clean up the mock to ensure tests are completely isolated.
		global.Math.random.mockRestore();
	} );
} );
