var Paper = require( "../../js/values/Paper.js" );

describe( "Creating a Paper", function(){
	it ( "returns metaDescription", function(){
		var metaValues = {};
		var paper = new Paper( "keyword", metaValues );
		expect( paper.hasMetaDescription() ).toBe ( false );
		expect( paper.getMetaDescription() ).toBe ( "" );

		metaValues = {
			metaDescription: "this is a meta"
		}
		paper = new Paper( "keyword", metaValues );
		expect( paper.hasMetaDescription() ).toBe ( true );
		expect( paper.getMetaDescription() ).toBe ( "this is a meta" );
	} )
} );
