import { SET_MARKER_PAUSE_STATUS, setMarkerPauseStatus } from "../../../src/redux/actions/markerPauseStatus";

describe( "markerPauseStatus actions", () => {
	it( "returns a SET_MARKER_PAUSE_STATUS action with isMarkerPaused: true when setMarkerPauseStatus is called with true", () => {
		const expected = {
			type: SET_MARKER_PAUSE_STATUS,
			isMarkerPaused: true,
		};
		const actual = setMarkerPauseStatus( true );

		expect( actual ).toEqual( expected );
	} );
	it( "returns a SET_MARKER_PAUSE_STATUS action with isMarkerPaused: false when setMarkerPauseStatus is called with false", () => {
		const expected = {
			type: SET_MARKER_PAUSE_STATUS,
			isMarkerPaused: false,
		};
		const actual = setMarkerPauseStatus( false );

		expect( actual ).toEqual( expected );
	} );
} );
