var TextField = require( "../../js/fields/text" );

describe( 'a text field', function() {

	it( 'should accept a value', function() {
		var textField = new TextField({
			value: "value"
		});

		expect( textField.render() ).toBe( '<input type="text" value="value" />' );
	});

	it( 'should accept a changed value', function() {
		var textField = new TextField();
		textField.setValue( "value" );

		expect( textField.render() ).toBe( '<input type="text" value="value" />' );
	});

	it( 'should accept a placeholder', function() {
		var textField = new TextField({
			placeholder: "placeholder"
		});

		expect( textField.render() ).toBe( '<input type="text" placeholder="placeholder" />' );
	});

	it( 'should accept a name', function() {
		var textField = new TextField({
			name: "name"
		});

		expect( textField.render() ).toBe( '<input type="text" name="name" />' );
	});

	it( 'should accept an id', function() {
		var textField = new TextField({
			id: "id"
		});

		expect( textField.render() ).toBe( '<input type="text" id="id" />' );
	});

	it( 'should accept a class', function() {
		var textField = new TextField({
			class: "class"
		});

		expect( textField.render() ).toBe( '<input type="text" class="class" />' );
	});

	it( 'should accept a changed class', function() {
		var textField = new TextField();
		textField.setClass( "class" );

		expect( textField.render() ).toBe( '<input type="text" class="class" />' );
	});
});
