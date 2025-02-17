import { useCallback, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Alert, Button, SkeletonLoader, TooltipContainer, TooltipTrigger, TooltipWithContext } from "@yoast/ui-library";
import { PencilIcon } from "@heroicons/react/outline";
import { useRemoteData } from "../services/use-remote-data";
import { WidgetTable, Score } from "../components/widget-table";
import { Widget, WidgetTitle } from "./widget";
import { ArrowNarrowRightIcon  } from "@heroicons/react/solid";
import { InfoTooltip } from "../components/info-tooltip";

/**
 * @type {import("../index").TopPageData} TopPageData
 */

/** @type {string} */
const TITLE = __( "Top 5 most popular content", "wordpress-seo" );

/**
 * The content of the info tooltip.
 *
 * @param {string} url The learn more link.
 *
 * @returns {JSX.Element} The element.
 */
const Info = ( { url } ) => (
	<>
		<p>
			{ __(
				"The top 5 URLs on your website with the highest number of clicks.",
				"wordpress-seo"
			) }
		</p>
		<Button
			variant="tertiary"
			as="a"
			target="_blank"
			href={ url }
			className="yst-px-0"
		>
			{ __( "Learn more", "wordpress-seo" ) }
			<ArrowNarrowRightIcon className="yst-w-4 yst-h-4 yst-me-1 rtl:yst-rotate-180 yst-ms-1.5" />
			<span className="yst-sr-only">
				{
					/* translators: Hidden accessibility text. */
					__( "(Opens in a new browser tab)", "wordpress-seo" )
				}
			</span>
		</Button>
	</>
);

/**
 * The header for the SEO score column when disabled.
 *
 * @param {boolean} isIndexablesDisabled The indexables disabled status.
 *
 * @returns {JSX.Element} The element.
 */
export const SeoScoreHeader = ( { isIndexablesEnabled, isSeoAnalysisEnabled } ) => {
	if ( isIndexablesEnabled && isSeoAnalysisEnabled ) {
		return <>
			Yoast
			<br />
			{ __( "SEO score", "wordpress-seo" ) }
		</>;
	}

	let tooltipText;

	if ( ! isIndexablesEnabled ) {
		tooltipText = __( "We can’t analyze your content, because you’re in a non-production environment.", "wordpress-seo" );
	} else if ( ! isSeoAnalysisEnabled ) {
		tooltipText = __( "We can’t provide SEO scores, because the SEO analysis is disabled for your site.", "wordpress-seo" );
	}

	return <TooltipContainer>
		<TooltipTrigger ariaDescribedby="yst-disabled-score-header-tooltip">
			<span className="yst-underline yst-decoration-dotted">
				Yoast
				<br />
				{ __( "SEO score", "wordpress-seo" ) }
			</span>
		</TooltipTrigger>
		<TooltipWithContext position="left" id="yst-disabled-score-header-tooltip">
			{ tooltipText }
		</TooltipWithContext>
	</TooltipContainer>;
};

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
		<WidgetTable.Cell>
			<SkeletonLoader className="yst-ms-auto">
				Edit
			</SkeletonLoader>
		</WidgetTable.Cell>
	</WidgetTable.Row>
);

/**
 * @param {TopPageData[]} data The data.
 * @param {JSX.Element} [children] The children. Use this to override the data rendering.
 * @param {boolean} [isIndexablesEnabled] Whether indexables are enabled.
 * @param {boolean} [isSeoAnalysisEnabled] Whether SEO analysis is enabled.
 *
 * @returns {JSX.Element} The element.
 */
