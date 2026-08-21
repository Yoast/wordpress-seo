import { renderHook, act } from "@testing-library/react";
import apiFetch from "@wordpress/api-fetch";
import { useVariationImages } from "../../../src/product-image-alt/hooks/use-variations-images";

jest.mock( "@wordpress/api-fetch" );

const VARIATION_ID     = 30;
const VARIATION_IMG_ID = 31;

const INITIAL_STATE = [
	{
		variationId: VARIATION_ID,
		image: { id: VARIATION_IMG_ID, src: "https://example.com/v.jpg", alt: "PHP alt" },
	},
];

function setupVariationDOM() {
	document.body.innerHTML = `
		<div id="variable_product_options">
			<div class="woocommerce_variations">
				<div class="woocommerce_variation">
					<h3><input type="hidden" class="variable_post_id" value="${ VARIATION_ID }"></h3>
					<p class="form-row upload_image">
						<a href="#" class="upload_image_button">
							<img src="https://example.com/v.jpg" alt="DOM alt">
							<input type="hidden" class="upload_image_id" value="${ VARIATION_IMG_ID }">
						</a>
					</p>
				</div>
			</div>
		</div>
	`;
}

describe( "useVariationImages", () => {
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

	const rowObserver      = () => observerInstances[ 0 ];
	const ajaxHandler      = () =>
		jQueryDocOn.mock.calls.find( ( [ e ] ) => e === "ajaxSuccess" )?.[ 1 ];

	// -------------------------------------------------------------------------

	describe( "initial state from PHP data", () => {
		it( "uses initialState when the DOM has no variation rows", () => {
			apiFetch.mockReturnValue( new Promise( () => {} ) );

			const { result } = renderHook( () => useVariationImages( INITIAL_STATE ) );

			expect( result.current.variationImages ).toBe( INITIAL_STATE );
		} );

		it( "defaults to empty array when initialState is undefined", () => {
			apiFetch.mockReturnValue( new Promise( () => {} ) );

			const { result } = renderHook( () => useVariationImages( undefined ) );

			expect( result.current.variationImages ).toEqual( [] );
		} );

		it( "preserves initialState when DOM is empty (guard in refresh)", async() => {
			// No DOM variation rows → refresh returns early, keeping initialState.
			const { result } = renderHook( () => useVariationImages( INITIAL_STATE ) );
			await act( async() => {} );

			expect( result.current.variationImages ).toBe( INITIAL_STATE );
			expect( apiFetch ).not.toHaveBeenCalled();
		} );
	} );

	// -------------------------------------------------------------------------

	describe( "DOM-based state", () => {
		beforeEach( () => setupVariationDOM() );

		it( "reads variation images from the DOM when rows are present", async() => {
			const { result } = renderHook( () => useVariationImages( [] ) );
			await act( async() => {} );

			expect( result.current.variationImages ).toHaveLength( 1 );
			expect( result.current.variationImages[ 0 ].variationId ).toBe( VARIATION_ID );
			expect( result.current.variationImages[ 0 ].image.id ).toBe( VARIATION_IMG_ID );
		} );

		it( "applies REST alt text after fetch resolves", async() => {
			const { result } = renderHook( () => useVariationImages( [] ) );
			await act( async() => {} );

			expect( result.current.variationImages[ 0 ].image.alt ).toBe(
				`REST alt ${ VARIATION_IMG_ID }`
			);
			expect( result.current.isLoadingVariationImagesAlts ).toBe( false );
		} );

		it( "skips apiFetch when no variation has an image id", async() => {
			// Remove the image id input so imageId is null.
			document.querySelector( "input.upload_image_id" ).value = "";

			renderHook( () => useVariationImages( [] ) );
			await act( async() => {} );

			expect( apiFetch ).not.toHaveBeenCalled();
		} );
	} );

	// -------------------------------------------------------------------------

	describe( "refresh triggers", () => {
		beforeEach( () => setupVariationDOM() );

		it( "refreshes when the .woocommerce_variations MutationObserver fires", async() => {
			const { result } = renderHook( () => useVariationImages( [] ) );
			await act( async() => {} );

			// Clear the variation rows.
			document.querySelector( ".woocommerce_variations" ).innerHTML = "";

			await act( async() => rowObserver().callback( [] ) );

			// DOM now empty → refresh guard triggers, keeping previous DOM state.
			// (Returns early when domImages.length === 0.)
			expect( result.current.variationImages ).toHaveLength( 1 );
		} );

		it( "refreshes on woocommerce_load_variations AJAX success", async() => {
			renderHook( () => useVariationImages( [] ) );
			await act( async() => {} );

			apiFetch.mockClear();
			await act( async() =>
				ajaxHandler()( {}, {}, { data: "action=woocommerce_load_variations" } )
			);

			// DOM still has variation rows → fetch runs.
			expect( apiFetch ).toHaveBeenCalled();
		} );

		it( "does not refresh for unrelated AJAX actions", async() => {
			renderHook( () => useVariationImages( [] ) );
			await act( async() => {} );

			apiFetch.mockClear();
			await act( async() =>
				ajaxHandler()( {}, {}, { data: "action=heartbeat" } )
			);

			expect( apiFetch ).not.toHaveBeenCalled();
		} );

		it( "refreshes on jQuery change of input.upload_image_id", async() => {
			renderHook( () => useVariationImages( [] ) );
			await act( async() => {} );

			apiFetch.mockClear();

			const changeCall = jQueryOn.mock.calls.find( ( [ e ] ) => e === "change" );
			const changeHandler = changeCall?.[ 2 ];

			await act( async() => changeHandler?.() );

			expect( apiFetch ).toHaveBeenCalled();
		} );

		it( "skips the row observer when .woocommerce_variations is absent", async() => {
			// no variation DOM
			document.body.innerHTML = "";

			renderHook( () => useVariationImages( [] ) );
			await act( async() => {} );

			expect( observerInstances ).toHaveLength( 0 );
		} );
	} );

	// -------------------------------------------------------------------------

	describe( "cleanup on unmount", () => {
		beforeEach( () => setupVariationDOM() );

		it( "disconnects the row MutationObserver", async() => {
			const { unmount } = renderHook( () => useVariationImages( [] ) );
			await act( async() => {} );

			unmount();

			expect( rowObserver().disconnect ).toHaveBeenCalled();
		} );

		it( "removes jQuery document and container listeners", async() => {
			const { unmount } = renderHook( () => useVariationImages( [] ) );
			await act( async() => {} );

			unmount();

			expect( jQueryDocOff ).toHaveBeenCalledWith( "ajaxSuccess", expect.any( Function ) );
			expect( jQueryOff ).toHaveBeenCalledWith( "change", "input.upload_image_id" );
		} );

		it( "removes the wp.media attachment:save listener", async() => {
			const { unmount } = renderHook( () => useVariationImages( [] ) );
			await act( async() => {} );

			unmount();

			expect( window.wp.media.off ).toHaveBeenCalledWith( "attachment:save", expect.any( Function ) );
		} );
	} );
} );
