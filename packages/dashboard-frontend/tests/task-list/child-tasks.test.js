import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChildTasks } from "../../src/task-list/components/child-tasks";

describe( "ChildTasks", () => {
	const mockTasks = [
		{
			id: "child-task-1",
			title: "First child task",
			duration: 10,
			priority: "high",
			isCompleted: true,
			parentTaskId: "parent-1",
		},
		{
			id: "child-task-2",
			title: "Second child task",
			duration: 15,
			priority: "medium",
			isCompleted: false,
			parentTaskId: "parent-1",
		},
		{
			id: "child-task-3",
			title: "Third child task",
			duration: 20,
			priority: "low",
			isCompleted: false,
			parentTaskId: "parent-1",
		},
		{
			id: "child-task-4",
			title: "Fourth child task",
			duration: 5,
			priority: "high",
			isCompleted: true,
			parentTaskId: "parent-1",
		},
		{
			id: "child-task-5",
			title: "Fifth child task",
			duration: 12,
			priority: "medium",
			isCompleted: false,
			parentTaskId: "parent-1",
		},
	];

	const mockOnClick = jest.fn();

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	it( "renders the progress bar with correct values", () => {
		render( <ChildTasks tasks={ mockTasks } singleTaskOnClick={ mockOnClick } /> );
		expect( screen.getByText( "Progress" ) ).toBeInTheDocument();
		expect( screen.getByText( "2" ) ).toBeInTheDocument();
		expect( screen.getByText( ( content, element ) => element.textContent === "2/5" ) ).toBeInTheDocument();
	} );

	it( "renders the first page of tasks (4 tasks per page)", () => {
		render( <ChildTasks tasks={ mockTasks } singleTaskOnClick={ mockOnClick } /> );
		expect( screen.getByText( "First child task" ) ).toBeInTheDocument();
		expect( screen.getByText( "Second child task" ) ).toBeInTheDocument();
		expect( screen.getByText( "Third child task" ) ).toBeInTheDocument();
		expect( screen.getByText( "Fourth child task" ) ).toBeInTheDocument();
		expect( screen.queryByText( "Fifth child task" ) ).not.toBeInTheDocument();
	} );

	it( "displays the correct page indicator", () => {
		render( <ChildTasks tasks={ mockTasks } singleTaskOnClick={ mockOnClick } /> );
		expect( screen.getByText( "Page 1 out of 2" ) ).toBeInTheDocument();
	} );

	it( "disables Previous button on first page", () => {
		render( <ChildTasks tasks={ mockTasks } singleTaskOnClick={ mockOnClick } /> );
		const previousButton = screen.getByText( "Previous" ).closest( "button" );
		expect( previousButton ).toBeDisabled();
	} );

	it( "enables Next button when there are more pages", () => {
		render( <ChildTasks tasks={ mockTasks } singleTaskOnClick={ mockOnClick } /> );
		const nextButton = screen.getByText( "Next" ).closest( "button" );
		expect( nextButton ).not.toBeDisabled();
	} );

	it( "navigates to the next page when Next button is clicked", () => {
		render( <ChildTasks tasks={ mockTasks } singleTaskOnClick={ mockOnClick } /> );
		const nextButton = screen.getByText( "Next" ).closest( "button" );
		fireEvent.click( nextButton );

		expect( screen.queryByText( "First child task" ) ).not.toBeInTheDocument();
		expect( screen.getByText( "Fifth child task" ) ).toBeInTheDocument();
		expect( screen.getByText( "Page 2 out of 2" ) ).toBeInTheDocument();
	} );

	it( "navigates to the previous page when Previous button is clicked", () => {
		render( <ChildTasks tasks={ mockTasks } singleTaskOnClick={ mockOnClick } /> );
		const nextButton = screen.getByText( "Next" ).closest( "button" );
		fireEvent.click( nextButton );

		const previousButton = screen.getByText( "Previous" ).closest( "button" );
		fireEvent.click( previousButton );

		expect( screen.getByText( "First child task" ) ).toBeInTheDocument();
		expect( screen.queryByText( "Fifth child task" ) ).not.toBeInTheDocument();
		expect( screen.getByText( "Page 1 out of 2" ) ).toBeInTheDocument();
	} );

	it( "disables Next button on last page", () => {
		render( <ChildTasks tasks={ mockTasks } singleTaskOnClick={ mockOnClick } /> );
		const nextButton = screen.getByText( "Next" ).closest( "button" );
		fireEvent.click( nextButton );

		expect( nextButton ).toBeDisabled();
	} );

	it( "enables Previous button on the second page", () => {
		render( <ChildTasks tasks={ mockTasks } singleTaskOnClick={ mockOnClick } /> );
		const nextButton = screen.getByText( "Next" ).closest( "button" );
		fireEvent.click( nextButton );

		const previousButton = screen.getByText( "Previous" ).closest( "button" );
		expect( previousButton ).not.toBeDisabled();
	} );

	it( "calls singleTaskOnClick when a task is clicked", () => {
		render( <ChildTasks tasks={ mockTasks } singleTaskOnClick={ mockOnClick } /> );
		const taskButton = screen.getByText( "First child task" ).closest( "button" );
		fireEvent.click( taskButton );

		expect( mockOnClick ).toHaveBeenCalledWith( "child-task-1" );
	} );

	it.each( [
		[ "empty array", [] ],
		[ "null", null ],
		[ "undefined", undefined ],
	] )( "displays 'No tasks detected' message when tasks is %s", ( _, tasks ) => {
		render( <ChildTasks tasks={ tasks } singleTaskOnClick={ mockOnClick } /> );
		expect( screen.getByText( "No tasks detected" ) ).toBeInTheDocument();
	} );

	it.each( [
		[ "empty array", [] ],
		[ "null", null ],
		[ "undefined", undefined ],
	] )( "does not render progress bar or pagination when tasks is %s", ( _, tasks ) => {
		render( <ChildTasks tasks={ tasks } singleTaskOnClick={ mockOnClick } /> );
		expect( screen.queryByText( "Progress" ) ).not.toBeInTheDocument();
		expect( screen.queryByText( "Previous" ) ).not.toBeInTheDocument();
		expect( screen.queryByText( "Next" ) ).not.toBeInTheDocument();
	} );

	it( "renders correctly with exactly 4 tasks (single page)", () => {
		const fourTasks = mockTasks.slice( 0, 4 );
		render( <ChildTasks tasks={ fourTasks } singleTaskOnClick={ mockOnClick } /> );

		expect( screen.getByText( "Page 1 out of 1" ) ).toBeInTheDocument();
		const nextButton = screen.getByText( "Next" ).closest( "button" );
		const previousButton = screen.getByText( "Previous" ).closest( "button" );
		expect( nextButton ).toBeDisabled();
		expect( previousButton ).toBeDisabled();
	} );

	it( "renders correctly with only 1 task", () => {
		const singleTask = [ mockTasks[ 0 ] ];
		render( <ChildTasks tasks={ singleTask } singleTaskOnClick={ mockOnClick } /> );

		expect( screen.getByText( "First child task" ) ).toBeInTheDocument();
		expect( screen.getByText( "Page 1 out of 1" ) ).toBeInTheDocument();
		expect( screen.getByText( ( content, element ) => element.textContent === "1/1" ) ).toBeInTheDocument();
	} );

	it( "calculates pagination correctly with 9 tasks (3 pages)", () => {
		const nineTasks = [
			...mockTasks,
			{ id: "child-task-6", title: "Sixth task", duration: 10, priority: "low", isCompleted: false, parentTaskId: "parent-1" },
			{ id: "child-task-7", title: "Seventh task", duration: 10, priority: "low", isCompleted: false, parentTaskId: "parent-1" },
			{ id: "child-task-8", title: "Eighth task", duration: 10, priority: "low", isCompleted: false, parentTaskId: "parent-1" },
			{ id: "child-task-9", title: "Ninth task", duration: 10, priority: "low", isCompleted: false, parentTaskId: "parent-1" },
		];
		render( <ChildTasks tasks={ nineTasks } singleTaskOnClick={ mockOnClick } /> );

		expect( screen.getByText( "Page 1 out of 3" ) ).toBeInTheDocument();

		// Navigate to page 2
		const nextButton = screen.getByText( "Next" ).closest( "button" );
		fireEvent.click( nextButton );
		expect( screen.getByText( "Page 2 out of 3" ) ).toBeInTheDocument();

		// Navigate to page 3
		fireEvent.click( nextButton );
		expect( screen.getByText( "Page 3 out of 3" ) ).toBeInTheDocument();
		expect( screen.getByText( "Ninth task" ) ).toBeInTheDocument();
	} );

	it( "resets to page 1 when parentTaskId changes", () => {
		const tasksWithParent1 = mockTasks;
		const { rerender } = render( <ChildTasks tasks={ tasksWithParent1 } singleTaskOnClick={ mockOnClick } /> );

		// Navigate to page 2
		const nextButton = screen.getByText( "Next" ).closest( "button" );
		fireEvent.click( nextButton );
		expect( screen.getByText( "Page 2 out of 2" ) ).toBeInTheDocument();

		// Change parent task ID
		const tasksWithParent2 = mockTasks.map( task => ( { ...task, parentTaskId: "parent-2" } ) );
		rerender( <ChildTasks tasks={ tasksWithParent2 } singleTaskOnClick={ mockOnClick } /> );

		// Should reset to page 1
		expect( screen.getByText( "Page 1 out of 2" ) ).toBeInTheDocument();
	} );

	it( "renders with all tasks completed", () => {
		const completedTasks = mockTasks.map( task => ( { ...task, isCompleted: true } ) );
		render( <ChildTasks tasks={ completedTasks } singleTaskOnClick={ mockOnClick } /> );

		expect( screen.getByText( ( content, element ) => element.textContent === "5/5" ) ).toBeInTheDocument();
	} );

	it( "renders with no tasks completed", () => {
		const incompleteTasks = mockTasks.map( task => ( { ...task, isCompleted: false } ) );
		render( <ChildTasks tasks={ incompleteTasks } singleTaskOnClick={ mockOnClick } /> );

		expect( screen.getByText( ( content, element ) => element.textContent === "0/5" ) ).toBeInTheDocument();
	} );

	it( "includes screen reader text for pagination", () => {
		const { container } = render( <ChildTasks tasks={ mockTasks } singleTaskOnClick={ mockOnClick } /> );
		const srTexts = container.querySelectorAll( ".yst-sr-only" );

		// Should have sr-only text in both Previous and Next buttons
		expect( srTexts.length ).toBeGreaterThanOrEqual( 2 );
		expect( container.textContent ).toContain( "Child tasks, current page 1" );
	} );
} );
