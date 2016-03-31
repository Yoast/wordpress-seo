var addModifier = require( "../../../js/helpers/bem/addModifier" );

describe( "addModifier", function() {
	var mockElement, mockParent;

	beforeEach( function() {
		mockElement = {
			className: "class"
		};

		mockParent = {
			getElementsByClassName: function() {
				return [ mockElement ];
			}
		}
	});

	it( "should add a modifier to an existing element", function() {
		addModifier( "modifier", "class", mockParent );

		expect( mockElement.className ).toBe( "class class--modifier" );
	} );

	it( "should work on classes with an existing modifier", function() {
		mockElement.className = "class--existing-modifier";

		addModifier( "modifier", "class--existing-modifier", mockParent );

		expect( mockElement.className ).toBe( "class--existing-modifier class--modifier" );
	} );
});
