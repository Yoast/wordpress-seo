import { Assessment } from "../../../../src/parsedPaper/assess/assessments";
import PaperParser from "../../../../src/parsedPaper/build/PaperParser";
import TreeBuilder from "../../../../src/parsedPaper/build/tree";
import TreeResearcher from "../../../../src/parsedPaper/research/TreeResearcher";
import Paper from "../../../../src/values/Paper";

describe( "Assessment", () => {
	const paper = new Paper( "Potatoes and tomatoes", {
		title: "Potatoes and tomatoes",
		description: "Potatoes are tomatoes, do not let anyone tell you otherwise.",
		slug: "potatoes-and-tomatoes",
	} );
	const treeBuilder = new TreeBuilder();
	const paperParser = new PaperParser( treeBuilder.build );
	const parsedPaper = paperParser.parse( paper );

	beforeEach( () => {
		console.warn = jest.fn();
	} );

	describe( "constructor", () => {
		it( "creates a new assessment instance", () => {
			const assessment = new Assessment( "lemons", null );
			expect( assessment.name ).toEqual( "lemons" );
		} );
	} );

	describe( "isApplicable", () => {
		it( "logs a warning when it is called without being implemented", ( done ) => {
			const assessment = new Assessment( "assessment", null );
			assessment.isApplicable( parsedPaper ).then( () => {
				expect( console.warn ).toBeCalled();
				done();
			} );
		} );
	} );

	describe( "apply", () => {
		it( "logs a warning when it is called without being implemented", ( done ) => {
			const assessment = new Assessment( "assessment", null );
			assessment.apply( parsedPaper ).then( () => {
				expect( console.warn ).toBeCalled();
				done();
			} );
		} );
	} );

	describe( "setResearcher", () => {
		it( "sets a new researcher", () => {
			const oldResearcher = new TreeResearcher();
			const assessment = new Assessment( "assessment", oldResearcher );

			expect( assessment.getResearcher() ).toEqual( oldResearcher );

			const newResearcher = new TreeResearcher();
			assessment.setResearcher( newResearcher );

			expect( assessment.getResearcher() ).toEqual( newResearcher );
		} );
	} );
} );
