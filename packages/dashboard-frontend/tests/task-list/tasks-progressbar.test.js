import React from "react";
import { render, screen } from "@testing-library/react";
import { TasksProgressBar } from "../../src/task-list/components/tasks-progressbar";

describe( "TasksProgressBar", () => {
	it( "renders the title", () => {
		render( <TasksProgressBar completedTasks={ 2 } totalTasks={ 5 } isLoading={ false } /> );
		expect( screen.getByText( "Tasks" ) ).toBeInTheDocument();
	} );

	it( "renders the progress bar and task count when not loading", () => {
		const { container } = render( <TasksProgressBar completedTasks={ 3 } totalTasks={ 10 } isLoading={ false } /> );
		const progressbar = container.querySelector( ".yst-progress-bar" );
		expect( progressbar ).toBeInTheDocument();
		expect( screen.getByText( "3" ) ).toBeInTheDocument();
		expect( screen.getByText( "/10" ) ).toBeInTheDocument();
	} );

	it( "renders skeleton loaders when loading", () => {
		const { container } = render( <TasksProgressBar completedTasks={ 0 } totalTasks={ 0 } isLoading={ true } /> );
		const skeletons = container.getElementsByClassName( "yst-skeleton-loader" );
		expect( skeletons.length ).toBe( 2 );
	} );

	it( "shows 0 completed tasks correctly", () => {
		render( <TasksProgressBar completedTasks={ 0 } totalTasks={ 5 } isLoading={ false } /> );
		expect( screen.getByText( "0" ) ).toBeInTheDocument();
		expect( screen.getByText( "/5" ) ).toBeInTheDocument();
	} );

	it( "shows all tasks completed correctly", () => {
		render( <TasksProgressBar completedTasks={ 5 } totalTasks={ 5 } isLoading={ false } /> );
		expect( screen.getByText( "5" ) ).toBeInTheDocument();
		expect( screen.getByText( "/5" ) ).toBeInTheDocument();
	} );

	it( "renders with totalTasks as 0", () => {
		render( <TasksProgressBar completedTasks={ 0 } totalTasks={ 0 } isLoading={ false } /> );
		expect( screen.getByText( "0" ) ).toBeInTheDocument();
		expect( screen.getByText( "/0" ) ).toBeInTheDocument();
	} );
	it( "does not render when completedTasks exceed totalTasks", () => {
		const { container } = render( <TasksProgressBar completedTasks={ 6 } totalTasks={ 5 } isLoading={ false } /> );
		expect( container.firstChild ).toBeNull();
	} );
} );
