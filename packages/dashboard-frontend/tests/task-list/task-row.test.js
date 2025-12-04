import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskRow } from "../../src/task-list/components/task-row";
import { Table } from "@yoast/ui-library";

describe( "TaskRow", () => {
	const defaultProps = {
		title: "Test Task",
		duration: 10,
		priority: "medium",
		badge: "premium",
		isCompleted: false,
		onClick: jest.fn(),
	};

	const renderInTable = ( props ) => {
		return render(
			<Table>
				<Table.Body>
					<TaskRow { ...defaultProps } { ...props } />
				</Table.Body>
			</Table>
		);
	};

	it( "renders the task title", () => {
		renderInTable();
		expect( screen.getByText( "Test Task" ) ).toBeInTheDocument();
	} );

	it( "renders the duration", () => {
		renderInTable( { duration: 25 } );
		expect( screen.getByText( /25m/ ) ).toBeInTheDocument();
	} );

	it( "renders the priority", () => {
		renderInTable( { priority: "high" } );
		expect( screen.getByText( "High" ) ).toBeInTheDocument();
	} );

	it( "renders the badge if provided", () => {
		renderInTable( { badge: "ai" } );
		expect( screen.getByText( "AI+" ) ).toBeInTheDocument();
	} );

	it( "does not render a badge if not provided", () => {
		renderInTable( { badge: "" } );
		expect( screen.queryByText( /Premium|Woo SEO|AI\+/i ) ).not.toBeInTheDocument();
	} );

	it( "shows check icon when completed", () => {
		renderInTable( { isCompleted: true } );
		const checkIcon = document.querySelector( ".yst-text-green-500" );
		expect( checkIcon ).toBeInTheDocument();
	} );

	it( "shows ellipse icon when not completed", () => {
		renderInTable( { isCompleted: false } );
		const ellipseIcon = document.querySelector( ".yst-text-slate-200" );
		expect( ellipseIcon ).toBeInTheDocument();
	} );

	it( "calls onClick when button is clicked", () => {
		const onClick = jest.fn();
		renderInTable( { onClick } );
		const button = screen.getByLabelText( /open task modal/i );
		fireEvent.click( button );
		expect( onClick ).toHaveBeenCalled();
	} );
} );
