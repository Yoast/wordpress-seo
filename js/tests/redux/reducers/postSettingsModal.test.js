import { setPostSettingsModalIsOpen } from "../../../src/redux/actions";
import postSettingsModal from "../../../src/redux/reducers/postSettingsModal";

describe( "postSettingsModal reducer", () => {
	it( "sets isOpen to true when the reducer is called with a setPostSettingsModalIsOpen action creator that is called with true", () => {
		const state = { isOpen: false };
		const expected = { isOpen: true };
		const action = setPostSettingsModalIsOpen( true );
		const actual = postSettingsModal( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "sets isOpen to false when the reducer is called with a setPostSettingsModalIsOpen action creator that is called with false", () => {
		const state = { isOpen: true };
		const expected = { isOpen: false };
		const action = setPostSettingsModalIsOpen( false );
		const actual = postSettingsModal( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "doesn't change the state when the postSettingsModal is called with a bogus action", () => {
		const state = { isOpen: true };
		const expected = { isOpen: true };
		const actual = postSettingsModal( state, { type: "BOGUS_ACTION" } );

		expect( actual ).toEqual( expected );
	} );
} );
