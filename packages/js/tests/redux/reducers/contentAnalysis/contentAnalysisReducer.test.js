import contentAnalysisReducer from "../../../../src/redux/reducers/contentAnalysis";

jest.mock( "../../../../src/redux/reducers/contentAnalysis/keywordResultsReducer", () => {
	return {
		keywordResultsReducer: jest.fn( () => {
			return { name: "keywordResultsReducer" };
		} ),
	};
} );

jest.mock( "../../../../src/redux/reducers/contentAnalysis/readabilityResultsReducer", () => {
	return {
		readabilityResultsReducer: jest.fn( () => {
			return { name: "readabilityResultsReducer" };
		} ),
	};
} );

jest.mock( "../../../../src/redux/reducers/contentAnalysis/inclusiveLanguageResultsReducer", () => {
	return {
		inclusiveLanguageResultsReducer: jest.fn( () => {
			return { name: "inclusiveLanguageResultsReducer" };
		} ),
	};
} );

it( "contains the keyword, readability and inclusive language reducers", () => {
	const expected = {
		seo: { name: "keywordResultsReducer" },
		readability: { name: "readabilityResultsReducer" },
		inclusiveLanguage: { name: "inclusiveLanguageResultsReducer" },
	};

	const actual = contentAnalysisReducer( {}, {} );
	expect( actual ).toEqual( expected );
} );
