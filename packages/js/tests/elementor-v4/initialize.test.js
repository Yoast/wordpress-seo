import { describe, expect, it, jest } from "@jest/globals";

// Capture the UI-hook callbacks the entry registers, and the dependencies it calls, so the test
// can drive the attach-preview hook in isolation. jest.mock factories may not reference `jest`, so
// the mock functions are declared here (the `mock` prefix lets the lazily-called factories use them).
const mockHooks = {};
const mockHandleEditorChange = jest.fn();
const mockDebouncedHandleEditorChange = jest.fn();
const mockResetMarks = jest.fn();
const mockGetWidgetMap = jest.fn();

jest.mock( "../../src/elementor/helpers/hooks", () => ( {
	registerElementorUIHookAfter: ( id, key, callback ) => {
		mockHooks[ id ] = callback;
	},
	registerElementorUIHookBefore: () => {},
} ) );
jest.mock( "../../src/elementor/helpers/is-form-id", () => ( {
	isFormId: () => true,
	isFormIdEqualToDocumentId: () => true,
} ) );
jest.mock( "../../src/elementor-v4/change-handler", () => ( {
	handleEditorChange: mockHandleEditorChange,
	debouncedHandleEditorChange: mockDebouncedHandleEditorChange,
} ) );
jest.mock( "../../src/elementor-v4/marks", () => ( {
	resetMarks: mockResetMarks,
	getWidgetMap: mockGetWidgetMap,
} ) );

describe( "elementor-v4 initialize — first-load content observer", () => {
	it( "observes the preview DOM and triggers extraction on attach-preview", () => {
		const previewElement = document.createElement( "div" );
		const elementorMock = {
			documents: { getCurrent: () => ( { $element: { get: () => previewElement } } ) },
			channels: { editor: { on: jest.fn(), off: jest.fn() } },
			settings: { page: { model: { on: jest.fn(), off: jest.fn() } } },
			// Invoke the panel:init handler synchronously so initialization runs during require().
			on: ( event, callback ) => {
				if ( event === "panel:init" ) {
					callback();
				}
			},
		};
		global.elementor = elementorMock;
		global.window.elementor = elementorMock;
		// Invoke the elementor:init handler synchronously.
		global.jQuery = () => ( {
			on: ( event, callback ) => {
				if ( event === "elementor:init" ) {
					callback();
				}
			},
		} );

		const observeSpy = jest.spyOn( MutationObserver.prototype, "observe" );
		jest.useFakeTimers();

		// Importing the entry wires the elementor:init → panel:init → setTimeout chain.
		require( "../../src/elementor-v4/initialize" );
		jest.runOnlyPendingTimers();

		// The attach-preview hook is where the observer is started.
		expect( typeof mockHooks[ "editor/documents/attach-preview" ] ).toBe( "function" );
		mockHooks[ "editor/documents/attach-preview" ]();

		// The fix: a MutationObserver watches the preview so the first render is picked up...
		expect( observeSpy ).toHaveBeenCalledWith(
			previewElement,
			expect.objectContaining( { childList: true, subtree: true } )
		);
		// ...and an extraction is kicked off.
		expect( mockDebouncedHandleEditorChange ).toHaveBeenCalled();

		observeSpy.mockRestore();
		jest.useRealTimers();
	} );
} );
