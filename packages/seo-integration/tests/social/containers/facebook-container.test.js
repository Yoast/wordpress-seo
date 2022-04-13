import { shallow } from "enzyme";

import { useReplacementVariables } from "../../../src/hooks/useReplacementVariables";
import { useSelect, useDispatch } from "@wordpress/data";

import Container from "../../../src/social/containers/facebook-container";

jest.mock( "@wordpress/data" );
jest.mock( "../../../src/hooks/useReplacementVariables" );

const Wrapper = jest.fn();


describe( "a test for Facebook editor container", () => {
	it( "creates a new Facebook editor container", () => {
		const select = jest.fn();
		useSelect.mockImplementation( func => func( select ) );

		select.mockReturnValue( {
			selectFacebookTitle: jest.fn( () => "title" ),
			selectFacebookDescription: jest.fn( () => "description" ),
			selectFacebookImage: jest.fn( () => (
				{}
			) ),
		} );

		useDispatch.mockReturnValue( {
			updateFacebookTitle: jest.fn(),
			updateFacebookDescription: jest.fn()
		} );

		useReplacementVariables.mockReturnValue( {
			replacementVariables: jest.fn(),
			recommendedReplacementVariables: jest.fn()
		} );

		const FacebookContainer = shallow( <Container as={ Wrapper }/> );

		expect( FacebookContainer ).toEqual( {} );
	} )
} );
