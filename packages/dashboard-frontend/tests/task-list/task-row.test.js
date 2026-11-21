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
		const elements = screen.getAllByText( "Test Task"  );
		// Both mobile and desktop.
		expect( elements.length ).toBe( 2 );
	} );

	it( "renders the duration", () => {
		renderInTable( { duration: 25 } );
		const elements = screen.getAllByText( /25m/ );
		// Both mobile and desktop.
		expect( elements.length ).toBe( 2 );
	} );

	it( "renders the priority", () => {
		renderInTable( { priority: "high" } );
		const elements = screen.getAllByText( "High" );
		// Both mobile and desktop.
		expect( elements.length ).toBe( 2 );
	} );

	it( "shows check icon when completed", () => {
		renderInTable( { isCompleted: true } );
		const checkIcon = document.querySelector( ".yst-text-green-500" );
		expect( checkIcon ).toBeInTheDocument();
	} );

	it( "shows check 0 minutes when completed", () => {
		renderInTable( { isCompleted: true } );
		const elements = screen.getAllByText( /0m/ );
		// Both mobile and desktop.
		expect( elements.length ).toBe( 2 );
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
			const elements = screen.getAllByText( /30m/ );
			// Both mobile and desktop.
			expect( elements.length ).toBe( 2 );
		} );

		it( "formats minutes with English locale using 'm' abbreviation", () => {
			renderInTable( { duration: 30, locale: "en-US" } );
			const elements = screen.getAllByText( /30m/ );
			// Both mobile and desktop.
			expect( elements.length ).toBe( 2 );
		} );

		it( "formats hours with English locale using 'h' abbreviation", () => {
			renderInTable( { duration: 120, locale: "en-US" } );
			const elements = screen.getAllByText( /2h/ );
			// Both mobile and desktop.
			expect( elements.length ).toBe( 2 );
		} );

		it( "formats hours and minutes with English locale using 'h' and 'm' abbreviations", () => {
			renderInTable( { duration: 90, locale: "en-US" } );
			const elements = screen.getAllByText( /1h 30m/ );
			// Both mobile and desktop.
			expect( elements.length ).toBe( 2 );
		} );

		it( "formats hours and minutes with Japanese locale ", () => {
			renderInTable( { duration: 90, locale: "ja-JP" } );
			const elements = screen.getAllByText( /1時間30分/ );
			// Both mobile and desktop.
			expect( elements.length ).toBe( 2 );
		} );

		it( "formats hours  with Japanese locale ", () => {
			renderInTable( { duration: 60, locale: "ja-JP" } );
			const elements = screen.getAllByText( /1時間/ );
			// Both mobile and desktop.
			expect( elements.length ).toBe( 2 );
		} );

		it( "formats hours  with Japanese locale ", () => {
			renderInTable( { duration: 30, locale: "ja-JP" } );
			const elements = screen.getAllByText( /30分/ );
			// Both mobile and desktop.
			expect( elements.length ).toBe( 2 );
		} );

		it( "formats hours and minutes with German locale using 'Std.' and 'Min' abbreviations", () => {
			renderInTable( { duration: 90, locale: "de-DE" } );
			// 90 minutes = 1 hour 30 minutes in German (uses "h" and "min")
			const elements = screen.getAllByText( /1 Std. 30 Min/ );
			// Both mobile and desktop.
			expect( elements.length ).toBe( 2 );
		} );

		it( "formats minutes with Italian locale using 'min' abbreviation", () => {
			renderInTable( { duration: 35, locale: "it-IT" } );
			const elements = screen.getAllByText( "35min" );
			// Both mobile and desktop.
			expect( elements.length ).toBe( 2 );
		} );
	} );
} );
