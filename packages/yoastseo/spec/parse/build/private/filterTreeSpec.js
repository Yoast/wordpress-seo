import filterTree from "../../../../src/parse/build/private/filterTree";
import content from "./testPage.html";
import build from "../../../../src/parse/build/build";
import LanguageProcessor from "../../../../src/parse/language/LanguageProcessor";
import Factory from "../../../specHelpers/factory";
import { elementHasName, elementHasClass } from "../../../../src/parse/build/private/filterHelpers";
import permanentFilters from "../../../../src/parse/build/private/alwaysFilterElements";

describe( "A Test", () => {
	it( "Something", () => {
		const html = content;
		const researcher = Factory.buildMockResearcher( {} );
		const languageProcessor = new LanguageProcessor( researcher );

		const tree = build( html, languageProcessor );
		const fullFilter = permanentFilters.concat( [ elementHasName( "a" ), elementHasClass( "yoast-schema-graph" ) ] );

		const filteredTree = filterTree( tree, fullFilter );

		expect( filteredTree.findAll( child => child.name === "script" ) ).toHaveLength( 0 );
		expect( filteredTree.findAll( child => child.name === "style" ) ).toHaveLength( 0 );
		expect( filteredTree.findAll( child => child.name === "code" ) ).toHaveLength( 0 );
		expect( filteredTree.findAll( child => child.name === "blockQuote" ) ).toHaveLength( 0 );
		expect( filteredTree.findAll( child => child.name === "a" ) ).toHaveLength( 0 );
		expect( filteredTree.findAll( child => {
			if ( child.attributes ) {
				return child.attributes.class === "yoast-schema-graph";
			}
			return false;
		} ) ).toHaveLength( 0 );

		// A smoke test check to check if not the entire tree was deleted.
		expect( filteredTree.findAll( child => child.name === "div" ).length ).toBeGreaterThan( 0 );
	} );
} );
