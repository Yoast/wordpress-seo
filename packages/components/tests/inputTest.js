import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Input from "../src/input/Input";

describe( "Input", () => {
	it( "generates an input based on the props", () => {
		render( <Input type="text" name="textInput" /> );

		const input = screen.getByRole( "textbox" );

		expect( input.name ).toBe( "textInput" );
		expect( input.defaultValue ).toBe( "" );
	} );

	it( "generates an input based on the defaults if required props are missing", () => {
		render( <Input /> );

		const input = screen.getByRole( "textbox" );

		expect( input.name ).toBe( "input" );
		expect( input.type ).toBe( "text" );
		expect( input.defaultValue ).toBe( "" );
	} );

	it( "generates an input based on the defaults if required props are partially missing", () => {
		render( <Input name="textInput" /> );

		const input = screen.getByRole( "textbox" );

		expect( input.name ).toBe( "textInput" );
		expect( input.type ).toBe( "text" );
		expect( input.defaultValue ).toBe( "" );
	} );

	it( "generates an input based on the defaults and additional, optional attributes", () => {
		const optionalAttributes = {
			className: "custom-input-class",
			id: "custom-input-identifier",
		};

		render( <Input name="textInput" optionalAttributes={ optionalAttributes } /> );

		const input = screen.getByRole( "textbox" );

		expect( input.className ).toBe( "custom-input-class" );
		expect( input.id ).toBe( "custom-input-identifier" );
	} );

	it( "generates an input based on the defaults and an onChange event binding", () => {
		const onChange = jest.fn();
		render( <Input name="textInput" onChange={ onChange } /> );

		fireEvent.change( screen.getByRole( "textbox" ), { target: { value: "changed" } } );

		expect( onChange ).toHaveBeenCalledTimes( 1 );
	} );
} );
