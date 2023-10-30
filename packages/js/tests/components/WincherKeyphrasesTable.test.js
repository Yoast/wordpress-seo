global.window.wpseoAdminGlobalL10n = [];
import { render, screen, waitFor, within } from "../test-utils";

global.window.wpseoAdminGlobalL10n[ "links.wincher.login" ] = "test.com";

import WincherKeyphrasesTable
	from "../../../js/src/components/WincherKeyphrasesTable";
import { noop } from "lodash";
import { trackKeyphrases } from "../../src/helpers/wincherEndpoints";

jest.mock( "../../src/helpers/wincherEndpoints" );
trackKeyphrases.mockImplementation( async fn => {
	return fn;
} );

/**
 * Render the WincherKeyphrasesTable component.
 *
 * @param {*} props The component props.
 * @returns {void}
 */
const renderWincherKeyphrasesTable = ( props ) => {
	render( <WincherKeyphrasesTable
		keyphrases={ [ "Example keyphrase" ] }
		trackedKeyphrases={ {} }
		onAuthentication={ noop }
		addTrackingKeyphrase={ noop }
		newRequest={ noop }
		setKeyphraseLimitReached={ noop }
		setTrackedKeyphrases={ noop }
		setRequestFailed={ noop }
		setRequestSucceeded={ noop }
		addTrackedKeyphrase={ noop }
		removeTrackedKeyphrase={ noop }
		setHasTrackedAll={ noop }
		onSelectKeyphrases={ noop }
		permalink=""
		selectedKeyphrases={ [] }
		{ ...props }
	/> );
};

describe( "WincherKeyphrasesTable", () => {
	beforeEach( () => {
		renderWincherKeyphrasesTable();
	} );

	it( "should fill the table with 1 element", async() => {
		const rows = screen.getAllByRole( "row" );
		expect( rows.length ).toBe( 2 );
	} );

	it( "should have the right keyphrases present", async() => {
		const cell = screen.getByRole( "cell", { name: "Example keyphrase" } );
		expect( cell ).toBeInTheDocument();
	} );
} );

describe( "WincherKeyphrasesTable with asterisk", () => {
	it( "should add an asterisk after the focus keyphrase, even if the keyphrase contains capital letters", async() => {
		renderWincherKeyphrasesTable( {
			keyphrases: [ "example keyphrase", "test" ],
			focusKeyphrase: "Example keyphrase",
		} );

		const cell = screen.getByRole( "cell", { name: /example keyphrase/i } );
		const span = within( cell ).getByText( "*" );
		expect( span ).toBeInTheDocument();
	} );

	it( "should track all keyphrases", async() => {
		const keyphrases = [ "example keyphrase", "test" ];
		waitFor( () => {
			renderWincherKeyphrasesTable( {
				keyphrases: keyphrases,
				isLoggedIn: true,
				trackAll: true,
			} );
		} );

		expect( trackKeyphrases ).toHaveBeenCalledWith( keyphrases );
	} );
} );


