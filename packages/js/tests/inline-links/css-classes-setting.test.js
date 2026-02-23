import { fireEvent, render, screen } from "../test-utils";
import CSSClassesSetting from "../../src/inline-links/css-classes-setting";

describe( "CSSClassesSetting", () => {
	let onChange;

	beforeEach( () => {
		onChange = jest.fn();
	} );

	it( "renders the checkbox unchecked when cssClasses is empty", () => {
		render( <CSSClassesSetting value={ {} } onChange={ onChange } /> );

		const checkbox = screen.getByRole( "checkbox", { name: "Additional CSS class(es)" } );
		expect( checkbox ).toBeInTheDocument();
		expect( checkbox ).not.toBeChecked();
	} );

	it( "renders the checkbox checked when cssClasses has a value", () => {
		render( <CSSClassesSetting value={ { cssClasses: "my-class" } } onChange={ onChange } /> );

		const checkbox = screen.getByRole( "checkbox", { name: "Additional CSS class(es)" } );
		expect( checkbox ).toBeChecked();
	} );

	it( "does not render the text input when checkbox is unchecked", () => {
		render( <CSSClassesSetting value={ {} } onChange={ onChange } /> );

		expect( screen.queryByRole( "textbox" ) ).not.toBeInTheDocument();
	} );

	it( "renders the text input with the cssClasses value when checkbox is checked", () => {
		render( <CSSClassesSetting value={ { cssClasses: "my-class" } } onChange={ onChange } /> );

		const input = screen.getByRole( "textbox", { name: "Additional CSS class(es)" } );
		expect( input ).toBeInTheDocument();
		expect( input ).toHaveValue( "my-class" );
	} );

	it( "shows the text input when the checkbox is checked", () => {
		render( <CSSClassesSetting value={ {} } onChange={ onChange } /> );

		const checkbox = screen.getByRole( "checkbox", { name: "Additional CSS class(es)" } );
		fireEvent.click( checkbox );

		expect( screen.getByRole( "textbox", { name: "Additional CSS class(es)" } ) ).toBeInTheDocument();
	} );

	it( "clears cssClasses and hides the text input when checkbox is unchecked", () => {
		render( <CSSClassesSetting value={ { cssClasses: "my-class" } } onChange={ onChange } /> );

		const checkbox = screen.getByRole( "checkbox", { name: "Additional CSS class(es)" } );
		fireEvent.click( checkbox );

		expect( onChange ).toHaveBeenCalledWith( { cssClasses: "" } );
		expect( screen.queryByRole( "textbox" ) ).not.toBeInTheDocument();
	} );

	it( "calls onChange with sanitized value when typing in the input", () => {
		render( <CSSClassesSetting value={ { cssClasses: "" } } onChange={ onChange } /> );

		// Check the checkbox first to show the input.
		fireEvent.click( screen.getByRole( "checkbox" ) );

		const input = screen.getByRole( "textbox" );
		fireEvent.change( input, { target: { value: "class-one class-two" } } );

		expect( onChange ).toHaveBeenCalledWith( { cssClasses: "class-one class-two" } );
	} );

	it( "replaces commas with spaces in the input value", () => {
		render( <CSSClassesSetting value={ { cssClasses: "" } } onChange={ onChange } /> );

		fireEvent.click( screen.getByRole( "checkbox" ) );

		const input = screen.getByRole( "textbox" );
		fireEvent.change( input, { target: { value: "class-one,class-two,class-three" } } );

		expect( onChange ).toHaveBeenCalledWith( { cssClasses: "class-one class-two class-three" } );
	} );

	it( "collapses multiple spaces into one", () => {
		render( <CSSClassesSetting value={ { cssClasses: "" } } onChange={ onChange } /> );

		fireEvent.click( screen.getByRole( "checkbox" ) );

		const input = screen.getByRole( "textbox" );
		fireEvent.change( input, { target: { value: "class-one   class-two" } } );

		expect( onChange ).toHaveBeenCalledWith( { cssClasses: "class-one class-two" } );
	} );

	it( "trims the value on blur", () => {
		render( <CSSClassesSetting value={ { cssClasses: " my-class " } } onChange={ onChange } /> );

		const input = screen.getByRole( "textbox" );
		fireEvent.blur( input );

		expect( onChange ).toHaveBeenCalledWith( { cssClasses: "my-class" } );
	} );

	it( "does not call onChange on blur when value is already trimmed", () => {
		render( <CSSClassesSetting value={ { cssClasses: "my-class" } } onChange={ onChange } /> );

		const input = screen.getByRole( "textbox" );
		fireEvent.blur( input );

		expect( onChange ).not.toHaveBeenCalled();
	} );

	it( "preserves other properties in the value object when calling onChange", () => {
		const value = { url: "https://example.com", cssClasses: "old-class" };
		render( <CSSClassesSetting value={ value } onChange={ onChange } /> );

		const checkbox = screen.getByRole( "checkbox" );
		fireEvent.click( checkbox );

		expect( onChange ).toHaveBeenCalledWith( { url: "https://example.com", cssClasses: "" } );
	} );

	it( "handles undefined value gracefully", () => {
		render( <CSSClassesSetting value={ undefined } onChange={ onChange } /> );

		const checkbox = screen.getByRole( "checkbox", { name: "Additional CSS class(es)" } );
		expect( checkbox ).not.toBeChecked();
	} );

	it( "syncs expanded state when value changes externally", () => {
		const { rerender } = render( <CSSClassesSetting value={ {} } onChange={ onChange } /> );

		const checkbox = screen.getByRole( "checkbox" );
		expect( checkbox ).not.toBeChecked();

		// Simulate an external value change (e.g. undo/redo or selecting a different link).
		rerender( <CSSClassesSetting value={ { cssClasses: "new-class" } } onChange={ onChange } /> );

		expect( checkbox ).toBeChecked();
		expect( screen.getByRole( "textbox" ) ).toHaveValue( "new-class" );
	} );

	it( "collapses expanded state when value is cleared externally", () => {
		const { rerender } = render( <CSSClassesSetting value={ { cssClasses: "my-class" } } onChange={ onChange } /> );

		expect( screen.getByRole( "checkbox" ) ).toBeChecked();
		expect( screen.getByRole( "textbox" ) ).toBeInTheDocument();

		// Simulate external clear.
		rerender( <CSSClassesSetting value={ { cssClasses: "" } } onChange={ onChange } /> );

		expect( screen.getByRole( "checkbox" ) ).not.toBeChecked();
		expect( screen.queryByRole( "textbox" ) ).not.toBeInTheDocument();
	} );
} );
