import { Assessment } from "../../../src/tree/assess";
import Paper from "../../../src/values/Paper";

describe( "Assessment", () => {
	let paper;
	beforeEach( () => {
		console.warn = jest.fn();
		paper = new Paper( "Potatoes and tomatoes", {
			title: "Potatoes and tomatoes",
			description: "Potatoes are tomatoes, do not let anyone tell you otherwise.",
			url: "http://example.com/potatoes-and-tomatoes",
		} );
	} );

	describe( "constructor", () => {
		it( "creates a new assessment instance", () => {
			const assessment = new Assessment( "lemons" );
			expect( assessment.name ).toEqual( "lemons" );
		} );
	} );

	describe( "isApplicable", () => {
		it( "logs a warning when it is called without being implemented", ( done ) => {
			const assessment = new Assessment();
			assessment.isApplicable( paper, null ).then( () => {
				expect( console.warn ).toBeCalled();
				done();
			} );
		} );
	} );

	describe( "apply", () => {
		it( "logs a warning when it is called without being implemented", ( done ) => {
			const assessment = new Assessment();
			assessment.apply( paper, null ).then( () => {
				expect( console.warn ).toBeCalled();
				done();
			} );
		} );
	} );
} );
