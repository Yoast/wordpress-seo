import { dispatch, select } from "@wordpress/data";
import { initPostWatcher } from "../../src/classic-editor/watcher";

jest.mock( "@wordpress/data" );

jest.mock( "@yoast/seo-integration", () => {
	return {
		SEO_STORE_NAME: "@yoast/seo",
	};
} );

describe( "Initializing the post watcher", () => {
	it(
		"adds an event listener to the post title that updates the post title in the store when its value changes.",
		() => {
			// The code uses `debounce` which has a time component, so make sure to use fake timers.
			jest.useFakeTimers();
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

			// Fast-forward, run all time delayed functions (e.g. trigger the debounce immediately).
			jest.runAllTimers();

			expect( updateTitle ).toBeCalledWith( "A new title." );

			// Make sure we re-instate the default timer behaviors after the test.
			jest.useRealTimers();
		} );
} );
