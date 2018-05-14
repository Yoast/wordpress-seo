import initialize from "../src/edit.js";

jest.mock( "react-dom" );

describe( "initialize", () => {
	it( "initializes all functionality on the edit screen", () => {
		window.wpseoPostScraperL10n = {
			intl: {
				locale: "en_EN",
			},
		};
		const actual = initialize( {} );
		expect( actual.store ).toBeDefined();
	} );
} );
