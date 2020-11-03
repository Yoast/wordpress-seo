import { MODAL_OPEN, MODAL_DISMISS, MODAL_OPEN_NO_KEYPHRASE,
	setSEMrushOpenModal, setSEMrushDismissModal, setSEMrushNoKeyphraseMessage } from "../../../src/redux/actions/SEMrushModal";

describe( "SEMrushModal actions", () => {
	it( "returns a MODAL_OPEN action with location: sidebar when setSEMrushOpenModal is called with sidebar", () => {
		const expected =  {
			type: MODAL_OPEN,
			location: "sidebar",
		};
		const actual = setSEMrushOpenModal( "sidebar" );

		expect( actual ).toEqual( expected );
	} );
	it( "returns a MODAL_OPEN action with location: metabox when setSEMrushOpenModal is called with metabox", () => {
		const expected =  {
			type: MODAL_OPEN,
			location: "metabox",
		};
		const actual = setSEMrushOpenModal( "metabox" );

		expect( actual ).toEqual( expected );
	} );
	it( "returns a MODAL_OPEN action with location: none when setSEMrushOpenModal is called with none", () => {
		const expected =  {
			type: MODAL_OPEN,
			location: "none",
		};
		const actual = setSEMrushOpenModal( "none" );

		expect( actual ).toEqual( expected );
	} );
	it( "setSEMrushDismissModal should return an action with the MODAL_DISMISS type", () => {
		const expected = {
			type: MODAL_DISMISS,
		};
		const actual = setSEMrushDismissModal();

		expect( actual ).toEqual( expected );
	} );
	it( "setSEMrushNoKeyphraseMessage should return an action with the MODAL_OPEN_NO_KEYPHRASE type", () => {
		const expected = {
			type: MODAL_OPEN_NO_KEYPHRASE,
		};
		const actual = setSEMrushNoKeyphraseMessage();

		expect( actual ).toEqual( expected );
	} );
} );
