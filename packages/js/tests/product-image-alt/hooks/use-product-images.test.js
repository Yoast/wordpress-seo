import { renderHook, act } from "@testing-library/react";
import apiFetch from "@wordpress/api-fetch";
import { useVariationImages } from "../../../src/product-image-alt/hooks/use-variations-images";
import { useProductImages } from "../../../src/product-image-alt/hooks/use-product-images";

jest.mock( "@wordpress/api-fetch" );
jest.mock( "../../../src/product-image-alt/hooks/use-variations-images" );

const FEATURED_ID  = 10;
const GALLERY_ID_1 = 20;
const GALLERY_ID_2 = 21;

const STUB_VARIATION_IMAGES = [
	{ variationId: 30, image: { id: 31, src: "https://example.com/variation.jpg", alt: "Variation alt" } },
];

/**
 * Renders the classic WooCommerce product editor DOM into document.body.
 *
 * @param {object} [options]
 * @param {number} [options.thumbnailId=FEATURED_ID] The value of the hidden _thumbnail_id input.
 */
function setupDOM( { thumbnailId = FEATURED_ID } = {} ) {
	document.body.innerHTML = `
		<input type="hidden" id="_thumbnail_id" value="${ thumbnailId }">
		<div id="set-post-thumbnail">
			${ thumbnailId > 0 ? `<img src="https://example.com/thumb.jpg" alt="Featured DOM alt">` : "" }
		</div>
		<div id="product_images_container">
			<ul class="product_images">
				<li class="image" data-attachment_id="${ GALLERY_ID_1 }">
					<img src="https://example.com/g1.jpg" alt="Gallery DOM alt 1">
				</li>
				<li class="image" data-attachment_id="${ GALLERY_ID_2 }">
					<img src="https://example.com/g2.jpg" alt="">
				</li>
			</ul>
		</div>
	`;
}

