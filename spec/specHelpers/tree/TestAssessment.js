import { Assessment } from "../../../src/tree/assess";
import AssessmentResult from "../../../src/values/AssessmentResult";

/**
 * A test assessment.
 */
class TestAssessment extends Assessment {
	/**
	 * Makes a new test assessment.
	 *
	 * @param {boolean} applicable Whether to return true if checked whether this assessment is applicable.
	 * @param {number} boundary    The boundary to use when deciding to return a bad or good assessment result.
	 * @param {string} [name]      An optional name.
	 */
	constructor( applicable, boundary, name ) {
		super( name );
		this.applicable = applicable;
		this.boundary = boundary;
	}

	/**
	 * Checks whether this assessment is applicable to the given paper and tree combination.
	 *
	 * @param {Paper} paper                     The paper to check.
	 * @param {module:tree/structure.Node} node The tree to check.
	 *
	 * @returns {Promise<boolean>} Whether this assessment is applicable to the given paper and tree combination (wrapped in a promise).
	 */
	async isApplicable( paper, node ) {  // eslint-disable-line no-unused-vars
		// Set a minor time out, to make sure that the promises work.
		return Promise.resolve( this.applicable );
	}

	/**
	 * Applies this assessment to the given combination of paper and tree.
	 *
	 * @param {Paper} paper                                    The paper to check.
	 * @param {module:tree/structure.Node} node                The root node of the tree to check.
	 * @param {module:tree/research.TreeResearcher} researcher The researcher to use to retrieve researches from.
	 *
	 * @returns {Promise<*>} The result of this assessment (wrapped in a promise).
	 *
	 * @abstract
	 */
	async apply( paper, node, researcher ) {
		const nrOfTokens = await researcher.doResearch( "word count", node );
		if ( nrOfTokens < this.boundary ) {
			return Promise.resolve(
				this.generateResult( "Not enough words, try again.", 3 )
			);
		}
		return Promise.resolve(
			this.generateResult( "Enough words, good job!", 9 )
		);
	}

	/**
	 * Generates an assessment result.
	 *
	 * @param {string} text  The text to add to the assessment result.
	 * @param {number} score The score to add to the assessment result.
	 *
	 * @returns {AssessmentResult} The generated assessment result.
	 */
	generateResult( text, score ) {
		const assessmentResult = new AssessmentResult();

		assessmentResult.setScore( score );
		assessmentResult.setText( text );

		return assessmentResult;
	}
}

export default TestAssessment;
