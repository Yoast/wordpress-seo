/* eslint-disable no-undefined */
import * as actions from "../../../src/redux/actions/socialPreview";
import { socialPreviewsReducer } from "../../../src/redux/reducers/index";

const initialState = {
	facebook: {
		title: "",
		description: "",
		author: "",
		siteName: "",
		errors: [],
		imageUrl: "",
		imageId: "",
		imageType: "",
	},
	twitter: {
		title: "",
		description: "",
		author: "",
		siteName: "",
		errors: [],
		imageUrl: "",
		imageId: "",
		imageType: "",
	},
};

describe( socialPreviewsReducer, () => {
	it( "initializes the state", () => {
		const state = undefined;
		const action = {};

		const expected = initialState;
		const actual = socialPreviewsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	// Testing platform specificity
	it( "does not change title with the SET_TITLE action for a different platform", () => {
		const state = initialState;
		const facebookAction = actions.setSocialPreviewTitle( "A title", "facebook" );
		const expected = initialState.twitter;

		const actualTwitter = socialPreviewsReducer( state, facebookAction ).twitter;

		expect( actualTwitter ).toEqual( expected );
	} );

	// Testing key specificity:
	it( "Only changes the title when we do SET_TITLE action", () => {
		const state = { ...initialState };
		state.facebook.description = "I want to remain";
		state.facebook.title = "I want to change!";
		const facebookAction = actions.setSocialPreviewTitle( "I feel changed!", "facebook" );
		const expected = {
			...initialState.facebook,
			title: "I feel changed!",
		};

		const actualFacebook = socialPreviewsReducer( state, facebookAction ).facebook;

		expect( actualFacebook ).toEqual( expected );
	} );

	// Testing action type handling
	it( "handles the SET_TITLE action for the specific platform", () => {
		const state = initialState;
		const facebookAction = actions.setSocialPreviewTitle( "A title", "facebook" );
		const expected = {
			...initialState.facebook,
			title: "A title",
		};

		const actualFacebook = socialPreviewsReducer( state, facebookAction ).facebook;

		expect( actualFacebook ).toEqual( expected );
	} );
	it( "handles the SET_DESCRIPTION action for the specific platform", () => {
		const state = initialState;
		const facebookAction = actions.setSocialPreviewDescription( "A description", "facebook" );
		const expected = {
			...initialState.facebook,
			description: "A description",
		};

		const actualFacebook = socialPreviewsReducer( state, facebookAction ).facebook;

		expect( actualFacebook ).toEqual( expected );
	} );
	it( "handles the SET_IMAGE_URL action for the specific platform", () => {
		const state = initialState;
		const facebookAction = actions.setSocialPreviewImageUrl( "http://anurl.nl", "facebook" );
		const expected = {
			...initialState.facebook,
			imageUrl: "http://anurl.nl",
		};

		const actualFacebook = socialPreviewsReducer( state, facebookAction ).facebook;

		expect( actualFacebook ).toEqual( expected );
	} );
	it( "handles the SET_IMAGE_TYPE action for the specific platform", () => {
		const state = initialState;
		const facebookAction = actions.setSocialPreviewImageType( "square", "facebook" );
		const expected = {
			...initialState.facebook,
			imageType: "square",
		};

		const actualFacebook = socialPreviewsReducer( state, facebookAction ).facebook;

		expect( actualFacebook ).toEqual( expected );
	} );
} );
