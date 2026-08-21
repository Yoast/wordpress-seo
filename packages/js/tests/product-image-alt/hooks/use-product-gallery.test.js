import { renderHook, act } from "@testing-library/react";
import apiFetch from "@wordpress/api-fetch";
import { useProductGallery } from "../../../src/product-image-alt/hooks/use-product-gallery";

jest.mock( "@wordpress/api-fetch" );

const GALLERY_ID_1 = 20;
const GALLERY_ID_2 = 21;

const setupDOM = ( { items = [] } = {} ) => {
	const listItems = items.map(
		( { id, src = "https://example.com/g.jpg", alt = "" } ) =>
			`<li class="image" data-attachment_id="${ id }"><img src="${ src }" alt="${ alt }"></li>`
	).join( "" );

	document.body.innerHTML = `
		<div id="product_images_container">
			<ul class="product_images">${ listItems }</ul>
		</div>
	`;
};

describe( "useProductGallery", () => {
	const observerInstances = [];
	let jQueryOn;
	let jQueryOff;
	let jQueryDocOn;
	let jQueryDocOff;

	beforeEach( () => {
		observerInstances.length = 0;

		global.MutationObserver = jest.fn().mockImplementation( ( callback ) => {
			const instance = { callback, observe: jest.fn(), disconnect: jest.fn() };
			observerInstances.push( instance );
			return instance;
		} );

		setupDOM( {
			items: [
				{ id: GALLERY_ID_1, alt: "Gallery alt 1" },
				{ id: GALLERY_ID_2, alt: "" },
			],
		} );

		jQueryOn  = jest.fn();
		jQueryOff = jest.fn();
		const $container = { on: jQueryOn, off: jQueryOff };

		jQueryDocOn  = jest.fn();
		jQueryDocOff = jest.fn();
		const $doc = { on: jQueryDocOn, off: jQueryDocOff };

		window.jQuery = jest.fn().mockImplementation( ( sel ) =>
			sel === document ? $doc : $container
		);

		window.wp = { media: { on: jest.fn(), off: jest.fn() } };

		apiFetch.mockImplementation( ( { path } ) => {
			const [ , id ] = path.match( /\/(\d+)\?/ ) ?? [];
			// eslint-disable-next-line camelcase
			return Promise.resolve( { id: Number( id ), alt_text: `REST alt ${ id }` } );
		} );
	} );

	afterEach( () => {
		jest.clearAllMocks();
		document.body.innerHTML = "";
	} );

	const galleryObserver  = () => observerInstances[ 0 ];
	const galleryUpdateHandler = () =>
		jQueryOn.mock.calls.find( ( [ e ] ) => e === "woocommerce_gallery_update" )?.[ 1 ];
	const ajaxHandler      = () =>
		jQueryDocOn.mock.calls.find( ( [ e ] ) => e === "ajaxSuccess" )?.[ 1 ];

	// -------------------------------------------------------------------------

	describe( "initial state", () => {
		it( "reads gallery images from the DOM immediately", () => {
			apiFetch.mockReturnValue( new Promise( () => {} ) );

			const { result } = renderHook( () => useProductGallery() );

			expect( result.current.galleryImages ).toHaveLength( 2 );
			expect( result.current.galleryImages[ 0 ].id ).toBe( GALLERY_ID_1 );
			expect( result.current.galleryImages[ 1 ].id ).toBe( GALLERY_ID_2 );
		} );

		it( "reads gallery image IDs via data-attachment_id (underscore)", () => {
			apiFetch.mockReturnValue( new Promise( () => {} ) );

			const { result } = renderHook( () => useProductGallery() );

			expect( result.current.galleryImages[ 0 ].id ).toBe( GALLERY_ID_1 );
		} );

		it( "returns an empty array when gallery is empty", () => {
			setupDOM();
			apiFetch.mockReturnValue( new Promise( () => {} ) );

			const { result } = renderHook( () => useProductGallery() );

			expect( result.current.galleryImages ).toHaveLength( 0 );
		} );

		it( "sets isLoadingProductGalleryAlts true while fetching", () => {
			apiFetch.mockReturnValue( new Promise( () => {} ) );

			const { result } = renderHook( () => useProductGallery() );

			expect( result.current.isLoadingProductGalleryAlts ).toBe( true );
		} );
	} );

	// -------------------------------------------------------------------------

	describe( "REST alt text fetch", () => {
		it( "applies REST alt text after fetch resolves", async() => {
			const { result } = renderHook( () => useProductGallery() );
			await act( async() => {} );

			expect( result.current.galleryImages[ 0 ].alt ).toBe( `REST alt ${ GALLERY_ID_1 }` );
			expect( result.current.galleryImages[ 1 ].alt ).toBe( `REST alt ${ GALLERY_ID_2 }` );
			expect( result.current.isLoadingProductGalleryAlts ).toBe( false );
		} );

		it( "skips apiFetch when gallery has no valid ids", async() => {
			setupDOM( { items: [ { id: null } ] } );

			renderHook( () => useProductGallery() );
			await act( async() => {} );

			expect( apiFetch ).not.toHaveBeenCalled();
		} );
	} );

	// -------------------------------------------------------------------------

	describe( "refresh triggers", () => {
		it( "re-reads DOM when the gallery MutationObserver fires", async() => {
			const { result } = renderHook( () => useProductGallery() );
			await act( async() => {} );

			// Remove one gallery item.
			document.querySelector( ".product_images" ).innerHTML =
				`<li class="image" data-attachment_id="${ GALLERY_ID_1 }"><img src="" alt=""></li>`;

			await act( async() => galleryObserver().callback( [] ) );

			expect( result.current.galleryImages ).toHaveLength( 1 );
		} );

		it( "re-reads DOM on woocommerce_gallery_update", async() => {
			const { result } = renderHook( () => useProductGallery() );
			await act( async() => {} );

			document.querySelector( ".product_images" ).innerHTML = "";
			await act( async() => galleryUpdateHandler()() );

			expect( result.current.galleryImages ).toHaveLength( 0 );
		} );

		it( "refreshes on save-attachment AJAX success", async() => {
			renderHook( () => useProductGallery() );
			await act( async() => {} );

			apiFetch.mockClear();
			await act( async() => ajaxHandler()( {}, {}, { data: "action=save-attachment&id=20" } ) );

			expect( apiFetch ).toHaveBeenCalled();
		} );

		it( "does not refresh for unrelated AJAX actions", async() => {
			renderHook( () => useProductGallery() );
			await act( async() => {} );

			apiFetch.mockClear();
			await act( async() => ajaxHandler()( {}, {}, { data: "action=heartbeat" } ) );

			expect( apiFetch ).not.toHaveBeenCalled();
		} );

		it( "skips gallery observer when .product_images is absent", async() => {
			document.querySelector( ".product_images" ).remove();

			renderHook( () => useProductGallery() );
			await act( async() => {} );

			expect( observerInstances ).toHaveLength( 0 );
		} );
	} );

	// -------------------------------------------------------------------------

	describe( "cleanup on unmount", () => {
		it( "disconnects the gallery MutationObserver", async() => {
			const { unmount } = renderHook( () => useProductGallery() );
			await act( async() => {} );

			unmount();

			expect( galleryObserver().disconnect ).toHaveBeenCalled();
		} );

		it( "removes jQuery gallery and document event listeners", async() => {
			const { unmount } = renderHook( () => useProductGallery() );
			await act( async() => {} );

			unmount();

			expect( jQueryOff ).toHaveBeenCalledWith( "woocommerce_gallery_update", expect.any( Function ) );
			expect( jQueryDocOff ).toHaveBeenCalledWith( "ajaxSuccess", expect.any( Function ) );
		} );

		it( "removes the wp.media attachment:save listener", async() => {
			const { unmount } = renderHook( () => useProductGallery() );
			await act( async() => {} );

			unmount();

			expect( window.wp.media.off ).toHaveBeenCalledWith( "attachment:save", expect.any( Function ) );
		} );
	} );
} );
