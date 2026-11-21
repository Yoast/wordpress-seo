import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import TextInput from "../../src/inputs/TextInput";

describe( "TextInput", () => {
	it( "generates an input based on the props", () => {
		const { container } = render(
			<TextInput
				type="text"
				name="textInput"
				label="Heya"
				linkTo="linkTo"
			/>
		);

		const input = screen.getByRole( "textbox" );

		expect( screen.getByText( "Heya" ) ).not.toBeNull();
		expect( container.querySelector( "a.yoast-help" ).getAttribute( "href" ) ).toBe( "linkTo" );
		expect( input.name ).toBe( "textInput" );
		expect( input.value ).toBe( "" );
	} );

	it( "generates an input based on the defaults if required props are missing", () => {
		render(
			<TextInput
				label="heya"
			/>
		);

		const input = screen.getByRole( "textbox" );

		expect( input.name ).toBe( "" );
		expect( input.type ).toBe( "text" );
		expect( input.value ).toBe( "" );
	} );

	it( "generates an input based on the defaults if required props are partially missing", () => {
		render(
			<TextInput
				label="heya"
				name="textInput"
			/>
		);

		const input = screen.getByRole( "textbox" );

		expect( input.name ).toBe( "textInput" );
		expect( input.type ).toBe( "text" );
		expect( input.value ).toBe( "" );
	} );

	it( "generates an input based on the defaults and additional, optional attributes", () => {
		const optionalAttributes = {
			id: "custom-input-identifier",
		};

		render( <TextInput label="hi" name="textInput" { ...optionalAttributes } /> );

		const input = screen.getByRole( "textbox" );

		expect( input.id ).toBe( "custom-input-identifier" );
		expect( screen.getByText( "hi" ).htmlFor ).toBe( "custom-input-identifier" );
	} );

	it( "generates an input based on the defaults and an onChange event binding", () => {
		const onChange = jest.fn();
		render( <TextInput label="hi" name="textInput" onChange={ onChange } /> );

		fireEvent.change( screen.getByRole( "textbox" ), { target: { value: "changed" } } );

		expect( onChange ).toHaveBeenCalledTimes( 1 );
		expect( onChange ).toHaveBeenCalledWith( "changed" );
	} );
} );