describe( "useProductImages", () => {
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

		setupDOM();

		jQueryOn  = jest.fn();
		jQueryOff = jest.fn();
		const $container = { on: jQueryOn, off: jQueryOff };

		jQueryDocOn  = jest.fn();
		jQueryDocOff = jest.fn();
		const $doc = { on: jQueryDocOn, off: jQueryDocOff };

		window.jQuery = jest.fn().mockImplementation(
			( sel ) => ( sel === document ? $doc : $container )
		);

		window.wp = { media: { on: jest.fn(), off: jest.fn() } };

		useVariationImages.mockReturnValue( {
			variationImages: STUB_VARIATION_IMAGES,
			isLoadingAlts: false,
		} );

		apiFetch.mockImplementation( ( { path } ) => {
			const [ , id ] = path.match( /\/(\d+)\?/ ) ?? [];
			return Promise.resolve( { id: Number( id ), alt_text: `REST alt ${ id }` } );
		} );
	} );

	afterEach( () => {
		jest.clearAllMocks();
		document.body.innerHTML = "";
	} );

	// --- Helpers to retrieve event handlers registered during mount ---

	// Observer creation order mirrors the useEffect setup order:
	// 0 = gallery, 1 = thumbnail.
	const galleryObserver      = () => observerInstances[ 0 ];
	const thumbnailObserver    = () => observerInstances[ 1 ];
	const galleryUpdateHandler = () =>
		jQueryOn.mock.calls.find( ( [ e ] ) => e === "woocommerce_gallery_update" )?.[ 1 ];
	const ajaxSuccessHandler   = () =>
		jQueryDocOn.mock.calls.find( ( [ e ] ) => e === "ajaxSuccess" )?.[ 1 ];

	// -------------------------------------------------------------------------

	describe( "initial state", () => {
		beforeEach( () => {
			// Never-resolving fetch keeps the hook in its intermediate DOM-only state.
			apiFetch.mockReturnValue( new Promise( () => {} ) );
		} );

		it( "exposes the featured image from the DOM immediately", () => {
			const { result } = renderHook( () => useProductImages() );

			expect( result.current.featuredImage ).toEqual( {
				id: FEATURED_ID,
				src: "https://example.com/thumb.jpg",
				alt: "Featured DOM alt",
			} );
		} );

		it( "exposes gallery images from the DOM immediately", () => {
			const { result } = renderHook( () => useProductImages() );

			expect( result.current.galleryImages ).toEqual( [
				{ id: GALLERY_ID_1, src: "https://example.com/g1.jpg", alt: "Gallery DOM alt 1" },
				{ id: GALLERY_ID_2, src: "https://example.com/g2.jpg", alt: "" },
			] );
		} );

		it( "reads gallery image IDs via data-attachment_id (underscore, not camelCase)", () => {
			const { result } = renderHook( () => useProductImages() );

			expect( result.current.galleryImages[ 0 ].id ).toBe( GALLERY_ID_1 );
			expect( result.current.galleryImages[ 1 ].id ).toBe( GALLERY_ID_2 );
		} );

		it( "returns variationImages from useVariationImages", () => {
			const { result } = renderHook( () => useProductImages() );

			expect( result.current.variationImages ).toBe( STUB_VARIATION_IMAGES );
		} );

		it( "returns null featuredImage when _thumbnail_id is 0", () => {
			setupDOM( { thumbnailId: 0 } );

			const { result } = renderHook( () => useProductImages() );

			expect( result.current.featuredImage ).toBeNull();
		} );

		it( "returns null featuredImage when _thumbnail_id is -1", () => {
			setupDOM( { thumbnailId: -1 } );

			const { result } = renderHook( () => useProductImages() );

			expect( result.current.featuredImage ).toBeNull();
		} );

		it( "sets isLoadingAlts true while the REST fetch is in flight", () => {
			const { result } = renderHook( () => useProductImages() );

			expect( result.current.isLoadingAlts ).toBe( true );
		} );

		it( "sets isLoadingAlts true when useVariationImages is loading", () => {
			apiFetch.mockResolvedValue( {} ); // resolves immediately
			useVariationImages.mockReturnValue( { variationImages: [], isLoadingAlts: true } );

			const { result } = renderHook( () => useProductImages() );

			expect( result.current.isLoadingAlts ).toBe( true );
		} );
	} );

	// -------------------------------------------------------------------------

	describe( "REST alt text fetch", () => {
		it( "fetches alt text for the featured image and gallery images only", async() => {
			renderHook( () => useProductImages() );

			await act( async() => {} );

			expect( apiFetch ).toHaveBeenCalledWith( { path: `/wp/v2/media/${ FEATURED_ID }?_fields=id,alt_text` } );
			expect( apiFetch ).toHaveBeenCalledWith( { path: `/wp/v2/media/${ GALLERY_ID_1 }?_fields=id,alt_text` } );
			expect( apiFetch ).toHaveBeenCalledWith( { path: `/wp/v2/media/${ GALLERY_ID_2 }?_fields=id,alt_text` } );
			expect( apiFetch ).toHaveBeenCalledTimes( 3 );
		} );

		it( "applies REST alt text to featured and gallery images after the fetch resolves", async() => {
			const { result } = renderHook( () => useProductImages() );

			await act( async() => {} );

			expect( result.current.featuredImage.alt ).toBe( `REST alt ${ FEATURED_ID }` );
			expect( result.current.galleryImages[ 0 ].alt ).toBe( `REST alt ${ GALLERY_ID_1 }` );
			expect( result.current.galleryImages[ 1 ].alt ).toBe( `REST alt ${ GALLERY_ID_2 }` );
		} );

		it( "clears isLoadingAlts after the fetch completes", async() => {
			const { result } = renderHook( () => useProductImages() );

			await act( async() => {} );

			expect( result.current.isLoadingAlts ).toBe( false );
		} );

		it( "skips apiFetch when there are no featured or gallery images", async() => {
			document.body.innerHTML = `
				<input type="hidden" id="_thumbnail_id" value="0">
				<div id="set-post-thumbnail"></div>
				<div id="product_images_container">
					<ul class="product_images"></ul>
				</div>
			`;

			renderHook( () => useProductImages() );

			await act( async() => {} );

			expect( apiFetch ).not.toHaveBeenCalled();
		} );
	} );

	// -------------------------------------------------------------------------

	describe( "refresh triggers", () => {
		it( "re-reads the DOM when the gallery MutationObserver fires", async() => {
			const { result } = renderHook( () => useProductImages() );
			await act( async() => {} );

			document.querySelector( ".product_images" ).innerHTML = `
				<li class="image" data-attachment_id="${ GALLERY_ID_1 }">
					<img src="https://example.com/g1.jpg" alt="Gallery DOM alt 1">
				</li>
			`;

			await act( async() => galleryObserver().callback( [] ) );

			expect( result.current.galleryImages ).toHaveLength( 1 );
		} );

		it( "re-reads the DOM when set-post-thumbnail is clicked", async() => {
			const { result } = renderHook( () => useProductImages() );
			await act( async() => {} );

			document.getElementById( "_thumbnail_id" ).value = "0";
			document.getElementById( "set-post-thumbnail" ).innerHTML = "";

			await act( async() => document.getElementById( "set-post-thumbnail" ).click() );

			expect( result.current.featuredImage ).toBeNull();
		} );

		it( "re-reads the DOM when the thumbnail MutationObserver fires", async() => {
			const { result } = renderHook( () => useProductImages() );
			await act( async() => {} );

			document.getElementById( "_thumbnail_id" ).value = "0";
			document.getElementById( "set-post-thumbnail" ).innerHTML = "";

			await act( async() => thumbnailObserver().callback( [] ) );

			expect( result.current.featuredImage ).toBeNull();
		} );

		it( "re-reads the DOM on woocommerce_gallery_update", async() => {
			const { result } = renderHook( () => useProductImages() );
			await act( async() => {} );

			document.querySelector( ".product_images" ).innerHTML = "";

			await act( async() => galleryUpdateHandler()() );

			expect( result.current.galleryImages ).toHaveLength( 0 );
		} );

		it.each( [
			[ "save-attachment",        "action=save-attachment&id=20" ],
			[ "save-attachment-compat", "action=save-attachment-compat&id=20&nonce=abc" ],
			[ "set-post-thumbnail",     "action=set-post-thumbnail&thumbnail_id=10" ],
		] )( "triggers a refresh on %s AJAX success", async( _name, data ) => {
			renderHook( () => useProductImages() );
			await act( async() => {} );

			apiFetch.mockClear();

			await act( async() => ajaxSuccessHandler()( {}, {}, { data } ) );

			expect( apiFetch ).toHaveBeenCalled();
		} );

		it( "ignores AJAX actions unrelated to attachment or thumbnail", async() => {
			renderHook( () => useProductImages() );
			await act( async() => {} );

			apiFetch.mockClear();

			await act( async() =>
				ajaxSuccessHandler()( {}, {}, { data: "action=query-attachments&query[post_type]=attachment" } )
			);

			expect( apiFetch ).not.toHaveBeenCalled();
		} );
	} );

	// -------------------------------------------------------------------------

	describe( "optional DOM elements", () => {
		it( "skips the gallery MutationObserver when the gallery container is absent", async() => {
			document.querySelector( ".product_images" ).remove();

			renderHook( () => useProductImages() );
			await act( async() => {} );

			// Only the thumbnail observer is created.
			expect( observerInstances ).toHaveLength( 1 );
		} );

		it( "skips the thumbnail observer and click listener when set-post-thumbnail is absent", async() => {
			document.getElementById( "set-post-thumbnail" ).remove();

			renderHook( () => useProductImages() );
			await act( async() => {} );

			// Only the gallery observer is created.
			expect( observerInstances ).toHaveLength( 1 );
		} );
	} );

	// -------------------------------------------------------------------------

	describe( "cleanup on unmount", () => {
		it( "disconnects all MutationObservers", async() => {
			const { unmount } = renderHook( () => useProductImages() );
			await act( async() => {} );

			unmount();

			observerInstances.forEach( ( o ) => expect( o.disconnect ).toHaveBeenCalled() );
		} );

		it( "removes jQuery gallery and document event listeners", async() => {
			const { unmount } = renderHook( () => useProductImages() );
			await act( async() => {} );

			unmount();

			expect( jQueryOff ).toHaveBeenCalledWith( "woocommerce_gallery_update", expect.any( Function ) );
			expect( jQueryDocOff ).toHaveBeenCalledWith( "ajaxSuccess", expect.any( Function ) );
		} );

		it( "removes the wp.media attachment:save listener", async() => {
			const { unmount } = renderHook( () => useProductImages() );
			await act( async() => {} );

			unmount();

			expect( window.wp.media.off ).toHaveBeenCalledWith( "attachment:save", expect.any( Function ) );
		} );

		it( "removes the thumbnail click listener", async() => {
			const { unmount } = renderHook( () => useProductImages() );
			await act( async() => {} );

			unmount();

			// After unmount, a click should not trigger another REST fetch.
			apiFetch.mockClear();
			document.getElementById( "set-post-thumbnail" ).click();
			await act( async() => {} );

			expect( apiFetch ).not.toHaveBeenCalled();
		} );
	} );
} );
