import { __, sprintf } from "@wordpress/i18n";

import AssessmentResult from "../values/AssessmentResult";
import { ensureTree } from "../parse/ensureTree";
import removeDuplicateMarks from "../markers/removeDuplicateMarks";
import MissingArgument from "../errors/missingArgument";
import { showTrace } from "../helpers/errors";

/**
 * Asserts that the required `runAssessment` arguments are all present.
 *
 * Extracted from `runAssessment` to keep its cyclomatic complexity within the linted maximum.
 *
 * @param {Assessment} assessment The assessment to run.
 * @param {Paper}      paper      The paper to run the assessment on.
 * @param {Researcher} researcher The researcher to use.
 *
 * @throws {MissingArgument} When any of the three is missing.
 *
 * @returns {void}
 */
function assertRequiredArguments( assessment, paper, researcher ) {
	if ( ! assessment ) {
		throw new MissingArgument( "runAssessment requires an assessment." );
	}

	if ( ! paper ) {
		throw new MissingArgument( "runAssessment requires a paper." );
	}

	if ( ! researcher ) {
		throw new MissingArgument( "runAssessment requires a researcher." );
	}
}

/**
 * Runs a single assessment correctly, without instantiating an `Assessor`.
 *
 * This is the direct (non-worker) primitive equivalent to the per-assessment slice of
 * `Assessor.assess()` + `Assessor.executeAssessment()`: it wires the researcher to the paper, builds
 * the HTML tree when one is needed (so tree-dependent assessments such as text length or keyphrase
 * density work, not just data-only ones), gates on applicability, runs the assessment, stamps the
 * identifier, populates marks, and isolates errors to a `-1` result.
 *
 * Editor-marker wiring (`hasMarker`/`getMarker`) is intentionally left out: it is `Assessor` instance
 * state and highlighting is a UI concern owned by the caller.
 *
 * A correctly-configured `Researcher` is required even for assessments that do not read it, because
 * building the tree needs its language data. Obtain one via the shipped `getResearcher()` entry
 * (`yoastseo/researcher`) so consumers don't hand-wire language data.
 *
 * @param {Assessment} assessment             The assessment to run.
 * @param {Paper}      paper                  The paper to run the assessment on.
 * @param {Researcher} researcher             The researcher to use. Required, even when the assessment doesn't read it.
 * @param {Object}     [options]              Optional settings.
 * @param {boolean}    [options.buildTree]    Whether to build the HTML tree when the paper lacks one
 *                                            (default `true`). Set to `false` for data-only assessments
 *                                            that don't read the tree, to skip the build cost.
 *
 * @throws {MissingArgument} When the assessment, the paper or the researcher is missing.
 *
 * @returns {AssessmentResult|null} The assessment result, or `null` when the assessment is not applicable.
 */
export function runAssessment( assessment, paper, researcher, options = {} ) {
	/*
	 * All three arguments are required, so they are validated up front: this is a public entry point and
	 * the error isolation below only covers failures inside the assessment itself, not a malformed call.
	 */
	assertRequiredArguments( assessment, paper, researcher );

	const { buildTree = true } = options;

	researcher.setPaper( paper );

	if ( buildTree ) {
		// No-op when the paper already carries a tree; builds it otherwise. Mirrors `assessor.js`.
		ensureTree( paper, researcher );
	}

	// Mirror `Assessor.isApplicable`: treat a missing `isApplicable` as applicable.
	const isApplicable = typeof assessment.isApplicable === "undefined"
		? true
		: assessment.isApplicable( paper, researcher );

	if ( ! isApplicable ) {
		return null;
	}

	let result;

	try {
		result = assessment.getResult( paper, researcher );
		result.setIdentifier( assessment.identifier );

		if ( result.hasMarks() ) {
			result.marks = removeDuplicateMarks( assessment.getMarks( paper, researcher ) );
		}
	} catch ( assessmentError ) {
		showTrace( assessmentError );

		result = new AssessmentResult();
		// Stamp the identifier on the error result too, so callers can tell which assessment failed.
		result.setIdentifier( assessment.identifier );
		result.setScore( -1 );
		result.setText( sprintf(
			/* translators: %1$s expands to the name of the assessment. */
			__( "An error occurred in the '%1$s' assessment", "wordpress-seo" ),
			assessment.identifier
		) );
	}

	return result;
}
