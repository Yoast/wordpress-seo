import { getPostSettingsModalIsOpen } from "../../../src/redux/selectors";

describe( "getPostSettingsModalIsOpen selector", () => {
	it( "returns postSettingsModal's isOpen state", () => {
		const state = {
			postSettingsModal: {
				isOpen: false,
			},
		};

		expect( getPostSettingsModalIsOpen( state ) ).toEqual( false );
	} );
} );
