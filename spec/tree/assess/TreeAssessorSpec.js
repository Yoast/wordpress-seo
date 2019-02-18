import { TreeAssessor, ScoreAggregator, Assessment } from "../../../src/tree/assess";
import buildTree from "../../../src/tree/builder";
import { TreeResearcher } from "../../../src/tree/research";
import Paper from "../../../src/values/Paper";

import factory from "../../specHelpers/factory.js";
import TestAggregator from "../../specHelpers/tree/TestAggregator";
import TestAssessment from "../../specHelpers/tree/TestAssessment";
import TestResearch from "../../specHelpers/tree/TestResearch";

describe( "TreeAssessor", () => {
	const i18n = factory.buildJed();

	describe( "constructor", () => {
		it( "creates a new TreeAssessor without assessments", () => {
			const researcher = new TreeResearcher();
			const scoreAggregator = new ScoreAggregator();
			const assessor = new TreeAssessor( {
				researcher,
				scoreAggregator,
				i18n,
			} );

			expect( assessor.getAvailableAssessments() ).toEqual( [] );
			expect( assessor.scoreAggregator ).toEqual( scoreAggregator );
			expect( assessor.researcher ).toEqual( researcher );
			expect( assessor.i18n ).toEqual( i18n );
		} );

		it( "creates a new TreeAssessor with assessments", () => {
			const researcher = new TreeResearcher();
			const scoreAggregator = new ScoreAggregator();
			const assessments = [ new Assessment(), new Assessment() ];
			const assessor = new TreeAssessor( {
				researcher,
				scoreAggregator,
				i18n,
				assessments,
			} );

			expect( assessor.getAvailableAssessments() ).toEqual( assessments );
			expect( assessor.scoreAggregator ).toEqual( scoreAggregator );
			expect( assessor.researcher ).toEqual( researcher );
			expect( assessor.i18n ).toEqual( i18n );
		} );
	} );

	describe( "getApplicableAssessments", () => {
		it( "checks whether assessments are applicable", ( done ) => {
			const researcher = new TreeResearcher();
			const scoreAggregator = new ScoreAggregator();
			const assessments = [
				new TestAssessment( true, 5, "applicable" ),
				new TestAssessment( false, 5, "not applicable" ),
			];
			const assessor = new TreeAssessor( {
				researcher,
				scoreAggregator,
				i18n,
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
			researcher.addResearch( "word count", research );

			const scoreAggregator = new TestAggregator();
			const assessments = [
				// Gives back a 'bad' result when word count < 8.
				new TestAssessment( true, 8, "word count" ),
				// Gives back a 'bad' result when word count < 5.
				new TestAssessment( true, 5, "word count" ),
			];
			const assessor = new TreeAssessor( {
				researcher,
				scoreAggregator,
				i18n,
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
				url: "https://example.com/rainbows",
				permalink: "rainbows",
			} );

			const node = buildTree( text );

			assessor.assess( paper, node ).then( result => {
				/*
				  Word count of text is smaller than 8, but bigger than 6.
				  First assessment gives back a 'bad' score (3).
				  Second gives back a 'good' score (9).
				  Aggregator sums scores so total score should be a 12.
				 */
				expect( result ).toEqual( 12 );
				done();
			} );
		} );
	} );

	describe( "registerAssessment", () => {
		it( "registers an assessment", () => {
			const researcher = new TreeResearcher();
			const research = new TestResearch();
			researcher.addResearch( "word count", research );

			const scoreAggregator = new TestAggregator();
			const assessments = [
				// Gives back a 'bad' result when word count < 8.
				new TestAssessment( true, 8, "word count" ),
			];
			const assessor = new TreeAssessor( {
				researcher,
				scoreAggregator,
				i18n,
				assessments,
			} );

			expect( assessor._assessments ).toHaveLength( 1 );

			const newAssessment = new TestAssessment( true, 4, "word count" );
			assessor.registerAssessment( "lenient word count", newAssessment );

			expect( assessor._assessments ).toHaveLength( 2 );
		} );
	} );

	describe( "removeAssessment", () => {
		it( "removes an assessment", () => {
			const researcher = new TreeResearcher();
			const research = new TestResearch();
			researcher.addResearch( "word count", research );

			const lenientWordCount = new TestAssessment( true, 4, "lenient word count" );

			const scoreAggregator = new TestAggregator();
			const assessments = [
				new TestAssessment( true, 8, "word count" ),
				lenientWordCount,
			];
			const assessor = new TreeAssessor( {
				researcher,
				scoreAggregator,
				i18n,
				assessments,
			} );

			expect( assessor._assessments ).toHaveLength( 2 );

			const removedAssessment = assessor.removeAssessment( "lenient word count" );

			expect( assessor._assessments ).toHaveLength( 1 );
			expect( removedAssessment ).toEqual( lenientWordCount );
		} );

		it( "returns null if no assessment is registered under the given name", () => {
			const researcher = new TreeResearcher();
			const research = new TestResearch();
			researcher.addResearch( "word count", research );

			const scoreAggregator = new TestAggregator();
			const assessments = [
				new TestAssessment( true, 8, "word count" ),
				new TestAssessment( true, 4, "lenient word count" ),
			];
			const assessor = new TreeAssessor( {
				researcher,
				scoreAggregator,
				i18n,
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
			researcher.addResearch( "word count", research );

			const lenientWordCount = new TestAssessment( true, 4, "lenient word count" );

			const scoreAggregator = new TestAggregator();
			const assessments = [
				new TestAssessment( true, 8, "word count" ),
				lenientWordCount,
			];
			const assessor = new TreeAssessor( {
				researcher,
				scoreAggregator,
				i18n,
				assessments,
			} );

			const assessment = assessor.getAssessment( "lenient word count" );

			expect( assessment ).toEqual( lenientWordCount );
		} );
	} );

	describe( "setAssessments", () => {
		it( "sets assessments", () => {
			const researcher = new TreeResearcher();
			const scoreAggregator = new ScoreAggregator();

			const assessments = [
				new TestAssessment( true, 5, "test assessment" ),
			];

			const assessor = new TreeAssessor( {
				researcher,
				scoreAggregator,
				i18n,
				assessments,
			} );

			expect( assessor.getAvailableAssessments() ).toEqual( assessments );

			const newAssessments = [
				new TestAssessment( false, 3, "new test assessment" ),
			];

			assessor.setAssessments( newAssessments );

			expect( assessor.getAvailableAssessments() ).toEqual( newAssessments );
		} );
	} );
} );
