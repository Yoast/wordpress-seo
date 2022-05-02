import { dispatch, select } from "@wordpress/data";
import { initPostWatcher } from "../../src/classic-editor/watcher";

jest.mock( "@wordpress/data" );

/**
 * Mock debounce, instead of using fake timers
 * because of this bug https://github.com/facebook/jest/issues/3465
 */
jest.mock( "lodash", () => ( {
	...jest.requireActual( "lodash" ),
	debounce: jest.fn( fn => fn ),
} ) );

jest.mock( "@yoast/seo-integration", () => {
	return {
		SEO_STORE_NAME: "@yoast/seo",
	};
} );

describe( "Initializing the post watcher", () => {
	it(
		"adds an event listener to the post title that updates the post title in the store when its value changes.",
		() => {
			// Create a document with an input element for the post title.
			const titleElement = document.createElement( "input" );
			titleElement.setAttribute( "id", "title" );
			titleElement.setAttribute( "value", "A new title." );

			document.body.append( titleElement );

			const updateTitle = jest.fn();
			dispatch.mockReturnValue( { updateTitle } );

			select.mockReturnValue( {
				selectSlug: jest.fn(),
			} );

			initPostWatcher();

			/*
			 * Simulate a user entering a new title by manually dispatching
			 * an `input` event on the title element.
			 */
			const event = new Event( "input", {
				bubbles: true,
				cancelable: true,
			} );

			titleElement.dispatchEvent( event );

			expect( updateTitle ).toBeCalledWith( "A new title." );
		} );
} );
