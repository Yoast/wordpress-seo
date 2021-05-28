var Button = require( "../../js/inputs/button" );

describe( 'a button', function() {
	it( 'should accept a value', function() {
		var button = new Button({
			value: "value"
		});

		expect( button.render() ).toBe( '<button type="button">value</button>' );
	});

	it( 'should accept a changed value', function() {
		var button = new Button();
		button.setValue( "value" );

		expect( button.render() ).toBe( '<button type="button">value</button>' );
	});

	it( 'should accept a class', function() {
		var button = new Button({
			className: "class"
		});

		expect( button.render() ).toBe( '<button type="button" class="class"></button>' );
	});

	it( 'should accept a changed class', function() {
		var button = new Button();
		button.setClassName( "class" );

		expect( button.render() ).toBe( '<button type="button" class="class"></button>' );
	});

	it( 'should accept multiple values', function() {
		var button = new Button({
			value: "value",
			className: "class"
		});

		expect( button.render() ).toBe( '<button type="button" class="class">value</button>' );
	});
});
