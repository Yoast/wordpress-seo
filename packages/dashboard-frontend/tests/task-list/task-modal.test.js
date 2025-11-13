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

	it( "calls onClose when Close button is clicked", () => {
		const onClose = jest.fn();
		render( <TaskModal { ...defaultProps } onClose={ onClose } isOpen={ true } /> );
		const closeButton = screen.getAllByRole( "button" )[ 1 ];
		fireEvent.click( closeButton );
		expect( onClose ).toHaveBeenCalled();
	} );

	it( "calls callToAction onClick when CTA button is clicked", () => {
		render( <TaskModal { ...defaultProps } /> );
		fireEvent.click( screen.getByText( /Start configuration/i ) );
		expect( defaultProps.callToAction.onClick ).toHaveBeenCalled();
	} );

	it( "disables the CTA button when isCompleted is true", () => {
		render( <TaskModal { ...defaultProps } isCompleted={ true } /> );
		const ctaButton = screen.getByText( /Start configuration/i ).closest( "button" );
		expect( ctaButton ).toBeDisabled();
	} );
} );
