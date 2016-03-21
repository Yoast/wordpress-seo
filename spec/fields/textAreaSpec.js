var TextArea = require( "../../js/fields/textarea" );

describe( 'a text area', function() {

	it( 'should accept a value', function() {
		var textArea = new TextArea({
			value: "value"
		});

		expect( textArea.render() ).toBe( '<label><textarea>value</textarea></label>' );
	});

	it( 'should accept a changed value', function() {
		var textArea = new TextArea();
		textArea.setValue( "value" );

		expect( textArea.render() ).toBe( '<label><textarea>value</textarea></label>' );
	});

	it( 'should accept a placeholder', function() {
		var textArea = new TextArea({
			placeholder: "placeholder"
		});

		expect( textArea.render() ).toBe( '<label><textarea placeholder="placeholder"></textarea></label>' );
	});

	it( 'should accept a name', function() {
		var textArea = new TextArea({
			name: "name"
		});

		expect( textArea.render() ).toBe( '<label><textarea name="name"></textarea></label>' );
	});

	it( 'should accept an id', function() {
		var textArea = new TextArea({
			id: "id"
		});

		expect( textArea.render() ).toBe( '<label for="id"><textarea id="id"></textarea></label>' );
	});

	it( 'should accept a class', function() {
		var textArea = new TextArea({
			className: "class"
		});

		expect( textArea.render() ).toBe( '<label><textarea class="class"></textarea></label>' );
	});

	it( 'should accept a changed class', function() {
		var textArea = new TextArea();
		textArea.setClassName( "class" );

		expect( textArea.render() ).toBe( '<label><textarea class="class"></textarea></label>' );
	});

	it( 'should accept a title', function() {
		var textArea = new TextArea({
			title: "title"
		});

		expect( textArea.render() ).toBe( '<label>title<textarea></textarea></label>' );
	});

	it( 'should accept multiple values', function() {
		var textArea = new TextArea({
			value: "value",
			title: "title",
			id: "id"
		});

		expect( textArea.render() ).toBe( '<label for="id">title<textarea id="id">value</textarea></label>' );
	});

	it( 'should accept a label class', function() {
		var textArea = new TextArea({
			labelClassName: "label-class"
		});

		expect( textArea.render() ).toBe( '<label class="label-class"><textarea></textarea></label>' );
	});
});
