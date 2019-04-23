import PaperParser from "../../../src/parsedPaper/build/PaperParser";
import Paper from "../../../src/values/Paper";
import buildTree from "../../../src/parsedPaper/build/tree/html/buildTree";

const testPaper = new Paper( "text", {
	keyword: "testing",
	title: "Testing is nice",
	description: "A description of the niceties of testing.",
} );

const initialMetaData = {
	testKey: "testValue",
};

describe( "PaperParser", () => {
	let paperParser;

	beforeEach( () => {
		paperParser = new PaperParser( buildTree );
		console.warn = jest.fn();
	} );

	describe( "constructor", () => {
		it( "makes a new ParsedPaper", () => {
			expect( paperParser ).toBeInstanceOf( PaperParser );
		} );
	} );

	describe( "parse", () => {
		it( "calls the treeBuilder function to parse the Paper's text", () => {
			const fakeTreeBuilder = jest.fn();
			const testParser = new PaperParser( fakeTreeBuilder );
			testParser.parse( testPaper );
			expect( fakeTreeBuilder ).toHaveBeenCalledWith( testPaper._text );
		} );

		it( "calls ParsedPaper's constructMetaData method", () => {
			const constructMetaDataSpy = jest.spyOn( PaperParser.prototype, "constructMetaData" );
			paperParser.parse( testPaper );
			expect( constructMetaDataSpy ).toHaveBeenCalledWith( testPaper );
		} );
	} );

	describe( "constructMetaData", () => {
		it( "returns an object from the paper", () => {
			const metaData = paperParser.constructMetaData( testPaper );
			expect( typeof metaData ).toEqual( "object" );
		} );

		it( "calls runMetaDataModifiers from paperParser", () => {
			const runMetaDataModifiersSpy = jest.spyOn( PaperParser.prototype, "runMetaDataModifiers" );
			paperParser.constructMetaData( testPaper );
			expect( runMetaDataModifiersSpy )
				.toHaveBeenCalledWith( {}, testPaper );
		} );
	} );

	describe( "runMetaDataModifiers", () => {
		it( "runs metaDataModifiers that are registered on the PaperParser", () => {
			paperParser.registerMetaDataModifier( "testModifier", ( metaData ) => {
				metaData.testModification = "success";
				return metaData;
			} );
			expect( paperParser.runMetaDataModifiers( initialMetaData, testPaper ) )
				.toEqual( {
					testKey: "testValue",
					testModification: "success",
				} );
		} );

		it( "skips faulty metaDataModifiers registered on the PaperParser", () => {
			paperParser.registerMetaDataModifier( "faultyTestModifier", ( metaData ) => {
				metaData.modifcation = "success";
				// Bad function call:
				metaData.nonExistingFunc();
				return metaData;
			} );
			expect( paperParser.runMetaDataModifiers( initialMetaData ) )
				.toEqual( initialMetaData )
			;
		} );
	} );
} );
