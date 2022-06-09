import { addFilter } from "@wordpress/hooks";
import initializeUsedKeyphrasesAssessment from "../../../src/classic-editor/plugins/used-keyphrases-assessment";
import UsedKeywords from "../../../src/analysis/usedKeywords";

jest.mock( "@wordpress/hooks" );
jest.mock( "../../../src/analysis/usedKeywords" );

describe( "The initializeUsedKeyphrasesAssessment function", () => {
	it( "initializes the previously used keyphrases assessment", () => {
		const refreshAnalysis = jest.fn();

		window.wpseoScriptData = {
			metabox: {
				previouslyUsedKeywordActive: true,
			},
		};

		// Reset the mock.
		addFilter.mockClear();

		UsedKeywords.prototype.init = jest.fn();

		initializeUsedKeyphrasesAssessment(
			"get_focus_keyword_usage",
			refreshAnalysis,
		);

		expect( UsedKeywords.prototype.init ).toBeCalledTimes( 1 );
		expect( addFilter ).toBeCalledTimes( 1 );
	} );
	it( "does not initialize the previously used keyphrases assessment when it is disabled", () => {
		const refreshAnalysis = jest.fn();

		window.wpseoScriptData = {
			metabox: {
				previouslyUsedKeywordActive: false,
			},
		};

		// Reset the mock.
		addFilter.mockClear();

		UsedKeywords.prototype.init = jest.fn();

		initializeUsedKeyphrasesAssessment(
			"get_focus_keyword_usage",
			refreshAnalysis,
		);

		expect( UsedKeywords.prototype.init ).not.toBeCalledTimes( 1 );
		expect( addFilter ).not.toBeCalled();
	} );
} );
