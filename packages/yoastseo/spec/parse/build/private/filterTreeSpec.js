import filterElements from "../../../../src/parse/build/private/filterTree";
import content from "./testPage.html";
import build from "../../../../src/parse/build/build";
import LanguageProcessor from "../../../../src/parse/language/LanguageProcessor";
import Factory from "../../../specHelpers/factory";
import { elementHasName, elementHasClass } from "../../../../src/parse/build/private/filterHelpers";

describe( "A Test", () => {
	it( "Something", () => {
		const html = content;
		const researcher = Factory.buildMockResearcher( {} );
		const languageProcessor = new LanguageProcessor( researcher );

		const tree = build( html, languageProcessor );

		const filteredTree = filterElements( tree, [ elementHasName( "a" ), elementHasClass( "yoast-schema-graph" ) ] );

		expect( filteredTree.findAll( child => child.name === "script" ).length ).toEqual( 0 );
		expect( filteredTree.findAll( child => child.name === "style" ).length ).toEqual( 0 );
		expect( filteredTree.findAll( child => child.name === "code" ).length ).toEqual( 0 );
		expect( filteredTree.findAll( child => child.name === "blockQuote" ).length ).toEqual( 0 );
		expect( filteredTree.findAll( child => child.name === "a" ).length ).toEqual( 0 );
		expect( filteredTree.findAll( child => {
			if ( child.attributes ) {
				return child.attributes.class === "yoast-schema-graph";
			}
			return false;
		} ).length ).toEqual( 0 );
	} );
} );
