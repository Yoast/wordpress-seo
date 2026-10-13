import { CONFIGURE_RESEARCHER_FILTER, getResearcher, resetResearcher } from "../../../src/bulk-editor/services/researcher";

// Jest requires mock-factory-referenced variables to be prefixed with "mock".
const mockApplyFilters = jest.fn( ( hookName, value ) => value );

jest.mock( "@wordpress/hooks", () => ( { applyFilters: ( ...args ) => mockApplyFilters( ...args ) } ) );

describe( "getResearcher", () => {
	let constructed;

	beforeEach( () => {
		resetResearcher();
		mockApplyFilters.mockClear();
		mockApplyFilters.mockImplementation( ( hookName, value ) => value );
		constructed = 0;
		window.yoast = {
			...window.yoast,
			Researcher: {
				"default": function Researcher() {
					constructed += 1;
				},
			},
		};
	} );

	afterEach( () => {
		delete window.yoast;
	} );

	it( "builds the researcher once and shares it across callers", async() => {
		const first = await getResearcher( "en_US" );
		const second = await getResearcher( "en_US" );

		expect( first ).toBe( second );
		expect( constructed ).toBe( 1 );
	} );

	it( "lets Premium augment the researcher through the filter, and awaits it", async() => {
		const configure = jest.fn( () => Promise.resolve() );
		mockApplyFilters.mockImplementation( () => configure );

		const researcher = await getResearcher( "nl_NL" );

		expect( mockApplyFilters ).toHaveBeenCalledWith( CONFIGURE_RESEARCHER_FILTER, expect.any( Function ) );
		expect( configure ).toHaveBeenCalledWith( researcher, "nl_NL" );
	} );

	it( "rejects when building the researcher fails", async() => {
		mockApplyFilters.mockImplementation( () => () => Promise.reject( new Error( "morphology boom" ) ) );

		await expect( getResearcher( "en_US" ) ).rejects.toThrow( "morphology boom" );
	} );

	it( "retries on the next call instead of caching the failure for the session", async() => {
		// Fail once, then succeed: a transient failure (e.g. fetching morphology data) must not poison the page.
		mockApplyFilters.mockImplementationOnce( () => () => Promise.reject( new Error( "transient" ) ) );

		await expect( getResearcher( "en_US" ) ).rejects.toThrow( "transient" );

		const researcher = await getResearcher( "en_US" );

		expect( researcher ).toBeDefined();
		expect( constructed ).toBe( 2 );
	} );

	it( "rejects when the analysis package is not on the page", async() => {
		delete window.yoast.Researcher;

		await expect( getResearcher( "en_US" ) ).rejects.toThrow();
	} );
} );
