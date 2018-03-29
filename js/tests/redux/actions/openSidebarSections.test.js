/* global describe, it, expect */

import * as actions from "../../../src/redux/actions/openSidebarSections";

describe( "openSidebarSections actions", () => {
	it( "should pass along the id when opening a section", () => {
		const expected = {
			type: actions.OPEN_SIDEBAR_SECTION,
			addSection: "sectionOpened",
		};
		const actual = actions.openSidebarSection( "sectionOpened" );

		expect( actual ).toEqual( expected );
	} );

	it( "should pass along the keyword when closing a section", () => {
		const expected = {
			type: actions.CLOSE_SIDEBAR_SECTION,
			removeSection: "sectionClosed",
		};
		const actual = actions.closeSidebarSection( "sectionClosed" );

		expect( actual ).toEqual( expected );
	} );

	it( "should pass nothing but the type in the action object when closing all sections", () => {
		const expected = {
			type: actions.CLOSE_ALL_SIDEBAR_SECTIONS,
		};
		const actual = actions.closeAllSidebarSections();

		expect( actual ).toEqual( expected );
	} );
} );
