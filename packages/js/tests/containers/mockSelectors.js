/**
 * Sets up a specific store's redux selectors.
 *
 * @returns {jest.Mock<{getPreferences: jest.Mock<unknown>, getResultsForFocusKeyword: jest.Mock<unknown>, getReadabilityResults: jest.Mock<unknown>,
 * getFocusKeyphrase: jest.Mock<unknown>}|{getBlocks: jest.Mock<unknown>}>} The mock selectors.
 */
export function mockSelectors() {
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

	const getFocusKeyphrase = jest.fn().mockReturnValue( null );

	const getChecklistItems = jest.fn().mockReturnValue( {} );

	const yoastSEOSelectors = {
		getFocusKeyphrase,
		getResultsForFocusKeyword,
		getReadabilityResults,
		getPreferences,
		getChecklistItems,
	};

	const getBlocks = jest.fn().mockReturnValue( [
		{
			name: "core/paragraph",
			clientId: "0890e6b3-235b-4b71-9d27-c0c9fd980137",
			attributes: {
				content: "A paragraph",
			},
		},
	] );

	const coreBlockEditorSelectors = {
		getBlocks,
	};

	return jest.fn( storeName => {
		switch ( storeName ) {
			case "yoast-seo/editor" :
				return yoastSEOSelectors;
			case "core/block-editor" :
				return coreBlockEditorSelectors;
		}
	} );
}
