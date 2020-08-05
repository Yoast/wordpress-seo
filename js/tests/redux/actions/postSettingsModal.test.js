import { SET_POST_SETTINGS_MODAL_IS_OPEN, setPostSettingsModalIsOpen } from "../../../src/redux/actions";

describe( "postSettingsModal actions", () => {
	it( "returns a SET_POST_SETTINGS_MODAL_IS_OPEN action with isOpen: true when setPostSettingsModalIsOpen is called with true", () => {
		const expected = {
			type: SET_POST_SETTINGS_MODAL_IS_OPEN,
			isOpen: true,
		};
		const actual = setPostSettingsModalIsOpen( true );

		expect( actual ).toEqual( expected );
	} );

	it( "returns a SET_POST_SETTINGS_MODAL_IS_OPEN action with isOpen: false when setPostSettingsModalIsOpen is called with false", () => {
		const expected = {
			type: SET_POST_SETTINGS_MODAL_IS_OPEN,
			isOpen: false,
		};
		const actual = setPostSettingsModalIsOpen( false );

		expect( actual ).toEqual( expected );
	} );
} );
