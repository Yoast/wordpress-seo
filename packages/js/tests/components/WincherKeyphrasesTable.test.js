global.window.wpseoAdminGlobalL10n = [];
import { render, screen, waitFor, within } from "../test-utils";

global.window.wpseoAdminGlobalL10n[ "links.wincher.login" ] = "test.com";

import WincherKeyphrasesTable
	from "../../../js/src/components/WincherKeyphrasesTable";
import { noop } from "lodash";
import { getKeyphrases, trackKeyphrases } from "../../src/helpers/wincherEndpoints";

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
describe( "WincherKeyphrasesTable - fetch behavior", () => {
	beforeEach( () => {
		getKeyphrases.mockReset();
	} );

	it( "calls getKeyphrases when logged in with a permalink and startAt", async() => {
		getKeyphrases.mockResolvedValue( { status: 200, results: {} } );

		renderWincherKeyphrasesTable( {
			isLoggedIn: true,
			permalink: "https://example.com/post",
			startAt: "2025-04-18T00:00:00Z",
			trackedKeyphrases: null,
		} );

		await waitFor( () => {
			expect( getKeyphrases ).toHaveBeenCalled();
		} );
	} );

	it( "calls setTrackedKeyphrases with the response results on a successful fetch", async() => {
		const mockResults = { "example keyphrase": { keyword: "example keyphrase" } };
		getKeyphrases.mockResolvedValue( { status: 200, results: mockResults } );
		const setTrackedKeyphrases = jest.fn();

		renderWincherKeyphrasesTable( {
			isLoggedIn: true,
			permalink: "https://example.com/post",
			startAt: "2025-04-18T00:00:00Z",
			trackedKeyphrases: null,
			setTrackedKeyphrases,
		} );

		await waitFor( () => {
			expect( setTrackedKeyphrases ).toHaveBeenCalledWith( mockResults );
		} );
	} );

	it( "calls setRequestFailed when the fetch returns a non-200 status", async() => {
		getKeyphrases.mockResolvedValue( { status: 500 } );
		const setRequestFailed = jest.fn();

		renderWincherKeyphrasesTable( {
			isLoggedIn: true,
			permalink: "https://example.com/post",
			startAt: "2025-04-18T00:00:00Z",
			trackedKeyphrases: null,
			setRequestFailed,
		} );

		await waitFor( () => {
			expect( setRequestFailed ).toHaveBeenCalled();
		} );
	} );

	it( "does not fetch when isLoggedIn is false", () => {
		renderWincherKeyphrasesTable( {
			isLoggedIn: false,
			permalink: "https://example.com/post",
			startAt: "2025-04-18T00:00:00Z",
			trackedKeyphrases: null,
		} );

		expect( getKeyphrases ).not.toHaveBeenCalled();
	} );

	it( "does not fetch when permalink is missing", () => {
		renderWincherKeyphrasesTable( {
			isLoggedIn: true,
			permalink: "",
			startAt: "2025-04-18T00:00:00Z",
			trackedKeyphrases: null,
		} );

		expect( getKeyphrases ).not.toHaveBeenCalled();
	} );

	it( "does not fetch when startAt is missing", () => {
		renderWincherKeyphrasesTable( {
			isLoggedIn: true,
			permalink: "https://example.com/post",
			startAt: null,
			trackedKeyphrases: null,
		} );

		expect( getKeyphrases ).not.toHaveBeenCalled();
	} );
} );
