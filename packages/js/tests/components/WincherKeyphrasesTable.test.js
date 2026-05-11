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

describe( "WincherKeyphrasesTable getKeyphrases fetch", () => {
	const successResponse = { status: 200, results: { seo: { keyword: "seo" } } };

	const renderWithFetch = ( props = {} ) => render( <WincherKeyphrasesTable
		keyphrases={ [ "seo" ] }
		trackedKeyphrases={ null }
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
		isLoggedIn={ true }
		permalink="https://example.com"
		startAt="2024-01-01"
		selectedKeyphrases={ [] }
		{ ...props }
	/> );

	beforeEach( () => {
		jest.clearAllMocks();
		getKeyphrases.mockResolvedValue( successResponse );
	} );

	it( "calls getKeyphrases with the correct arguments on mount", async() => {
		renderWithFetch();

		await waitFor( () => expect( getKeyphrases ).toHaveBeenCalledTimes( 1 ) );
		expect( getKeyphrases ).toHaveBeenCalledWith(
			[ "seo" ],
			"2024-01-01",
			"https://example.com",
			expect.any( AbortSignal )
		);
	} );

	it( "calls setTrackedKeyphrases with the response results after a successful fetch", async() => {
		const setTrackedKeyphrases = jest.fn();

		renderWithFetch( { setTrackedKeyphrases } );

		await waitFor( () => expect( setTrackedKeyphrases ).toHaveBeenCalledWith( successResponse.results ) );
	} );

	it( "calls getKeyphrases a second time and resolves setTrackedKeyphrases when keyphrases change", async() => {
		const setTrackedKeyphrases = jest.fn();

		const { rerender } = renderWithFetch( { setTrackedKeyphrases } );

		await waitFor( () => expect( getKeyphrases ).toHaveBeenCalledTimes( 1 ) );

		rerender( <WincherKeyphrasesTable
			keyphrases={ [ "seo", "tools" ] }
			trackedKeyphrases={ null }
			onAuthentication={ noop }
			addTrackingKeyphrase={ noop }
			newRequest={ noop }
			setKeyphraseLimitReached={ noop }
			setTrackedKeyphrases={ setTrackedKeyphrases }
			setRequestFailed={ noop }
			setRequestSucceeded={ noop }
			addTrackedKeyphrase={ noop }
			removeTrackedKeyphrase={ noop }
			setHasTrackedAll={ noop }
			onSelectKeyphrases={ noop }
			isLoggedIn={ true }
			permalink="https://example.com"
			startAt="2024-01-01"
			selectedKeyphrases={ [] }
		/> );

		await waitFor( () => expect( getKeyphrases ).toHaveBeenCalledTimes( 2 ) );
		await waitFor( () => expect( setTrackedKeyphrases ).toHaveBeenCalledTimes( 2 ) );
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


