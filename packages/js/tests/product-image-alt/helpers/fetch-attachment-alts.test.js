import apiFetch from "@wordpress/api-fetch";
import { fetchAttachmentAlts } from "../../../src/product-image-alt/helpers/fetch-attachment-alts";

jest.mock( "@wordpress/api-fetch" );

const altTextLabel = "alt_text";
describe( "fetchAttachmentAlts", () => {
	afterEach( () => jest.clearAllMocks() );

	it( "returns an empty Map and skips fetch when ids is empty", async() => {
		const result = await fetchAttachmentAlts( [] );

		expect( result ).toEqual( new Map() );
		expect( apiFetch ).not.toHaveBeenCalled();
	} );

	it( "fetches the correct path for a single id", async() => {
		apiFetch.mockResolvedValue( { id: 1, [ altTextLabel ]: "My alt" } );

		await fetchAttachmentAlts( [ 1 ] );

		expect( apiFetch ).toHaveBeenCalledWith( { path: `/wp/v2/media/1?_fields=id,${ altTextLabel }` } );
	} );

	it( "returns a Map with alt_text keyed by attachment id", async() => {
		apiFetch.mockResolvedValue( { id: 1, [ altTextLabel ]: "My alt" } );

		const result = await fetchAttachmentAlts( [ 1 ] );

		expect( result.get( 1 ) ).toBe( "My alt" );
	} );

	it( "fetches all ids and returns all alt texts", async() => {
		apiFetch.mockImplementation( ( { path } ) => {
			const [ , id ] = path.match( /\/(\d+)\?/ );
			return Promise.resolve( { id: Number( id ), [ altTextLabel ]: `Alt ${ id }` } );
		} );

		const result = await fetchAttachmentAlts( [ 1, 2, 3 ] );

		expect( result.get( 1 ) ).toBe( "Alt 1" );
		expect( result.get( 2 ) ).toBe( "Alt 2" );
		expect( result.get( 3 ) ).toBe( "Alt 3" );
		expect( apiFetch ).toHaveBeenCalledTimes( 3 );
	} );

	it( "maps a null alt_text to empty string", async() => {
		apiFetch.mockResolvedValue( { id: 1, [ altTextLabel ]: null } );

		const result = await fetchAttachmentAlts( [ 1 ] );

		expect( result.get( 1 ) ).toBe( "" );
	} );

	it( "maps a failed fetch to empty string", async() => {
		apiFetch.mockRejectedValue( new Error( "Network error" ) );

		const result = await fetchAttachmentAlts( [ 1 ] );

		expect( result.get( 1 ) ).toBe( "" );
	} );

	it( "handles a mix of successful and failed fetches", async() => {
		apiFetch.mockImplementation( ( { path } ) => {
			const [ , id ] = path.match( /\/(\d+)\?/ );
			if ( Number( id ) === 2 ) {
				return Promise.reject( new Error( "Not found" ) );
			}
			return Promise.resolve( { id: Number( id ), [ altTextLabel ]: `Alt ${ id }` } );
		} );

		const result = await fetchAttachmentAlts( [ 1, 2 ] );

		expect( result.get( 1 ) ).toBe( "Alt 1" );
		expect( result.get( 2 ) ).toBe( "" );
	} );
} );
