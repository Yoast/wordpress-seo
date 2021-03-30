/**
 * Setup the redux selectors
 * @param name (
 * @param schemaBlocksValidationresults Overrides default (invalid) schema blocks validation results
 * @returns The Mocked selectors
 */
export function MockSelectors(name, schemaBlocksValidationresults = null) {
    const getResultsForFocusKeyword = jest.fn().mockReturnValue({
        overallScore: 60,
    });

    const getReadabilityResults = jest.fn().mockReturnValue({
        overallScore: 100,
    });

    const getPreferences = jest.fn().mockReturnValue({
        isKeywordAnalysisActive: true,
        isContentAnalysisActive: true,
    });

	const getFocusKeyphrase = jest.fn().mockReturnValue( null );

    const getSchemaBlocksValidationResults = jest.fn().mockReturnValue(schemaBlocksValidationresults || {
        "1234-abcde": {
            result: 1,
        },
    });

    const yoastSEOSelectors = {
		getFocusKeyphrase,
        getResultsForFocusKeyword,
        getReadabilityResults,
        getPreferences,
    };

    const schemaBlocksSelectors = {
        getSchemaBlocksValidationResults,
    }

    const getBlocks = jest.fn().mockReturnValue([
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
    ]);

    const coreEditorSelectors = {
        getBlocks,
    };

    const select = jest.fn(name => {
        switch (name) {
            case "yoast-seo/editor" :
                return yoastSEOSelectors;
            case "core/editor" :
                return coreEditorSelectors;
            case "yoast-seo/schema-blocks" :
                return schemaBlocksSelectors;
        }
    });
    return select;
}
