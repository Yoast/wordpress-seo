import { shallow } from "enzyme";
import { useSelect, useDispatch } from "@wordpress/data";

import { useReplacementVariables } from "../../../src/hooks/useReplacementVariables";
import Container from "../../../src/social/containers/twitter-container";

jest.mock( "@wordpress/data" );
jest.mock( "../../../src/hooks/useReplacementVariables" );

const Wrapper = jest.fn();

describe( "a test for TwitterEditorContainer component", () => {
	it( "creates a new Twitter editor container", () => {
		const select = jest.fn();
		useSelect.mockImplementation( func => func( select ) );

		select.mockReturnValue( {
			selectTwitterTitle: jest.fn( () => "Successful cat meow-nager" ),
			selectTwitterDescription: jest.fn( () => "A collection of stories of successful cat meow-nagers in meow-naging their human: less work more treats." ),
			selectTwitterImage: jest.fn( () => (
				{
					alt: "A cat wearing a robe",
				}
			) ),
			selectTwitterImageURL: jest.fn( () => "https://example.com/assets/images/cat.jpeg" ),
			getTwitterImageType: jest.fn( () => "summary" ),
			selectSocialDescriptionTemplate: jest.fn( () => "A tortie that wraps the human around her paws: based on the account of Ms. Zornitsa." ),
			selectFacebookTitle: jest.fn( () => "Successful catsistants on Facebook" ),
			selectFacebookDescription: jest.fn( () => "A collection of stories of successful catsistants." ),
			selectMetaDescription: jest.fn( () => "" ),
			selectExcerpt: jest.fn( () => "An excerpt about cat story." ),
			selectSocialTitleTemplate: jest.fn( () => "Cat blogs: A story about cats on social Media" ),
			selectSeoTitle: jest.fn( () => "Cat blogs: A story about cats" ),
			selectTitleTemplate: jest.fn( () => "A title templates for all beautiful things that are cats" ),
			selectDescriptionTemplate: jest.fn( () => "A description template" ),
		} );

		const updateTwitterTitle = jest.fn();
		const updateTwitterDescription = jest.fn();

		useDispatch.mockReturnValue( {
			updateTwitterTitle,
			updateTwitterDescription,
		} );

		const replacementVariables = jest.fn();
		const recommendedReplacementVariables = jest.fn();

		useReplacementVariables.mockReturnValue( {
			replacementVariables,
			recommendedReplacementVariables,
		} );

		const TwitterContainer = shallow( <Container as={ Wrapper } extraProp={ 10 } /> );

		// Name, title and description.
		expect( TwitterContainer.props().socialMediumName ).toEqual( "Twitter" );
		expect( TwitterContainer.props().title ).toEqual( "Successful cat meow-nager" );
		expect( TwitterContainer.props().description ).toEqual( "A collection of stories of successful cat meow-nagers in meow-naging their human: less work more treats." );
		expect( TwitterContainer.props().descriptionPreviewFallback ).toEqual( "A tortie that wraps the human around her paws: based on the account of Ms. Zornitsa." );
		expect( TwitterContainer.props().titlePreviewFallback ).toEqual( "Cat blogs: A story about cats on social Media" );
		// Image.
		expect( TwitterContainer.props().imageUrl ).toEqual( "https://example.com/assets/images/cat.jpeg" );
		expect( TwitterContainer.props().alt ).toEqual( "A cat wearing a robe" );
		expect( TwitterContainer.props().isLarge ).toEqual( false );
		// Update actions.
		expect( TwitterContainer.props().onTitleChange ).toEqual( updateTwitterTitle );
		expect( TwitterContainer.props().onDescriptionChange ).toEqual( updateTwitterDescription );
		// Replacement variables.
		expect( TwitterContainer.props().replacementVariables ).toEqual( replacementVariables );
		expect( TwitterContainer.props().recommendedReplacementVariables ).toEqual( recommendedReplacementVariables );
		// Placeholders.
		expect( TwitterContainer.props().titleInputPlaceholder ).toBe( "" );
		expect( TwitterContainer.props().descriptionInputPlaceholder ).toBe( "" );
		// Extra props.
		expect( TwitterContainer.props().extraProp ).toBe( 10 );
	} );
} );
