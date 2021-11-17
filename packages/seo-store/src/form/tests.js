import seoReducer, { seoActions } from "./slice/seo";

describe( "Seo slice", () => {
	// eslint-disable-next-line no-undefined
	const previousState = undefined;

	const initialState = {
		title: "",
		description: "",
		slug: "",
		isCornerstone: false,
	};

	describe( "Reducer", () => {
		test( "should return the seo slice its initial state", () => {
			expect( seoReducer( previousState, {} ) ).toEqual( initialState );
		} );

		test( "should update the title", () => {
			const { updateSeoTitle } = seoActions;

			const result = seoReducer( initialState, updateSeoTitle( "test" ) );

			expect( result ).toEqual( {
				...initialState,
				title: "test",
			} );
		} );

		test( "should update the description", () => {
			const { updateMetaDescription } = seoActions;

			const result = seoReducer( initialState, updateMetaDescription( "test" ) );

			expect( result ).toEqual( {
				...initialState,
				description: "test",
			} );
		} );

		test( "should update the slug", () => {
			const { updateSlug } = seoActions;

			const result = seoReducer( initialState, updateSlug( "test" ) );

			expect( result ).toEqual( {
				...initialState,
				slug: "test",
			} );
		} );

		test( "should update the isCornerstone", () => {
			const { updateIsCornerstone } = seoActions;

			const result = seoReducer( initialState, updateIsCornerstone( false ) );

			expect( result ).toEqual( {
				...initialState,
				isCornerstone: false,
			} );
		} );
	} );
} );
