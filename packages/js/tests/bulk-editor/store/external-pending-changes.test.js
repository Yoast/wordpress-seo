import reducer, {
	createInitialExternalPendingChangesState,
	externalPendingChangesActions,
	externalPendingChangesSelectors,
} from "../../../src/bulk-editor/store/external-pending-changes";

describe( "external-pending-changes slice", () => {
	it( "defaults to no pending changes", () => {
		expect( createInitialExternalPendingChangesState() ).toBe( false );
	} );

	it( "updates the state via setHasExternalPendingChanges", () => {
		expect( reducer( false, externalPendingChangesActions.setHasExternalPendingChanges( true ) ) ).toBe( true );
	} );

	it( "coerces the payload to a boolean", () => {
		expect( reducer( true, externalPendingChangesActions.setHasExternalPendingChanges( 0 ) ) ).toBe( false );
	} );

	it( "selects the pending state from the store state", () => {
		expect( externalPendingChangesSelectors.selectHasExternalPendingChanges( { externalPendingChanges: true } ) ).toBe( true );
	} );

	it( "falls back to false when the state is missing", () => {
		expect( externalPendingChangesSelectors.selectHasExternalPendingChanges( {} ) ).toBe( false );
	} );
} );
