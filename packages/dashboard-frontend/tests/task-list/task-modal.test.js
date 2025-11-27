import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskModal } from "../../src/task-list/components/task-modal";

describe( "TaskModal", () => {
	const defaultProps = {
		isOpen: true,
		onClose: jest.fn(),
		callToAction: {
			label: "Start configuration",
			onClick: jest.fn(),
			type: "create",
			href: null,
		},
		title: "Complete the First-time configuration",
		duration: 15,
		priority: "high",
		taskId: "task-1",
		why: "Helping us understand your site will enable us to provide better SEO suggestions tailored to your needs.",
		how: "Answer a few questions about your website's type, audience, and content focus to set up the plugin effectively.",
		isCompleted: false,
	};

	it( "renders the modal when open", () => {
		render( <TaskModal { ...defaultProps } /> );
		expect( screen.getByText( /Complete the First-time configuration/i ) ).toBeInTheDocument();
	} );

	it( "displays the duration and unit", () => {
		render( <TaskModal { ...defaultProps } /> );
		expect( screen.queryByText( "15m" ) ).toBeInTheDocument();
	} );

	it( "shows the correct priority label", () => {
		render( <TaskModal { ...defaultProps } /> );
		expect( screen.getByText( /High/i ) ).toBeInTheDocument();
	} );

	it( "renders the why copy", () => {
		render( <TaskModal { ...defaultProps } /> );
		expect( screen.getByText( "Helping us understand your site will enable us to provide better SEO suggestions tailored to your needs." ) ).toBeInTheDocument();
	} );

	it( "renders the how copy", () => {
		render( <TaskModal { ...defaultProps } /> );
		expect( screen.getByText( "Answer a few questions about your website's type, audience, and content focus to set up the plugin effectively." ) ).toBeInTheDocument();
	} );

	it( "calls onClose when Close button is clicked, for both header and footer", () => {
		const onClose = jest.fn();
		render( <TaskModal { ...defaultProps } onClose={ onClose } isOpen={ true } /> );
		const closeButton = screen.getAllByRole( "button", { name: /close/i } );
		// Tests for each close button.
		closeButton.forEach( button => {
			fireEvent.click( button );
			expect( onClose ).toHaveBeenCalled();
		} );
	} );

	it( "calls callToAction onClick when CTA button is clicked", () => {
		render( <TaskModal { ...defaultProps } /> );
		fireEvent.click( screen.getByText( /Start configuration/i ) );
		expect( defaultProps.callToAction.onClick ).toHaveBeenCalled();
	} );

	describe( "when isCompleted is true", () => {
		const completedProps = {
			...defaultProps,
			isCompleted: true,
		};

		it( "disables the CTA button", () => {
			render( <TaskModal { ...completedProps } /> );
			const ctaButton = screen.getByText( /Start configuration/i ).closest( "button" );
			expect( ctaButton ).toBeDisabled();
		} );

		it( "applies gray styling to the title", () => {
			render( <TaskModal { ...completedProps } /> );
			const title = screen.getByText( /Complete the First-time configuration/i );
			expect( title ).toHaveClass( "yst-text-slate-500" );
		} );

		it( "renders the CompleteStatus component", () => {
			render( <TaskModal { ...completedProps } /> );
			expect( screen.queryByText( "Completed" ) ).toBeInTheDocument();
		} );

		it( "shows the visual separator (·) after CompleteStatus", () => {
			render( <TaskModal { ...completedProps } /> );
			const statusContainer = screen.getByText( /Complete the First-time configuration/i ).closest( "div" ).querySelector( ".yst-flex.yst-gap-1" );
			// When isCompleted is true, there should be two separators: one after CompleteStatus and one between Duration and Priority
			// Format should be like "CompleteStatus · 15m · High"
			const separatorCount = ( statusContainer.textContent.match( /·/g ) || [] ).length;
			expect( separatorCount ).toBe( 2 );
		} );

		it( "still displays duration and priority information", () => {
			render( <TaskModal { ...completedProps } /> );
			expect( screen.getByText( "15m" ) ).toBeInTheDocument();
			expect( screen.getByText( /High/i ) ).toBeInTheDocument();
		} );
	} );

	describe( "when isCompleted is false", () => {
		it( "does not apply gray styling to the title", () => {
			render( <TaskModal { ...defaultProps } /> );
			const title = screen.getByText( /Complete the First-time configuration/i );
			expect( title ).not.toHaveClass( "yst-text-slate-500" );
		} );

		it( "does not render the CompleteStatus component", () => {
			render( <TaskModal { ...defaultProps } /> );
			const statusContainer = screen.getByText( /Complete the First-time configuration/i ).closest( "div" ).querySelector( ".yst-flex.yst-gap-1" );
			// When isCompleted is false, the text should only contain duration and priority with one separator
			// Format should be like "15m · High" instead of "CompleteStatus · 15m · High"
			const separatorCount = ( statusContainer.textContent.match( /·/g ) || [] ).length;
			expect( separatorCount ).toBe( 1 );
			expect( screen.queryByText( "Completed" ) ).not.toBeInTheDocument();
		} );

		it( "enables the CTA button", () => {
			render( <TaskModal { ...defaultProps } /> );
			const ctaButton = screen.getByText( /Start configuration/i ).closest( "button" );
			expect( ctaButton ).not.toBeDisabled();
		} );
	} );

	describe( "when isLoading is true", () => {
		const loadingProps = {
			...defaultProps,
			isLoading: true,
		};

		it( "passes isLoading prop to the CallToActionButton", () => {
			render( <TaskModal { ...loadingProps } /> );
			const ctaButton = screen.getByText( /Generating…/i ).closest( "button" );
			expect( ctaButton ).toBeInTheDocument();
		} );

		it( "shows loading text instead of original CTA label", () => {
			render( <TaskModal { ...loadingProps } /> );
			expect( screen.queryByText( /Start configuration/i ) ).not.toBeInTheDocument();
			expect( screen.getByText( /Generating…/i ) ).toBeInTheDocument();
		} );

		it( "still renders modal content correctly while loading", () => {
			render( <TaskModal { ...loadingProps } /> );
			expect( screen.getByText( /Complete the First-time configuration/i ) ).toBeInTheDocument();
			expect( screen.getByText( "15m" ) ).toBeInTheDocument();
			expect( screen.getByText( /High/i ) ).toBeInTheDocument();
			expect( screen.getByText( "Helping us understand your site will enable us to provide better SEO suggestions tailored to your needs." ) ).toBeInTheDocument();
		} );

		describe( "with delete type CTA", () => {
			const deleteLoadingProps = {
				...loadingProps,
				callToAction: {
					...loadingProps.callToAction,
					type: "delete",
					label: "Delete task",
				},
			};

			it( "shows 'Deleting…' text for delete type CTA when loading", () => {
				render( <TaskModal { ...deleteLoadingProps } /> );
				expect( screen.queryByText( /Delete task/i ) ).not.toBeInTheDocument();
				expect( screen.getByText( /Deleting…/i ) ).toBeInTheDocument();
			} );
		} );
	} );
	describe( "when isError is true", () => {
		const errorProps = {
			...defaultProps,
			isError: true,
			errorMessage: "Custom error message.",
		};

		it( "renders the error alert", () => {
			render( <TaskModal { ...errorProps } /> );
			expect( screen.getByRole( "alert" ) ).toBeInTheDocument();
			expect( screen.getByText( /Oops! Something went wrong./i ) ).toBeInTheDocument();
			expect( screen.getByText( /Custom error message./i ) ).toBeInTheDocument();
		} );

		it( "displays default message when no errorMessage is provided", () => {
			const noMessageProps = {
				...defaultProps,
				isError: true,
			};
			render( <TaskModal { ...noMessageProps } /> );
			expect( screen.getByRole( "alert" ) ).toBeInTheDocument();
			expect( screen.getByText( /Oops! Something went wrong./i ) ).toBeInTheDocument();
			expect( screen.getByText( /Please try again./i ) ).toBeInTheDocument();
		} );
	} );
} );
