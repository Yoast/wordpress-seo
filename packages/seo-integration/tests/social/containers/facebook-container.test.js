import { shallow } from "enzyme";
import { useSelect, useDispatch } from "@wordpress/data";

import { useReplacementVariables } from "../../../src/hooks/useReplacementVariables";
import Container from "../../../src/social/containers/facebook-container";

jest.mock( "@wordpress/data" );
jest.mock( "../../../src/hooks/useReplacementVariables" );

const Wrapper = jest.fn();

describe( "The FacebookContainer components", () => {
	it( "creates a new Facebook editor container", () => {
		const select = jest.fn();
		useSelect.mockImplementation( func => func( select ) );

		select.mockReturnValue( {
			selectFacebookTitle: jest.fn( () => "title" ),
			selectFacebookDescription: jest.fn( () => "description" ),
			selectFacebookImage: jest.fn( () => (
				{
					alt: "A dog is sitting on the porch of a log cabin.",
				}
			) ),
			selectFacebookImageURL: jest.fn( () => "https://example.com/assets/images/image.jpeg" ),
			selectSocialDescriptionTemplate: jest.fn( () => "A tortie that wraps the human around her paws: based on the account of Ms. Zornitsa." ),
			selectMetaDescription: jest.fn( () => "" ),
			selectExcerpt: jest.fn( () => "An excerpt about cat story." ),
			selectSocialTitleTemplate: jest.fn( () => "Cat blogs: A story about cats on social Media" ),
			selectSeoTitle: jest.fn( () => "Cat blogs: A story about cats" ),
			selectSeoTemplates: jest.fn( () => ( {
				title: "A title templates for all beautiful things that are cats",
				titleNoFallback: "Just a title template",
				description: "A description template",
			} ) ),
		} );

		const updateFacebookTitle = jest.fn();
		const updateFacebookDescription = jest.fn();

		useDispatch.mockReturnValue( {
			updateFacebookTitle,
			updateFacebookDescription,
		} );

		const replacementVariables = jest.fn();
		const recommendedReplacementVariables = jest.fn();

		useReplacementVariables.mockReturnValue( {
			replacementVariables,
			recommendedReplacementVariables,
		} );

		const FacebookContainer = shallow( <Container as={ Wrapper } extraProp={ 10 } /> );

		// Name, title and description.
		expect( FacebookContainer.props().socialMediumName ).toEqual( "Facebook" );
		expect( FacebookContainer.props().title ).toEqual( "title" );
		expect( FacebookContainer.props().description ).toEqual( "description" );
		expect( FacebookContainer.props().descriptionPreviewFallback ).toEqual( "A tortie that wraps the human around her paws: based on the account of Ms. Zornitsa." );
		expect( FacebookContainer.props().titlePreviewFallback ).toEqual( "Cat blogs: A story about cats on social Media" );
		// Image.
		expect( FacebookContainer.props().imageUrl ).toEqual( "https://example.com/assets/images/image.jpeg" );
		expect( FacebookContainer.props().alt ).toEqual( "A dog is sitting on the porch of a log cabin." );
		// Update actions.
		expect( FacebookContainer.props().onTitleChange ).toEqual( updateFacebookTitle );
		expect( FacebookContainer.props().onDescriptionChange ).toEqual( updateFacebookDescription );
		// Replacement variables.
		expect( FacebookContainer.props().replacementVariables ).toEqual( replacementVariables );
		expect( FacebookContainer.props().recommendedReplacementVariables ).toEqual( recommendedReplacementVariables );
		// Placeholders.
		expect( FacebookContainer.props().titleInputPlaceholder ).toBe( "" );
		expect( FacebookContainer.props().descriptionInputPlaceholder ).toBe( "" );
		// Extra props.
		expect( FacebookContainer.props().extraProp ).toBe( 10 );
	} );
} );
