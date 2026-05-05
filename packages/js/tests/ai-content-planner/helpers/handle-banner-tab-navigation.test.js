import { handleBannerTabNavigation } from "../../../src/ai-content-planner/helpers/handle-banner-tab-navigation";

const mockFindNext = jest.fn();

jest.mock( "@wordpress/dom", () => ( {
	focus: {
		tabbable: {
			findNext: ( ...args ) => mockFindNext( ...args ),
		},
	},
} ) );

/**
 * Creates a minimal keydown event mock.
 * @param {object} overrides Properties to override on the default Tab event.
 * @returns {object} The event mock.
 */
const makeEvent = ( overrides = {} ) => ( {
	defaultPrevented: false,
	keyCode: 9,
	shiftKey: false,
	target: document.createElement( "button" ),
	preventDefault: jest.fn(),
	...overrides,
} );

describe( "handleBannerTabNavigation", () => {
	let bannerEl;
	let insideButton;
	let outsideButton;

	beforeEach( () => {
		bannerEl = document.createElement( "div" );
		insideButton = document.createElement( "button" );
		outsideButton = document.createElement( "button" );

		bannerEl.appendChild( insideButton );
		document.body.appendChild( bannerEl );
		document.body.appendChild( outsideButton );

		mockFindNext.mockReset();
	} );

	afterEach( () => {
		document.body.innerHTML = "";
	} );

	describe( "early returns", () => {
		it( "does nothing when event.defaultPrevented is true", () => {
			const event = makeEvent( { defaultPrevented: true } );
			handleBannerTabNavigation( bannerEl, event );
			expect( mockFindNext ).not.toHaveBeenCalled();
			expect( event.preventDefault ).not.toHaveBeenCalled();
		} );

		it( "does nothing for non-Tab keys", () => {
			const event = makeEvent( { keyCode: 13 } );
			handleBannerTabNavigation( bannerEl, event );
			expect( mockFindNext ).not.toHaveBeenCalled();
			expect( event.preventDefault ).not.toHaveBeenCalled();
		} );

		it( "does nothing for Shift+Tab", () => {
			const event = makeEvent( { shiftKey: true } );
			handleBannerTabNavigation( bannerEl, event );
			expect( mockFindNext ).not.toHaveBeenCalled();
			expect( event.preventDefault ).not.toHaveBeenCalled();
		} );

		it( "does nothing when bannerEl is null", () => {
			const event = makeEvent();
			handleBannerTabNavigation( null, event );
			expect( mockFindNext ).not.toHaveBeenCalled();
			expect( event.preventDefault ).not.toHaveBeenCalled();
		} );

		it( "does nothing when there is no next tabbable element", () => {
			mockFindNext.mockReturnValue( null );
			const event = makeEvent( { target: outsideButton } );
			handleBannerTabNavigation( bannerEl, event );
			expect( event.preventDefault ).not.toHaveBeenCalled();
		} );
	} );

	describe( "Tab into banner", () => {
		it( "focuses the first banner button and prevents default when tabbing from outside", () => {
			mockFindNext.mockReturnValue( insideButton );
			const focusSpy = jest.spyOn( insideButton, "focus" );
			const event = makeEvent( { target: outsideButton } );

			handleBannerTabNavigation( bannerEl, event );

			expect( event.preventDefault ).toHaveBeenCalledTimes( 1 );
			expect( focusSpy ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	describe( "Tab out of banner", () => {
		it( "focuses the next element outside the banner and prevents default when tabbing from the last button", () => {
			mockFindNext.mockReturnValue( outsideButton );
			const focusSpy = jest.spyOn( outsideButton, "focus" );
			const event = makeEvent( { target: insideButton } );

			handleBannerTabNavigation( bannerEl, event );

			expect( event.preventDefault ).toHaveBeenCalledTimes( 1 );
			expect( focusSpy ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	describe( "Tab within banner", () => {
		it( "does not intercept when both current and next tabbable are inside the banner", () => {
			const secondInsideButton = document.createElement( "button" );
			bannerEl.appendChild( secondInsideButton );
			mockFindNext.mockReturnValue( secondInsideButton );
			const focusSpy = jest.spyOn( secondInsideButton, "focus" );
			const event = makeEvent( { target: insideButton } );

			handleBannerTabNavigation( bannerEl, event );

			expect( event.preventDefault ).not.toHaveBeenCalled();
			expect( focusSpy ).not.toHaveBeenCalled();
		} );
	} );

	describe( "Tab outside banner entirely", () => {
		it( "does not intercept when both current and next tabbable are outside the banner", () => {
			const anotherOutsideButton = document.createElement( "button" );
			document.body.appendChild( anotherOutsideButton );
			mockFindNext.mockReturnValue( anotherOutsideButton );
			const focusSpy = jest.spyOn( anotherOutsideButton, "focus" );
			const event = makeEvent( { target: outsideButton } );

			handleBannerTabNavigation( bannerEl, event );

			expect( event.preventDefault ).not.toHaveBeenCalled();
			expect( focusSpy ).not.toHaveBeenCalled();
		} );
	} );
} );
