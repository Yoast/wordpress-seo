/**
 * Sets up a specific store's redux selectors.
 *
 * @param {string} name                    The redux store to mock.
 * @param {object} schemaBlocksValidations Overrides default (invalid) schema blocks validation results.
 *
 * @returns {jest.Mock<{getPreferences: jest.Mock<unknown>, getResultsForFocusKeyword: jest.Mock<unknown>, getReadabilityResults: jest.Mock<unknown>,
 * getFocusKeyphrase: jest.Mock<unknown>}|{getBlocks: jest.Mock<unknown>}|{getSchemaBlocksValidationResults: jest.Mock<unknown>}>} The mock selectors.
 */
export function mockSelectors( name, schemaBlocksValidations = null ) {
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

	const yoastSEOSelectors = {
		getFocusKeyphrase,
		getResultsForFocusKeyword,
		getReadabilityResults,
		getPreferences,
	};

	const getSchemaBlocksValidationResults = jest.fn().mockReturnValue( schemaBlocksValidations || {
		"1234-abcde": {
			result: 1,
		},
	} );

	const schemaBlocksSelectors = {
		getSchemaBlocksValidationResults,
	};

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

	const coreBlockEditorSelectors = {
		getBlocks,
	};

	const select = jest.fn( storeName => {
		switch ( storeName ) {
			case "yoast-seo/editor" :
				return yoastSEOSelectors;
			case "core/block-editor" :
				return coreBlockEditorSelectors;
			case "yoast-seo/schema-blocks" :
				return schemaBlocksSelectors;
		}
	} );
	return select;
}
