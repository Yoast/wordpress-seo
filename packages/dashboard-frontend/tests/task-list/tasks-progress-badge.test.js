import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TasksProgressBadge } from "../../src/task-list/components/tasks-progress-badge";

describe( "TasksProgressBadge", () => {
	it( "renders the label", () => {
		render( <TasksProgressBadge completedTasks={ 2 } totalTasks={ 5 } label="Tasks" /> );
		expect( screen.getByText( "Tasks" ) ).toBeInTheDocument();
	} );

	it( "renders the task count", () => {
		render( <TasksProgressBadge completedTasks={ 3 } totalTasks={ 10 } /> );
		expect( screen.getByText( "3" ) ).toBeInTheDocument();
		expect( screen.getByText( "/" ) ).toBeInTheDocument();
		expect( screen.getByText( "10" ) ).toBeInTheDocument();
	} );

	it( "shows 0 completed tasks correctly", () => {
		render( <TasksProgressBadge completedTasks={ 0 } totalTasks={ 5 } /> );
		expect( screen.getByText( "0" ) ).toBeInTheDocument();
		expect( screen.getByText( "/" ) ).toBeInTheDocument();
		expect( screen.getByText( "5" ) ).toBeInTheDocument();
	} );

	it( "shows all tasks completed correctly", () => {
		render( <TasksProgressBadge completedTasks={ 5 } totalTasks={ 5 } /> );
		const taskCount = screen.getAllByText( "5" );
		expect( screen.getByText( "/" ) ).toBeInTheDocument();
		expect( taskCount.length ).toBe( 2 );
	} );

	it( "includes screen reader text for progress", () => {
		const { container } = render( <TasksProgressBadge completedTasks={ 4 } totalTasks={ 8 } /> );
		const srText = container.querySelector( ".yst-sr-only" );
		expect( srText ).toBeInTheDocument();
		expect( srText ).toHaveTextContent( "4 out of 8 tasks completed" );
	} );

	it.each( [
		[ "0 tasks are completed", { completedTasks: 0, totalTasks: 0 } ],
		[ "all tasks are completed", { completedTasks: 5, totalTasks: 5 } ],
		[ "some tasks are completed", { completedTasks: 3, totalTasks: 5 } ],
		[ "with label", { completedTasks: 2, totalTasks: 4, label: "Tasks" } ],
	] )( "matches snapshot for when %s", ( _, { completedTasks, totalTasks, label } ) => {
		const { asFragment } = render(
			<TasksProgressBadge completedTasks={ completedTasks } totalTasks={ totalTasks } label={ label } />
		);
		expect( asFragment() ).toMatchSnapshot();
	} );

	it( "renders skeleton loaders when loading", () => {
		const { container } = render( <TasksProgressBadge completedTasks={ 0 } totalTasks={ 0 } isLoading={ true } /> );
		const skeletons = container.getElementsByClassName( "yst-skeleton-loader" );
		expect( skeletons.length ).toBe( 2 );
	} );

	it( "renders as a span by default", () => {
		const { container } = render( <TasksProgressBadge completedTasks={ 2 } totalTasks={ 5 } /> );
		expect( container.firstChild.tagName ).toBe( "SPAN" );
	} );

	it( "renders as a button when as='button' is provided", () => {
		const { container } = render( <TasksProgressBadge completedTasks={ 2 } totalTasks={ 5 } as="button" /> );
		expect( container.firstChild.tagName ).toBe( "BUTTON" );
	} );

	it( "renders as a div when as='div' is provided", () => {
		const { container } = render( <TasksProgressBadge completedTasks={ 2 } totalTasks={ 5 } as="div" /> );
		expect( container.firstChild.tagName ).toBe( "DIV" );
	} );

	it( "matches snapshot when rendered as a button", () => {
		const { asFragment } = render(
			<TasksProgressBadge completedTasks={ 2 } totalTasks={ 5 } as="button" />
		);
		expect( asFragment() ).toMatchSnapshot();
	} );

	it( "calls onClick with parentTaskId when both are provided and clicked", () => {
		const onClick = jest.fn();
		const { container } = render(
			<TasksProgressBadge completedTasks={ 2 } totalTasks={ 5 } onClick={ onClick } parentTaskId="task-1" as="button" />
		);
		fireEvent.click( container.firstChild );
		expect( onClick ).toHaveBeenCalledTimes( 1 );
		expect( onClick ).toHaveBeenCalledWith( "task-1" );
	} );
	it.each( [
		[ "parentTaskId is missing", { as: "button", onClick: jest.fn() } ],
		[ "onClick is missing", { as: "button", parentTaskId: "task-1" } ],
		[ "isLoading is true", { as: "button", onClick: jest.fn(), parentTaskId: "task-1", isLoading: true } ],
		[ "rendered as a span (default)", { onClick: jest.fn(), parentTaskId: "task-1" } ],
	] )( "does not call onClick when %s", ( _, props ) => {
		const { container } = render(
			<TasksProgressBadge completedTasks={ 2 } totalTasks={ 5 } { ...props } />
		);
		// Should not throw when clicked without an onClick handler.
		expect( () => fireEvent.click( container.firstChild ) ).not.toThrow();
	} );
} );
