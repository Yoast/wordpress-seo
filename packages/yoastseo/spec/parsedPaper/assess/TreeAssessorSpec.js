import { TreeAssessor } from "../../../src/parsedPaper/assess";
import TreeBuilder from "../../../src/parsedPaper/build/tree";
import { TreeResearcher } from "../../../src/parsedPaper/research";
import Paper from "../../../src/values/Paper";

import TestAggregator from "../../specHelpers/tree/TestAggregator";
import TestAssessment from "../../specHelpers/tree/TestAssessment";
import TestResearch from "../../specHelpers/tree/TestResearch";

describe( "TreeAssessor", () => {
	let treeBuilder;

	beforeEach( () => {
		treeBuilder = new TreeBuilder();
	} );

	describe( "constructor", () => {
		it( "creates a new TreeAssessor without assessments", () => {
			const researcher = new TreeResearcher();
			const scoreAggregator = new TestAggregator();
			const assessor = new TreeAssessor( {
				researcher,
				scoreAggregator,
			} );

			expect( assessor.getAssessments() ).toEqual( [] );
			expect( assessor.scoreAggregator ).toEqual( scoreAggregator );
			expect( assessor.researcher ).toEqual( researcher );
		} );

		it( "creates a new TreeAssessor with assessments", () => {
			const researcher = new TreeResearcher();
			const scoreAggregator = new TestAggregator();
			const assessments = [
				new TestAssessment( true, 8, "test assessment 1", researcher ),
				new TestAssessment( true, 6, "test assessment 2", researcher ),
			];
			const assessor = new TreeAssessor( {
				researcher,
				scoreAggregator,
				assessments,
			} );

			expect( assessor.getAssessments() ).toEqual( assessments );
			expect( assessor.scoreAggregator ).toEqual( scoreAggregator );
			expect( assessor.researcher ).toEqual( researcher );
		} );
	} );

	describe( "getApplicableAssessments", () => {
		it( "checks whether assessments are applicable", ( done ) => {
			const researcher = new TreeResearcher();
			const scoreAggregator = new TestAggregator();
			const assessments = [
				new TestAssessment( true, 5, "applicable", researcher ),
				new TestAssessment( false, 5, "not applicable", researcher ),
			];
			const assessor = new TreeAssessor( {
				researcher,
				scoreAggregator,
				assessments,
			} );

			assessor.getApplicableAssessments( null, null ).then(
				applicableAssessments => {
					// Only the first test assessment is applicable.
					expect( applicableAssessments ).toEqual( [ assessments[ 0 ] ] );
					done();
				}
			);
		} );
	} );

	describe( "assess", () => {
		it( "assesses a paper and node", ( done ) => {
			const researcher = new TreeResearcher();
			const research = new TestResearch();
			researcher.addResearch( "test research", research );

			const scoreAggregator = new TestAggregator();
			const assessments = [
				// Gives back a 'bad' result when word count < 8.
				new TestAssessment( true, 8, "test assessment 1", researcher ),
				// Gives back a 'bad' result when word count < 5.
				new TestAssessment( true, 5, "test assessment 2", researcher ),
			];
			const assessor = new TreeAssessor( {
				researcher,
				scoreAggregator,
				assessments,
			} );

			// Text with 6 words.
			const text = "<h1>Rainbows!</h1><p>This text has six words</p>";

			const paper = new Paper( text, {
				keyword: "rainbows",
				synonyms: "rainbow",
				title: "Lotsa rainbows",
				description: "Rainbows are awesome, unicorns are too!",
				titleWidth: 30,
				slug: "rainbows",
				permalink: "https://example.com/rainbows",
			} );

			const node = treeBuilder.build( text );

			assessor.assess( paper, node ).then( result => {
				/*
				  Word count of text is smaller than 8, but bigger than 6.
				  First assessment gives back a 'bad' score (3).
				  Second gives back a 'good' score (9).
				  Aggregator sums scores so total score should be a 12.
				 */
				expect( result.score ).toEqual( 12 );
				expect( result.results ).toHaveLength( 2 );
				done();
			} );
		} );

		it( "shows an assessment result indicating that the assessment failed when it throws an error", ( done ) => {
			const researcher = new TreeResearcher();
			const research = new TestResearch();
			researcher.addResearch( "test research", research );

			const scoreAggregator = new TestAggregator();
			const assessments = [
				// Gives back a 'bad' result when word count < 8.
				new TestAssessment( true, 8, "assessment with error", researcher ),
				// Gives back a 'bad' result when word count < 5.
				new TestAssessment( true, 5, "assessment with no error", researcher, true ),
			];
			const assessor = new TreeAssessor( {
				researcher,
				scoreAggregator,
				assessments,
			} );

			// Text with 6 words.
			const text = "<h1>Rainbows!</h1><p>This text has six words</p>";

			const paper = new Paper( text, {
				keyword: "rainbows",
				synonyms: "rainbow",
				title: "Lotsa rainbows",
				description: "Rainbows are awesome, unicorns are too!",
				titleWidth: 30,
				slug: "rainbows",
				permalink: "https://example.com/rainbows",
			} );

			const node = treeBuilder.build( text );

			assessor.assess( paper, node ).then( result => {
				/*
				  One 'bad' score (3).
				  One errored assessment that is not counted.
				 */
				expect( result.score ).toEqual( 3 );
				// We still want the errored assessment to be in the results.
				expect( result.results ).toHaveLength( 2 );
				const erroredResults = result.results.filter( res => res.getScore() === -1 );
				// One errored result.
				expect( erroredResults ).toHaveLength( 1 );
				done();
			} );
		} );
	} );

	describe( "registerAssessment", () => {
		it( "registers an assessment", () => {
			const researcher = new TreeResearcher();
			const research = new TestResearch();
			researcher.addResearch( "test research", research );

			const scoreAggregator = new TestAggregator();
			const assessments = [
				// Gives back a 'bad' result when word count < 8.
				new TestAssessment( true, 8, "test assessment", researcher ),
			];
			const assessor = new TreeAssessor( {
				researcher,
				scoreAggregator,
				assessments,
			} );

			expect( assessor._assessments ).toHaveLength( 1 );

			const newAssessment = new TestAssessment( true, 4, "test assessment 2", researcher );
			assessor.registerAssessment( "test assessment 2", newAssessment );

			expect( assessor._assessments ).toHaveLength( 2 );
		} );
	} );

	describe( "removeAssessment", () => {
		it( "removes an assessment", () => {
			const researcher = new TreeResearcher();
			const research = new TestResearch();
			researcher.addResearch( "test research", research );

			const assessmentToRemove = new TestAssessment( true, 4, "assessment to remove", researcher );

			const scoreAggregator = new TestAggregator();
			const assessments = [
				new TestAssessment( true, 8, "assessment to keep", researcher ),
				assessmentToRemove,
			];
			const assessor = new TreeAssessor( {
				researcher,
				scoreAggregator,
				assessments,
			} );

			expect( assessor._assessments ).toHaveLength( 2 );

			const removedAssessment = assessor.removeAssessment( "assessment to remove" );

			expect( assessor._assessments ).toHaveLength( 1 );
			expect( removedAssessment ).toEqual( assessmentToRemove );
		} );

		it( "returns null if no assessment is registered under the given name", () => {
			const researcher = new TreeResearcher();
			const research = new TestResearch();
			researcher.addResearch( "test research", research );

			const scoreAggregator = new TestAggregator();
			const assessments = [
				new TestAssessment( true, 8, "test assessment 1", researcher ),
				new TestAssessment( true, 4, "test assessment 2", researcher ),
			];
			const assessor = new TreeAssessor( {
				researcher,
				scoreAggregator,
				assessments,
			} );

			expect( assessor._assessments ).toHaveLength( 2 );

			const removedAssessment = assessor.removeAssessment( "dancing potatoes" );

			expect( assessor._assessments ).toHaveLength( 2 );
			expect( removedAssessment ).toEqual( null );
		} );
	} );

	describe( "getAssessment", () => {
		it( "retrieves an assessment", () => {
			const researcher = new TreeResearcher();
			const research = new TestResearch();
			researcher.addResearch( "test research", research );

			const assessmentToGet = new TestAssessment( true, 4, "assessment to get", researcher );

			const scoreAggregator = new TestAggregator();
			const assessments = [
				new TestAssessment( true, 8, "assessment not to get", researcher ),
				assessmentToGet,
			];
			const assessor = new TreeAssessor( {
				researcher,
				scoreAggregator,
				assessments,
			} );

			const assessment = assessor.getAssessment( "assessment to get" );

			expect( assessment ).toEqual( assessmentToGet );
		} );

		it( "return null if an assessment under the given name does not exist", () => {
			const researcher = new TreeResearcher();
			const research = new TestResearch();
			researcher.addResearch( "test research", research );

			const assessmentToGet = new TestAssessment( true, 4, "assessment to get", researcher );

			const scoreAggregator = new TestAggregator();
			const assessments = [
				new TestAssessment( true, 8, "assessment not to get", researcher ),
				assessmentToGet,
			];
			const assessor = new TreeAssessor( {
				researcher,
				scoreAggregator,
				assessments,
			} );

			const assessment = assessor.getAssessment( "unknown assessment" );

			expect( assessment ).toEqual( null );
		} );
	} );

	describe( "setAssessments", () => {
		it( "sets assessments", () => {
			const researcher = new TreeResearcher();
			const scoreAggregator = new TestAggregator();

			const assessments = [
				new TestAssessment( true, 5, "test assessment", researcher ),
			];

			const assessor = new TreeAssessor( {
				researcher,
				scoreAggregator,
				assessments,
			} );

			expect( assessor.getAssessments() ).toEqual( assessments );

			const newAssessments = [
				new TestAssessment( false, 3, "new test assessment", researcher ),
			];

			assessor.setAssessments( newAssessments );

			expect( assessor.getAssessments() ).toEqual( newAssessments );
		} );
	} );
} );
