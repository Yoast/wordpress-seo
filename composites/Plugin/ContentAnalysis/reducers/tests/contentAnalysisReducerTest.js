import { UPDATE_SEO_RESULT, UPDATE_READABILITY_RESULT } from "../../actions/contentAnalysis";
import { contentAnalysisReducer} from "../../reducers/contentAnalysisReducer";
import { readabilityResultsReducer } from "../../reducers/contentAnalysis/readabilityResultsReducer";
import { keywordResultsReducer } from "../../reducers/contentAnalysis/keywordResultsReducer";


jest.mock( "../../reducers/contentAnalysis/readabilityResultsReducer", () => {
	return {
		readabilityResultsReducer: jest.fn( ( state = {} ) => {
			return { name: "readabilityResultsReducer" };
		} ),
	};
} );

jest.mock( "../../reducers/contentAnalysis/keywordResultsReducer", () => {
	return {
		keywordResultsReducer: jest.fn( ( state = {} ) => {
			return { name: "keywordResultsReducer" };
		} ),
	};
} );

test( "content analysis reducer", () => {
	const state = {};
	const action = {
		type: UPDATE_SEO_RESULT,
		keyword: "keyword",
		result: { score: "good result" },
	};
	const expected = { seo: { name: "keywordResultsReducer" }, readability: { name: "readabilityResultsReducer" } };

	const actual = contentAnalysisReducer( state, action );
	expect( actual ).toEqual( expected );
} );

test( "content analysis reducer", () => {
	const state = {};
	const action = {
		type: UPDATE_READABILITY_RESULT,
		result: { score: "good result" },
	};
	const expected = { readability: { name: "readabilityResultsReducer" }, seo: { name: "keywordResultsReducer" } };

	const actual = contentAnalysisReducer( state, action );
	expect( actual ).toEqual( expected );
} );
