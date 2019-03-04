import { SEOScoreAggregator } from "../../../src/tree/assess/scoreAggregators";
import { TreeResearcher } from "../../../src/tree/research";
import factory from "../../specHelpers/factory.js";

import { constructSEOAssessor } from "../../../src/tree/assess/assessorFactories";

describe( "assessorFactories", () => {
	let i18n;
	let researcher;

	beforeEach( () => {
		i18n = factory.buildJed();
		researcher = new TreeResearcher();
	} );

	describe( "seoAssessorFactory", () => {
		it( "can create an SEO Assessor", () => {
			const assessor = constructSEOAssessor( i18n, researcher );

			const expectedAssessments = [];
			const expectedResearcher = researcher;
			const expectedScoreAggregator = new SEOScoreAggregator();

			expect( assessor.getAssessments() ).toEqual( expectedAssessments );
			expect( assessor.researcher ).toEqual( expectedResearcher );
			expect( assessor.scoreAggregator ).toEqual( expectedScoreAggregator );
		} );
	} );
} );
