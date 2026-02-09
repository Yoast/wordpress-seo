import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskRow } from "../../src/task-list/components/task-row";
import { TaskListTable } from "../../src/task-list/components/task-list-table";
import { TaskListProvider } from "../../src/task-list/task-list-context";

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
		const locale = props?.locale || "en-US";
		return render(
			<TaskListProvider locale={ locale }>
				<TaskListTable>
					<TaskRow { ...defaultProps } { ...props } />
				</TaskListTable>
			</TaskListProvider>
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

	it( "shows check 0 minutes when completed", () => {
		renderInTable( { isCompleted: true } );
		expect( screen.getByText( /0m/ ) ).toBeInTheDocument();
	} );

	it( "shows ellipse icon when not completed", () => {
		renderInTable( { isCompleted: false } );
		const ellipseIcon = document.querySelector( ".yst-text-primary-500" );
		expect( ellipseIcon ).toBeInTheDocument();
	} );

	it( "calls onClick when button is clicked", () => {
		const onClick = jest.fn();
		renderInTable( { onClick } );
		const button = screen.getByLabelText( /open task modal/i );
		fireEvent.click( button );
		expect( onClick ).toHaveBeenCalled();
	} );
	it( "loading task row matches snapshot", () => {
		const { asFragment } = render(
			<TaskListTable>
				<TaskRow.Loading titleClassName="yst-w-60" />
			</TaskListTable>
		);
		expect( asFragment() ).toMatchSnapshot();
	} );

	describe( "locale context", () => {
		it( "formats duration with default locale when no locale is provided", () => {
			renderInTable( { duration: 30 } );
			// Default locale is "en-US" in the TaskListProvider
			expect( screen.getByText( /30m/ ) ).toBeInTheDocument();
		} );

		it( "formats minutes with English locale using 'm' abbreviation", () => {
			renderInTable( { duration: 30, locale: "en-US" } );
			expect( screen.getByText( /30m/ ) ).toBeInTheDocument();
		} );

		it( "formats hours with English locale using 'h' abbreviation", () => {
			renderInTable( { duration: 120, locale: "en-US" } );
			expect( screen.getByText( /2h/ ) ).toBeInTheDocument();
		} );

		it( "formats hours and minutes with English locale using 'h' and 'm' abbreviations", () => {
			renderInTable( { duration: 90, locale: "en-US" } );
			expect( screen.getByText( /1h 30m/ ) ).toBeInTheDocument();
		} );

		it( "formats hours and minutes with Japanese locale ", () => {
			renderInTable( { duration: 90, locale: "ja-JP" } );
			expect( screen.getByText( /1時間30分/ ) ).toBeInTheDocument();
		} );

		it( "formats hours  with Japanese locale ", () => {
			renderInTable( { duration: 60, locale: "ja-JP" } );
			expect( screen.getByText( /1時間/ ) ).toBeInTheDocument();
		} );

		it( "formats hours  with Japanese locale ", () => {
			renderInTable( { duration: 30, locale: "ja-JP" } );
			expect( screen.getByText( /30分/ ) ).toBeInTheDocument();
		} );

		it( "formats hours and minutes with German locale using 'Std.' and 'Min' abbreviations", () => {
			renderInTable( { duration: 90, locale: "de-DE" } );
			// 90 minutes = 1 hour 30 minutes in German (uses "h" and "min")
			expect( screen.getByText( /1 Std. 30 Min/ ) ).toBeInTheDocument();
		} );

		it( "formats minutes with Italian locale using 'min' abbreviation", () => {
			renderInTable( { duration: 35, locale: "it-IT" } );
			expect( screen.getByText( /35min/ ) ).toBeInTheDocument();
		} );
	} );
} );
