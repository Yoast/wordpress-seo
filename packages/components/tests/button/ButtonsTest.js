/* eslint-disable react/jsx-no-bind */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import {
	NewButton as Button,
	ButtonStyledLink,
	CloseButton,
} from "../../src/button";

const shallowRenderer = new ReactShallowRenderer();
describe( "Button", () => {
	it( "should render with only required props", () => {
		shallowRenderer.render( <Button /> );

		const result = shallowRenderer.getRenderOutput();

		expect( result ).toBeDefined();
	} );

	it( "should render a button based on provided props", () => {
		shallowRenderer.render(
			<Button
				onClick={ ()=>{} }
				id="very-nice-id"
			/>
		);

		const result = shallowRenderer.getRenderOutput();

		expect( result ).toBeDefined();
		expect( result.props.id ).toBe( "very-nice-id" );
		expect( result.props.className ).toBe( "yoast-button yoast-button--primary" );
		expect( result.type ).toBe( "button" );
	} );

	it( "should render a small button based on the provided 'small' prop", () => {
		shallowRenderer.render(
			<Button
				onClick={ ()=>{} }
				id="very-nice-id"
				variant="buy"
				small={ true }
			/>
		);

		const result = shallowRenderer.getRenderOutput();

		expect( result ).toBeDefined();
		expect( result.props.className ).toBe( "yoast-button yoast-button--buy yoast-button--small" );
	} );

	it( "should render a small button based on the provided 'disabled' prop", () => {
		shallowRenderer.render(
			<Button
				onClick={ ()=>{} }
				id="very-nice-id"
				variant="secondary"
				disabled={ true }
			/>
		);

		const result = shallowRenderer.getRenderOutput();

		expect( result ).toBeDefined();
		expect( result.props.className ).toBe( "yoast-button yoast-button--secondary" );
	} );

	it( "generates an error if wrong props are provided", () => {
		console.error = jest.fn();

		shallowRenderer.render(
			<Button
				variant={ { afterIcon: "blerf" } }
			/>
		);

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] ).toBe( "Warning: Failed %s type: %s%s" );
		expect( console.error.mock.calls[ 0 ][ 1 ] ).toBe( "prop" );
		expect( console.error.mock.calls[ 0 ][ 2 ] ).toContain( "Invalid prop `variant` of value `[object Object]` supplied to `Button`" );
	} );
} );

describe( "Primary variant", () => {
	const expectedClassName = "yoast-button yoast-button--primary";
	it( "matches the Button snapshot", () => {
		shallowRenderer.render( <Button variant="primary" onClick={ () => {} }>test</Button> );

		const result = shallowRenderer.getRenderOutput();
		expect( result ).toMatchSnapshot();
		expect( result.props.className ).toBe( expectedClassName );
	} );

	it( "matches the Link snapshot", () => {
		shallowRenderer.render( <ButtonStyledLink variant="primary" href="#">test</ButtonStyledLink> );

		const result = shallowRenderer.getRenderOutput();
		expect( result ).toMatchSnapshot();
		expect( result.props.className ).toBe( expectedClassName );
	} );
} );

describe( "Secondary variant", () => {
	const expectedClassName = "yoast-button yoast-button--secondary";
	it( "matches the Button snapshot", () => {
		shallowRenderer.render( <Button variant="secondary" onClick={ () => {} }>test</Button> );

		const result = shallowRenderer.getRenderOutput();
		expect( result ).toMatchSnapshot();
		expect( result.props.className ).toBe( expectedClassName );
	} );

	it( "matches the Link snapshot", () => {
		shallowRenderer.render( <ButtonStyledLink variant="secondary" href="#">test</ButtonStyledLink> );

		const result = shallowRenderer.getRenderOutput();
		expect( result ).toMatchSnapshot();
		expect( result.props.className ).toBe( expectedClassName );
	} );
} );

describe( "Buy variant", () => {
	const expectedClassName = "yoast-button yoast-button--buy";
	it( "matches the Button snapshot", () => {
		shallowRenderer.render( <Button variant="buy" onClick={ () => {} }>test</Button> );

		const result = shallowRenderer.getRenderOutput();
		expect( result ).toMatchSnapshot();
		expect( result.props.className ).toBe( expectedClassName );
	} );

	it( "matches the Link snapshot", () => {
		shallowRenderer.render( <ButtonStyledLink variant="buy" href="#">test</ButtonStyledLink> );

		const result = shallowRenderer.getRenderOutput();
		expect( result ).toMatchSnapshot();
		expect( result.props.className ).toBe( expectedClassName );
	} );
} );

describe( "Text variant", () => {
	const removeClassName = "yoast-remove";
	it( "matches the Button snapshot", () => {
		shallowRenderer.render( <Button variant="remove" onClick={ () => {} }>test</Button> );

		const result = shallowRenderer.getRenderOutput();
		expect( result ).toMatchSnapshot();
		expect( result.props.className ).toBe( removeClassName );
	} );

	it( "matches the Link snapshot", () => {
		shallowRenderer.render( <ButtonStyledLink variant="remove" href="#">test</ButtonStyledLink> );

		const result = shallowRenderer.getRenderOutput();
		expect( result ).toMatchSnapshot();
		expect( result.props.className ).toBe( removeClassName );
	} );

	const hideClassName = "yoast-hide";
	it( "matches the Button snapshot", () => {
		shallowRenderer.render( <Button variant="hide" onClick={ () => {} }>test</Button> );

		const result = shallowRenderer.getRenderOutput();
		expect( result ).toMatchSnapshot();
		expect( result.props.className ).toBe( hideClassName );
	} );

	it( "matches the Link snapshot", () => {
		shallowRenderer.render( <ButtonStyledLink variant="hide" href="#">test</ButtonStyledLink> );

		const result = shallowRenderer.getRenderOutput();
		expect( result ).toMatchSnapshot();
		expect( result.props.className ).toBe( hideClassName );
	} );
} );

describe( "Icon", () => {
	const closeClassname = "yoast-close";
	it( "CloseButton matches the Button snapshot", () => {
		shallowRenderer.render( <CloseButton onClick={ () => {} }>test</CloseButton> );

		const result = shallowRenderer.getRenderOutput();
		expect( result ).toMatchSnapshot();
		expect( result.props.className ).toBe( closeClassname );
	} );
} );
