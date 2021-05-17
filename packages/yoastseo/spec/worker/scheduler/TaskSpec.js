import Task from "../../../src/worker/scheduler/Task";

describe( "Worker Scheduler Task", () => {
	describe( "Throws errors when arguments are not the correct type", () => {
		const id = 0;
		const execute = () => {};
		const done = () => {};

		test( "task id has to be a number", () => {
			const error = new Error( "Task.id should be a number." );

			expect( () => new Task( "id", execute, done ) ).toThrow( error );
			expect( () => new Task( id, execute, done ) ).not.toThrow( error );
		} );

		test( "task execute has to be a function", () => {
			const error = new Error( "Task.execute should be a function." );

			expect( () => new Task( id, "execute", done ) ).toThrow( error );
			expect( () => new Task( id, execute, done ) ).not.toThrow( error );
		} );

		test( "task done has to be a function", () => {
			const error = new Error( "Task.done should be a function." );

			expect( () => new Task( id, execute, "done" ) ).toThrow( error );
			expect( () => new Task( id, execute, done ) ).not.toThrow( error );
		} );

		test( "task data has to be an object", () => {
			const error = new Error( "Task.data should be an object." );

			expect( () => new Task( id, execute, done, false ) ).toThrow( error );
			expect( () => new Task( id, execute, done, {} ) ).not.toThrow( error );
		} );
	} );
} );
