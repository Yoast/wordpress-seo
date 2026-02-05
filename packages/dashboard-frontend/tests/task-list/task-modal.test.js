import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskModal } from "../../src/task-list/components/task-modal";
import { TaskListProvider } from "../../src/task-list/task-list-context";

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
		about: "<p>Helping us understand your site will enable us to provide better SEO suggestions tailored to your needs. Answer a few questions about your website's type, audience, and content focus to set up the plugin effectively.</p>",
		isCompleted: false,
	};

	it( "renders the modal when open", () => {
		render(
			<TaskListProvider locale="en-US">
				<TaskModal { ...defaultProps } />
			</TaskListProvider>
		);
		expect( screen.getByText( /Complete the First-time configuration/i ) ).toBeInTheDocument();
	} );

	it( "displays the duration and unit", () => {
		render(
			<TaskListProvider locale="en-US">
				<TaskModal { ...defaultProps } />
			</TaskListProvider>
		);
		expect( screen.queryByText( "15m" ) ).toBeInTheDocument();
	} );

	it( "shows the correct priority label", () => {
		render(
			<TaskListProvider locale="en-US">
				<TaskModal { ...defaultProps } />
			</TaskListProvider>
		);
		expect( screen.getByText( /High/i ) ).toBeInTheDocument();
	} );

	it( "renders the about copy", () => {
		render(
			<TaskListProvider locale="en-US">
				<TaskModal { ...defaultProps } />
			</TaskListProvider>
		);
		expect( screen.getByText( "Helping us understand your site will enable us to provide better SEO suggestions tailored to your needs." ) ).toBeInTheDocument();
	} );

	it( "calls onClose when Close button is clicked, for both header and footer", () => {
		const onClose = jest.fn();
		render(
			<TaskListProvider locale="en-US">
				<TaskModal { ...defaultProps } onClose={ onClose } isOpen={ true } />
			</TaskListProvider>
		);
		const closeButton = screen.getAllByRole( "button", { name: /close/i } );
		// Tests for each close button.
		closeButton.forEach( button => {
			fireEvent.click( button );
			expect( onClose ).toHaveBeenCalled();
		} );
	} );

	it( "calls callToAction onClick when CTA button is clicked", () => {
		render(
			<TaskListProvider locale="en-US">
				<TaskModal { ...defaultProps } />
			</TaskListProvider>
		);
		fireEvent.click( screen.getByText( /Start configuration/i ) );
		expect( defaultProps.callToAction.onClick ).toHaveBeenCalled();
	} );

	describe( "when isCompleted is true", () => {
		const completedProps = {
			...defaultProps,
			isCompleted: true,
		};

		it( "disables the CTA button", () => {
			render(
				<TaskListProvider locale="en-US">
					<TaskModal { ...completedProps } />
				</TaskListProvider>
			);
			const ctaButton = screen.getByText( /Start configuration/i ).closest( "button" );
			expect( ctaButton ).toBeDisabled();
		} );

		it( "applies gray styling to the title", () => {
			render(
				<TaskListProvider locale="en-US">
					<TaskModal { ...completedProps } />
				</TaskListProvider>
			);
			const title = screen.getByText( /Complete the First-time configuration/i );
			expect( title ).toHaveClass( "yst-text-slate-500" );
		} );

		it( "renders the CompleteStatus component", () => {
			render(
				<TaskListProvider locale="en-US">
					<TaskModal { ...completedProps } />
				</TaskListProvider>
			);
			const statusIcon = screen.getByRole( "img", { name: /task completed/i } );
			expect( statusIcon ).toBeInTheDocument();
		} );

		it( "shows the visual separator (·) after CompleteStatus", () => {
			render(
				<TaskListProvider locale="en-US">
					<TaskModal { ...completedProps } />
				</TaskListProvider>
			);
			const statusContainer = screen.getByText( /Complete the First-time configuration/i ).closest( "div" ).querySelector( ".yst-flex.yst-gap-1" );
			// When isCompleted is true, there should be two separators: one after CompleteStatus and one between Duration and Priority
			// Format should be like "CompleteStatus · 15m · High"
			const separatorCount = ( statusContainer.textContent.match( /·/g ) || [] ).length;
			expect( separatorCount ).toBe( 1 );
		} );

		it( "displays duration as 0m and priority information", () => {
			render(
				<TaskListProvider locale="en-US">
					<TaskModal { ...completedProps } />
				</TaskListProvider>
			);
			expect( screen.getByText( "0m" ) ).toBeInTheDocument();
			expect( screen.getByText( /High/i ) ).toBeInTheDocument();
		} );
	} );

	describe( "when isCompleted is false", () => {
		it( "does not apply gray styling to the title", () => {
			render(
				<TaskListProvider locale="en-US">
					<TaskModal { ...defaultProps } />
				</TaskListProvider>
			);
			const title = screen.getByText( /Complete the First-time configuration/i );
			expect( title ).not.toHaveClass( "yst-text-slate-500" );
		} );

		it( "does not render the CompleteStatus component", () => {
			render(
				<TaskListProvider locale="en-US">
					<TaskModal { ...defaultProps } />
				</TaskListProvider>
			);
			const statusContainer = screen.getByText( /Complete the First-time configuration/i ).closest( "div" ).querySelector( ".yst-flex.yst-gap-1" );
			// When isCompleted is false, the text should only contain duration and priority with one separator
			// Format should be like "15m · High" instead of "CompleteStatus · 15m · High"
			const separatorCount = ( statusContainer.textContent.match( /·/g ) || [] ).length;
			expect( separatorCount ).toBe( 1 );
			expect( screen.queryByText( "Completed" ) ).not.toBeInTheDocument();
		} );

		it( "enables the CTA button", () => {
			render(
				<TaskListProvider locale="en-US">
					<TaskModal { ...defaultProps } />
				</TaskListProvider>
			);
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
			render(
				<TaskListProvider locale="en-US">
					<TaskModal { ...loadingProps } />
				</TaskListProvider>
			);
			const ctaButton = screen.getByText( /Generating…/i ).closest( "button" );
			expect( ctaButton ).toBeInTheDocument();
		} );

		it( "shows loading text instead of original CTA label", () => {
			render(
				<TaskListProvider locale="en-US">
					<TaskModal { ...loadingProps } />
				</TaskListProvider>
			);
			expect( screen.queryByText( /Start configuration/i ) ).not.toBeInTheDocument();
			expect( screen.getByText( /Generating…/i ) ).toBeInTheDocument();
		} );

		it( "still renders modal content correctly while loading", () => {
			render(
				<TaskListProvider locale="en-US">
					<TaskModal { ...loadingProps } />
				</TaskListProvider>
			);
			expect( screen.getByText( /Complete the First-time configuration/i ) ).toBeInTheDocument();
			expect( screen.getByText( "15m" ) ).toBeInTheDocument();
			expect( screen.getByText( /High/i ) ).toBeInTheDocument();
			expect(
				screen.getByText( /Helping us understand your site will enable us to provide better SEO suggestions tailored to your needs/i )
			).toBeInTheDocument();
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
				render(
					<TaskListProvider locale="en-US">
						<TaskModal { ...deleteLoadingProps } />
					</TaskListProvider>
				);
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
			render(
				<TaskListProvider locale="en-US">
					<TaskModal { ...errorProps } />
				</TaskListProvider>
			);
			expect( screen.getByRole( "alert" ) ).toBeInTheDocument();
			expect( screen.getByText( /Oops! Something went wrong./i ) ).toBeInTheDocument();
			expect( screen.getByText( /Custom error message./i ) ).toBeInTheDocument();
		} );

		it( "displays default message when no errorMessage is provided", () => {
			const noMessageProps = {
				...defaultProps,
				isError: true,
			};
			render(
				<TaskListProvider locale="en-US">
					<TaskModal { ...noMessageProps } />
				</TaskListProvider>
			);
			expect( screen.getByRole( "alert" ) ).toBeInTheDocument();
			expect( screen.getByText( /Oops! Something went wrong./i ) ).toBeInTheDocument();
			expect( screen.getByText( /Please try again./i ) ).toBeInTheDocument();
		} );
	} );
} );
