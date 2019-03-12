var removeModifier = require( "../../../js/helpers/bem/removeModifier" );

describe( "removeModifier", function() {
	var mockElement, mockParent;

	beforeEach( function() {
		mockElement = {
			className: "class class--modifier"
		};

		mockParent = {
			getElementsByClassName: function() {
				return [ mockElement ];
			}
		}
	});

	it( "should remove the modifier from an element", function() {
		removeModifier( "modifier", "class", mockParent );

		expect( mockElement.className ).toBe( "class" );
	});

	it( "should work on classes with an existing modifier", function() {
		mockElement.className = "class--existing-modifier class--modifier";

		removeModifier( "modifier", "class--existing-modifier", mockParent );

		expect( mockElement.className ).toBe( "class--existing-modifier" );
	});

	it( "should leave the classes intact", function() {
		mockElement.className = "class";

		removeModifier( "modifier", "class", mockParent );

		expect( mockElement.className ).toBe( "class" );
	});
});
