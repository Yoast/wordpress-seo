var addModifierToClass = require( "../../../js/helpers/bem/addModifierToClass" );

describe( "addModifierToClass", function() {

	it( "should add the modifier to the class", function() {
		expect( addModifierToClass( "modifier", "class" ) ).toBe( "class--modifier" );
	});

	it( "should remove the previous modifier", function() {
		expect( addModifierToClass( "modifier", "class--old-modifier" ) ).toBe( "class--modifier" );
	});
});
