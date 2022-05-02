import { shallow } from "enzyme";
import { useSelect, useDispatch, dispatch } from "@wordpress/data";
import SocialMetadata, { Facebook, Twitter } from "../../../../src/classic-editor/components/social/SocialMetadata";

jest.mock( "@wordpress/data" );
jest.mock( "@yoast/seo-integration", () => ( {
	...jest.requireActual( "@yoast/seo-integration" ),
	TwitterContainer: jest.fn(),
	FacebookContainer: jest.fn(),
} ) );

window.wpseoScriptData = {
	metabox: {
		showSocial: {
			facebook: true,
			twitter: true,
		},
		isPremium: "0",
	},
};

const updateTwitterImage = jest.fn();
const updateFacebookImage = jest.fn();

dispatch.mockReturnValue( {
	updateTwitterImage,
	updateFacebookImage,
} );

describe( "The SocialMetadata component", () => {
	it( "renders with the social metadata component", () => {
		const select = jest.fn();
		select.mockReturnValue( {
			getImageFallback: jest.fn( () => "https://www.sweetestcat.com/images/fluffy-cat.jpg" ),
			selectFacebookImageURL: jest.fn( () => "https://www.sweetestcat.com/images/fb/fluffy-cat-on-fb.jpg" ),
			getSiteUrl: jest.fn( () => "www.sweetestcat.com" ),
		} );

		useSelect.mockImplementation( func => func( select ) );

		const updateFacebookData = jest.fn();
		const clearFacebookPreviewImage = jest.fn();
		const updateTwitterData = jest.fn();
		const clearTwitterPreviewImage = jest.fn();

		useDispatch.mockReturnValue( {
			updateFacebookData,
			clearFacebookPreviewImage,
			updateTwitterData,
			clearTwitterPreviewImage,
		} );
		const renderedComponent = shallow( <SocialMetadata /> );

		const facebookComponent = renderedComponent.find( Facebook );
		const facebookProps = facebookComponent.props();

		expect( facebookProps.siteUrl ).toEqual( "www.sweetestcat.com" );
		expect( facebookProps.isPremium ).toEqual( false );
		expect( facebookProps.onRemoveImageClick ).toEqual( clearFacebookPreviewImage );
		expect( facebookProps.onLoad ).toEqual( updateFacebookData );
		expect( facebookProps.onSelectImageClick ).toBeDefined();

		const twitterComponent = renderedComponent.find( Twitter );
		const twitterProps = twitterComponent.props();

		expect( twitterProps.siteUrl ).toEqual( "www.sweetestcat.com" );
		expect( twitterProps.isPremium ).toEqual( false );
		expect( twitterProps.onRemoveImageClick ).toEqual( clearTwitterPreviewImage );
		expect( twitterProps.onLoad ).toEqual( updateTwitterData );
		expect( twitterProps.onSelectImageClick ).toBeDefined();
	} );
	it( "does not render the Facebook editor when the Facebook editor is disabled", () => {
		const select = jest.fn();
		select.mockReturnValue( {
			getImageFallback: jest.fn( () => "https://www.sweetestcat.com/images/fluffy-cat.jpg" ),
			selectFacebookImageURL: jest.fn( () => "https://www.sweetestcat.com/images/fb/fluffy-cat-on-fb.jpg" ),
			getSiteUrl: jest.fn( () => "www.sweetestcat.com" ),
		} );

		window.wpseoScriptData.metabox.showSocial.facebook = false;
		window.wpseoScriptData.metabox.showSocial.twitter = true;

		useSelect.mockImplementation( func => func( select ) );

		const updateFacebookData = jest.fn();
		const clearFacebookPreviewImage = jest.fn();
		const updateTwitterData = jest.fn();
		const clearTwitterPreviewImage = jest.fn();

		useDispatch.mockReturnValue( {
			updateFacebookData,
			clearFacebookPreviewImage,
			updateTwitterData,
			clearTwitterPreviewImage,
		} );
		const renderedComponent = shallow( <SocialMetadata /> );

		expect( renderedComponent.find( Facebook ) ).toHaveLength( 0 );
		expect( renderedComponent.find( Twitter ) ).toHaveLength( 1 );
	} );
	it( "does not render the Twitter editor when the Twitter editor is disabled", () => {
		const select = jest.fn();
		select.mockReturnValue( {
			getImageFallback: jest.fn( () => "https://www.sweetestcat.com/images/fluffy-cat.jpg" ),
			selectFacebookImageURL: jest.fn( () => "https://www.sweetestcat.com/images/fb/fluffy-cat-on-fb.jpg" ),
			getSiteUrl: jest.fn( () => "www.sweetestcat.com" ),
		} );

		window.wpseoScriptData.metabox.showSocial.facebook = true;
		window.wpseoScriptData.metabox.showSocial.twitter = false;

		useSelect.mockImplementation( func => func( select ) );

		const updateFacebookData = jest.fn();
		const clearFacebookPreviewImage = jest.fn();
		const updateTwitterData = jest.fn();
		const clearTwitterPreviewImage = jest.fn();

		useDispatch.mockReturnValue( {
			updateFacebookData,
			clearFacebookPreviewImage,
			updateTwitterData,
			clearTwitterPreviewImage,
		} );
		const renderedComponent = shallow( <SocialMetadata /> );

		expect( renderedComponent.find( Facebook ) ).toHaveLength( 1 );
		expect( renderedComponent.find( Twitter ) ).toHaveLength( 0 );
	} );
} );
