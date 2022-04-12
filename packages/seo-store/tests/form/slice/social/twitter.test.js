import { curry, set } from "lodash";
import twitterReducer, { twitterActions, twitterSelectors } from "../../../../src/form/slice/social/twitter";

describe( "a test for twitter slice", () => {
	// eslint-disable-next-line no-undefined
	const previousState = undefined;

	const initialState = {
		title: "",
		description: "",
		image: {},
	};

	describe( "a test for twitter reducer", () => {
		test( "should return the initial state", () => {
			expect( twitterReducer( previousState, {} ) ).toEqual( initialState );
		} );

		test( "should update the title", () => {
			const { updateTwitterTitle } = twitterActions;

			const result = twitterReducer( initialState, updateTwitterTitle( "Catfluencer on Twitter" ) );

			expect( result ).toEqual( {
				...initialState,
				title: "Catfluencer on Twitter",
			} );
		} );

		test( "should update the description", () => {
			const { updateTwitterDescription } = twitterActions;

			const result = twitterReducer( initialState, updateTwitterDescription( "How to be a purr-fect catfluencer on Twitter." ) );

			expect( result ).toEqual( {
				...initialState,
				description: "How to be a purr-fect catfluencer on Twitter.",
			} );
		} );

		test( "should update the image", () => {
			const { updateTwitterImage } = twitterActions;

			const result = twitterReducer( initialState, updateTwitterImage( {
				id: 1,
				url: "https://example.com/catfluencer",
				width: 500,
				height: 600,
				alt: "A sleeping cat",
			} ) );

			expect( result ).toEqual( {
				...initialState,
				image: {
					id: 1,
					url: "https://example.com/catfluencer",
					width: 500,
					height: 600,
					alt: "A sleeping cat",
				},
			} );
		} );
	} );

	describe( "a test for twitter selectors", () => {
		const createStoreState = curry( set )( {}, "form.social" );

		test( "should select the twitter title", () => {
			const { selectTwitterTitle } = twitterSelectors;

			const state = {
				twitter: {
					title: "Excelling in catfluencer role on Twitter",
				},
			};
			const result = selectTwitterTitle( createStoreState( state ) );

			expect( result ).toEqual( "Excelling in catfluencer role on Twitter" );
		} );

		test( "should select the twitter description", () => {
			const { selectTwitterDescription } = twitterSelectors;

			const state = {
				twitter: {
					description: "What it means to be a catfluencer and what treats should we present to our cats so they can excel in being one.",
				},
			};
			const result = selectTwitterDescription( createStoreState( state ) );

			expect( result ).toEqual( "What it means to be a catfluencer and what treats should we present to our cats so they can excel in being one." );
		} );

		test( "should select the twitter image", () => {
			const { selectTwitterImage } = twitterSelectors;

			const state = {
				twitter: {
					image: {
						id: 1,
						url: "https://example.com/catfluencer-meowdel",
						width: 500,
						height: 600,
						alt: "A sleeping cat",
					},
				},
			};
			const result = selectTwitterImage( createStoreState( state ) );

			expect( result ).toEqual( {
				id: 1,
				url: "https://example.com/catfluencer-meowdel",
				width: 500,
				height: 600,
				alt: "A sleeping cat",
			} );
		} );
	} );
} );
