import fs from "fs";
import path from "path";
import getResearcher from "../../src/languageProcessing/getResearcher";
import EnglishResearcher from "../../src/languageProcessing/languages/en/Researcher";
import DefaultResearcher from "../../src/languageProcessing/languages/_default/Researcher";

describe( "getResearcher", () => {
	it( "resolves a supported language to its Researcher class", () => {
		const Researcher = getResearcher( "en" );

		expect( Researcher ).toBe( EnglishResearcher );
		// It returns the class, not an instance, so consumers stay in control of construction.
		expect( typeof Researcher ).toBe( "function" );
		expect( () => new Researcher() ).not.toThrow();
	} );

	it( "reduces a locale to its language part before resolving", () => {
		expect( getResearcher( "en_US" ) ).toBe( EnglishResearcher );
		expect( getResearcher( "en-US" ) ).toBe( EnglishResearcher );
	} );

	it( "falls back to the default Researcher for an unsupported language", () => {
		expect( getResearcher( "xx" ) ).toBe( DefaultResearcher );
	} );

	it( "falls back to the default Researcher when no language is given", () => {
		expect( getResearcher() ).toBe( DefaultResearcher );
	} );

	it( "registers a Researcher for every language directory", () => {
		const languagesDir = path.join( __dirname, "../../src/languageProcessing/languages" );
		const languages = fs.readdirSync( languagesDir, { withFileTypes: true } )
			// `_default` backs the fallback rather than a supported language code.
			.filter( entry => entry.isDirectory() && entry.name !== "_default" )
			.map( entry => entry.name );

		// A new language folder that is not added to the factory's map silently falls back to the default
		// Researcher; this guards against that.
		const unregistered = languages.filter( language => getResearcher( language ) === DefaultResearcher );
		expect( unregistered ).toEqual( [] );
	} );
} );
