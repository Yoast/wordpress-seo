import { shallow } from "enzyme";
import { default as Container } from "../../../src/social/containers/facebook-container";
import * as data from "@wordpress/data";

// Jest.mock( "@wordpress/data", () => ( {
// 	// Inject the actual implementation of `@wordpress/data`.
// 	...jest.requireActual( "@wordpress/data" ),
// 	// Overwrite the `dispatch` function with out own mocked version.
// 	UseSelect: func => func( jest.fn() ),
// 	UseDispatch: jest.fn(),
// } ) );

const Wrapper = jest.fn();


describe( "a test for Facebook editor container", () => {
	jest.spyOn( data, "useSelect" ).mockImplementation( jest.fn() );

	const FacebookContainer = shallow( <Container as={ Wrapper } /> );

	expect( FacebookContainer ).toEqual();
} );
