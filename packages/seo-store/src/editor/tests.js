import editorReducer, { editorActions } from "./slice";

describe( "Editor slice", () => {
	// eslint-disable-next-line no-undefined
	const previousState = undefined;

	const initialState = {
		content: "",
		title: "",
		permalink: "",
		excerpt: "",
		date: "",
		featuredImage: {},
	};

	describe( "Reducer", () => {
		test( "should return the editor slice its initial state", () => {
			expect( editorReducer( previousState, {} ) ).toEqual( initialState );
		} );

		test( "should update the content", () => {
			const { updateContent } = editorActions;

			const result = editorReducer( previousState, updateContent( "test" ) );

			expect( result ).toEqual( {
				...initialState,
				content: "test",
			} );
		} );

		test( "should update the title", () => {
			const { updateTitle } = editorActions;

			const result = editorReducer( initialState, updateTitle( "test" ) );

			expect( result ).toEqual( {
				...initialState,
				title: "test",
			} );
		} );

		test( "should update the permalink", () => {
			const { updatePermalink } = editorActions;

			const result = editorReducer( initialState, updatePermalink( "test" ) );

			expect( result ).toEqual( {
				...initialState,
				permalink: "test",
			} );
		} );

		test( "should update the excerpt", () => {
			const { updateExcerpt } = editorActions;

			const result = editorReducer( initialState, updateExcerpt( "test" ) );

			expect( result ).toEqual( {
				...initialState,
				excerpt: "test",
			} );
		} );

		test( "should update the featured image", () => {
			const { updateFeaturedImage } = editorActions;

			const result = editorReducer( initialState, updateFeaturedImage( { url: "http://example.com" } ) );

			expect( result ).toEqual( {
				...initialState,
				featuredImage: {
					url: "http://example.com",
				},
			} );
		} );
	} );
} );
