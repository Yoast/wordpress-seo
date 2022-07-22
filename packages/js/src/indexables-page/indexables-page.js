import apiFetch from "@wordpress/api-fetch";
import { __ } from "@wordpress/i18n";
import { useEffect, useState, useCallback } from "@wordpress/element";
import { Button, Alert } from "@yoast/ui-library";
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
	const [ ignoreIndexable, setIgnoreIndexable ] = useState( null );

	/**
	 * Fetches a list of indexables.
	 *
	 * @param {string} listName The name of the list to fetch.
	 * @param {function} setList The list setter.
	 *
	 * @returns {boolean} True if the request was successful.
	 */
	const fetchList = async( listName, setList ) => {
		try {
			const response = await apiFetch( {
				path: `yoast/v1/${ listName }`,
				method: "GET",
			} );

			const parsedResponse = await response.json;
			setList( parsedResponse.list );
			return true;
		} catch ( e ) {
			// URL() constructor throws a TypeError exception if url is malformed.
			console.error( e.message );
			return false;
		}
	};

	/**
	 * Fetches a list of indexables.
	 *
	 * @param {string} listName The name of the list to fetch.
	 * @param {function} setList The list setter.
	 *
	 * @returns {}
	 */
	const renderList = ( callback ) => {
		if ( ignoreIndexable === null ) {
			return;
		}
		callback( prevState =>
			prevState.filter( indexable => {
			  return indexable.id !== ignoreIndexable.indexable.id;
			}),
		  );

		console.log( 'Updated Indexables: ', worstReadabilityIndexables );
	};

	/* eslint-disable  complexity */
	/**
	 * Updates the content of a list of indexables.
	 *
	 * @param {string} listName The name of the list to fetch.
	 * @param {array} indexables The name of the list to fetch.
	 *
	 * @returns {boolean} True if the update was successful.
	 */
	const updateList = ( listName, indexables ) => {
		switch ( listName ) {
			case "least_readability":
				return ( indexables.length < 7 ) ? fetchList( "least_readability", setWorstReadabilityIndexables ) : renderList( setWorstReadabilityIndexables );
			case "least_seo_score":
				return ( indexables.length < 7 ) ? fetchList( "least_seo_score", setWorstSEOIndexables ) : renderList( setWorstSEOIndexables );
			case "most_linked":
				return ( indexables.length < 7 ) ? fetchList( "most_linked", setMostLinkedIndexables ) : renderList( setMostLinkedIndexables );
			case "least_linked":
				return ( indexables.length < 7 ) ? fetchList( "least_linked", setLeastLinkedIndexables ) : renderList( setLeastLinkedIndexables );
			default:
				return false;
		}
	};

	const handleUndo =  useCallback( async( ignored ) => {
		const id = ignored.indexable.id;
		const type = ignored.type;
		const indexable = ignored.indexable;
		const position = ignored.position;

		try {
			const response = await apiFetch( {
				path: "yoast/v1/restore_indexable",
				method: "POST",
				data: { id: id, type: type },
			} );

			const parsedResponse = await response.json;
			if ( parsedResponse.success ) {
				switch ( type ) {
					case "least_readability":
						setWorstReadabilityIndexables( prevState =>
							[
								...prevState.splice( 0, position ),
								indexable,
								...prevState.splice( position, worstReadabilityIndexables.length ),
							]
							);
						break;
					case "least_seo_score":
						setWorstSEOIndexables( prevState => [ indexable, ...prevState ] );
						break;
					case "most_linked":
						setMostLinkedIndexables( prevState => [ indexable, ...prevState ] );
						break;
					case "least_linked":
						setLeastLinkedIndexables( prevState => [ indexable, ...prevState ] );
						break;
				}
				setIgnoreIndexable( null );
				return true;
			}
			return false;
		} catch ( error ) {
			// URL() constructor throws a TypeError exception if url is malformed.
			console.error( error.message );
			return false;
		}
	}, [ apiFetch, setWorstReadabilityIndexables, setWorstSEOIndexables, setMostLinkedIndexables, setLeastLinkedIndexables, setIgnoreIndexable, worstReadabilityIndexables ] );

	const onClickUndo = useCallback( ( ignored ) => {
		return () => handleUndo( ignored );
	}, [ handleUndo ] );

	useEffect( async() => {
		updateList( "least_readability", worstReadabilityIndexables );
	}, [] );

	useEffect( async() => {
		updateList( "least_seo_score", worstSEOIndexables );
	}, [ ] );

	useEffect( async() => {
		if ( ignoreIndexable !== null ) {
			switch ( ignoreIndexable.type ) {
				case "least_readability":
					return updateList( ignoreIndexable.type, worstReadabilityIndexables );
				case "least_seo_score":
					return updateList( ignoreIndexable.type, worstSEOIndexables );
				case "most_linked":
					return updateList( ignoreIndexable.type, leastLinkedIndexables );
				case "least_linked":
					return updateList( ignoreIndexable.type, mostLinkedIndexables );
				default:
					return false;
			}
		}
	}, [ ignoreIndexable ] );

	useEffect( async() => {
		updateList( "most_linked", mostLinkedIndexables );
	}, [ ] );

	useEffect( async() => {
		updateList( "least_linked", leastLinkedIndexables );
	}, [] );

	return <div
		className="yst-bg-white yst-rounded-lg yst-p-6 yst-shadow-md yst-max-w-full yst-mt-6"
	>

		{ ignoreIndexable && <Alert><Button onClick={ onClickUndo( ignoreIndexable ) }>{ `Ignore ${ignoreIndexable.indexable.id}` }</Button></Alert> }
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
			type="least_readability"
			addToIgnoreList={ setIgnoreIndexable }
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
			addToIgnoreList={ setIgnoreIndexable }
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
			addToIgnoreList={ setIgnoreIndexable }
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
			addToIgnoreList={ setIgnoreIndexable }
		/>

	</div>;
}

export default IndexablesPage;
