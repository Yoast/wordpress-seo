import apiFetch from "@wordpress/api-fetch";
import { __ } from "@wordpress/i18n";
import { useEffect, useState } from "@wordpress/element";
import { Button, Table } from "@yoast/ui-library";
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

	return <div
		className="yst-bg-white yst-rounded-lg yst-p-6 yst-shadow-md yst-max-w-full yst-mt-6"
	>
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
		/>
		{/* <h3 className="yst-my-4 yst-text-xl">Least Linked To</h3>
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
		</Table> */}
	</div>;
}

export default IndexablesPage;
