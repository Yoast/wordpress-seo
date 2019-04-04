import buildTree from "../../../src/parsedPaper/build";
import ParsedPaper from "../../src/parsedPaper/ParsedPaper";

describe( "TreeResearcher", () => {
	describe( "constructor", () => {
		it( "makes a new TreeResearcher", () => {
			const parsedPaper = new ParsedPaper();
			expect( parsedPaper ).toBeInstanceOf( ParsedPaper );
		} );
	} );
);
