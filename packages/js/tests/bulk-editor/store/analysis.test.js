import { analysisSelectors, createInitialAnalysisState } from "../../../src/bulk-editor/store/analysis";

describe( "the analysis slice", () => {
	afterEach( () => {
		delete window.wpseoBulkEditorData;
	} );

	it( "reads the localized SEO analysis flag", () => {
		window.wpseoBulkEditorData = { analysis: { keywordAnalysisActive: true } };

		expect( createInitialAnalysisState() ).toEqual( { keywordAnalysisActive: true } );
	} );

	it( "treats a missing or non-boolean flag as off", () => {
		expect( createInitialAnalysisState() ).toEqual( { keywordAnalysisActive: false } );

		window.wpseoBulkEditorData = { analysis: { keywordAnalysisActive: "1" } };

		expect( createInitialAnalysisState() ).toEqual( { keywordAnalysisActive: false } );
	} );

	it( "selects the flag from the state", () => {
		expect( analysisSelectors.selectIsKeywordAnalysisActive( { analysis: { keywordAnalysisActive: true } } ) ).toBe( true );
		expect( analysisSelectors.selectIsKeywordAnalysisActive( { analysis: { keywordAnalysisActive: false } } ) ).toBe( false );
		expect( analysisSelectors.selectIsKeywordAnalysisActive( {} ) ).toBe( false );
	} );
} );