const TopPagesTable = ( { data, children, isIndexablesEnabled = true, isSeoAnalysisEnabled = true } ) => {
	return <WidgetTable>
		<WidgetTable.Head>
			<WidgetTable.Header>{ __( "Landing page", "wordpress-seo" ) }</WidgetTable.Header>
			<WidgetTable.Header className="yst-text-end">{ __( "Clicks", "wordpress-seo" ) }</WidgetTable.Header>
			<WidgetTable.Header className="yst-text-end">{ __( "Impressions", "wordpress-seo" ) }</WidgetTable.Header>
			<WidgetTable.Header className="yst-text-end">{ __( "CTR", "wordpress-seo" ) }</WidgetTable.Header>
			<WidgetTable.Header className="yst-text-end">{ __( "Average position", "wordpress-seo" ) }</WidgetTable.Header>
			<WidgetTable.Header className="yst-text-center">
				<SeoScoreHeader isIndexablesEnabled={ isIndexablesEnabled } isSeoAnalysisEnabled={ isSeoAnalysisEnabled } />
			</WidgetTable.Header>
			<WidgetTable.Header className="yst-text-end">{ __( "Actions", "wordpress-seo" ) }</WidgetTable.Header>
		</WidgetTable.Head>
		<WidgetTable.Body>
			{ children || data.map( ( { subject, clicks, impressions, ctr, position, seoScore, links }, index ) => (
				<WidgetTable.Row key={ `most-popular-content-${ index }` } index={ index }>
					<WidgetTable.Cell className="yst-text-slate-900 yst-font-medium">{ subject }</WidgetTable.Cell>
					<WidgetTable.Cell className="yst-text-end">{ clicks }</WidgetTable.Cell>
					<WidgetTable.Cell className="yst-text-end">{ impressions }</WidgetTable.Cell>
					<WidgetTable.Cell className="yst-text-end">{ ctr }</WidgetTable.Cell>
					<WidgetTable.Cell className="yst-text-end">{ position }</WidgetTable.Cell>
					<WidgetTable.Cell>
						<div className="yst-flex yst-justify-center">
							<Score
								score={ seoScore }
								isIndexablesEnabled={ isIndexablesEnabled }
								isSeoAnalysisEnabled={ isSeoAnalysisEnabled }
								isEditable={ links?.edit }
							/>
						</div>
					</WidgetTable.Cell>

					<WidgetTable.Cell className="yst-text-end">
						<Button
							variant="tertiary"
							size="small"
							as="a"
							href={ links?.edit }
							className="yst-px-0 yst-me-1"
							disabled={ ! links?.edit }
							aria-disabled={ ! links?.edit }
							role="link"
						>
							<PencilIcon className="yst-w-4 yst-h-4 yst-me-1.5" />
							{ __( "Edit", "wordpress-seo" ) }
						</Button>
					</WidgetTable.Cell>
				</WidgetTable.Row>
			) ) }
		</WidgetTable.Body>
	</WidgetTable>;
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
	links: dataFormatter.format( item.links, "links", { widget: "topPages" } ),
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
		return remoteDataProvider.fetchJson(
			dataProvider.getEndpoint( "timeBasedSeoMetrics" ),
			{ limit: limit.toString( 10 ), options: { widget: "page" }  },
			options );
	}, [ dataProvider, limit ] );

	const infoLink = dataProvider.getLink( "topPagesInfoLearnMore" );

	const isIndexablesEnabled = dataProvider.hasFeature( "indexables" );
	const isSeoAnalysisEnabled = dataProvider.hasFeature( "seoAnalysis" );

	/**
	 * @type {function(?TopPageData[]): TopPageData[]} Function to format the top pages data.
	 */
	const formatTopPages = useMemo( () => createTopPageFormatter( dataFormatter ), [ dataFormatter ] );

	const { data, error, isPending } = useRemoteData( getTopPages, formatTopPages );

	const renderContent = () => {
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
			return <Alert variant="error" className="yst-mt-4">{ error.message }</Alert>;
		}

		if ( data.length === 0 ) {
			return <p className="yst-mt-4">{ __( "No data to display: Your site hasn't received any visitors yet.", "wordpress-seo" ) }</p>;
		}

		return <TopPagesTable data={ data } isIndexablesEnabled={ isIndexablesEnabled } isSeoAnalysisEnabled={ isSeoAnalysisEnabled } />;
	};

	return <Widget>
		<div className="yst-flex yst-justify-between">
			<WidgetTitle>{ TITLE }</WidgetTitle>
			<InfoTooltip>
				<Info url={ infoLink } />
			</InfoTooltip>
		</div>
		{ renderContent() }
	</Widget>;
};
