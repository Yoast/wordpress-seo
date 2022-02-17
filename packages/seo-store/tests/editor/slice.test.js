import editorReducer, { editorActions } from "../../src/editor/slice";

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
		taxonomies: {},
		locale: "",
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

		test( "should update the date", () => {
			const { updateDate } = editorActions;

			const result = editorReducer( initialState, updateDate( new Date( Date.UTC( 2021, 11, 15, 12 ) ).toISOString() ) );

			expect( result ).toEqual( {
				...initialState,
				date: "2021-12-15T12:00:00.000Z",
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

		test( "should update the locale", () => {
			const { updateLocale } = editorActions;

			const result = editorReducer( initialState, updateLocale( "ja" ) );

			expect( result ).toEqual( {
				...initialState,
				locale: "ja",
			} );
		} );

		test( "should update the terms", () => {
			const { updateTerms } = editorActions;

			const result = editorReducer( initialState, updateTerms( {
				taxonomyType: "tags",
				terms: [
				{
					id: "1",
					name: "tag 1",
				},
				{
					id: "2",
					name: "tag 2",
				},
			] } ) );

			expect( result ).toEqual( {
				...initialState,
					taxonomies: {
						tags: [
							{
								id: "1",
								name: "tag 1",
							},
							{
								id: "2",
								name: "tag 2",
							},
						],
					}
			} );
		} );
	} );
} );
