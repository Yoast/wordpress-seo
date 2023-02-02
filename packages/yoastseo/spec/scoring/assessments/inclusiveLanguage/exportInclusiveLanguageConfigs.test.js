import { sprintf } from "@wordpress/i18n";
import { last } from "lodash-es";

import inclusiveLanguageAssessmentsConfigs from "../../../../src/scoring/assessments/inclusiveLanguage/configuration";
import { SCORES } from "../../../../src/scoring/assessments/inclusiveLanguage/configuration/scores";
import InclusiveLanguageAssessment from "../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";

const fs = require( "fs" );

/**
 * Note: this file is not a regular Jest test, as it exports the inclusive language configuration, rather than testing it.
 */
describe( "Export of the inclusive language configuration", () => {
	/**
	 * Retrieves the rules from a function call in a prettier format.
	 * @param {string} str The function call.
	 * @returns {string} The prettier formatted string.
	 */
	const retrieveRule = ( str ) => {
		const matches = [ ...str.matchAll( /\.filter.*?_is(.*?)Exception.*?\[(.*?)]/g ) ];
		return matches.map( match => "Not" + match[ 1 ] + ": " + match[ 2 ] ).join( " and " );
	};

	/**
	 * Retrieves the href value from a string containing an anchor.
	 * @param {string} str The string containing an anchor.
	 * @returns {string} The href value of the anchor.
	 */
	const retrieveAnchor = ( str ) => {
		const parser = new DOMParser();
		const htmlDoc = parser.parseFromString( str, "text/html" );
		return htmlDoc.querySelector( "a" ).href;
	};

	/**
	 * Writes the given contents to the given filename in the temporary directory tmp
	 * @param {string} filename The name of the file.
	 * @param {string} content The content of the file.
	 * @returns {void}
	 */
	const writeToTempFile = ( filename, content ) => {
		// Creates a temporary directory in the current working directory to store the data, if it not yet exists.
		// (i.e., packages/yoastseo/tmp/ if this function is called from packages/yoastseo/)
		const dir = "tmp/";
		if ( ! fs.existsSync( dir ) ) {
			fs.mkdirSync( dir );
		}

		// Writes the data to this temporary directory
		fs.writeFileSync( dir + filename, content );
	};

	it( "exports all inclusive language assessments to a csv", () => {
		// Retrieve all configs
		const assessments = inclusiveLanguageAssessmentsConfigs.map(
			config => new InclusiveLanguageAssessment( config )
		);

		// Generate the header
		const header = [
			"Category",
			"Identifier",
			"Non-Inclusive (\"x\")",
			"Inclusive (\"y\")",
			"Score",
			"Rule",
			"Case-sensitive?",
			"Feedback String (Generic)",
			"Learn more URL",
		];

		// Generate the results
		const results = assessments.map( ( assessment ) =>
			( {
				category: last( retrieveAnchor( assessment.learnMoreUrl ).split( "-" ) ),
				identifier: assessment.identifier,
				nonInclusivePhrases: assessment.nonInclusivePhrases.join( ", " ),
				inclusiveAlternatives: assessment.inclusiveAlternatives.join( ", " ).replace( /<\/?i>/g, "" ),
				score: assessment.score === SCORES.POTENTIALLY_NON_INCLUSIVE ? "orange" : "red",
				rule: assessment.rule.name === "includesConsecutiveWords" ? "" : retrieveRule( assessment.rule.toString() ),
				caseSensitive: assessment.caseSensitive ? "yes" : "no",
				feedbackFormat: sprintf( assessment.feedbackFormat, "\"x\"", "\"y\"", "\"z\"" ).replace( /<\/?i>/g, "" ),
				learnMoreUrl: retrieveAnchor( assessment.learnMoreUrl ),
			} )
		);

		// Collects the results and the header into list of ;-separated rows
		const resultLines = results.map( result => Object.values( result ).join( ";" ) );
		resultLines.unshift( header.join( ";" ) );

		// Set doExport to true to write the results to a temporary file.
		const doExport = false;
		if ( doExport ) {
			writeToTempFile( "inclusive-language-database.csv", resultLines.join( "\n" ) );
		}
	} );

	it( "should retrieve rules in a more pretty format", () => {
		let assessment = new InclusiveLanguageAssessment( inclusiveLanguageAssessmentsConfigs.find( obj => obj.identifier === "firemen" ) );
		expect( retrieveRule( assessment.rule.toString() ) ).toEqual( "" );

		assessment = new InclusiveLanguageAssessment( inclusiveLanguageAssessmentsConfigs.find( obj => obj.identifier === "binge" ) );
		expect( retrieveRule( assessment.rule.toString() ) ).toEqual( "NotFollowedBy: \"drink\", \"drinks\", \"drinking\"" );

		assessment = new InclusiveLanguageAssessment( inclusiveLanguageAssessmentsConfigs.find( obj => obj.identifier === "seniors" ) );
		expect( retrieveRule( assessment.rule.toString() ) ).
			toEqual( "NotPrecededBy: \"high school\", \"college\", \"graduating\", \"juniors and\"" +
			" and NotFollowedBy: \"in high school\", \"in college\", \"who are graduating\"" );
	} );

	it( "should retrieve the href value for an anchor", () => {
		const assessment = new InclusiveLanguageAssessment( inclusiveLanguageAssessmentsConfigs.find( obj => obj.identifier === "firemen" ) );
		expect( retrieveAnchor( assessment.learnMoreUrl ) ).toEqual( "https://yoa.st/inclusive-language-gender" );
	} );
} );
