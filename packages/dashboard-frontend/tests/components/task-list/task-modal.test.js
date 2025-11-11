import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskModal } from "../../../src/components/task-list/task-modal";
import { QuestionMarkCircleIcon } from "@heroicons/react/outline";

describe( "TaskModal", () => {
	const defaultProps = {
		isOpen: true,
		onClose: jest.fn(),
		callToAction: {
			content: "Start configuration",
			props: { onClick: jest.fn() },
		},
		title: "Complete the First-time configuration",
		duration: 15,
		priority: "high",
		detailsList: [
			{ Icon: QuestionMarkCircleIcon, title: "Why this matters", description: "Helping us understand your site will enable us to provide better SEO suggestions tailored to your needs." },
			{ Icon: QuestionMarkCircleIcon, title: "Set your site goals", description: "Defining clear goals for your site will help us provide more targeted recommendations." },
		],
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

	it( "renders all details in the list", () => {
		render( <TaskModal { ...defaultProps } /> );
		expect( screen.getByText( /Why this matters/i ) ).toBeInTheDocument();
		expect( screen.getByText( /Set your site goals/i ) ).toBeInTheDocument();
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
		expect( defaultProps.callToAction.props.onClick ).toHaveBeenCalled();
	} );
} );
