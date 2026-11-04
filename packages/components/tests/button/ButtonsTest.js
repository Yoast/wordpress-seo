/* eslint-disable react/jsx-no-bind */
import React from "react";
import { fireEvent, render } from "@testing-library/react";
import {
	NewButton as Button,
	ButtonStyledLink,
	CloseButton,
} from "../../src/button";

describe( "Button", () => {
	it( "should render with only required props", () => {
		const { container } = render( <Button /> );

		const result = container.firstChild;

		expect( result ).not.toBeNull();
	} );

	it( "should render a button based on provided props", () => {
		const { container } = render(
			<Button
				onClick={ ()=>{} }
				id="very-nice-id"
			/>
		);

		const result = container.firstChild;

		expect( result.id ).toBe( "very-nice-id" );
		expect( result.className ).toBe( "yoast-button yoast-button--primary" );
		expect( result.tagName ).toBe( "BUTTON" );
	} );

	it( "should render a small button based on the provided 'small' prop", () => {
		const { container } = render(
			<Button
				onClick={ ()=>{} }
				id="very-nice-id"
				variant="buy"
				small={ true }
			/>
		);

		const result = container.firstChild;

		expect( result.className ).toBe( "yoast-button yoast-button--buy yoast-button--small" );
	} );

	it( "should render a small button based on the provided 'disabled' prop", () => {
		const { container } = render(
			<Button
				onClick={ ()=>{} }
				id="very-nice-id"
				variant="secondary"
				disabled={ true }
			/>
		);

		const result = container.firstChild;

		expect( result.className ).toBe( "yoast-button yoast-button--secondary" );
	} );
} );

describe( "Primary variant", () => {
	const expectedClassName = "yoast-button yoast-button--primary";
	it( "matches the Button snapshot", () => {
		const { container } = render( <Button variant="primary" onClick={ () => {} }>test</Button> );

		const result = container.firstChild;
		expect( result ).toMatchSnapshot();
		expect( result.className ).toBe( expectedClassName );
	} );

	it( "calls onClick when the Button is clicked", () => {
		const onClick = jest.fn();
		const { container } = render( <Button variant="primary" onClick={ onClick }>test</Button> );

		fireEvent.click( container.firstChild );
		expect( onClick ).toHaveBeenCalledTimes( 1 );
	} );

	it( "matches the Link snapshot", () => {
		const { container } = render( <ButtonStyledLink variant="primary" href="#">test</ButtonStyledLink> );

		const result = container.firstChild;
		expect( result ).toMatchSnapshot();
		expect( result.className ).toBe( expectedClassName );
	} );
} );

describe( "Secondary variant", () => {
	const expectedClassName = "yoast-button yoast-button--secondary";
	it( "matches the Button snapshot", () => {
		const { container } = render( <Button variant="secondary" onClick={ () => {} }>test</Button> );

		const result = container.firstChild;
		expect( result ).toMatchSnapshot();
		expect( result.className ).toBe( expectedClassName );
	} );

	it( "calls onClick when the Button is clicked", () => {
		const onClick = jest.fn();
		const { container } = render( <Button variant="secondary" onClick={ onClick }>test</Button> );

		fireEvent.click( container.firstChild );
		expect( onClick ).toHaveBeenCalledTimes( 1 );
	} );

	it( "matches the Link snapshot", () => {
		const { container } = render( <ButtonStyledLink variant="secondary" href="#">test</ButtonStyledLink> );

		const result = container.firstChild;
		expect( result ).toMatchSnapshot();
		expect( result.className ).toBe( expectedClassName );
	} );
} );

describe( "Buy variant", () => {
	const expectedClassName = "yoast-button yoast-button--buy";
	it( "matches the Button snapshot", () => {
		const { container } = render( <Button variant="buy" onClick={ () => {} }>test</Button> );

		const result = container.firstChild;
		expect( result ).toMatchSnapshot();
		expect( result.className ).toBe( expectedClassName );
	} );

	it( "calls onClick when the Button is clicked", () => {
		const onClick = jest.fn();
		const { container } = render( <Button variant="buy" onClick={ onClick }>test</Button> );

		fireEvent.click( container.firstChild );
		expect( onClick ).toHaveBeenCalledTimes( 1 );
	} );

	it( "matches the Link snapshot", () => {
		const { container } = render( <ButtonStyledLink variant="buy" href="#">test</ButtonStyledLink> );

		const result = container.firstChild;
		expect( result ).toMatchSnapshot();
		expect( result.className ).toBe( expectedClassName );
	} );
} );

describe( "Text variant", () => {
	const removeClassName = "yoast-remove";
	it( "matches the Button snapshot", () => {
		const { container } = render( <Button variant="remove" onClick={ () => {} }>test</Button> );

		const result = container.firstChild;
		expect( result ).toMatchSnapshot();
		expect( result.className ).toBe( removeClassName );
	} );

	it( "calls onClick when the Remove Button is clicked", () => {
		const onClick = jest.fn();
		const { container } = render( <Button variant="remove" onClick={ onClick }>test</Button> );

		fireEvent.click( container.firstChild );
		expect( onClick ).toHaveBeenCalledTimes( 1 );
	} );

	it( "matches the Link snapshot", () => {
		const { container } = render( <ButtonStyledLink variant="remove" href="#">test</ButtonStyledLink> );

		const result = container.firstChild;
		expect( result ).toMatchSnapshot();
		expect( result.className ).toBe( removeClassName );
	} );

	const hideClassName = "yoast-hide";
	it( "matches the Button snapshot", () => {
		const { container } = render( <Button variant="hide" onClick={ () => {} }>test</Button> );

		const result = container.firstChild;
		expect( result ).toMatchSnapshot();
		expect( result.className ).toBe( hideClassName );
	} );

	it( "calls onClick when the Hide Button is clicked", () => {
		const onClick = jest.fn();
		const { container } = render( <Button variant="hide" onClick={ onClick }>test</Button> );

		fireEvent.click( container.firstChild );
		expect( onClick ).toHaveBeenCalledTimes( 1 );
	} );

	it( "matches the Link snapshot", () => {
		const { container } = render( <ButtonStyledLink variant="hide" href="#">test</ButtonStyledLink> );

		const result = container.firstChild;
		expect( result ).toMatchSnapshot();
		expect( result.className ).toBe( hideClassName );
	} );
} );

describe( "Icon", () => {
	const closeClassname = "yoast-close";
	it( "CloseButton matches the Button snapshot", () => {
		const { container } = render( <CloseButton onClick={ () => {} }>test</CloseButton> );

		const result = container.firstChild;
		expect( result ).toMatchSnapshot();
		expect( result.className ).toBe( closeClassname );
	} );

	it( "calls onClick when the CloseButton is clicked", () => {
		const onClick = jest.fn();
		const { container } = render( <CloseButton onClick={ onClick }>test</CloseButton> );

		fireEvent.click( container.firstChild );
		expect( onClick ).toHaveBeenCalledTimes( 1 );
	} );
} );
