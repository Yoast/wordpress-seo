import { createInterpolateElement, useEffect, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Link, Paper, Title } from "@yoast/ui-library";
import { useFetch } from "../../fetch/use-fetch";
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
 * @param {string|URL} endpoint The endpoint.
 * @param {ContentType} contentType The content type.
 * @param {Term?} [term] The term.
 * @returns {URL} The URL to get scores.
 */
const createScoresUrl = ( endpoint, contentType, term ) => {
	const url = new URL( endpoint );

	url.searchParams.set( "contentType", contentType.name );

	if ( contentType.taxonomy?.name && term?.name ) {
		url.searchParams.set( "taxonomy", contentType.taxonomy.name );
		url.searchParams.set( "term", term.name );
	}

	return url;
};

// Added dummy space as content to prevent children prop warnings in the console.
const supportLink = <Link variant="error" href="admin.php?page=wpseo_page_support"> </Link>;

const TimeoutErrorMessage = createInterpolateElement(
	sprintf(
		/* translators: %1$s and %2$s expand to an opening/closing tag for a link to the support page. */
		__( "A timeout occurred, possibly due to a large number of posts or terms. In case you need further help, please take a look at our %1$sSupport page%2$s.", "wordpress-seo" ),
		"<supportLink>",
		"</supportLink>"
	),
	{
		supportLink,
	}
);
const OtherErrorMessage = createInterpolateElement(
	sprintf(
		/* translators: %1$s and %2$s expand to an opening/closing tag for a link to the support page. */
		__( "Something went wrong. In case you need further help, please take a look at our %1$sSupport page%2$s.", "wordpress-seo" ),
		"<supportLink>",
		"</supportLink>"
	),
	{
		supportLink,
	}
);

/**
 * @param {Error?} [error] The error.
 * @returns {JSX.Element} The element.
 */
const ErrorAlert = ( { error } ) => {
	if ( ! error ) {
		return null;
	}
	return (
		<Alert variant="error">
			{ error?.name === "TimeoutError"
				? TimeoutErrorMessage
				: OtherErrorMessage
			}
		</Alert>
	);
};

/**
 * @param {AnalysisType} analysisType The analysis type. Either "seo" or "readability".
 * @param {ContentType[]} contentTypes The content types. May not be empty.
 * @param {string} endpoint The endpoint or base URL.
 * @param {Object<string,string>} headers The headers to send with the request.
 * @returns {JSX.Element} The element.
 */
export const Scores = ( { analysisType, contentTypes, endpoint, headers } ) => {
	const [ selectedContentType, setSelectedContentType ] = useState( contentTypes[ 0 ] );
	const [ selectedTerm, setSelectedTerm ] = useState();

	const { data: scores, error, isPending } = useFetch( {
		dependencies: [ selectedContentType.name, selectedContentType?.taxonomy, selectedTerm?.name ],
		url: createScoresUrl( endpoint, selectedContentType, selectedTerm ),
		options: {
			headers: {
				"Content-Type": "application/json",
				...headers,
			},
		},
		fetchDelay: 0,
		prepareData: ( data ) => data?.scores,
	} );

	useEffect( () => {
		// Reset the selected term when the selected content type changes.
		setSelectedTerm( undefined ); // eslint-disable-line no-undefined
	}, [ selectedContentType.name ] );

	return (
		<Paper className="yst-@container yst-grow yst-max-w-screen-sm yst-p-8 yst-shadow-md">
			<Title as="h2">
				{ analysisType === "readability"
					? __( "Readability scores", "wordpress-seo" )
					: __( "SEO scores", "wordpress-seo" )
				}
			</Title>
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
				<ErrorAlert error={ error } />
				{ ! error && (
					<ScoreContent
						scores={ scores }
						isLoading={ isPending }
						descriptions={ SCORE_DESCRIPTIONS[ analysisType ] }
						idSuffix={ analysisType }
					/>
				) }
			</div>
		</Paper>
	);
};
