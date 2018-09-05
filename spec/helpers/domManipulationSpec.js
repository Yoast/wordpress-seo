import domManipulation from "../../src/helpers/domManipulation.js";

var hasClass = domManipulation.hasClass;
var addClass = domManipulation.addClass;
var removeClass = domManipulation.removeClass;

describe( "Checks whether an element has a specific class", function() {
	var mockElement = [];
	mockElement.className = "test";
	it( "Returns true, the element has the specified class", function() {
		expect( hasClass( mockElement, "test" ) ).toBe( true );
	} );

	it( "Returns false, the element doesn't have the specified class", function() {
		expect( hasClass( mockElement, "test123" ) ).toBe( false );
	} );

	var mockElementNoClass = [];
	mockElementNoClass.className = "";

	it( "Returns false, the element doesn't have the specified class, because it has no classes", function() {
		expect( hasClass( mockElementNoClass, "test" ) ).toBe( false );
	} );
} );

describe( "Adds a class to an element", function() {
	var mockElementToAddClass = [];
	mockElementToAddClass.className = "default";
	addClass( mockElementToAddClass, "test" );

	it( "Returns the className of the element", function() {
		expect( mockElementToAddClass.className ).toBe( "default test" );
	} );

	addClass( mockElementToAddClass, "test" );

	it( "Returns the className of the element, doesn't add a class twice", function() {
		expect( mockElementToAddClass.className ).toBe( "default test" );
	} );
} );

describe( "Removes a class from an element", function() {
	var mockElementToRemoveClass = [];
	mockElementToRemoveClass.className = "default test";
	removeClass( mockElementToRemoveClass, "test" );

	it( "Returns the className of the element", function() {
		expect( mockElementToRemoveClass.className ).toBe( "default" );
	} );
} );

describe( "Removes multiple classes from an element", function() {
	var mockElementToRemoveClass = [];
	mockElementToRemoveClass.className = "default test1 test2";
	domManipulation.removeClasses( mockElementToRemoveClass, [ "test1", "test2" ] );
	it( "Returns the className of the element", function() {
		expect( mockElementToRemoveClass.className ).toBe( "default" );
	} );
} );
