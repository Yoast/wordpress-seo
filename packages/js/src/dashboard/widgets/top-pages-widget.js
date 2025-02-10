import { useCallback, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Alert, Button, SkeletonLoader } from "@yoast/ui-library";
import { PencilIcon } from "@heroicons/react/outline";
import { useRemoteData } from "../services/use-remote-data";
import { TableWidget } from "./table-widget";
import { Widget } from "./widget";

/**
 * @type {import("../index").TopPageData} TopPageData
 */

/** @type {string} */
const TITLE = __( "Top 5 most popular content", "wordpress-seo" );

/**
 * @param {number} index The index.
 * @returns {JSX.Element} The element.
 */
const TopPagesSkeletonLoaderRow = ( { index } ) => (
	<TableWidget.Row index={ index }>
		<TableWidget.Cell><SkeletonLoader>https://example.com/page</SkeletonLoader></TableWidget.Cell>
		<TableWidget.Cell><SkeletonLoader className="yst-ms-auto">10</SkeletonLoader></TableWidget.Cell>
		<TableWidget.Cell><SkeletonLoader className="yst-ms-auto">100</SkeletonLoader></TableWidget.Cell>
		<TableWidget.Cell><SkeletonLoader className="yst-ms-auto">0.12</SkeletonLoader></TableWidget.Cell>
		<TableWidget.Cell><SkeletonLoader className="yst-ms-auto">12.34</SkeletonLoader></TableWidget.Cell>
		<TableWidget.Cell>
			<div className="yst-flex yst-justify-center">
				<SkeletonLoader className="yst-shrink-0 yst-w-3 yst-aspect-square yst-rounded-full" />
			</div>
		</TableWidget.Cell>
		<TableWidget.Cell>
			<SkeletonLoader className="yst-ms-auto">
				Edit
			</SkeletonLoader>
		</TableWidget.Cell>
	</TableWidget.Row>
);

/**
 * @param {TopPageData[]} data The data.
 * @param {JSX.Element} [children] The children. Use this to override the data rendering.
 * @returns {JSX.Element} The element.
 */
const TopPagesTable = ( { data, children } ) => {
	return <TableWidget title={ TITLE }>
		<TableWidget.Head>
			<TableWidget.Header>{ __( "Landing page", "wordpress-seo" ) }</TableWidget.Header>
			<TableWidget.Header className="yst-text-end">{ __( "Clicks", "wordpress-seo" ) }</TableWidget.Header>
			<TableWidget.Header className="yst-text-end">{ __( "Impressions", "wordpress-seo" ) }</TableWidget.Header>
			<TableWidget.Header className="yst-text-end">{ __( "CTR", "wordpress-seo" ) }</TableWidget.Header>
			<TableWidget.Header className="yst-text-end">{ __( "Average position", "wordpress-seo" ) }</TableWidget.Header>
			<TableWidget.Header className="yst-text-center">{ __( "SEO score", "wordpress-seo" ) }</TableWidget.Header>
			<TableWidget.Header className="yst-text-end">{ __( "Actions", "wordpress-seo" ) }</TableWidget.Header>
		</TableWidget.Head>
		<TableWidget.Body>
			{ children || data.map( ( { subject, clicks, impressions, ctr, position, seoScore, editLink }, index ) => (
				<TableWidget.Row key={ `most-popular-content-${ index }` } index={ index }>
					<TableWidget.Cell className="yst-text-slate-900 yst-font-medium">{ subject }</TableWidget.Cell>
					<TableWidget.Cell className="yst-text-end">{ clicks }</TableWidget.Cell>
					<TableWidget.Cell className="yst-text-end">{ impressions }</TableWidget.Cell>
					<TableWidget.Cell className="yst-text-end">{ ctr }</TableWidget.Cell>
					<TableWidget.Cell className="yst-text-end">{ position }</TableWidget.Cell>
					<TableWidget.Cell><TableWidget.ScoreBullet score={ seoScore } /></TableWidget.Cell>
					<TableWidget.Cell className="yst-text-end">
						<Button
							variant="tertiary"
							size="small"
							as="a"
							href={ editLink }
							className="yst-px-0 yst-me-1"
							disabled={ ! editLink }
							aria-disabled={ ! editLink }
							role="link"
						>
							<PencilIcon className="yst-w-4 yst-h-4 yst-me-1.5" />
							{ __( "Edit", "wordpress-seo" ) }
						</Button>
					</TableWidget.Cell>
				</TableWidget.Row>
			) ) }
		</TableWidget.Body>
	</TableWidget>;
};

/**
 * @param {import("../services/data-formatter")} dataFormatter The data formatter.
 * @returns {function(?TopPageData[]): TopPageData[]} Function to format the top pages data.
 */
export const createTopPageFormatter = ( dataFormatter ) => ( data = [] ) => data.map( ( item ) => ( {
	subject: dataFormatter.format( item.subject, "subject", { widget: "topPages" } ),
	clicks: dataFormatter.format( item.clicks, "clicks", { widget: "topPages" } ),
	impressions: dataFormatter.format( item.impressions, "impressions", { widget: "topPages" } ),
	ctr: dataFormatter.format( item.ctr, "ctr", { widget: "topPages" } ),
	position: dataFormatter.format( item.position, "position", { widget: "topPages" } ),
	seoScore: dataFormatter.format( item.seoScore, "seoScore", { widget: "topPages" } ),
	editLink: item.links?.edit,
} ) );

/**
 * @param {import("../services/data-provider")} dataProvider The data provider.
 * @param {import("../services/remote-data-provider")} remoteDataProvider The remote data provider.
 * @param {import("../services/data-formatter")} dataFormatter The data formatter.
 * @param {number} [limit=5] The limit.
 * @returns {JSX.Element} The element.
 */
export const TopPagesWidget = ( { dataProvider, remoteDataProvider, dataFormatter, limit = 5 } ) => {
	/**
	 * @param {RequestInit} options The options.
	 * @returns {Promise<TopPageData[]|Error>} The promise of TopPageData or an Error.
	 */
	const getTopPages = useCallback( ( options ) => {
		return remoteDataProvider.fetchJson( dataProvider.getEndpoint( "topPages" ), { limit: limit.toString( 10 ) }, options );
	}, [ dataProvider, limit ] );

	/**
	 * @type {function(?TopPageData[]): TopPageData[]} Function to format the top pages data.
	 */
	const formatTopPages = useMemo( () => createTopPageFormatter( dataFormatter ), [ dataFormatter ] );

	const { data, error, isPending } = useRemoteData( getTopPages, formatTopPages );

	if ( isPending ) {
		return (
			<TopPagesTable>
				{ Array.from( { length: limit }, ( _, index ) => (
					<TopPagesSkeletonLoaderRow key={ `top-pages-table--row__${ index }` } index={ index } />
				) ) }
			</TopPagesTable>
		);
	}

	if ( error ) {
		return (
			<Widget title={ TITLE }>
				<Alert variant="error" className="yst-mt-4">
					{ error.message }
				</Alert>
			</Widget>
		);
	}

	if ( data.length === 0 ) {
		return (
			<Widget title={ TITLE }>
				<p className="yst-mt-4">
					{ __( "No data to display: Your site hasn't received any visitors yet.", "wordpress-seo" ) }
				</p>
			</Widget>
		);
	}

	return (
		<TopPagesTable data={ data } />
	);
};
