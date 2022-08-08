import { mapDispatchToProps, mapSelectToProps } from "../../src/containers/SnippetEditor";

describe( "SnippetEditor container", () => {
	it( "maps select to the props", () => {
		const select = jest.fn( name => {
			if ( name === "yoast-seo/editor" ) {
				return {
					getBaseUrlFromSettings: jest.fn().mockReturnValue( "https://localhost.test" ),
					getDateFromSettings: jest.fn().mockReturnValue( "01-01-1970" ),
					getFocusKeyphrase: jest.fn().mockReturnValue( "active" ),
					getRecommendedReplaceVars: jest.fn().mockReturnValue( [
						{
							name: "variable",
							value: "Value",
						},
					] ),
					getReplaceVars: jest.fn().mockReturnValue( [
						{
							name: "variable",
							value: "Value",
						},
					] ),
					getShoppingData: jest.fn().mockReturnValue( {
						rating: 1,
						reviewCount: 2,
						avalability: "in stock",
						price: "&euro; 123",
					} ),
					getSiteIconUrlFromSettings: jest.fn().mockReturnValue( "https://localhost.test/wp-content/uploads/2021/01/WordPress1.jpg" ),
					getSnippetEditorData: jest.fn().mockReturnValue( {
						title: "Title",
						slug: "slug",
						description: "Description",
					} ),
					getSnippetEditorMode: jest.fn().mockReturnValue( "desktop" ),
					getSnippetEditorPreviewImageUrl: jest.fn().mockReturnValue( "https://localhost.test/wp-content/uploads/2021/01/WordPress2.jpg" ),
					getSnippetEditorWordsToHighlight: jest.fn().mockReturnValue( [ "active" ] ),
					isCornerstoneContent: jest.fn().mockReturnValue( true ),
					getIsTerm: jest.fn().mockReturnValue( true ),
					getContentLocale: jest.fn().mockReturnValue( "en" ),
				};
			}
		} );

		const expected = {
			baseUrl: "https://localhost.test",
			data: {
				title: "Title",
				slug: "slug",
				description: "Description",
			},
			date: "01-01-1970",
			faviconSrc: "https://localhost.test/wp-content/uploads/2021/01/WordPress1.jpg",
			keyword: "active",
			mobileImageSrc: "https://localhost.test/wp-content/uploads/2021/01/WordPress2.jpg",
			mode: "desktop",
			recommendedReplacementVariables: [
				{
					name: "variable",
					value: "Value",
				},
			],
			replacementVariables: [
				{
					name: "variable",
					value: "Value",
				},
			],
			shoppingData: {
				rating: 1,
				reviewCount: 2,
				avalability: "in stock",
				price: "&euro; 123",
			},
			wordsToHighlight: [ "active" ],
			isCornerstone: true,
			isTaxonomy: true,
			locale: "en",
		};

		const result = mapSelectToProps( select );

		expect( result ).toEqual( expected );
	} );

	it( "maps dispatch to props", () => {
		const yoastEditorDispatch = {
			switchMode: jest.fn(),
			updateData: jest.fn(),
			updateAnalysisData: jest.fn(),
		};
		const coreEditorDispatch = {
			editPost: jest.fn(),
		};
		const dispatch = jest.fn( name => {
			switch ( name ) {
				case "yoast-seo/editor":
					return yoastEditorDispatch;
				case "core/editor":
					return coreEditorDispatch;
			}
		} );

		const result = mapDispatchToProps( dispatch );

		expect( typeof result.onChange ).toEqual( "function" );
		expect( result.onChangeAnalysisData ).toBe( yoastEditorDispatch.updateAnalysisData );

		result.onChange( "mode", "mobile" );
		expect( yoastEditorDispatch.switchMode ).toHaveBeenCalledWith( "mobile" );

		result.onChange( "slug", "snail" );
		expect( yoastEditorDispatch.updateData ).toHaveBeenCalledWith( { slug: "snail" } );
		expect( coreEditorDispatch.editPost ).toHaveBeenCalledWith( { slug: "snail" } );

		result.onChange( "title", "Title" );
		expect( yoastEditorDispatch.updateData ).toHaveBeenCalledWith( { title: "Title" } );

		result.onChangeAnalysisData( "data" );
		expect( yoastEditorDispatch.updateAnalysisData ).toHaveBeenCalledWith( "data" );
	} );
} );
