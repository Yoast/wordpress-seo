import { sprintf } from "@wordpress/i18n";
import { last } from "lodash-es";

import inclusiveLanguageAssessmentsConfigs from "../../../../src/scoring/assessments/inclusiveLanguage/configuration";
import { SCORES } from "../../../../src/scoring/assessments/inclusiveLanguage/configuration/scores";
import InclusiveLanguageAssessment from "../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";

const fs = require( "fs" );

describe( "Export of the inclusive language configuration", () => {
	/**
	 * Retrieves the rules from a function call in a more pretty format.
	 * @param {string} str The function call.
	 * @returns {string} The more pretty formatted string.
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

	it( "should export all inclusive language assessments", () => {
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
			[
				last( retrieveAnchor( assessment.learnMoreUrl ).split( "-" ) ),
				assessment.identifier,
				assessment.nonInclusivePhrases.join( ", " ),
				assessment.inclusiveAlternatives.join( ", " ).replace( /<\/?i>/g, "" ),
				assessment.score === SCORES.POTENTIALLY_NON_INCLUSIVE ? "orange" : "red",
				assessment.rule.name === "includesConsecutiveWords" ? "" : retrieveRule( assessment.rule.toString() ),
				assessment.caseSensitive ? "yes" : "no",
				sprintf( assessment.feedbackFormat, "\"x\"", "\"y\"", "\"z\"" ).replace( /<\/?i>/g, "" ),
				retrieveAnchor( assessment.learnMoreUrl ),
			]
		);

		// Collects the results and the header into list of ;-separated rows
		const resultLines = results.map( result => result.join( ";" ) );
		resultLines.unshift( header.join( ";" ) );

		// Creates a temporary directory to store the data (if it not yet exists)
		const dir = "tmp/";
		if ( ! fs.existsSync( dir ) ) {
			fs.mkdirSync( dir );
		}

		// Writes the data to this temporary directory (packages/yoastseo/tmp)
		fs.writeFileSync( dir + "inclusive-language-database.csv", resultLines.join( "\n" ) );
	} );

	it( "should retrieve rules in a more pretty format", () => {
		let assessment = new InclusiveLanguageAssessment( inclusiveLanguageAssessmentsConfigs.find( obj => obj.identifier === "firemen" ) );
		expect( retrieveRule( assessment.rule.toString() ) ).toEqual( "" );

		assessment = new InclusiveLanguageAssessment( inclusiveLanguageAssessmentsConfigs.find( obj => obj.identifier === "gypVerb" ) );
		expect( retrieveRule( assessment.rule.toString() ) ).toEqual( "NotPrecededBy: \"a\", \"the\"" );

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
