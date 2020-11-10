import {
    removeSearchParam,
    addHistoryState
} from "../../src/helpers/urlHelpers";

describe( "removeSearchParam", () => {
    it( "removes the given parameter from url", () => {
        const expected = "https://example.org/file.html?first=foo";

        const actual = removeSearchParam( "https://example.org/file.html?first=foo&second=bar", "second" );

        expect( actual ).toEqual( expected );
    } );

    it( "removes the given non present parameter from url", () => {
        const expected = "https://example.org/file.html?first=foo&second=bar";

        const actual = removeSearchParam( "https://example.org/file.html?first=foo&second=bar", "third" );

        expect( actual ).toEqual( expected );
    } );
} );

describe( "addHistoryState", () => {
    it( "adds a new state to the history.", () => {
        const currentURL = window.location.href;

        addHistoryState( null, "", "http://localhost/file.html?first=foo" );

        const actual = window.location.href;

        expect( currentURL ).toEqual( "http://localhost/" );
        expect( actual ).toEqual( "http://localhost/file.html?first=foo" );
    } );
} );
