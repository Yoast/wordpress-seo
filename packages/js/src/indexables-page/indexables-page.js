import apiFetch from "@wordpress/api-fetch";
import { __ } from "@wordpress/i18n";
import { useEffect, useState } from "@wordpress/element";
import { Button } from "@yoast/ui-library";

import Table from "./components/list-table";

/**
 * A table with the least readable posts.
 *
 * @returns {WPElement} A table with the least readable posts.
 */
function LeastReadabilityTable() {
	const [ indexables, setIndexables ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );

	useEffect( async() => {
		try {
			const response = await apiFetch( {
				path: "yoast/v1/least_seo_score",
				method: "GET",
			} );

			const parsedResponse = await response.json;
			setIndexables( parsedResponse.least_seo_score );
			setIsLoading( false );
		} catch ( e ) {
			// URL() constructor throws a TypeError exception if url is malformed.
			console.error( e.message );
			return false;
		}
	}, [] );

	return (
		<>
			<h3 className="yst-my-4 yst-text-xl">Least Readability Score</h3>
			<Table>
				<Table.Header>
					<Table.HeaderCell>{ __( "Title", "wordpress-seo" ) }</Table.HeaderCell>
					<Table.HeaderCell>{ __( "Readability Score", "wordpress-seo" ) }</Table.HeaderCell>
					<Table.HeaderCell>{ __( "Edit", "wordpress-seo" ) }</Table.HeaderCell>
					<Table.HeaderCell>{ __( "Ignore", "wordpress-seo" ) }</Table.HeaderCell>
				</Table.Header>
				<Table.Body>
					{
						indexables.map( ( indexable, index ) => {
							return <Table.Row
								key={ `indexable-row-${ index }` }
							>
								<Table.Cell>{ indexable.breadcrumb_title }</Table.Cell>
								<Table.Cell>{ indexable.readability_score }</Table.Cell>
								<Table.Cell><Button variant="secondary">Edit</Button></Table.Cell>
								<Table.Cell><Button variant="error">Ignore</Button></Table.Cell>
							</Table.Row>;
						} )
					}
				</Table.Body>
			</Table>
		</>
	);
}

/**
 * A table.
 *
 * @returns {WPElement} A table.
 */
function IndexablesPage() {
	return <div
		className="yst-bg-white yst-rounded-lg yst-p-6 yst-shadow-md yst-max-w-full yst-mt-6"
	>
		<header className="yst-border-b yst-border-gray-200"><div className="yst-max-w-screen-sm yst-p-8"><h2 className="yst-text-2xl yst-font-bold">{ __( "Indexables page", "wordpress-seo" ) }</h2></div></header>
		<LeastReadabilityTable />
		<h3 className="yst-my-4 yst-text-xl">Least SEO Score</h3>
		<Table>
			<Table.Header>
				<Table.HeaderCell>{ __( "Title", "wordpress-seo" ) }</Table.HeaderCell>
				<Table.HeaderCell>{ __( "SEO Score", "wordpress-seo" ) }</Table.HeaderCell>
				<Table.HeaderCell>{ __( "Edit", "wordpress-seo" ) }</Table.HeaderCell>
				<Table.HeaderCell>{ __( "Ignore", "wordpress-seo" ) }</Table.HeaderCell>
			</Table.Header>
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
		<h3 className="yst-my-4 yst-text-xl">Least Linked To</h3>
		<Table>
			<Table.Header>
				<Table.HeaderCell>{ __( "Title", "wordpress-seo" ) }</Table.HeaderCell>
				<Table.HeaderCell>{ __( "Incoming links", "wordpress-seo" ) }</Table.HeaderCell>
				<Table.HeaderCell>{ __( "Find posts to link from", "wordpress-seo" ) }</Table.HeaderCell>
				<Table.HeaderCell>{ __( "Ignore", "wordpress-seo" ) }</Table.HeaderCell>
			</Table.Header>
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
			<Table.Header>
				<Table.HeaderCell>{ __( "Title", "wordpress-seo" ) }</Table.HeaderCell>
				<Table.HeaderCell>{ __( "Incoming links", "wordpress-seo" ) }</Table.HeaderCell>
				<Table.HeaderCell>{ __( "Find posts to link to", "wordpress-seo" ) }</Table.HeaderCell>
				<Table.HeaderCell>{ __( "Ignore", "wordpress-seo" ) }</Table.HeaderCell>
			</Table.Header>
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
	</div>;
}

export default IndexablesPage;
