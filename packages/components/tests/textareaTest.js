import React from "react";
import { render, screen } from "@testing-library/react";
import Textarea from "../src/Textarea";

describe( "A Textarea component", () => {
	it( "generates a textarea based on the props", () => {
		render( <Textarea name="customTextarea" /> );

		const textarea = screen.getByRole( "textbox" );

		expect( textarea.name ).toBe( "customTextarea" );
		expect( textarea.value ).toBe( "" );
	} );

	it( "generates an input based on the defaults if required props are missing", () => {
		render( <Textarea /> );

		const textarea = screen.getByRole( "textbox" );

		expect( textarea.name ).toBe( "textarea" );
		expect( textarea.value ).toBe( "" );
	} );

	it( "receives focus when it's focus property is set", () => {
		// Cannot seem to simulate clicking / cannot read the focus property.
	} );
} );
