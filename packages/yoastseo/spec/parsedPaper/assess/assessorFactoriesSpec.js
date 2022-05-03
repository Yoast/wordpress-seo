import { ReadabilityScoreAggregator, SEOScoreAggregator } from "../../../src/parsedPaper/assess/scoreAggregators";
import { TreeResearcher } from "../../../src/parsedPaper/research";

import {
	constructReadabilityAssessor,
	constructSEOAssessor,
} from "../../../src/parsedPaper/assess/assessorFactories";

describe( "assessorFactories", () => {
	let researcher;

	beforeEach( () => {
		researcher = new TreeResearcher();
	} );

	describe( "constructSEOAssessor", () => {
		it( "can create an SEO Assessor", () => {
			const config = {};
			const assessor = constructSEOAssessor( researcher, config );

			const expectedAssessments = [];
			const expectedResearcher = researcher;
			const expectedScoreAggregator = new SEOScoreAggregator();

			expect( assessor.getAssessments() ).toEqual( expectedAssessments );
			expect( assessor.researcher ).toEqual( expectedResearcher );
			expect( assessor.scoreAggregator ).toEqual( expectedScoreAggregator );
		} );

		it( "can create an SEO taxonomy Assessor", () => {
			const config = {
				taxonomy: true,
			};
			const assessor = constructSEOAssessor( researcher, config );

			const expectedAssessments = [];
			const expectedResearcher = researcher;
			const expectedScoreAggregator = new SEOScoreAggregator();

			expect( assessor.getAssessments() ).toEqual( expectedAssessments );
			expect( assessor.researcher ).toEqual( expectedResearcher );
			expect( assessor.scoreAggregator ).toEqual( expectedScoreAggregator );
		} );

		it( "can create an SEO related keyphrase Assessor", () => {
			const config = {
				relatedKeyphrase: true,
			};
			const assessor = constructSEOAssessor( researcher, config );

			const expectedAssessments = [];
			const expectedResearcher = researcher;
			const expectedScoreAggregator = new SEOScoreAggregator();

			expect( assessor.getAssessments() ).toEqual( expectedAssessments );
			expect( assessor.researcher ).toEqual( expectedResearcher );
			expect( assessor.scoreAggregator ).toEqual( expectedScoreAggregator );
		} );

		it( "can create an SEO taxonomy related keyphrase Assessor", () => {
			const config = {
				taxonomy: true,
				relatedKeyphrase: true,
			};
			const assessor = constructSEOAssessor( researcher, config );

			const expectedAssessments = [];
			const expectedResearcher = researcher;
			const expectedScoreAggregator = new SEOScoreAggregator();

			expect( assessor.getAssessments() ).toEqual( expectedAssessments );
			expect( assessor.researcher ).toEqual( expectedResearcher );
			expect( assessor.scoreAggregator ).toEqual( expectedScoreAggregator );
		} );

		it( "can create an SEO cornerstone Assessor", () => {
			const config = {
				cornerstone: true,
			};
			const assessor = constructSEOAssessor( researcher, config );

			const expectedAssessments = [];
			const expectedResearcher = researcher;
			const expectedScoreAggregator = new SEOScoreAggregator();

			expect( assessor.getAssessments() ).toEqual( expectedAssessments );
			expect( assessor.researcher ).toEqual( expectedResearcher );
			expect( assessor.scoreAggregator ).toEqual( expectedScoreAggregator );
		} );

		it( "can create an SEO cornerstone related keyphrase Assessor", () => {
			const config = {
				cornerstone: true,
				relatedKeyphrase: true,
			};
			const assessor = constructSEOAssessor( researcher, config );

			const expectedAssessments = [];
			const expectedResearcher = researcher;
			const expectedScoreAggregator = new SEOScoreAggregator();

			expect( assessor.getAssessments() ).toEqual( expectedAssessments );
			expect( assessor.researcher ).toEqual( expectedResearcher );
			expect( assessor.scoreAggregator ).toEqual( expectedScoreAggregator );
		} );

		it( "throws an error when the given configuration combination does not exist", () => {
			const config = {
				cornerstone: true,
				taxonomy: true,
			};

			expect( () => constructSEOAssessor( researcher, config ) ).toThrow();
		} );
	} );

	describe( "constructReadabilityAssessor", () => {
		it( "construct a readability assessor", () => {
			const assessor = constructReadabilityAssessor( researcher );

			const expectedAssessments = [];
			const expectedResearcher = researcher;
			const expectedScoreAggregator = new ReadabilityScoreAggregator();

			expect( assessor.getAssessments() ).toEqual( expectedAssessments );
			expect( assessor.researcher ).toEqual( expectedResearcher );
			expect( assessor.scoreAggregator ).toEqual( expectedScoreAggregator );
		} );

		it( "construct a cornerstone readability assessor", () => {
			const assessor = constructReadabilityAssessor( researcher, true );

			const expectedAssessments = [];
			const expectedResearcher = researcher;
			const expectedScoreAggregator = new ReadabilityScoreAggregator();

			expect( assessor.getAssessments() ).toEqual( expectedAssessments );
			expect( assessor.researcher ).toEqual( expectedResearcher );
			expect( assessor.scoreAggregator ).toEqual( expectedScoreAggregator );
		} );
	} );
} );
