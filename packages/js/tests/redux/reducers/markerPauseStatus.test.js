import { setMarkerPauseStatus } from "../../../src/redux/actions/markerPauseStatus";
import markerPauseStatusReducer from "../../../src/redux/reducers/markerPauseStatus";

describe( "markerPauseStatus reducer", () => {
	it( "sets isMarkerPaused to true when the reducer is called with a setMarkerPauseStatus action creator that is called with true", () => {
		const state = false;
		const action = setMarkerPauseStatus( true );
		const expected = true;
		const actual = markerPauseStatusReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "sets isMarkerPaused to false when the reducer is called with a setMarkerPauseStatus action creator that is called with false", () => {
		const state = true;
		const action = setMarkerPauseStatus( false );
		const expected = false;
		const actual = markerPauseStatusReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "doesn't change the state when the markerPauseStatus is called with a bogus action", () => {
		const state = true;
		const expected = true;
		const actual = markerPauseStatusReducer( state, { type: "BOGUS_ACTION" } );

		expect( actual ).toEqual( expected );
	} );
} );
