import { shallow } from "enzyme";
import { useSelect, useDispatch, dispatch } from "@wordpress/data";
import SocialMetadata, { Facebook } from "../../../../src/classic-editor/components/social/SocialMetadata";

jest.mock( "@wordpress/data" );
jest.mock( "@yoast/seo-integration", () => ( {
	...jest.requireActual( "@yoast/seo-integration" ),
	TwitterContainer: jest.fn(),
	FacebookContainer: jest.fn(),
} ) );

self.wpseoScriptData = {
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

		window.wpseoScriptData.metabox.showSocial.facebook = true;

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

		expect( renderedComponent.find( Facebook ).props().siteUrl ).toEqual( "www.sweetestcat.com" );
	} );
} );
