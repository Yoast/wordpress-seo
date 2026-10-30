import React from "react";
import renderer, { act } from "react-test-renderer";
import { noop } from "lodash";
import AnalysisResult, { MarkButton } from "../src/AnalysisResult.js";

test( "the AnalysisResult component matches the snapshot", () => {
	const component = renderer.create(
		<AnalysisResult
			ariaLabelMarks="SEOResult"
			ariaLabelEdit="SEOResultEdit"
			bulletColor="blue"
			buttonIdMarks="Result button"
			buttonIdEdit="Result button edit"
			pressed={ true }
			hasMarksButton={ true }
			hasEditButton={ true }
			onButtonClickMarks={ noop }
			onButtonClickEdit={ noop }
			text={ "You're doing great!" }
			score="good"
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the AnalysisResult component with html in the text matches the snapshot", () => {
	const component = renderer.create(
		<AnalysisResult
			ariaLabelMarks="SEOResult"
			ariaLabelEdit="SEOResultEdit"
			bulletColor="blue"
			buttonIdMarks="Result button"
			buttonIdEdit="Result button edit"
			pressed={ true }
			hasMarksButton={ true }
			hasEditButton={ true }
			onButtonClickMarks={ noop }
			onButtonClickEdit={ noop }
			text={ "You're doing <b>great!</b>" }
			score="good"
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the AnalysisResult component with disabled buttons matches the snapshot", () => {
	const component = renderer.create(
		<AnalysisResult
			ariaLabelMarks="SEOResult"
			ariaLabelEdit="SEOResultEdit"
			bulletColor="blue"
			buttonIdMarks="Result button"
			buttonIdEdit="Result button edit"
			pressed={ true }
			hasMarksButton={ true }
			hasEditButton={ true }
			onButtonClickMarks={ noop }
			onButtonClickEdit={ noop }
			text={ "You're doing great!" }
			score="good"
			marksButtonStatus={ "disabled" }
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the AnalysisResult component with hidden buttons matches the snapshot", () => {
	const component = renderer.create(
		<AnalysisResult
			ariaLabelMarks="SEOResult"
			ariaLabelEdit="SEOResultEdit"
			bulletColor="blue"
			buttonIdMarks="Result button"
			buttonIdEdit="Result button edit"
			pressed={ true }
			hasMarksButton={ true }
			hasEditButton={ true }
			onButtonClickMarks={ noop }
			onButtonClickEdit={ noop }
			text={ "You're doing great!" }
			score="good"
			marksButtonStatus={ "hidden" }
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the AnalysisResult component with suppressed text matches the snapshot", () => {
	const component = renderer.create(
		<AnalysisResult
			ariaLabelMarks="SEOResult"
			ariaLabelEdit="SEOResultEdit"
			bulletColor="blue"
			suppressedText={ true }
			buttonIdMarks="Result button"
			buttonIdEdit="Result button edit"
			pressed={ true }
			hasMarksButton={ true }
			hasEditButton={ true }
			onButtonClickMarks={ noop }
			onButtonClickEdit={ noop }
			text={ "You're doing great!" }
			score="good"
			marksButtonStatus={ "hidden" }
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the AnalysisResult component with a beta badge label matches the snapshot", () => {
	const component = renderer.create(
		<AnalysisResult
			ariaLabelMarks="SEOResult"
			ariaLabelEdit="SEOResultEdit"
			bulletColor="blue"
			buttonIdMarks="Result button"
			buttonIdEdit="Result button edit"
			pressed={ true }
			hasMarksButton={ true }
			hasEditButton={ true }
			onButtonClickMarks={ noop }
			onButtonClickEdit={ noop }
			text={ "This is beta!" }
			score="good"
			marksButtonStatus={ "hidden" }
			hasBetaBadgeLabel={ true }
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the AnalysisResult component with a activated premium matches the snapshot", () => {
	const component = renderer.create(
		<AnalysisResult
			ariaLabelMarks="SEOResult"
			ariaLabelEdit="SEOResultEdit"
			bulletColor="blue"
			buttonIdMarks="Result button"
			buttonIdEdit="Result button edit"
			pressed={ true }
			hasMarksButton={ true }
			hasEditButton={ true }
			onButtonClickMarks={ noop }
			onButtonClickEdit={ noop }
			text={ "This is beta!" }
			score="good"
			marksButtonStatus={ "hidden" }
			hasBetaBadgeLabel={ true }
			isPremium={ true }
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

describe( "the MarkButton tooltip", () => {
	let component;

	const getWrapper = () => component.root.find( node => node.type === "span" && node.props.onPointerEnter );
	const getButton = () => component.root.find( node => node.type === "button" );
	const isTooltipVisible = () => {
		const tooltip = component.root.find( node => node.type === "div" && node.props.role === "tooltip" );
		return ! tooltip.props.className.includes( "yst-hidden" );
	};

	beforeEach( () => {
		jest.useFakeTimers();
		act( () => {
			component = renderer.create(
				<MarkButton ariaLabel="Highlight this result in the text" id="testMark" onClick={ noop } isPressed={ false } />,
				{ createNodeMock: () => ( { getBoundingClientRect: () => ( { top: 0, right: 0, bottom: 0, left: 0 } ) } ) }
			);
		} );
	} );

	afterEach( () => {
		jest.useRealTimers();
	} );

	it( "shows on pointer enter and hides shortly after pointer leave", () => {
		act( () => getWrapper().props.onPointerEnter() );
		expect( isTooltipVisible() ).toBe( true );

		act( () => getWrapper().props.onPointerLeave() );
		expect( isTooltipVisible() ).toBe( true );

		act( () => jest.runAllTimers() );
		expect( isTooltipVisible() ).toBe( false );
	} );

	it( "stays visible when the pointer comes back before the hide delay ends", () => {
		act( () => getWrapper().props.onPointerEnter() );
		act( () => getWrapper().props.onPointerLeave() );
		act( () => getWrapper().props.onPointerEnter() );
		act( () => jest.runAllTimers() );

		expect( isTooltipVisible() ).toBe( true );
	} );

	it( "shows on focus and hides on blur", () => {
		act( () => getButton().props.onFocus( { target: { matches: () => true } } ) );
		expect( isTooltipVisible() ).toBe( true );

		act( () => getButton().props.onBlur() );
		expect( isTooltipVisible() ).toBe( false );
	} );

	it( "does not stay open on focus from a click once the pointer leaves", () => {
		act( () => getWrapper().props.onPointerEnter() );
		act( () => getButton().props.onFocus( { target: { matches: () => false } } ) );
		expect( isTooltipVisible() ).toBe( true );

		act( () => getWrapper().props.onPointerLeave() );
		act( () => jest.runAllTimers() );
		expect( isTooltipVisible() ).toBe( false );
	} );

	it( "stays dismissed after Escape when the pointer leaves the still focused button", () => {
		act( () => getWrapper().props.onPointerEnter() );
		act( () => getButton().props.onFocus( { target: { matches: () => true } } ) );
		act( () => getButton().props.onKeyDown( { key: "Escape", stopPropagation: noop } ) );
		expect( isTooltipVisible() ).toBe( false );

		act( () => getWrapper().props.onPointerLeave() );
		act( () => jest.runAllTimers() );
		expect( isTooltipVisible() ).toBe( false );
	} );

	it( "shows again on the next pointer enter after Escape", () => {
		act( () => getButton().props.onFocus( { target: { matches: () => true } } ) );
		act( () => getButton().props.onKeyDown( { key: "Escape", stopPropagation: noop } ) );
		expect( isTooltipVisible() ).toBe( false );

		act( () => getWrapper().props.onPointerEnter() );
		expect( isTooltipVisible() ).toBe( true );
	} );
} );
