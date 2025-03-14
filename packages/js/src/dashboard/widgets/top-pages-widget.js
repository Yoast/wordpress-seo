import { PencilIcon } from "@heroicons/react/outline";
import { useCallback, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button, SkeletonLoader, TooltipContainer, TooltipTrigger, TooltipWithContext } from "@yoast/ui-library";
import { ErrorAlert } from "../components/error-alert";
import { NoDataParagraph } from "../components/no-data-paragraph";
import { Score, WidgetTable } from "../components/widget-table";
import { useRemoteData } from "../services/use-remote-data";
import { Widget } from "./widget";

/**
 * @type {import("../index").TopPageData} TopPageData
 */

/**
 * The header for the SEO score column.
 *
 * @param {boolean} isIndexablesEnabled Whether indexables are enabled.
 * @param {boolean} isSeoAnalysisEnabled Whether SEO analysis is enabled.
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

	return <TooltipContainer className="yst-inline-block">
		<TooltipTrigger
			ariaDescribedby="yst-disabled-score-header-tooltip"
			className="yst-cursor-help yst-underline yst-decoration-dotted yst-underline-offset-4"
		>
			Yoast
			<br />
			{ __( "SEO score", "wordpress-seo" ) }
		</TooltipTrigger>
		<TooltipWithContext position="bottom" id="yst-disabled-score-header-tooltip" className="yst-w-52">
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
 * @returns {JSX.Element} The element.
 */
const TopPagesTable = ( { data, children, isIndexablesEnabled = true, isSeoAnalysisEnabled = true } ) => (
	<WidgetTable>
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
								id={ `yst-top-pages-widget__seo-score-${ index }` }
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
	</WidgetTable>
);

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
 * The content of the top pages widget.
 *
 * @param {TopPageData[]} data The data.
 * @param {boolean} isPending Whether the data is pending.
 * @param {number} limit The limit.
 * @param {Error} error The error.
 * @param {import("../services/data-provider")} dataProvider The data provider.
 *
 * @returns {JSX.Element} The element.
 */
const TopPagesWidgetContent = ( { data, isPending, limit, error, dataProvider } ) => {
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
		return <ErrorAlert error={ error } supportLink={ dataProvider.getLink( "errorSupport" ) } className="yst-mt-4" />;
	}
	if ( data.length === 0 ) {
		return <NoDataParagraph />;
	}

	return (
		<TopPagesTable
			data={ data }
			isIndexablesEnabled={ dataProvider.hasFeature( "indexables" ) }
			isSeoAnalysisEnabled={ dataProvider.hasFeature( "seoAnalysis" ) }
		/>
	);
};

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
			{ limit: limit.toString( 10 ), options: { widget: "page" } },
			options );
	}, [ dataProvider, limit ] );

	const infoLink = dataProvider.getLink( "topPagesInfoLearnMore" );

	/**
	 * @type {function(?TopPageData[]): TopPageData[]} Function to format the top pages data.
	 */
	const formatTopPages = useMemo( () => createTopPageFormatter( dataFormatter ), [ dataFormatter ] );

	const { data, error, isPending } = useRemoteData( getTopPages, formatTopPages );

	return <Widget
		className="yst-paper__content yst-col-span-4"
		title={ __( "Top 5 most popular content", "wordpress-seo" ) }
		tooltip={ __(
			"The top 5 URLs on your website with the highest number of clicks.",
			"wordpress-seo"
		) }
		tooltipLearnMoreLink={ infoLink }
	>
		<TopPagesWidgetContent
			data={ data }
			isPending={ isPending }
			limit={ limit }
			error={ error }
			dataProvider={ dataProvider }
		/>
	</Widget>;
};
