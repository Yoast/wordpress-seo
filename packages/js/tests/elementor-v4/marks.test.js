import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockSetActiveMarker = jest.fn();
const mockSetMarkerPauseStatus = jest.fn();
const mockApplyMarks = jest.fn();

jest.mock( "@wordpress/data", () => ( {
	dispatch: () => ( {
		setActiveMarker: mockSetActiveMarker,
		setMarkerPauseStatus: mockSetMarkerPauseStatus,
	} ),
} ) );

jest.mock( "yoastseo", () => ( {
	Paper: class {
		/**
		 * @param {string} text The paper text.
		 * @param {Object} attributes The paper attributes.
		 */
		constructor( text, attributes ) {
			this.text = text;
			this.attributes = attributes;
		}
	},
} ) );

global.YoastSEO = { analysis: { applyMarks: mockApplyMarks } };

import { resetMarks } from "../../src/elementor-v4/marks";

describe( "resetMarks", () => {
	beforeEach( () => jest.clearAllMocks() );

	it( "sets the active marker to null", () => {
		resetMarks();
		expect( mockSetActiveMarker ).toHaveBeenCalledWith( null );
	} );

	it( "unpauses the marker status", () => {
		resetMarks();
		expect( mockSetMarkerPauseStatus ).toHaveBeenCalledWith( false );
	} );

	it( "calls applyMarks with an empty Paper and empty marks array", () => {
		resetMarks();
		expect( mockApplyMarks ).toHaveBeenCalledTimes( 1 );
		const [ , marks ] = mockApplyMarks.mock.calls[ 0 ];
		expect( marks ).toEqual( [] );
	} );
} );
