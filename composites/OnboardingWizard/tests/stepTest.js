jest.unmock( "../Step" );
jest.unmock( "prop-types" );

import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import Step from "../Step";

describe( "a step component", () => {
	let inputProps = {
		id: "",
		title: "Title",
		fields: {},
		components: {},
		currentStep: "",
		nextStep: () => {},
		previousStep: () => {},
	};

	const renderer = new ReactShallowRenderer();
	renderer.render( <Step { ...inputProps } /> );

	const stepComponent = renderer.getRenderOutput();

	it( "has div container with correct id", () => {
		expect( stepComponent.type ).toEqual( "div" );
		expect( stepComponent.props.className ).toEqual( "yoast-wizard--step--container" );
	} );

	it( "has a h1 header title", () => {
		const header = stepComponent.props.children[ 0 ];

		expect( header.type ).toEqual( "h1" );
		expect( header.props.children ).toEqual( inputProps.title );
	} );

	it( "throws an error when required property title is missing", () => {
		console.error = jest.genMockFn();

		renderer.render( <Step /> );
		renderer.getRenderOutput();

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type" );
	} );

	it( "throws an error when property fields is not an object ", () => {
		console.error = jest.genMockFn();

		inputProps = {
			fields: "",
			title: "Title",
		};

		renderer.render( <Step { ...inputProps } /> );
		renderer.getRenderOutput();

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type: Invalid prop `fields` of type `string` supplied to `Step`," +
			            " expected `object`." );
	} );

	it( "throws an error when property title is not a string", () => {
		console.error = jest.genMockFn();

		inputProps = {
			title: 1,
		};

		renderer.render( <Step { ...inputProps } /> );
		renderer.getRenderOutput();

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type: Invalid prop `title` of type `number` supplied to `Step`, expected `string`." );
	} );

	it( "throws an error when property currentStep is not a string", () => {
		console.error = jest.genMockFn();

		inputProps = {
			title: "Title",
			currentStep: false,
		};

		renderer.render( <Step { ...inputProps } /> );
		renderer.getRenderOutput();

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[ 0 ][ 0 ] )
			.toContain( "Warning: Failed prop type: Invalid prop `currentStep` of type `boolean` supplied to `Step`, expected `string`." );
	} );
} );
