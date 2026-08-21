import { renderHook, act } from "@testing-library/react";
import apiFetch from "@wordpress/api-fetch";
import { useProductImage } from "../../../src/product-image-alt/hooks/use-product-image";

jest.mock( "@wordpress/api-fetch" );

const IMG_ID  = 10;
const IMG_SRC = "https://example.com/thumb.jpg";

const setupDOM = ( { withImage = false, alt = "" } = {} ) => {
	document.body.innerHTML = `
		<div id="postimagediv" class="postbox">
			<div class="inside">
				<a id="set-post-thumbnail" class="thickbox">
					${ withImage ? `<img src="${ IMG_SRC }" alt="${ alt }">` : "Set product image" }
				</a>
			</div>
		</div>
		<input type="hidden" id="_thumbnail_id" value="${ withImage ? IMG_ID : -1 }">
	`;
};

describe( "useProductImage", () => {
	const observerInstances = [];
	let jQueryDocOn;
	let jQueryDocOff;

	beforeEach( () => {
		jest.useFakeTimers();
		observerInstances.length = 0;

		global.MutationObserver = jest.fn().mockImplementation( ( callback ) => {
			const instance = { callback, observe: jest.fn(), disconnect: jest.fn() };
			observerInstances.push( instance );
			return instance;
		} );

		setupDOM();

		jQueryDocOn  = jest.fn();
		jQueryDocOff = jest.fn();
		const $doc = { on: jQueryDocOn, off: jQueryDocOff };
		window.jQuery = jest.fn().mockReturnValue( $doc );

		window.wp = { media: { on: jest.fn(), off: jest.fn() } };

		apiFetch.mockImplementation( ( { path } ) => {
			const [ , id ] = path.match( /\/(\d+)\?/ ) ?? [];
			// eslint-disable-next-line camelcase
			return Promise.resolve( { id: Number( id ), alt_text: `REST alt ${ id }` } );
		} );
	} );

	afterEach( () => {
		jest.clearAllMocks();
		jest.useRealTimers();
		document.body.innerHTML = "";
	} );

	// Helpers to access specific observers by target.
	const bodyObserver   = () => observerInstances.find( o => o.observe.mock.calls[ 0 ]?.[ 0 ] === document.body );
	const insideObserver = () => observerInstances.find( o => o !== bodyObserver() );
	const ajaxHandler    = () => jQueryDocOn.mock.calls.find( ( [ e ] ) => e === "ajaxSuccess" )?.[ 1 ];

	// -------------------------------------------------------------------------

	describe( "initial state", () => {
		it( "returns null featuredImage when no image is set", () => {
			apiFetch.mockReturnValue( new Promise( () => {} ) );

			const { result } = renderHook( () => useProductImage() );

			expect( result.current.featuredImage ).toBeNull();
		} );

		it( "reads featuredImage from the DOM when an image is set at page load", () => {
			setupDOM( { withImage: true, alt: "Page-load alt" } );
			apiFetch.mockReturnValue( new Promise( () => {} ) );

			const { result } = renderHook( () => useProductImage() );

			expect( result.current.featuredImage ).toEqual( {
				id: IMG_ID,
				src: IMG_SRC,
				alt: "Page-load alt",
			} );
		} );

		it( "sets isLoadingFeaturedImageAlt true while REST fetch is in flight", () => {
			setupDOM( { withImage: true } );
			apiFetch.mockReturnValue( new Promise( () => {} ) );

			const { result } = renderHook( () => useProductImage() );

			expect( result.current.isLoadingFeaturedImageAlt ).toBe( true );
		} );
	} );

	// -------------------------------------------------------------------------

	describe( "REST alt text fetch", () => {
		it( "applies REST alt text after fetch resolves", async() => {
			setupDOM( { withImage: true, alt: "" } );

			const { result } = renderHook( () => useProductImage() );
			await act( async() => {} );

			expect( result.current.featuredImage.alt ).toBe( `REST alt ${ IMG_ID }` );
			expect( result.current.isLoadingFeaturedImageAlt ).toBe( false );
		} );

		it( "skips apiFetch when no image is set", async() => {
			renderHook( () => useProductImage() );
			await act( async() => {} );

			expect( apiFetch ).not.toHaveBeenCalled();
		} );

		it( "skips apiFetch when id is null (timing race)", async() => {
			// img present but _thumbnail_id still -1
			setupDOM( { withImage: true } );
			document.getElementById( "_thumbnail_id" ).value = "-1";

			renderHook( () => useProductImage() );
			await act( async() => {} );

			expect( apiFetch ).not.toHaveBeenCalled();
		} );
	} );

	// -------------------------------------------------------------------------

	describe( "thickbox close detection", () => {
		it( "refreshes when #TB_overlay is removed from document.body", async() => {
			setupDOM( { withImage: true, alt: "" } );

			const { result } = renderHook( () => useProductImage() );
			await act( async() => {} );

			// Simulate thickbox closing.
			const tbOverlay = { id: "TB_overlay" };
			await act( async() => {
				bodyObserver().callback( [ { removedNodes: [ tbOverlay ] } ] );
				jest.runAllTimers();
				// advance setTimeout(refresh, 0)
			} );

			expect( result.current.featuredImage ).not.toBeNull();
		} );

		it( "refreshes when #TB_window is removed from document.body", async() => {
			setupDOM( { withImage: true, alt: "" } );

			const { result } = renderHook( () => useProductImage() );
			await act( async() => {} );

			const tbWindow = { id: "TB_window" };
			await act( async() => {
				bodyObserver().callback( [ { removedNodes: [ tbWindow ] } ] );
				jest.runAllTimers();
			} );

			expect( result.current.featuredImage ).not.toBeNull();
		} );

		it( "ignores removal of non-thickbox elements", async() => {
			const { result } = renderHook( () => useProductImage() );
			await act( async() => {} );

			const someDiv = { id: "some-div" };
			await act( async() => {
				bodyObserver().callback( [ { removedNodes: [ someDiv ] } ] );
				jest.runAllTimers();
			} );

			// featuredImage stays null since no #set-post-thumbnail img exists.
			expect( result.current.featuredImage ).toBeNull();
		} );
	} );

	// -------------------------------------------------------------------------

	describe( ".inside MutationObserver", () => {
		it( "refreshes when the .inside subtree changes", async() => {
			const { result } = renderHook( () => useProductImage() );
			await act( async() => {} );

			// Add an image to the DOM to simulate the product image being set.
			document.querySelector( "#set-post-thumbnail" ).innerHTML =
				`<img src="${ IMG_SRC }" alt="">`;
			document.getElementById( "_thumbnail_id" ).value = String( IMG_ID );

			await act( async() => insideObserver().callback( [] ) );

			expect( result.current.featuredImage ).toMatchObject( { id: IMG_ID } );
		} );

		it( "refreshes to null when the img is removed", async() => {
			setupDOM( { withImage: true, alt: "" } );

			const { result } = renderHook( () => useProductImage() );
			await act( async() => {} );

			// Remove the image.
			document.querySelector( "#set-post-thumbnail" ).innerHTML = "Set product image";
			document.getElementById( "_thumbnail_id" ).value = "-1";

			await act( async() => insideObserver().callback( [] ) );

			expect( result.current.featuredImage ).toBeNull();
		} );
	} );

	// -------------------------------------------------------------------------

	describe( "AJAX success listener", () => {
		it( "refreshes on save-attachment AJAX success", async() => {
			setupDOM( { withImage: true, alt: "" } );
			renderHook( () => useProductImage() );
			await act( async() => {} );

			apiFetch.mockClear();
			await act( async() => ajaxHandler()( {}, {}, { data: "action=save-attachment&id=10" } ) );

			expect( apiFetch ).toHaveBeenCalled();
		} );

		it( "does not refresh for unrelated AJAX actions", async() => {
			renderHook( () => useProductImage() );
			await act( async() => {} );

			apiFetch.mockClear();
			await act( async() => ajaxHandler()( {}, {}, { data: "action=heartbeat" } ) );

			expect( apiFetch ).not.toHaveBeenCalled();
		} );
	} );

	// -------------------------------------------------------------------------

	describe( "cleanup on unmount", () => {
		it( "disconnects both MutationObservers", async() => {
			const { unmount } = renderHook( () => useProductImage() );
			await act( async() => {} );

			unmount();

			observerInstances.forEach( ( o ) => expect( o.disconnect ).toHaveBeenCalled() );
		} );

		it( "removes the jQuery ajaxSuccess listener", async() => {
			const { unmount } = renderHook( () => useProductImage() );
			await act( async() => {} );

			unmount();

			expect( jQueryDocOff ).toHaveBeenCalledWith( "ajaxSuccess", expect.any( Function ) );
		} );

		it( "removes the wp.media attachment:save listener", async() => {
			const { unmount } = renderHook( () => useProductImage() );
			await act( async() => {} );

			unmount();

			expect( window.wp.media.off ).toHaveBeenCalledWith( "attachment:save", expect.any( Function ) );
		} );
	} );
} );
