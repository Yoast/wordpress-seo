var TextField = require( "../../js/fields/text" );

describe( 'a text field', function() {

	it( 'should accept a value', function() {
		var textField = new TextField({
			value: "value"
		});

		expect( textField.render() ).toBe( '<label><input type="text" value="value" /></label>' );
	});

	it( 'should accept a changed value', function() {
		var textField = new TextField();
		textField.setValue( "value" );

		expect( textField.render() ).toBe( '<label><input type="text" value="value" /></label>' );
	});

	it( 'should accept a placeholder', function() {
		var textField = new TextField({
			placeholder: "placeholder"
		});

		expect( textField.render() ).toBe( '<label><input type="text" placeholder="placeholder" /></label>' );
	});

	it( 'should accept a name', function() {
		var textField = new TextField({
			name: "name"
		});

		expect( textField.render() ).toBe( '<label><input type="text" name="name" /></label>' );
	});

	it( 'should accept an id', function() {
		var textField = new TextField({
			id: "id"
		});

		expect( textField.render() ).toBe( '<label for="id"><input type="text" id="id" /></label>' );
	});

	it( 'should accept a class', function() {
		var textField = new TextField({
			className: "class"
		});

		expect( textField.render() ).toBe( '<label><input type="text" class="class" /></label>' );
	});

	it( 'should accept a changed class', function() {
		var textField = new TextField();
		textField.setClassName( "class" );

		expect( textField.render() ).toBe( '<label><input type="text" class="class" /></label>' );
	});

	it( 'should accept a title', function() {
		var textField = new TextField({
			title: "title"
		});

		expect( textField.render() ).toBe( '<label>title<input type="text" /></label>' );
	});

	it( 'should accept multiple values', function() {
		var textField = new TextField({
			value: "value",
			title: "title",
			id: "id"
		});

		expect( textField.render() ).toBe( '<label for="id">title<input type="text" value="value" id="id" /></label>' );
	})
});
