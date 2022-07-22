import apiFetch from "@wordpress/api-fetch";
import { __ } from "@wordpress/i18n";
import { useEffect, useState, useCallback } from "@wordpress/element";
import { Button, Table, Alert } from "@yoast/ui-library";
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
	 * Updates the content of a list of indexables.
	 *
	 * @param {string} listName The name of the list to fetch.
	 *
	 * @returns {boolean} True if the update was successful.
	 */
	const updateList = ( listName ) => {
		switch ( listName ) {
			case "least_readability":
				return fetchList( "least_readability", setWorstReadabilityIndexables );
			case "least_seo_score":
				return fetchList( "least_seo_score", setWorstSEOIndexables );
			default:
				return false;
		}
	};

	const handleUndo =  useCallback( async( e ) => {
		const id = e.currentTarget.dataset.id;
		const type = e.currentTarget.dataset.type;
		try {
			const response = await apiFetch( {
				path: "yoast/v1/restore_indexable",
				method: "POST",
				data: { id: id, type: type },
			} );

			const parsedResponse = await response.json;
			if ( parsedResponse.success ) {
				updateList( type );
				setIgnoreIndexable( null );
				return true;
			}
			return false;
		} catch ( error ) {
			// URL() constructor throws a TypeError exception if url is malformed.
			console.error( error.message );
			return false;
		}
	}, [ apiFetch, setIgnoreIndexable ] );

	useEffect( async() => {
		updateList( "least_readability" );
	}, [ ] );

	useEffect( async() => {
		updateList( "least_seo_score" );
	}, [ ] );

	useEffect( async() => {
		if ( ignoreIndexable !== null ) {
			updateList( ignoreIndexable.type );
		}
	}, [ ignoreIndexable ] );

	return <div
		className="yst-bg-white yst-rounded-lg yst-p-6 yst-shadow-md yst-max-w-full yst-mt-6"
	>

		{ ignoreIndexable && <Alert><Button onClick={ handleUndo } data-id={ignoreIndexable.id} data-type={ignoreIndexable.type}>{ `Ignore ${ignoreIndexable.id}` }</Button></Alert> }
		<header className="yst-border-b yst-border-gray-200"><div className="yst-max-w-screen-sm yst-p-8"><h2 className="yst-text-2xl yst-font-bold">{ __( "Indexables page", "wordpress-seo" ) }</h2></div></header>
		<h3 className="yst-my-4 yst-text-xl">Least Readability Score</h3>
		<IndexablesTable
			indexables={ worstReadabilityIndexables }
			keyHeaderMap={
				{
					breadcrumb_title: __( "Title", "wordpress-seo" ),
					readability_score: __( "Readability Score", "wordpress-seo" ),
					edit: __( "Edit", "wordpress-seo" ),
					ignore: __( "Ignore", "wordpress-seo" ),
				}
			}
			type="least_readability"
			addToIgnoreList={ setIgnoreIndexable }
		/>
		<h3 className="yst-my-4 yst-text-xl">Least SEO Score</h3>
		<IndexablesTable
			indexables={ worstSEOIndexables }
			keyHeaderMap={
				{
					breadcrumb_title: __( "Title", "wordpress-seo" ),
					primary_focus_keyword_score: __( "SEO Score", "wordpress-seo" ),
					edit: __( "Edit", "wordpress-seo" ),
					ignore: __( "Ignore", "wordpress-seo" ),
				}
			}
			type="least_seo_score"
			addToIgnoreList={ setIgnoreIndexable }
		/>
		{ /* <h3 className="yst-my-4 yst-text-xl">Least Linked To</h3>
		<Table>
			<Table.Head>
				<Table.Row>
					<Table.Header>{ __( "Title", "wordpress-seo" ) }</Table.Header>
					<Table.Header>{ __( "Incoming links", "wordpress-seo" ) }</Table.Header>
					<Table.Header>{ __( "Find posts to link from", "wordpress-seo" ) }</Table.Header>
					<Table.Header>{ __( "Ignore", "wordpress-seo" ) }</Table.Header>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.Row>
					<Table.Cell>test1</Table.Cell>
					<Table.Cell>test1</Table.Cell>
					<Table.Cell>test1</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell>test1</Table.Cell>
					<Table.Cell>test1</Table.Cell>
					<Table.Cell>test1</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell>test1</Table.Cell>
					<Table.Cell>test1</Table.Cell>
					<Table.Cell>test1</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table>
		<h3 className="yst-my-4 yst-text-xl">Most Linked To</h3>
		<Table>
			<Table.Head>
				<Table.Header>{ __( "Title", "wordpress-seo" ) }</Table.Header>
				<Table.Header>{ __( "Incoming links", "wordpress-seo" ) }</Table.Header>
				<Table.Header>{ __( "Find posts to link to", "wordpress-seo" ) }</Table.Header>
				<Table.Header>{ __( "Ignore", "wordpress-seo" ) }</Table.Header>
			</Table.Head>
			<Table.Body>
				<Table.Row>
					<Table.Cell>test1</Table.Cell>
					<Table.Cell>test1</Table.Cell>
					<Table.Cell>test1</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell>test1</Table.Cell>
					<Table.Cell>test1</Table.Cell>
					<Table.Cell>test1</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell>test1</Table.Cell>
					<Table.Cell>test1</Table.Cell>
					<Table.Cell>test1</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table> */ }
	</div>;
}

export default IndexablesPage;
