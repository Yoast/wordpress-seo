import apiFetch from "@wordpress/api-fetch";
import { __ } from "@wordpress/i18n";
import { useEffect, useState } from "@wordpress/element";
import IndexablesTable from "./components/indexables-table";

/**
 * A table.
 *
 * @returns {WPElement} A table.
 */
function IndexablesPage() {
	const [ worstReadabilityIndexables, setWorstReadabilityIndexables ] = useState( [] );
	const [ worstSEOIndexables, setWorstSEOIndexables ] = useState( [] );
	const [ leastLinkedIndexables, setLeastLinkedIndexables ] = useState( [] );
	const [ mostLinkedIndexables, setMostLinkedIndexables ] = useState( [] );

	useEffect( async() => {
		try {
			const response = await apiFetch( {
				path: "yoast/v1/least_readability",
				method: "GET",
			} );

			const parsedResponse = await response.json;
			setWorstReadabilityIndexables( parsedResponse.least_readable );
		} catch ( e ) {
			// URL() constructor throws a TypeError exception if url is malformed.
			console.error( e.message );
			return false;
		}
	}, [] );

	useEffect( async() => {
		try {
			const response = await apiFetch( {
				path: "yoast/v1/least_seo_score",
				method: "GET",
			} );

			const parsedResponse = await response.json;
			setWorstSEOIndexables( parsedResponse.least_seo_score );
		} catch ( e ) {
			// URL() constructor throws a TypeError exception if url is malformed.
			console.error( e.message );
			return false;
		}
	}, [] );

	useEffect( async() => {
		try {
			const response = await apiFetch( {
				path: "yoast/v1/most_linked",
				method: "GET",
			} );

			const parsedResponse = await response.json;
			setMostLinkedIndexables( parsedResponse.most_linked );
		} catch ( e ) {
			// URL() constructor throws a TypeError exception if url is malformed.
			console.error( e.message );
			return false;
		}
	}, [] );

	useEffect( async() => {
		try {
			const response = await apiFetch( {
				path: "yoast/v1/least_linked",
				method: "GET",
			} );

			const parsedResponse = await response.json;
			/* eslint-disable-next-line camelcase */
			const least_linked = JSON.stringify( parsedResponse.least_linked, ( key, value ) =>  ( key === "incoming_link_count" && value === null ) ? "0" : value );
			setLeastLinkedIndexables( JSON.parse( least_linked ) );
		} catch ( e ) {
			// URL() constructor throws a TypeError exception if url is malformed.
			console.error( e.message );
			return false;
		}
	}, [] );

	return <div
		className="yst-bg-white yst-rounded-lg yst-p-6 yst-shadow-md yst-max-w-full yst-mt-6"
	>
		<header className="yst-border-b yst-border-gray-200"><div className="yst-max-w-screen-sm yst-p-8"><h2 className="yst-text-2xl yst-font-bold">{ __( "Indexables page", "wordpress-seo" ) }</h2></div></header>
		<h3 className="yst-my-4 yst-text-xl">{ __( "Least Readability Score", "wordpress-seo" ) }</h3>
		<IndexablesTable
			indexables={ worstReadabilityIndexables }
			keyHeaderMap={
				{
					/* eslint-disable camelcase */
					breadcrumb_title: __( "Title", "wordpress-seo" ),
					readability_score: __( "Readability Score", "wordpress-seo" ),
					edit: __( "Edit", "wordpress-seo" ),
					ignore: __( "Ignore", "wordpress-seo" ),
					/* eslint-enable camelcase */
				}
			}
			type="least_readability_score"
		/>
		<h3 className="yst-my-4 yst-text-xl">{ __( "Least SEO Score", "wordpress-seo" ) }</h3>
		<IndexablesTable
			indexables={ worstSEOIndexables }
			keyHeaderMap={
				{
					/* eslint-disable camelcase */
					breadcrumb_title: __( "Title", "wordpress-seo" ),
					primary_focus_keyword_score: __( "SEO Score", "wordpress-seo" ),
					edit: __( "Edit", "wordpress-seo" ),
					ignore: __( "Ignore", "wordpress-seo" ),
					/* eslint-enable camelcase */
				}
			}
			type="least_seo_score"
		/>
		<h3 className="yst-my-4 yst-text-xl">{ __( "Least Linked", "wordpress-seo" ) }</h3>
		<IndexablesTable
			indexables={ leastLinkedIndexables }
			keyHeaderMap={
				{
					/* eslint-disable camelcase */
					breadcrumb_title: __( "Title", "wordpress-seo" ),
					incoming_link_count: __( "Incoming links", "wordpress-seo" ),
					edit: __( "Find posts to link from", "wordpress-seo" ),
					ignore: __( "Ignore", "wordpress-seo" ),
					/* eslint-enable camelcase */
				}
			}
			type="least_linked"
		/>
		<h3 className="yst-my-4 yst-text-xl">{ __( "Most Linked", "wordpress-seo" ) }</h3>
		<IndexablesTable
			indexables={ mostLinkedIndexables }
			keyHeaderMap={
				{
					/* eslint-disable camelcase */
					breadcrumb_title: __( "Title", "wordpress-seo" ),
					incoming_link_count: __( "Incoming links", "wordpress-seo" ),
					edit: __( "Find posts to link to", "wordpress-seo" ),
					ignore: __( "Ignore", "wordpress-seo" ),
					/* eslint-enable camelcase */
				}
			}
			type="most_linked"
		/>

	</div>;
}

export default IndexablesPage;
