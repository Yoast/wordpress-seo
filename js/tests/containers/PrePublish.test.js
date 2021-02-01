import { mapSelectToProps, mapDispatchToProps } from "../../src/containers/PrePublish";

describe( "The PrePublish container", () => {
	it( "maps the select function to props", () => {
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

		const getSchemaBlocksValidationResults = jest.fn().mockReturnValue( {
			"1234-abcde": {
				result: 1,
			},
		} );

		const selectors = {
			getFocusKeyphrase: jest.fn(),
			getResultsForFocusKeyword,
			getReadabilityResults,
			getPreferences,
			getSchemaBlocksValidationResults,
		};

		const select = jest.fn();

		select.mockReturnValue( selectors );

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
			label: "No focus keyword was entered",
			score: "bad",
		} );

		expect( props.checklist ).toContainEqual( {
			label: "Schema analysis:",
			score: "bad",
			scoreValue: "Needs improvement",
		} );
	} );

	it( "maps the dispatch function to props", () => {
		const dispatchers = {
			closePublishSidebar: jest.fn(),
			openGeneralSidebar: jest.fn(),
		};

		const dispatch = jest.fn();

		dispatch.mockReturnValue( dispatchers );

		const { onClick } = mapDispatchToProps( dispatch );

		onClick();

		expect( dispatchers.closePublishSidebar ).toHaveBeenCalled();
		expect( dispatchers.openGeneralSidebar ).toHaveBeenCalledWith( "yoast-seo/seo-sidebar" );
	} );
} );
