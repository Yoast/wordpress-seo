import { createInterpolateElement, useCallback, useEffect, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Link } from "@yoast/ui-library";
import { useRemoteData } from "../../services/use-remote-data";
import { SCORE_DESCRIPTIONS } from "../score-meta";
import { ContentTypeFilter } from "./content-type-filter";
import { ScoreContent } from "./score-content";
import { TermFilter } from "./term-filter";

/**
 * @type {import("../index").ContentType} ContentType
 * @type {import("../index").Taxonomy} Taxonomy
 * @type {import("../index").Term} Term
 * @type {import("../index").AnalysisType} AnalysisType
 */

/**
 * @param {string} message The message with placeholders.
 * @param {JSX.Element} link The link.
 * @returns {JSX.Element|string} The message.
 */
const createLinkMessage = ( message, link ) => {
	try {
		return createInterpolateElement( sprintf( message, "<link>", "</link>" ), { link } );
	} catch ( e ) {
		return sprintf( message, "", "" );
	}
};

/**
 * @param {Error?} [error] The error.
 * @param {string} supportLink The support link.
 * @returns {JSX.Element} The element.
 */
const ErrorAlert = ( { error, supportLink } ) => {
	if ( ! error ) {
		return null;
	}

	// Added dummy space as content to prevent children prop warnings in the console.
	const link = <Link variant="error" href={ supportLink }> </Link>;

	return (
		<Alert variant="error">
			{ error?.name === "TimeoutError"
				? createLinkMessage(
					/* translators: %1$s and %2$s expand to an opening/closing tag for a link to the support page. */
					__( "A timeout occurred, possibly due to a large number of posts or terms. In case you need further help, please take a look at our %1$sSupport page%2$s.", "wordpress-seo" ),
					link
				)
				: createLinkMessage(
					/* translators: %1$s and %2$s expand to an opening/closing tag for a link to the support page. */
					__( "Something went wrong. In case you need further help, please take a look at our %1$sSupport page%2$s.", "wordpress-seo" ),
					link
				)
			}
		</Alert>
	);
};

/**
 * @param {ContentType?} [contentType] The selected content type.
 * @param {Term?} [term] The selected term.
 * @returns {{contentType: string, taxonomy?: string, term?: string}} The score query parameters.
 */
const getScoreQueryParams = ( contentType, term ) => { // eslint-disable-line complexity
	const params = {
		contentType: contentType?.name,
	};
	if ( contentType?.taxonomy?.name && term?.name ) {
		params.taxonomy = contentType.taxonomy.name;
		params.term = term.name;
	}

	return params;
};

/**
 * @param {?{scores: Score[]}} [data] The data.
 * @returns {?Score[]} scores The scores.
 */
const prepareScoreData = ( data ) => data?.scores;

/**
 * @param {AnalysisType} analysisType The analysis type. Either "seo" or "readability".
 * @param {ContentType[]} contentTypes The content types. May not be empty.
 * @param {import("../services/data-provider")} dataProvider The data provider.
 * @param {import("../services/remote-data-provider")} remoteDataProvider The remote data provider.
 * @returns {JSX.Element} The element.
 */
export const Scores = ( { analysisType, contentTypes, dataProvider, remoteDataProvider } ) => { // eslint-disable-line complexity
	const [ selectedContentType, setSelectedContentType ] = useState( contentTypes[ 0 ] );
	/** @type {[Term?, function(Term?)]} */
	const [ selectedTerm, setSelectedTerm ] = useState();

	const getScores = useCallback( ( options ) => remoteDataProvider.fetchJson(
		dataProvider.getEndpoint( analysisType + "Scores" ),
		getScoreQueryParams( selectedContentType, selectedTerm ),
		options
	), [ dataProvider, analysisType, selectedContentType, selectedTerm ] );

	const { data: scores, error, isPending } = useRemoteData( getScores, prepareScoreData );

	useEffect( () => {
		// Reset the selected term when the selected content type changes.
		setSelectedTerm( undefined ); // eslint-disable-line no-undefined
	}, [ selectedContentType?.name ] );

	return (
		<>
			<div className="yst-grid yst-grid-cols-1 @md:yst-grid-cols-2 yst-gap-6 yst-mt-4">
				<ContentTypeFilter
					idSuffix={ analysisType }
					contentTypes={ contentTypes }
					selected={ selectedContentType }
					onChange={ setSelectedContentType }
				/>
				{ selectedContentType.taxonomy && selectedContentType.taxonomy?.links?.search &&
					<TermFilter
						idSuffix={ analysisType }
						taxonomy={ selectedContentType.taxonomy }
						selected={ selectedTerm }
						onChange={ setSelectedTerm }
					/>
				}
			</div>
			<div className="yst-mt-6">
				<ErrorAlert error={ error } supportLink={ dataProvider.getLink( "errorSupport" ) } />
				{ ! error && (
					<ScoreContent
						scores={ scores }
						isLoading={ isPending }
						descriptions={ SCORE_DESCRIPTIONS[ analysisType ] }
						idSuffix={ analysisType }
					/>
				) }
			</div>
		</>
	);
};
