/* global describe, it, expect */

import { openSidebarSection, closeSidebarSection, closeAllSidebarSections } from "../../../src/redux/actions/openSidebarSections";
import openSidebarSectionsReducer from "../../../src/redux/reducers/openSidebarSections";

describe( "openSidebarSections reducers", () => {
	describe( "openSidebarSection", () => {
		it( "should add the to be opened section to the openSidebarSections array", () => {
			const state = [];
			const action = openSidebarSection( "openThisSection" );
			const expected = [ "openThisSection" ];
			const actual = openSidebarSectionsReducer( state, action );

			expect( actual ).toEqual( expected );
		} );

		it( "should not add a section that is already open to the openSidebarSections array", () => {
			const state = [ "alreadyOpen", "alsoOpen" ];
			const action = openSidebarSection( "alreadyOpen" );
			const expected = [ "alreadyOpen", "alsoOpen" ];
			const actual = openSidebarSectionsReducer( state, action );

			expect( actual ).toEqual( expected );
		} );

		it( "should not add the section to the array if the passed argument is not a string", () => {
			const state = [ "alreadyOpen", "alsoOpen" ];
			const action = openSidebarSection( 1234 );
			const expected = [ "alreadyOpen", "alsoOpen" ];
			const actual = openSidebarSectionsReducer( state, action );

			expect( actual ).toEqual( expected );
		} );
	} );

	describe( "closeSidebarSection", () => {
		it( "should remove the to be closed section from the openSidebarSections array", () => {
			const state = [ "alreadyOpen", "alsoOpen" ];
			const action = closeSidebarSection( "alsoOpen" );
			const expected = [ "alreadyOpen" ];
			const actual = openSidebarSectionsReducer( state, action );

			expect( actual ).toEqual( expected );
		} );

		it( "should not change the array when closing a section that was already closed", () => {
			const state = [ "alreadyOpen", "alsoOpen" ];
			const action = closeSidebarSection( "fictionalSection" );
			const expected = [ "alreadyOpen", "alsoOpen" ];
			const actual = openSidebarSectionsReducer( state, action );

			expect( actual ).toEqual( expected );
		} );
	} );

	describe( "closeAllSidebarSections", () => {
		it( "should empty the openSidebarSections array", () => {
			const state = [ "alreadyOpen", "alsoOpen" ];
			const action = closeAllSidebarSections();
			const expected = [];
			const actual = openSidebarSectionsReducer( state, action );

			expect( actual ).toEqual( expected );
		} );
	} );
} );
