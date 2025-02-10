import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Alert, Button, SkeletonLoader } from "@yoast/ui-library";
import { useRemoteData } from "../services/use-remote-data";
import { WidgetTable } from "../components/widget-table";
import { Widget, WidgetTitle } from "./widget";
import { ArrowRightIcon } from "@heroicons/react/solid";
import { InfoTooltip } from "../components/info-tooltip";


/**
 * @type {import("../index").TopPageData} TopPageData
 */

/** @type {string} */
const TITLE = __( "Top 5 most popular content", "wordpress-seo" );


const Info = ( { link } ) => (
	<>
		<p>
			{ __(
				"The top 5 URLs on your website with the highest number of clicks.",
				"wordpress-seo"
			) }
		</p>
		<Button
			variant="tertiary"
			href={ link }
			className="yst-px-0 yst-flex yst-gap-1.5"
		>
			{ __( "Learn more", "wordpress-seo" ) }
			<ArrowRightIcon className="yst-w-4 yst-h-4 yst-me-1 rtl:yst-rotate-180" />
		</Button>
	</>
);


/**
 * @param {number} index The index.
 * @returns {JSX.Element} The element.
 */
const TopPagesSkeletonLoaderRow = ( { index } ) => (
	<WidgetTable.Row index={ index }>
		<WidgetTable.Cell><SkeletonLoader>https://example.com/page</SkeletonLoader></WidgetTable.Cell>
		<WidgetTable.Cell><SkeletonLoader className="yst-ms-auto">10</SkeletonLoader></WidgetTable.Cell>
		<WidgetTable.Cell><SkeletonLoader className="yst-ms-auto">100</SkeletonLoader></WidgetTable.Cell>
		<WidgetTable.Cell><SkeletonLoader className="yst-ms-auto">0.12</SkeletonLoader></WidgetTable.Cell>
		<WidgetTable.Cell><SkeletonLoader className="yst-ms-auto">12.34</SkeletonLoader></WidgetTable.Cell>
		<WidgetTable.Cell>
			<div className="yst-flex yst-justify-center">
				<SkeletonLoader className="yst-shrink-0 yst-w-3 yst-aspect-square yst-rounded-full" />
			</div>
		</WidgetTable.Cell>
	</WidgetTable.Row>
);

/**
 * @param {TopPageData[]} data The data.
 * @param {JSX.Element} [children] The children. Use this to override the data rendering.
 * @param {string} learnMoreLink The learn more link.
 * @returns {JSX.Element} The element.
 */
const TopPagesTable = ( { data, children, learnMoreLink } ) => {
	return <Widget>
		<div className="yst-flex yst-justify-between">
			<WidgetTitle>{ TITLE }</WidgetTitle>
			<InfoTooltip>
				<Info link={ learnMoreLink } />
			</InfoTooltip>
		</div>
		<WidgetTable>
			<WidgetTable.Head>
				<WidgetTable.Header>{ __( "Landing page", "wordpress-seo" ) }</WidgetTable.Header>
				<WidgetTable.Header className="yst-text-end">{ __( "Clicks", "wordpress-seo" ) }</WidgetTable.Header>
				<WidgetTable.Header className="yst-text-end">{ __( "Impressions", "wordpress-seo" ) }</WidgetTable.Header>
				<WidgetTable.Header className="yst-text-end">{ __( "CTR", "wordpress-seo" ) }</WidgetTable.Header>
				<WidgetTable.Header className="yst-text-end">{ __( "Average position", "wordpress-seo" ) }</WidgetTable.Header>
				<WidgetTable.Header className="yst-text-center">{ __( "SEO score", "wordpress-seo" ) }</WidgetTable.Header>
			</WidgetTable.Head>
			<WidgetTable.Body>
				{ children || data.map( ( { subject, clicks, impressions, ctr, position, seoScore }, index ) => (
					<WidgetTable.Row key={ `most-popular-content-${ index }` } index={ index }>
						<WidgetTable.Cell className="yst-text-slate-900 yst-font-medium">{ subject }</WidgetTable.Cell>
						<WidgetTable.Cell className="yst-text-end">{ clicks }</WidgetTable.Cell>
						<WidgetTable.Cell className="yst-text-end">{ impressions }</WidgetTable.Cell>
						<WidgetTable.Cell className="yst-text-end">{ ctr }</WidgetTable.Cell>
						<WidgetTable.Cell className="yst-text-end">{ position }</WidgetTable.Cell>
						<WidgetTable.Cell><WidgetTable.ScoreBullet score={ seoScore } /></WidgetTable.Cell>
					</WidgetTable.Row>
				) ) }
			</WidgetTable.Body>
		</WidgetTable>
	</Widget>;
};

/**
 * @param {import("../services/data-provider")} dataProvider The data provider.
 * @param {import("../services/remote-data-provider")} remoteDataProvider The remote data provider.
 * @param {number} [limit=5] The limit.
 * @returns {JSX.Element} The element.
 */
export const TopPagesWidget = ( { dataProvider, remoteDataProvider, limit = 5 } ) => {
	const getTopPages = useCallback( ( options ) => {
		return remoteDataProvider.fetchJson( dataProvider.getEndpoint( "topPages" ), { limit: limit.toString( 10 ) }, options );
	}, [ dataProvider, limit ] );

	const { data, error, isPending } = useRemoteData( getTopPages );

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

	if ( ! data || data.length === 0 ) {
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
