import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Paper, Title } from "@yoast/ui-library";
import { useFetch } from "../../hooks/use-fetch";
import { ContentTypeFilter } from "../components/content-type-filter";
import { ScoreContent } from "../components/score-content";
import { TermFilter } from "../components/term-filter";
import { SCORE_DESCRIPTIONS } from "../score-meta";

/**
 * @type {import("../index").ContentType} ContentType
 * @type {import("../index").Term} Term
 */

/**
 * @param {ContentType[]} contentTypes The content types. May not be empty.
 * @returns {JSX.Element} The element.
 */
export const ReadabilityScores = ( { contentTypes } ) => {
	const [ selectedContentType, setSelectedContentType ] = useState( contentTypes[ 0 ] );
	const [ selectedTerm, setSelectedTerm ] = useState();

	const { data: scores, isPending } = useFetch( {
		dependencies: [ selectedContentType.name, selectedTerm?.name ],
		url: "/wp-content/plugins/wordpress-seo/packages/js/src/dashboard/scores/readability/scores.json",
		//		url: `/wp-json/yoast/v1/scores/${ contentType.name }/${ term?.name }`,
		options: { headers: { "Content-Type": "application/json" } },
		fetchDelay: 0,
		doFetch: async( url, options ) => {
			await new Promise( ( resolve ) => setTimeout( resolve, 1000 ) );
			return [ "good", "ok", "bad", "notAnalyzed" ].map( ( name ) => ( {
				name,
				amount: Math.ceil( Math.random() * 10 ),
				links: Math.random() > 0.5 ? {} : { view: `edit.php?readability_filter=${ name }` },
			} ) );
			// eslint-disable-next-line no-unreachable
			try {
				const response = await fetch( url, options );
				if ( ! response.ok ) {
					// From the perspective of the results, we want to reject this as an error.
					throw new Error( "Not ok" );
				}
				return response.json();
			} catch ( error ) {
				return Promise.reject( error );
			}
		},
	} );

	return (
		<Paper className="yst-@container yst-grow yst-max-w-screen-sm yst-p-8">
			<Title as="h2">{ __( "Readability scores", "wordpress-seo" ) }</Title>
			<div className="yst-grid yst-grid-cols-1 @md:yst-grid-cols-2 yst-gap-6 yst-mt-4">
				<ContentTypeFilter
					idSuffix="readability"
					contentTypes={ contentTypes }
					selected={ selectedContentType }
					onChange={ setSelectedContentType }
				/>
				{ selectedContentType.taxonomy && selectedContentType.taxonomy?.links?.search &&
					<TermFilter
						idSuffix="readability"
						taxonomy={ selectedContentType.taxonomy }
						selected={ selectedTerm }
						onChange={ setSelectedTerm }
					/>
				}
			</div>
			<ScoreContent scores={ scores } isLoading={ isPending } descriptions={ SCORE_DESCRIPTIONS.readability } />
		</Paper>
	);
};
