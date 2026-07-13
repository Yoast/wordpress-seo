import reducer, {
	commitSwitch,
	createInitialPendingSwitchState,
	pendingSwitchActions,
	pendingSwitchSelectors,
	requestSwitch,
} from "../../../src/bulk-editor/store/pending-switch";

describe( "pendingSwitch slice", () => {
	it( "defaults to no switch pending", () => {
		expect( createInitialPendingSwitchState() ).toBe( null );
	} );

	it( "holds and clears a deferred switch", () => {
		const held = reducer( null, pendingSwitchActions.setPendingSwitch( { kind: "contentType", target: "page" } ) );
		expect( held ).toEqual( { kind: "contentType", target: "page" } );

		expect( reducer( held, pendingSwitchActions.clearPendingSwitch() ) ).toBe( null );
	} );

	it( "selects the pending switch", () => {
		expect( pendingSwitchSelectors.selectPendingSwitch( { pendingSwitch: { kind: "fieldSet", target: "social" } } ) )
			.toEqual( { kind: "fieldSet", target: "social" } );
		expect( pendingSwitchSelectors.selectPendingSwitch( {} ) ).toBe( null );
	} );
} );

describe( "requestSwitch thunk", () => {
	const makeThunkArgs = ( { editingRows = {}, hasExternalPendingChanges = false, activeContentType = "", activeFieldSet = "search" } = {} ) => ( {
		select: {
			selectEditingRows: () => editingRows,
			selectHasExternalPendingChanges: () => hasExternalPendingChanges,
			selectActiveContentTypeName: () => activeContentType,
			selectActiveFieldSet: () => activeFieldSet,
		},
		dispatch: {
			setPendingSwitch: jest.fn(),
			commitSwitch: jest.fn(),
		},
	} );

	it( "commits immediately when nothing guards the switch", () => {
		const args = makeThunkArgs();
		requestSwitch( { kind: "contentType", target: "page" } )( args );

		expect( args.dispatch.commitSwitch ).toHaveBeenCalledWith( { kind: "contentType", target: "page" } );
		expect( args.dispatch.setPendingSwitch ).not.toHaveBeenCalled();
	} );

	it( "defers the switch while manual edits are in progress", () => {
		const args = makeThunkArgs( { editingRows: { 7: {} } } );
		requestSwitch( { kind: "fieldSet", target: "social" } )( args );

		expect( args.dispatch.setPendingSwitch ).toHaveBeenCalledWith( { kind: "fieldSet", target: "social" } );
		expect( args.dispatch.commitSwitch ).not.toHaveBeenCalled();
	} );

	it( "defers the switch while an external plugin reports pending changes", () => {
		const args = makeThunkArgs( { hasExternalPendingChanges: true } );
		requestSwitch( { kind: "contentType", target: "product" } )( args );

		expect( args.dispatch.setPendingSwitch ).toHaveBeenCalledWith( { kind: "contentType", target: "product" } );
	} );

	it( "ignores a switch to what is already active", () => {
		const args = makeThunkArgs( { activeContentType: "page", editingRows: { 7: {} } } );
		requestSwitch( { kind: "contentType", target: "page" } )( args );

		expect( args.dispatch.commitSwitch ).not.toHaveBeenCalled();
		expect( args.dispatch.setPendingSwitch ).not.toHaveBeenCalled();
	} );

	it( "commits a navigate switch straight away when nothing guards it", () => {
		const args = makeThunkArgs();
		requestSwitch( { kind: "navigate", target: "https://example.test/tools" } )( args );

		expect( args.dispatch.commitSwitch ).toHaveBeenCalledWith( { kind: "navigate", target: "https://example.test/tools" } );
		expect( args.dispatch.setPendingSwitch ).not.toHaveBeenCalled();
	} );

	it( "defers a navigate switch while manual edits are in progress", () => {
		const args = makeThunkArgs( { editingRows: { 7: {} } } );
		requestSwitch( { kind: "navigate", target: "https://example.test/tools" } )( args );

		expect( args.dispatch.setPendingSwitch ).toHaveBeenCalledWith( { kind: "navigate", target: "https://example.test/tools" } );
		expect( args.dispatch.commitSwitch ).not.toHaveBeenCalled();
	} );

	it( "defers a navigate switch while an external plugin reports pending changes", () => {
		const args = makeThunkArgs( { hasExternalPendingChanges: true } );
		requestSwitch( { kind: "navigate", target: "https://example.test/tools" } )( args );

		expect( args.dispatch.setPendingSwitch ).toHaveBeenCalledWith( { kind: "navigate", target: "https://example.test/tools" } );
		expect( args.dispatch.commitSwitch ).not.toHaveBeenCalled();
	} );
} );

describe( "commitSwitch thunk", () => {
	const makeDispatch = () => ( {
		setActiveContentType: jest.fn(),
		setActiveFieldSet: jest.fn(),
		deselectAll: jest.fn(),
		stopEdit: jest.fn(),
		clearPendingSwitch: jest.fn(),
	} );

	it( "changes the field set and clears the pending switch for a field-set switch", () => {
		const dispatch = makeDispatch();
		commitSwitch( { kind: "fieldSet", target: "social" } )( { dispatch } );

		expect( dispatch.setActiveFieldSet ).toHaveBeenCalledWith( "social" );
		expect( dispatch.setActiveContentType ).not.toHaveBeenCalled();
		expect( dispatch.deselectAll ).not.toHaveBeenCalled();
		expect( dispatch.clearPendingSwitch ).toHaveBeenCalled();
	} );

	it( "changes the content type and clears the edits, delegating the selection reset to setActiveContentType", () => {
		const dispatch = makeDispatch();
		commitSwitch( { kind: "contentType", target: "page" } )( { dispatch } );

		expect( dispatch.setActiveContentType ).toHaveBeenCalledWith( "page" );
		expect( dispatch.stopEdit ).toHaveBeenCalled();
		// The selection slice resets on setActiveContentType, so commitSwitch does not deselect separately.
		expect( dispatch.deselectAll ).not.toHaveBeenCalled();
		expect( dispatch.clearPendingSwitch ).toHaveBeenCalled();
	} );

	it( "navigates to the target URL for a navigate switch, leaving view state untouched", () => {
		const dispatch = makeDispatch();
		const original = window.location;
		delete window.location;
		window.location = { href: "" };

		commitSwitch( { kind: "navigate", target: "https://example.test/tools" } )( { dispatch } );

		expect( window.location.href ).toBe( "https://example.test/tools" );
		expect( dispatch.setActiveContentType ).not.toHaveBeenCalled();
		expect( dispatch.setActiveFieldSet ).not.toHaveBeenCalled();
		expect( dispatch.stopEdit ).not.toHaveBeenCalled();
		// The page unloads, so there is no pending switch to clear.
		expect( dispatch.clearPendingSwitch ).not.toHaveBeenCalled();

		window.location = original;
	} );
} );
