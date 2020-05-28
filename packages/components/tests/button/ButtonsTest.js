/* eslint-disable react/jsx-no-bind */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import {
	Button,
	PrimaryButton,
	PrimaryLink,
	SecondaryButton,
	SecondaryLink,
	UpsellButton,
	UpsellLink,
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
		expect( result.props.className ).toBe( "yoast-button" );
		expect( result.type ).toBe( "button" );
	} );

	it( "generates an error if wrong props are provided", () => {
		console.error = jest.genMockFn();

		shallowRenderer.render(
			<Button
				isLink="indeed"
			/>
		);

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type: Invalid prop `isLink` of type `string` supplied to `Button`, expected `boolean`." );
	} );

	it( "renders a link instead of a button if isLink is true", () => {
		shallowRenderer.render(
			<Button
				isLink={ true }
			/>
		);

		const result = shallowRenderer.getRenderOutput();

		expect( result ).toBeDefined();
		expect( result.type ).toBe( "a" );
	} );
} );

describe( "Primary", () => {
	const expectedClassName = "yoast-button yoast-button--primary";
	it( "matches the Button snapshot", () => {
		shallowRenderer.render( <PrimaryButton onClick={ () => {} }>test</PrimaryButton> );

		const result = shallowRenderer.getRenderOutput();
		expect( result ).toMatchSnapshot();
		expect( result.props.className ).toBe( expectedClassName );
	} );

	it( "matches the Link snapshot", () => {
		shallowRenderer.render( <PrimaryLink href="#">test</PrimaryLink> );

		const result = shallowRenderer.getRenderOutput();
		expect( result ).toMatchSnapshot();
		expect( result.props.className ).toBe( expectedClassName );
	} );
} );

describe( "Secondary", () => {
	const expectedClassName = "yoast-button yoast-button--secondary";
	it( "matches the Button snapshot", () => {
		shallowRenderer.render( <SecondaryButton onClick={ () => {} }>test</SecondaryButton> );

		const result = shallowRenderer.getRenderOutput();
		expect( result ).toMatchSnapshot();
		expect( result.props.className ).toBe( expectedClassName );
	} );

	it( "matches the Link snapshot", () => {
		shallowRenderer.render( <SecondaryLink href="#">test</SecondaryLink> );

		const result = shallowRenderer.getRenderOutput();
		expect( result ).toMatchSnapshot();
		expect( result.props.className ).toBe( expectedClassName );
	} );
} );

describe( "Upsell", () => {
	const expectedClassName = "yoast-button yoast-button--buy";
	it( "matches the Button snapshot without caret", () => {
		shallowRenderer.render( <UpsellButton onClick={ () => {} }>test</UpsellButton> );

		const result = shallowRenderer.getRenderOutput();

		// Filter carets from children.
		const children = result.props.children;
		const carets = children.filter( element => element.props && element.props.className === "yoast-button--buy__caret" );

		// Carets not present in children.
		expect( carets.length ).toEqual( 0 );

		// General Upsell test
		expect( result ).toMatchSnapshot();
		expect( result.props.className ).toBe( expectedClassName );
	} );

	it( "matches the Link snapshot without caret", () => {
		shallowRenderer.render( <UpsellLink href="#">test</UpsellLink> );

		const result = shallowRenderer.getRenderOutput();

		// Filter carets from children.
		const children = result.props.children;
		const carets = children.filter( element => element.props && element.props.className === "yoast-button--buy__caret" );

		// Carets not present in children.
		expect( carets.length ).toEqual( 0 );

		// General Upsell test
		expect( result ).toMatchSnapshot();
		expect( result.props.className ).toBe( expectedClassName );
	} );

	it( "has a caret in the Button snapshot when caret is true", () => {
		shallowRenderer.render( <UpsellButton onClick={ () => {} } caret={ true }>test</UpsellButton> );

		const result = shallowRenderer.getRenderOutput();

		// Filter carets from children.
		const children = result.props.children;
		const carets = children.filter( element => element.props && element.props.className === "yoast-button--buy__caret" );

		// Carets present in children, with correct className.
		expect( carets.length ).toBeGreaterThan( 0 );
		expect( carets[ 0 ].props.className ).toBe( "yoast-button--buy__caret" );

		// General Upsell test.
		expect( result ).toMatchSnapshot();
		expect( result.props.className ).toBe( expectedClassName );
	} );

	it( "has a caret in the Link snapshot when caret is true", () => {
		shallowRenderer.render( <UpsellLink href="#" caret={ true }>test</UpsellLink> );

		const result = shallowRenderer.getRenderOutput();

		// Filter carets from children.
		const children = result.props.children;
		const carets = children.filter( element => element.props && element.props.className === "yoast-button--buy__caret" );

		// Carets present in children, with correct className.
		expect( carets.length ).toBeGreaterThan( 0 );
		expect( carets[ 0 ].props.className ).toBe( "yoast-button--buy__caret" );

		// General Upsell test.
		expect( result ).toMatchSnapshot();
		expect( result.props.className ).toBe( expectedClassName );
	} );
} );
