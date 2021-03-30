import { mapSelectToProps, mapDispatchToProps } from "../../src/containers/DocumentSidebar";

/**
 * Setup the redux selectors
 * @param name (
 * @param schemaBlocksValidationresults Overrides default (invalid) schema blocks validation results
 * @returns The Mocked selectors
 */
function getSelectors( name, schemaBlocksValidationresults = null ) {
	const getResultsForFocusKeyword = jest.fn().mockReturnValue( {
		overallScore: 60,
	} );

	const getReadabilityResults = jest.fn().mockReturnValue( {
		overallScore: 100,
	} );

	const getPreferences = jest.fn().mockReturnValue( {
		isKeywordAnalysisActive: true,
		isContentAnalysisActive: true,
	} );

	const getSchemaBlocksValidationResults = jest.fn().mockReturnValue( schemaBlocksValidationresults || {
		"1234-abcde": {
			result: 1,
		},
	} );

	const yoastSEOSelectors = {
		getResultsForFocusKeyword,
		getReadabilityResults,
		getPreferences,
	};

	const schemaBlocksSelectors = {
		getSchemaBlocksValidationResults,
	}

	const getBlocks = jest.fn().mockReturnValue( [
		{
			name: "yoast/recipe",
			clientId: "0890e6b3-235b-4b71-9d27-c0c9fd980137",
			attributes: {
				"is-yoast-schema-block": true,
			},
		},
		{
			name: "core/paragraph",
			clientId: "0890e6b3-235b-4b71-9d27-c0c9fd980137",
			attributes: {
				content: "A paragraph",
			},
		},
	] );

	const coreEditorSelectors = {
		getBlocks,
	};

	const select = jest.fn( name => {
		switch ( name ) {
			case "yoast-seo/editor" :
				return yoastSEOSelectors;
			case "core/editor" :
				return coreEditorSelectors;
			case "yoast-seo/schema-blocks" :
				return schemaBlocksSelectors;
		}
	} );
	return select;
}

describe( "The DocumentSidebar container", () => {
	it( "maps the select function to props", () => {
		const select = getSelectors( name );

		const props = mapSelectToProps( select );

		expect( props.checklist ).toContainEqual( {
			label: "Readability analysis:",
			score: "good",
			scoreValue: "Good",
		} );

		expect( props.checklist ).toContainEqual( {
			label: "SEO analysis:",
			score: "ok",
			scoreValue: "OK",
		} );

		expect( props.checklist ).toContainEqual( {
			label: "Schema analysis:",
			score: "bad",
			scoreValue: "Needs improvement",
		} );

		expect( props.intro ).toEqual( undefined );
	} );

	it( "maps the select function to props when no schema validation results are present", () => {
		const select = getSelectors( name, { "1234-abcde": { result: 0 } } );

		const props = mapSelectToProps( select );

		expect( props.checklist ).toContainEqual( {
			label: "Readability analysis:",
			score: "good",
			scoreValue: "Good",
		} );

		expect( props.checklist ).toContainEqual( {
			label: "SEO analysis:",
			score: "ok",
			scoreValue: "OK",
		} );

		expect( props.checklist ).toContainEqual( {
			label: "Schema analysis:",
			score: "good",
			scoreValue: "Good",
		} );

		expect( props.intro ).toEqual( undefined );
	} );

	it( "maps the dispatch function to props", () => {
		const dispatchers = {
			openGeneralSidebar: jest.fn(),
		};

		const dispatch = jest.fn();

		dispatch.mockReturnValue( dispatchers );

		const { onClick } = mapDispatchToProps( dispatch );

		onClick();

		expect( dispatchers.openGeneralSidebar ).toHaveBeenCalledWith( "yoast-seo/seo-sidebar" );
	} );
} );
