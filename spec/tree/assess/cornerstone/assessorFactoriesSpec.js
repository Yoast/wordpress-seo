import { ReadabilityScoreAggregator, SEOScoreAggregator } from "../../../../src/tree/assess/scoreAggregators";
import { TreeResearcher } from "../../../../src/tree/research";
import factory from "../../../specHelpers/factory.js";

import {
	constructReadabilityAssessor,
	constructRelatedKeyphraseAssessor,
	constructSEOAssessor,
} from "../../../../src/tree/assess/cornerstone/assessorFactories";

describe( "assessorFactories", () => {
	let i18n;
	let researcher;

	beforeEach( () => {
		i18n = factory.buildJed();
		researcher = new TreeResearcher();
	} );

	describe( "constructSEOAssessor", () => {
		it( "can create an SEO Assessor for cornerstone content", () => {
			const assessor = constructSEOAssessor( i18n, researcher );

			const expectedAssessments = [];
			const expectedResearcher = researcher;
			const expectedScoreAggregator = new SEOScoreAggregator();

			expect( assessor.getAssessments() ).toEqual( expectedAssessments );
			expect( assessor.researcher ).toEqual( expectedResearcher );
			expect( assessor.scoreAggregator ).toEqual( expectedScoreAggregator );
		} );
	} );

	describe( "constructReadabilityAssessor", () => {
		it( "can create a readability Assessor for cornerstone content", () => {
			const assessor = constructReadabilityAssessor( i18n, researcher );

			const expectedAssessments = [];
			const expectedResearcher = researcher;
			const expectedScoreAggregator = new ReadabilityScoreAggregator();

			expect( assessor.getAssessments() ).toEqual( expectedAssessments );
			expect( assessor.researcher ).toEqual( expectedResearcher );
			expect( assessor.scoreAggregator ).toEqual( expectedScoreAggregator );
		} );
	} );

	describe( "constructRelatedKeyphraseAssessor", () => {
		it( "can create a related keyphrase Assessor for cornerstone content", () => {
			const assessor = constructRelatedKeyphraseAssessor( i18n, researcher );

			const expectedAssessments = [];
			const expectedResearcher = researcher;
			const expectedScoreAggregator = new SEOScoreAggregator();

			expect( assessor.getAssessments() ).toEqual( expectedAssessments );
			expect( assessor.researcher ).toEqual( expectedResearcher );
			expect( assessor.scoreAggregator ).toEqual( expectedScoreAggregator );
		} );
	} );
} );
