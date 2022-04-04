import { getDescription, getSeoTitle } from "@yoast/wordpress-seo/src/redux/selectors";
import facebookReducer, { facebookActions, facebookSelectors } from "../../../../src/form/slice/social/facebook";

describe( "a test for facebook slice", () => {
	// eslint-disable-next-line no-undefined
	const previousState = undefined;

	const initialState = {
		title: "",
		description: "",
		image: {},
	};

	describe( "a test for facebook reducer", () => {
		test( "should return the initial state", () => {
			expect( facebookReducer( previousState, {} ) ).toEqual( initialState );
		} );

		test( "should update the title", () => {
			const { updateFacebookTitle } = facebookActions;

			const result = facebookReducer( initialState, updateFacebookTitle( "Catfluencer on Facebook" ) );

			expect( result ).toEqual( {
				...initialState,
				title: "Catfluencer on Facebook",
			} );
		} );

		test( "should update the description", () => {
			const { updateFacebookDescription } = facebookActions;

			const result = facebookReducer( initialState, updateFacebookDescription( "How to be a purr-fect catfluencer on Facebook." ) );

			expect( result ).toEqual( {
				...initialState,
				description: "How to be a purr-fect catfluencer on Facebook.",
			} );
		} );

		test( "should update the image", () => {
			const { updateFacebookImage } = facebookActions;

			const result = facebookReducer( initialState, updateFacebookImage( {
				id: 1,
				url: "http://example.com/catfluencer",
				width: 500,
				height: 600,
				alt: "A sleeping cat",
			} ) );

			expect( result ).toEqual( {
				...initialState,
				image: {
					id: 1,
					url: "http://example.com/catfluencer",
					width: 500,
					height: 600,
					alt: "A sleeping cat",
				},
			} );
		} );
	} );
} );
