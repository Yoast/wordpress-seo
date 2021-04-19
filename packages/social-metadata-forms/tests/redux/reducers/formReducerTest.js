/* eslint-disable no-undefined */
import * as actions from "../../../src/redux/actions/formActions";
import { socialReducer } from "../../../src/redux/reducers/index";

const initialState = {
	facebook: {
		title: "",
		description: "",
		warnings: [],
		image: {
			bytes: null,
			type: null,
			height: null,
			width: null,
			url: "",
			id: null,
			alt: "",
		},
	},
	twitter: {
		title: "",
		description: "",
		warnings: [],
		image: {
			bytes: null,
			type: null,
			height: null,
			width: null,
			url: "",
			id: null,
			alt: "",
		},
	},
};

describe( socialReducer, () => {
	it( "initializes the state", () => {
		const state = undefined;
		const action = {};

		const expected = initialState;
		const actual = socialReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	// Testing platform specificity
	it( "does not change title with the SET_SOCIAL_TITLE action for a different platform", () => {
		const state = initialState;
		const facebookAction = actions.setSocialPreviewTitle( "A title", "facebook" );
		const expected = initialState.twitter;

		const actualTwitter = socialReducer( state, facebookAction ).twitter;

		expect( actualTwitter ).toEqual( expected );
	} );

	// Testing key specificity:
	it( "Only changes the title when we do SET_SOCIAL_TITLE action", () => {
		const state = { ...initialState };
		state.facebook.description = "I want to remain";
		state.facebook.title = "I want to change!";
		const facebookAction = actions.setSocialPreviewTitle( "I feel changed!", "facebook" );
		const expected = {
			...initialState.facebook,
			title: "I feel changed!",
		};

		const actualFacebook = socialReducer( state, facebookAction ).facebook;

		expect( actualFacebook ).toEqual( expected );
	} );

	// Testing action type handling
	it( "handles the SET_SOCIAL_TITLE action for the specific platform", () => {
		const state = initialState;
		const facebookAction = actions.setSocialPreviewTitle( "A title", "facebook" );
		const expected = {
			...initialState.facebook,
			title: "A title",
		};

		const actualFacebook = socialReducer( state, facebookAction ).facebook;

		expect( actualFacebook ).toEqual( expected );
	} );
	it( "handles the SET_SOCIAL_DESCRIPTION action for the specific platform", () => {
		const state = initialState;
		const facebookAction = actions.setSocialPreviewDescription( "A description", "facebook" );
		const expected = {
			...initialState.facebook,
			description: "A description",
		};

		const actualFacebook = socialReducer( state, facebookAction ).facebook;

		expect( actualFacebook ).toEqual( expected );
	} );
	it( "handles the SET_SOCIAL_IMAGE_URL action for the specific platform", () => {
		const state = initialState;
		const facebookAction = actions.setSocialPreviewImageUrl( "http://anurl.nl", "facebook" );
		const expected = {
			...initialState.facebook,
			image: { ...initialState.facebook.image, url: "http://anurl.nl" },
		};

		const actualFacebook = socialReducer( state, facebookAction ).facebook;

		expect( actualFacebook ).toEqual( expected );
	} );
	it( "handles the SET_SOCIAL_IMAGE_TYPE action for the specific platform", () => {
		const state = initialState;
		const facebookAction = actions.setSocialPreviewImageType( "JPG", "facebook" );
		const expected = {
			...initialState.facebook,
			image: { ...initialState.facebook.image, type: "JPG" },
		};

		const actualFacebook = socialReducer( state, facebookAction ).facebook;

		expect( actualFacebook ).toEqual( expected );
	} );
	it( "handles the CLEAR_SOCIAL_IMAGE action for the specific platform", () => {
		const state = Object.assign( {}, initialState );
		state.facebook.image = { id: "I am the image to remove!" };

		const facebookAction = actions.clearSocialPreviewImage( "facebook" );

		const expected = {
			...initialState.facebook,
			image: {
				bytes: null,
				type: null,
				height: null,
				width: null,
				url: "",
				id: null,
				alt: "",
			},
		};

		const actualFacebook = socialReducer( state, facebookAction ).facebook;

		expect( actualFacebook ).toEqual( expected );
	} );
} );
