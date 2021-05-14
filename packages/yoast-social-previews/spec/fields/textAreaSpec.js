var TextArea = require( "../../js/inputs/textarea" );

describe( 'a text area', function() {

	it( 'should accept a value', function() {
		var textArea = new TextArea({
			value: "value"
		});

		expect( textArea.render() ).toBe( '<label><span class="snippet-editor__caret-hook"></span><textarea>value</textarea></label>' );
	});

	it( 'should accept a changed value', function() {
		var textArea = new TextArea();
		textArea.setValue( "value" );

		expect( textArea.render() ).toBe( '<label><span class="snippet-editor__caret-hook"></span><textarea>value</textarea></label>' );
	});

	it( 'should accept a placeholder', function() {
		var textArea = new TextArea({
			placeholder: "placeholder"
		});

		expect( textArea.render() ).toBe( '<label><span class="snippet-editor__caret-hook"></span><textarea placeholder="placeholder"></textarea></label>' );
	});

	it( 'should accept a name', function() {
		var textArea = new TextArea({
			name: "name"
		});

		expect( textArea.render() ).toBe( '<label><span class="snippet-editor__caret-hook"></span><textarea name="name"></textarea></label>' );
	});

	it( 'should accept an id', function() {
		var textArea = new TextArea({
			id: "id"
		});

		expect( textArea.render() ).toBe( '<label for="id"></label><span class="snippet-editor__caret-hook" id="id__caret-hook"></span><textarea id="id"></textarea>' );
	});

	it( 'should accept a class', function() {
		var textArea = new TextArea({
			className: "class"
		});

		expect( textArea.render() ).toBe( '<label><span class="snippet-editor__caret-hook"></span><textarea class="class"></textarea></label>' );
	});

	it( 'should accept a changed class', function() {
		var textArea = new TextArea();
		textArea.setClassName( "class" );

		expect( textArea.render() ).toBe( '<label><span class="snippet-editor__caret-hook"></span><textarea class="class"></textarea></label>' );
	});

	it( 'should accept a title', function() {
		var textArea = new TextArea({
			title: "title"
		});

		expect( textArea.render() ).toBe( '<label>title<span class="snippet-editor__caret-hook"></span><textarea></textarea></label>' );
	});

	it( 'should accept multiple values', function() {
		var textArea = new TextArea({
			value: "value",
			title: "title",
			id: "id"
		});

		expect( textArea.render() ).toBe( '<label for="id">title</label><span class="snippet-editor__caret-hook" id="id__caret-hook"></span><textarea id="id">value</textarea>' );
	});

	it( 'should accept a label class', function() {
		var textArea = new TextArea({
			labelClassName: "label-class"
		});

		expect( textArea.render() ).toBe( '<label class="label-class"><span class="snippet-editor__caret-hook"></span><textarea></textarea></label>' );
	});
});
