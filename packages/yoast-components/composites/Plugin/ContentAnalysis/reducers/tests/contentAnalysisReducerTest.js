import { UPDATE_SEO_RESULT } from "../../actions/contentAnalysis";
import contentAnalysisReducer from "../../reducers/contentAnalysisReducer";

jest.mock( "../../reducers/contentAnalysis/readabilityResultsReducer", () => {
	return {
		readabilityResultsReducer: jest.fn( () => {
			return { name: "readabilityResultsReducer" };
		} ),
	};
} );

jest.mock( "../../reducers/contentAnalysis/keywordResultsReducer", () => {
	return {
		keywordResultsReducer: jest.fn( () => {
			return { name: "keywordResultsReducer" };
		} ),
	};
} );

test( "content analysis reducer with the UPDATE_SEO_RESULT action", () => {
	const state = {};
	const action = {
		type: UPDATE_SEO_RESULT,
	};
	const expected = { seo: { name: "keywordResultsReducer" }, readability: { name: "readabilityResultsReducer" } };

	const actual = contentAnalysisReducer( state, action );
	expect( actual ).toEqual( expected );
} );
