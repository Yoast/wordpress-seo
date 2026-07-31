import { describe, expect, it } from "@jest/globals";
import {
	MODAL_NAME,
	modalActions,
	modalReducer,
	modalSelectors,
	getInitialModalState,
} from "../../../src/ai-content-planner/store/modal";
import { FEATURE_MODAL_STATUS } from "../../../src/ai-content-planner/constants";
import { ASYNC_ACTION_NAMES } from "../../../src/shared-admin/constants";
import { FETCH_CONTENT_OUTLINE_ACTION_NAME } from "../../../src/ai-content-planner/store/content-outline";
import { FETCH_CONTENT_SUGGESTIONS_ACTION_NAME } from "../../../src/ai-content-planner/store/content-suggestions";

describe( "modal store", () => {
	describe( "getInitialModalState", () => {
		it( "should return the initial state", () => {
			expect( getInitialModalState() ).toEqual( {
				isOpen: false,
				featureModalStatus: null,
			} );
		} );
	} );

	describe( "reducer", () => {
		it( "should return the initial state for an unknown action", () => {
			expect( modalReducer( undefined, { type: "@@INIT" } ) ).toEqual( {
				isOpen: false,
				featureModalStatus: null,
			} );
		} );

		it( "should reset to initial state on closeModal", () => {
			const state = { isOpen: true, featureModalStatus: FEATURE_MODAL_STATUS.contentSuggestions };
			expect( modalReducer( state, modalActions.closeModal() ) ).toEqual( {
				isOpen: false,
				featureModalStatus: null,
			} );
		} );

		it( "should set featureModalStatus on setFeatureModalStatus", () => {
			const result = modalReducer(
				getInitialModalState(),
				modalActions.setFeatureModalStatus( FEATURE_MODAL_STATUS.consent )
			);
			expect( result.featureModalStatus ).toBe( FEATURE_MODAL_STATUS.consent );
		} );

		it( "should set featureModalStatus to contentOutline when fetchContentOutline/request is dispatched", () => {
			const result = modalReducer(
				getInitialModalState(),
				{ type: `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }` }
			);
			expect( result.featureModalStatus ).toBe( FEATURE_MODAL_STATUS.contentOutline );
		} );

		it( "should set featureModalStatus to contentSuggestions when fetchContentPlannerSuggestions/request is dispatched", () => {
			const result = modalReducer(
				getInitialModalState(),
				{ type: `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }` }
			);
			expect( result.featureModalStatus ).toBe( FEATURE_MODAL_STATUS.contentSuggestions );
		} );
	} );

	describe( "selectors", () => {
		it( "should return featureModalStatus from state", () => {
			const state = { [ MODAL_NAME ]: { isOpen: true, featureModalStatus: FEATURE_MODAL_STATUS.contentOutline } };
			expect( modalSelectors.selectFeatureModalStatus( state ) ).toBe( FEATURE_MODAL_STATUS.contentOutline );
		} );

		it( "should return the default featureModalStatus when state is missing", () => {
			expect( modalSelectors.selectFeatureModalStatus( {} ) ).toBeNull();
		} );

		it( "should return null when featureModalStatus is null", () => {
			const state = { [ MODAL_NAME ]: { isOpen: false, featureModalStatus: null } };
			expect( modalSelectors.selectFeatureModalStatus( state ) ).toBeNull();
		} );
	} );
} );
