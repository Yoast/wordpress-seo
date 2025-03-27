import { useCallback, useEffect, useState } from "react";
import { useRemoteData } from "../../services/use-remote-data";
import { SCORE_DESCRIPTIONS } from "../score-meta";
import { ContentTypeFilter } from "./content-type-filter";
import { ScoreContent } from "./score-content";
import { TermFilter } from "./term-filter";
import { ErrorAlert } from "../../components/error-alert";

/**
 * @type {import("../index").ContentType} ContentType
 * @type {import("../index").Taxonomy} Taxonomy
 * @type {import("../index").Term} Term
 * @type {import("../index").AnalysisType} AnalysisType
 */

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
