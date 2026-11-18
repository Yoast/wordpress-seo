import { handleBannerKeyNavigation } from "../../../src/ai-content-planner/helpers/handle-banner-tab-navigation";

const mockFindNext = jest.fn();
const mockFindPrevious = jest.fn();

jest.mock( "@wordpress/dom", () => ( {
	focus: {
		tabbable: {
			findNext: ( ...args ) => mockFindNext( ...args ),
			findPrevious: ( ...args ) => mockFindPrevious( ...args ),
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
	key: "Tab",
	shiftKey: false,
	target: document.createElement( "button" ),
	preventDefault: jest.fn(),
	...overrides,
} );

describe( "handleBannerKeyNavigation", () => {
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
		mockFindPrevious.mockReset();
	} );

	afterEach( () => {
		document.body.innerHTML = "";
	} );

	describe( "early returns", () => {
		it( "does nothing when event.defaultPrevented is true", () => {
			const event = makeEvent( { defaultPrevented: true } );
			handleBannerKeyNavigation( bannerEl, event );
			expect( mockFindNext ).not.toHaveBeenCalled();
			expect( event.preventDefault ).not.toHaveBeenCalled();
		} );

		it( "does nothing for non-Tab, non-Arrow keys", () => {
			const event = makeEvent( { key: "Enter" } );
			handleBannerKeyNavigation( bannerEl, event );
			expect( mockFindNext ).not.toHaveBeenCalled();
			expect( event.preventDefault ).not.toHaveBeenCalled();
		} );

		it( "does nothing when bannerEl is null", () => {
			const event = makeEvent();
			handleBannerKeyNavigation( null, event );
			expect( mockFindNext ).not.toHaveBeenCalled();
			expect( event.preventDefault ).not.toHaveBeenCalled();
		} );

		it( "does nothing when there is no next tabbable element", () => {
			mockFindNext.mockReturnValue( null );
			const event = makeEvent( { target: outsideButton } );
			handleBannerKeyNavigation( bannerEl, event );
			expect( event.preventDefault ).not.toHaveBeenCalled();
		} );

		it( "does nothing when there is no previous tabbable element (Shift+Tab)", () => {
			mockFindPrevious.mockReturnValue( null );
			const event = makeEvent( { shiftKey: true, target: outsideButton } );
			handleBannerKeyNavigation( bannerEl, event );
			expect( event.preventDefault ).not.toHaveBeenCalled();
		} );
	} );

	describe( "Tab into banner", () => {
		it( "focuses the first banner button and prevents default when tabbing forward from outside", () => {
			mockFindNext.mockReturnValue( insideButton );
			const focusSpy = jest.spyOn( insideButton, "focus" );
			const event = makeEvent( { target: outsideButton } );

			handleBannerKeyNavigation( bannerEl, event );

			expect( event.preventDefault ).toHaveBeenCalledTimes( 1 );
			expect( focusSpy ).toHaveBeenCalledTimes( 1 );
		} );

		it( "focuses the last banner button and prevents default when shift-tabbing backward from outside", () => {
			mockFindPrevious.mockReturnValue( insideButton );
			const focusSpy = jest.spyOn( insideButton, "focus" );
			const event = makeEvent( { shiftKey: true, target: outsideButton } );

			handleBannerKeyNavigation( bannerEl, event );

			expect( event.preventDefault ).toHaveBeenCalledTimes( 1 );
			expect( focusSpy ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	describe( "Tab out of banner", () => {
		it( "focuses the next element outside and prevents default when tabbing forward from the last button", () => {
			mockFindNext.mockReturnValue( outsideButton );
			const focusSpy = jest.spyOn( outsideButton, "focus" );
			const event = makeEvent( { target: insideButton } );

			handleBannerKeyNavigation( bannerEl, event );

			expect( event.preventDefault ).toHaveBeenCalledTimes( 1 );
			expect( focusSpy ).toHaveBeenCalledTimes( 1 );
		} );

		it( "focuses the previous element outside and prevents default when shift-tabbing from the first button", () => {
			mockFindPrevious.mockReturnValue( outsideButton );
			const focusSpy = jest.spyOn( outsideButton, "focus" );
			const event = makeEvent( { shiftKey: true, target: insideButton } );

			handleBannerKeyNavigation( bannerEl, event );

			expect( event.preventDefault ).toHaveBeenCalledTimes( 1 );
			expect( focusSpy ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	describe( "Tab within banner", () => {
		it( "intercepts and moves focus when both current and next tabbable are inside the banner", () => {
			const secondInsideButton = document.createElement( "button" );
			bannerEl.appendChild( secondInsideButton );
			mockFindNext.mockReturnValue( secondInsideButton );
			const focusSpy = jest.spyOn( secondInsideButton, "focus" );
			const event = makeEvent( { target: insideButton } );

			handleBannerKeyNavigation( bannerEl, event );

			expect( event.preventDefault ).toHaveBeenCalledTimes( 1 );
			expect( focusSpy ).toHaveBeenCalledTimes( 1 );
		} );

		it( "intercepts and moves focus when both current and previous tabbable are inside the banner (Shift+Tab)", () => {
			const secondInsideButton = document.createElement( "button" );
			bannerEl.appendChild( secondInsideButton );
			mockFindPrevious.mockReturnValue( insideButton );
			const focusSpy = jest.spyOn( insideButton, "focus" );
			const event = makeEvent( { shiftKey: true, target: secondInsideButton } );

			handleBannerKeyNavigation( bannerEl, event );

			expect( event.preventDefault ).toHaveBeenCalledTimes( 1 );
			expect( focusSpy ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	describe( "Tab outside banner entirely", () => {
		it( "does not intercept when both current and next tabbable are outside the banner", () => {
			const anotherOutsideButton = document.createElement( "button" );
			document.body.appendChild( anotherOutsideButton );
			mockFindNext.mockReturnValue( anotherOutsideButton );
			const focusSpy = jest.spyOn( anotherOutsideButton, "focus" );
			const event = makeEvent( { target: outsideButton } );

			handleBannerKeyNavigation( bannerEl, event );

			expect( event.preventDefault ).not.toHaveBeenCalled();
			expect( focusSpy ).not.toHaveBeenCalled();
		} );

		it( "does not intercept when both current and previous tabbable are outside the banner (Shift+Tab)", () => {
			const anotherOutsideButton = document.createElement( "button" );
			document.body.appendChild( anotherOutsideButton );
			mockFindPrevious.mockReturnValue( anotherOutsideButton );
			const focusSpy = jest.spyOn( anotherOutsideButton, "focus" );
			const event = makeEvent( { shiftKey: true, target: outsideButton } );

			handleBannerKeyNavigation( bannerEl, event );

			expect( event.preventDefault ).not.toHaveBeenCalled();
			expect( focusSpy ).not.toHaveBeenCalled();
		} );
	} );

	describe( "ArrowDown / ArrowUp in dropdown menu", () => {
		let menuEl;

		beforeEach( () => {
			menuEl = document.createElement( "ul" );
			menuEl.setAttribute( "role", "menu" );
			bannerEl.appendChild( menuEl );
		} );

		it( "prevents default on ArrowDown when focus is on the menu element itself", () => {
			const event = makeEvent( { key: "ArrowDown", target: menuEl } );
			handleBannerKeyNavigation( bannerEl, event );
			expect( event.preventDefault ).toHaveBeenCalledTimes( 1 );
		} );

		it( "prevents default on ArrowDown when focus is inside the menu", () => {
			const menuItem = document.createElement( "li" );
			menuEl.appendChild( menuItem );
			const event = makeEvent( { key: "ArrowDown", target: menuItem } );
			handleBannerKeyNavigation( bannerEl, event );
			expect( event.preventDefault ).toHaveBeenCalledTimes( 1 );
		} );

		it( "prevents default on ArrowUp when focus is inside the menu", () => {
			const menuItem = document.createElement( "li" );
			menuEl.appendChild( menuItem );
			const event = makeEvent( { key: "ArrowUp", target: menuItem } );
			handleBannerKeyNavigation( bannerEl, event );
			expect( event.preventDefault ).toHaveBeenCalledTimes( 1 );
		} );

		it( "does not prevent default on ArrowDown when focus is outside the menu", () => {
			const event = makeEvent( { key: "ArrowDown", target: outsideButton } );
			handleBannerKeyNavigation( bannerEl, event );
			expect( event.preventDefault ).not.toHaveBeenCalled();
		} );

		it( "does not prevent default on ArrowDown when the banner has no menu", () => {
			bannerEl.removeChild( menuEl );
			const event = makeEvent( { key: "ArrowDown", target: insideButton } );
			handleBannerKeyNavigation( bannerEl, event );
			expect( event.preventDefault ).not.toHaveBeenCalled();
		} );
	} );
} );
