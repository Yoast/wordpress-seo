import { runAssessment } from "../../src/scoring/runAssessment";
import Paper from "../../src/values/Paper";
import AssessmentResult from "../../src/values/AssessmentResult";
import Mark from "../../src/values/Mark";
import Factory from "../../src/helpers/factory";
import memoizedSentenceTokenizer from "../../src/languageProcessing/helpers/sentence/memoizedSentenceTokenizer";

/**
 * Builds a minimal researcher stub that records `setPaper` calls but does no tree work.
 *
 * @returns {Object} A researcher stub with a `setPaper` spy.
 */
const buildStubResearcher = () => ( { setPaper: jest.fn() } );

/**
 * Builds a real-ish mock researcher capable of driving the tree builder, with a `setPaper` spy added
 * (the shared mock researcher omits `setPaper`, which `runAssessment` requires).
 *
 * @returns {Object} A researcher able to tokenize for tree building.
 */
const buildTreeResearcher = () => {
	const researcher = Factory.buildMockResearcher( {}, true, false, false,
		{ memoizedTokenizer: memoizedSentenceTokenizer } );
	researcher.setPaper = jest.fn();
	return researcher;
};

describe( "The runAssessment function", () => {
	it( "returns the result stamped with the assessment identifier when applicable", () => {
		const assessment = {
			identifier: "testAssessment",
			isApplicable: () => true,
			getResult: () => new AssessmentResult( { score: 9, text: "All good." } ),
		};

		const result = runAssessment( assessment, new Paper( "Some text." ), buildStubResearcher(), { buildTree: false } );

		expect( result ).not.toBeNull();
		expect( result.getIdentifier() ).toEqual( "testAssessment" );
		expect( result.getScore() ).toEqual( 9 );
	} );

	it( "returns null and does not run the assessment when it is not applicable", () => {
		const getResult = jest.fn();
		const assessment = {
			identifier: "testAssessment",
			isApplicable: () => false,
			getResult,
		};

		const result = runAssessment( assessment, new Paper( "Some text." ), buildStubResearcher(), { buildTree: false } );

		expect( result ).toBeNull();
		expect( getResult ).not.toHaveBeenCalled();
	} );

	it( "treats a missing isApplicable as applicable", () => {
		const assessment = {
			identifier: "noApplicability",
			getResult: () => new AssessmentResult( { score: 6 } ),
		};

		const result = runAssessment( assessment, new Paper( "Some text." ), buildStubResearcher(), { buildTree: false } );

		expect( result ).not.toBeNull();
		expect( result.getScore() ).toEqual( 6 );
	} );

	it( "builds the tree so tree-dependent assessments can score", () => {
		const paper = new Paper( "<p>Hello, world!</p>" );
		expect( paper.getTree() ).toBeNull();

		// This assessment only scores when a tree is present, proving the tree was built before it ran.
		const assessment = {
			identifier: "treeDependent",
			getResult: p => new AssessmentResult( { score: p.getTree() === null ? -1 : 9 } ),
		};

		const result = runAssessment( assessment, paper, buildTreeResearcher() );

		expect( paper.getTree() ).not.toBeNull();
		expect( result.getScore() ).toEqual( 9 );
	} );

	it( "does not build the tree when options.buildTree is false", () => {
		const paper = new Paper( "<p>Hello, world!</p>" );

		const assessment = {
			identifier: "dataOnly",
			getResult: () => new AssessmentResult( { score: 5 } ),
		};

		const result = runAssessment( assessment, paper, buildStubResearcher(), { buildTree: false } );

		expect( paper.getTree() ).toBeNull();
		expect( result.getScore() ).toEqual( 5 );
	} );

	it( "wires the researcher to the paper via setPaper", () => {
		const paper = new Paper( "Some text." );
		const researcher = buildStubResearcher();
		const assessment = {
			identifier: "testAssessment",
			getResult: () => new AssessmentResult( { score: 9 } ),
		};

		runAssessment( assessment, paper, researcher, { buildTree: false } );

		expect( researcher.setPaper ).toHaveBeenCalledWith( paper );
	} );

	it( "isolates a throwing assessment to a -1 result that keeps the identifier", () => {
		const traceSpy = jest.spyOn( console, "trace" ).mockImplementation( () => {} );
		const assessment = {
			identifier: "boom",
			getResult: () => {
				throw new Error( "kaboom" );
			},
		};

		const result = runAssessment( assessment, new Paper( "Some text." ), buildStubResearcher(), { buildTree: false } );

		expect( result.getScore() ).toEqual( -1 );
		expect( result.getIdentifier() ).toEqual( "boom" );
		expect( result.hasText() ).toBe( true );

		traceSpy.mockRestore();
	} );

	it( "populates the result marks, de-duplicated, when the result has marks", () => {
		const duplicatedMark = () => new Mark( { original: "cats", marked: "<yoastmark>cats</yoastmark>" } );
		const assessment = {
			identifier: "marked",
			getResult: () => new AssessmentResult( { score: 3, marks: [ duplicatedMark() ] } ),
			getMarks: () => [ duplicatedMark(), duplicatedMark() ],
		};

		const result = runAssessment( assessment, new Paper( "Some cats." ), buildStubResearcher(), { buildTree: false } );

		expect( result.hasMarks() ).toBe( true );
		expect( result.getMarks() ).toEqual( [ duplicatedMark() ] );
	} );

	it( "throws a MissingArgument error when no assessment is supplied", () => {
		expect( () => runAssessment( null, new Paper( "Some text." ), buildStubResearcher() ) )
			.toThrow( "runAssessment requires an assessment." );
	} );

	it( "throws a MissingArgument error when no paper is supplied", () => {
		const assessment = {
			identifier: "testAssessment",
			getResult: () => new AssessmentResult( { score: 9 } ),
		};

		expect( () => runAssessment( assessment, null, buildStubResearcher() ) ).toThrow( "runAssessment requires a paper." );
	} );

	it( "throws a MissingArgument error when no researcher is supplied", () => {
		const assessment = {
			identifier: "testAssessment",
			getResult: () => new AssessmentResult( { score: 9 } ),
		};

		expect( () => runAssessment( assessment, new Paper( "Some text." ) ) ).toThrow( "runAssessment requires a researcher." );
	} );
} );
