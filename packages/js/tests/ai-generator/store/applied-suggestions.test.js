import {
	appliedSuggestionsReducer,
	appliedSuggestionsActions,
	appliedSuggestionsSelectors,
	getInitialAppliedSuggestionsState,
	APPLIED_SUGGESTIONS_NAME,
} from "../../../src/ai-generator/store/applied-suggestions.js";

describe( "appliedSuggestionsReducer", () => {
	it( "should return the initial state", () => {
		expect( appliedSuggestionsReducer( undefined, {} ) ).toEqual( getInitialAppliedSuggestionsState() );
	} );

	it( "should handle addAppliedSuggestion", () => {
		const initialState = {};
		const payload = {
			editType: "edit1",
			previewType: "preview1",
			suggestion: "suggestion1",
		};
		const expectedState = {
			preview1: {
				edit1: "suggestion1",
			},
		};
		expect( appliedSuggestionsReducer( initialState, appliedSuggestionsActions.addAppliedSuggestion( payload ) ) ).toEqual( expectedState );
	} );
} );

describe( "appliedSuggestionsSelectors", () => {
	const mockState = {
		[ APPLIED_SUGGESTIONS_NAME ]: {
			preview1: {
				edit1: "suggestion1",
			},
		},
	};

	it( "should select all applied suggestions", () => {
		expect( appliedSuggestionsSelectors.selectAppliedSuggestions( mockState ) ).toEqual( mockState[ APPLIED_SUGGESTIONS_NAME ] );
	} );

	it( "should select specific applied suggestion", () => {
		const scope = {
			editType: "edit1",
			previewType: "preview1",
		};
		expect( appliedSuggestionsSelectors.selectAppliedSuggestionFor( mockState, scope ) ).toEqual( "suggestion1" );
	} );

	it( "should return empty string if suggestion not found", () => {
		const scope = {
			editType: "edit2",
			previewType: "preview2",
		};
		expect( appliedSuggestionsSelectors.selectAppliedSuggestionFor( mockState, scope ) ).toEqual( "" );
	} );
} );

