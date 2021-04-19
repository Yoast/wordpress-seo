import { setSEMrushOpenModal, setSEMrushDismissModal, setSEMrushNoKeyphraseMessage } from "../../../src/redux/actions/SEMrushModal";
import modalReducerSEMrush from "../../../src/redux/reducers/SEMrushModal";

describe( "SEMrushModalReducer", () => {
	it( "sets whichModalOpen to sidebar when the reducer is called with a setSEMrushOpenModal action creator that is called with sidebar", () => {
		const state = {
			whichModalOpen: "none",
			displayNoKeyphraseMessage: false,
		};

		const action = setSEMrushOpenModal( "sidebar" );

		const expected = {
			whichModalOpen: "sidebar",
			displayNoKeyphraseMessage: false,
		};
		const actual = modalReducerSEMrush( state, action );

		expect( actual ).toEqual( expected );
	} );
	it( "sets whichModalOpen to none when the reducer is called with a setSEMrushDismissModal action creator that is called with none", () => {
		const state = {
			whichModalOpen: "sidebar",
			displayNoKeyphraseMessage: false,
		};

		const action = setSEMrushDismissModal( "none" );

		const expected = {
			whichModalOpen: "none",
			displayNoKeyphraseMessage: false,
		};
		const actual = modalReducerSEMrush( state, action );

		expect( actual ).toEqual( expected );
	} );
	it( "sets displayNoKeyphraseMessage to true when the reducer is " +
		"called with a setSEMrushNoKeyphraseMessage action creator that is called with true", () => {
		const state = {
			whichModalOpen: "none",
			displayNoKeyphraseMessage: false,
		};

		const action = setSEMrushNoKeyphraseMessage( true );

		const expected = {
			whichModalOpen: "none",
			displayNoKeyphraseMessage: true,
		};
		const actual = modalReducerSEMrush( state, action );

		expect( actual ).toEqual( expected );
	} );
} );
