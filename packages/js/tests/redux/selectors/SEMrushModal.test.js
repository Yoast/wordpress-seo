import { getSEMrushModalOpen, getSEMrushNoKeyphraseMessage } from "../../../src/redux/selectors/SEMrushModal";

// This mimics parts of the yoast-seo/editor store.
const testState = {
	SEMrushModal: {
		whichModalOpen: "sidebar",
		displayNoKeyphraseMessage: false,
	},
};

describe( getSEMrushModalOpen, () => {
	it( "returns the modal status", () => {
		const actual = getSEMrushModalOpen( testState );

		const expected = "sidebar";

		expect( actual ).toEqual( expected );
	} );
} );

describe( getSEMrushNoKeyphraseMessage, () => {
	it( "returns the modal keyphrase status", () => {
		const actual = getSEMrushNoKeyphraseMessage( testState );

		const expected = false;

		expect( actual ).toEqual( expected );
	} );
} );
