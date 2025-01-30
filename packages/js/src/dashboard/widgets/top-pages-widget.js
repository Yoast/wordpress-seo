import { useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Alert, SkeletonLoader } from "@yoast/ui-library";
import { TableWidget } from "./table-widget";
import { Widget } from "./widget";

/**
 * @type {import("../index").MostPopularContent} Most popular content
 */

const TITLE = __( "Top 5 most popular content", "wordpress-seo" );

/**
 * @param {[MostPopularContent]} data The data.
 * @param {JSX.Element} [children] The children. Use this to override the data rendering.
 * @returns {JSX.Element} The element.
 */
export const MostPopularTable = ( { data, children } ) => {
	return <TableWidget title={ TITLE }>
		<TableWidget.Head>
			<TableWidget.Header>{ __( "Landing page", "wordpress-seo" ) }</TableWidget.Header>
			<TableWidget.Header className="yst-text-end">{ __( "Clicks", "wordpress-seo" ) }</TableWidget.Header>
			<TableWidget.Header className="yst-text-end">{ __( "Impressions", "wordpress-seo" ) }</TableWidget.Header>
			<TableWidget.Header className="yst-text-end">{ __( "CTR", "wordpress-seo" ) }</TableWidget.Header>
			<TableWidget.Header className="yst-text-end">{ __( "Average position", "wordpress-seo" ) }</TableWidget.Header>
			<TableWidget.Header className="yst-text-center">{ __( "SEO score", "wordpress-seo" ) }</TableWidget.Header>
		</TableWidget.Head>
		<TableWidget.Body>
			{ children || data.map( ( { subject, clicks, impressions, ctr, position, seoScore }, index ) => (
				<TableWidget.Row key={ `most-popular-content-${ index }` } index={ index }>
					<TableWidget.Cell className="yst-text-slate-900 yst-font-medium">{ subject }</TableWidget.Cell>
					<TableWidget.Cell className="yst-text-end">{ clicks }</TableWidget.Cell>
					<TableWidget.Cell className="yst-text-end">{ impressions }</TableWidget.Cell>
					<TableWidget.Cell className="yst-text-end">{ ctr }</TableWidget.Cell>
					<TableWidget.Cell className="yst-text-end">{ position }</TableWidget.Cell>
					<TableWidget.Cell><TableWidget.ScoreBullet score={ seoScore } /></TableWidget.Cell>
				</TableWidget.Row>
			) ) }
		</TableWidget.Body>
	</TableWidget>;
};

/**
 * @param {import("../services/data-provider")} dataProvider The data provider.
 * @param {number} [limit=5] The limit.
 * @returns {JSX.Element} The element.
 */
export const TopPagesWidget = ( { dataProvider, limit = 5 } ) => {
	const [ data, setData ] = useState( [] );
	const [ error, setError ] = useState( null );
	const [ isPending, setIsPending ] = useState( true );

	useEffect( () => {
		const controller = new AbortController();
		dataProvider.getTopPages( limit, controller.signal )
			.then( ( response ) => setData( response ) )
			.catch( ( e ) => setError( e ) )
			.finally( () => setIsPending( false ) );

		return () => controller.abort();
	}, [ dataProvider, limit ] );

	if ( isPending ) {
		return <MostPopularTable>
			{ Array.from( { length: limit }, ( _, index ) => (
				<TableWidget.Row key={ `most-popular-content-${ index }` } index={ index }>
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
				</TableWidget.Row>
			) ) }
		</MostPopularTable>;
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

	return <MostPopularTable data={ data } />;
};
