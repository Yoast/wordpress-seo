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

describe( "WincherKeyphrasesTable getKeyphraseData", () => {
	const activateTrackingText = "Activate tracking to show the ranking position";

	const renderWithTracked = ( keyphrases, trackedKeyphrases ) => render(
		<WincherKeyphrasesTable
			keyphrases={ keyphrases }
			trackedKeyphrases={ trackedKeyphrases }
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
		/>
	);

	it( "shows 'Activate tracking' when trackedKeyphrases is null", () => {
		renderWithTracked( [ "seo" ], null );
		expect( screen.getByText( activateTrackingText ) ).toBeInTheDocument();
	} );

	it( "shows 'Activate tracking' when trackedKeyphrases is empty", () => {
		renderWithTracked( [ "seo" ], {} );
		expect( screen.getByText( activateTrackingText ) ).toBeInTheDocument();
	} );

	it( "shows 'Activate tracking' when the keyphrase is not in trackedKeyphrases", () => {
		renderWithTracked( [ "seo" ], { other: { id: "1" } } );
		expect( screen.getByText( activateTrackingText ) ).toBeInTheDocument();
	} );

	it( "does not show 'Activate tracking' when the keyphrase is an own property of trackedKeyphrases", () => {
		renderWithTracked( [ "seo" ], { seo: { id: "1" } } );
		expect( screen.queryByText( activateTrackingText ) ).not.toBeInTheDocument();
	} );

	it( "matches keyphrases case-insensitively against trackedKeyphrases keys", () => {
		renderWithTracked( [ "SEO" ], { seo: { id: "1" } } );
		expect( screen.queryByText( activateTrackingText ) ).not.toBeInTheDocument();
	} );

	it( "does not return data for inherited properties of trackedKeyphrases", () => {
		// "constructor" exists on the Object prototype but is not an own property of a plain object.
		// trackedKeyphrases must be non-empty so isEmpty() does not short-circuit before the hasOwnProperty check.
		renderWithTracked( [ "constructor" ], { seo: { id: "1" } } );
		expect( screen.getByText( activateTrackingText ) ).toBeInTheDocument();
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


