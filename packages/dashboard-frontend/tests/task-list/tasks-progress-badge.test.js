import React from "react";
import { render, screen } from "@testing-library/react";
import { TasksProgressBadge } from "../../src/task-list/components/tasks-progress-badge";

describe( "TasksProgressBadge", () => {
	it( "renders the label", () => {
		render( <TasksProgressBadge completedTasks={ 2 } totalTasks={ 5 } label="Tasks" /> );
		expect( screen.getByText( "Tasks" ) ).toBeInTheDocument();
	} );

	it( "renders the task count", () => {
		render( <TasksProgressBadge completedTasks={ 3 } totalTasks={ 10 } /> );
		expect( screen.getByText( "3" ) ).toBeInTheDocument();
		expect( screen.getByText( "/10" ) ).toBeInTheDocument();
	} );

	it( "shows 0 completed tasks correctly", () => {
		render( <TasksProgressBadge completedTasks={ 0 } totalTasks={ 5 } /> );
		expect( screen.getByText( "0" ) ).toBeInTheDocument();
		expect( screen.getByText( "/5" ) ).toBeInTheDocument();
	} );

	it( "shows all tasks completed correctly", () => {
		render( <TasksProgressBadge completedTasks={ 5 } totalTasks={ 5 } /> );
		expect( screen.getByText( "5" ) ).toBeInTheDocument();
		expect( screen.getByText( "/5" ) ).toBeInTheDocument();
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
	] )( "matches snapshot for when %s", ( _, { completedTasks, totalTasks } ) => {
		const { asFragment } = render(
			<TasksProgressBadge completedTasks={ completedTasks } totalTasks={ totalTasks } />
		);
		expect( asFragment() ).toMatchSnapshot();
	} );
} );
