import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { noop } from "lodash";
import AnalysisResult, { MarkButton } from "../src/AnalysisResult.js";

test( "the AnalysisResult component matches the snapshot", () => {
	const { container } = render(
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

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "the AnalysisResult component with html in the text matches the snapshot", () => {
	const { container } = render(
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

	expect( container.firstChild ).toMatchSnapshot();
	expect( container.querySelector( "b" ) ).not.toBeNull();
	expect( container.querySelector( "b" ).textContent ).toBe( "great!" );
} );

test( "the AnalysisResult component with disabled buttons matches the snapshot", () => {
	const { container } = render(
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

	expect( container.firstChild ).toMatchSnapshot();
	expect( screen.getByRole( "button", { name: "SEOResult" } ).disabled ).toBe( true );
} );

test( "the AnalysisResult component with hidden buttons matches the snapshot", () => {
	const { container } = render(
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

	expect( container.firstChild ).toMatchSnapshot();
	expect( screen.queryByRole( "button", { name: "SEOResult" } ) ).toBeNull();
} );

test( "the AnalysisResult component with suppressed text matches the snapshot", () => {
	const { container } = render(
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

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "the AnalysisResult component with a beta badge label matches the snapshot", () => {
	const { container } = render(
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

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "the AnalysisResult component with a activated premium matches the snapshot", () => {
	const { container } = render(
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

	expect( container.firstChild ).toMatchSnapshot();
} );

describe( "the MarkButton tooltip", () => {
	let container;

	const getWrapper = () => container.querySelector( "span.yst-inline-flex" );
	const getButton = () => screen.getByRole( "button" );
	const isTooltipVisible = () => ! container.querySelector( "[role='tooltip']" ).classList.contains( "yst-hidden" );

	/**
	 * Focuses the button, faking whether the browser would show a focus ring for it.
	 *
	 * @param {boolean} isFocusVisible Whether the button matches :focus-visible.
	 *
	 * @returns {void}
	 */
	const focusButton = ( isFocusVisible ) => {
		const button = getButton();
		// Only fake the match during the focus event: role queries use `matches` too.
		const matches = jest.spyOn( button, "matches" ).mockReturnValue( isFocusVisible );
		fireEvent.focus( button );
		matches.mockRestore();
	};

	beforeEach( () => {
		jest.useFakeTimers();
		( { container } = render(
			<MarkButton ariaLabel="Highlight this result in the text" id="testMark" onClick={ noop } isPressed={ false } />
		) );
	} );

	afterEach( () => {
		jest.useRealTimers();
	} );

	it( "shows on pointer enter and hides shortly after pointer leave", () => {
		fireEvent.pointerEnter( getWrapper() );
		expect( isTooltipVisible() ).toBe( true );

		fireEvent.pointerLeave( getWrapper() );
		expect( isTooltipVisible() ).toBe( true );

		act( () => jest.runAllTimers() );
		expect( isTooltipVisible() ).toBe( false );
	} );

	it( "stays visible when the pointer comes back before the hide delay ends", () => {
		fireEvent.pointerEnter( getWrapper() );
		fireEvent.pointerLeave( getWrapper() );
		fireEvent.pointerEnter( getWrapper() );
		act( () => jest.runAllTimers() );

		expect( isTooltipVisible() ).toBe( true );
	} );

	it( "shows on focus and hides on blur", () => {
		focusButton( true );
		expect( isTooltipVisible() ).toBe( true );

		fireEvent.blur( getButton() );
		expect( isTooltipVisible() ).toBe( false );
	} );

	it( "does not stay open on focus from a click once the pointer leaves", () => {
		fireEvent.pointerEnter( getWrapper() );
		focusButton( false );
		expect( isTooltipVisible() ).toBe( true );

		fireEvent.pointerLeave( getWrapper() );
		act( () => jest.runAllTimers() );
		expect( isTooltipVisible() ).toBe( false );
	} );

	it( "stays dismissed after Escape when the pointer leaves the still focused button", () => {
		fireEvent.pointerEnter( getWrapper() );
		focusButton( true );
		fireEvent.keyDown( getButton(), { key: "Escape" } );
		expect( isTooltipVisible() ).toBe( false );

		fireEvent.pointerLeave( getWrapper() );
		act( () => jest.runAllTimers() );
		expect( isTooltipVisible() ).toBe( false );
	} );

	it( "shows again on the next pointer enter after Escape", () => {
		focusButton( true );
		fireEvent.keyDown( getButton(), { key: "Escape" } );
		expect( isTooltipVisible() ).toBe( false );

		fireEvent.pointerEnter( getWrapper() );
		expect( isTooltipVisible() ).toBe( true );
	} );
} );
