import { __ } from "@wordpress/i18n";
import { TableWidget } from "./widget-table";
import { ArrowRightIcon } from "@heroicons/react/solid";
import { Button, Paper, Title } from "@yoast/ui-library";
import { InfoTooltip } from "./info-tooltip";

/**
 * @type {import("../index").MostPopularContent} Most popular content
 */


/**
 * The top 5 most popular content table component.
 *
 * @param {[MostPopularContent]} Data The component props.
 *
 * @returns {JSX.Element} The element.
 */
export const MostPopularTable = ( { data, learnMoreLink } ) => {
	return <Paper className="yst-grow yst-p-8 yst-shadow-md yst-mt-6">
		<div className="yst-flex yst-justify-between">
			<Title as="h3" size="2" className="yst-text-slate-900 yst-font-medium">
				{ __( "Top 5 most popular content", "wordpress-seo" ) }
			</Title>
			<InfoTooltip>
				<Info link={ learnMoreLink } />
			</InfoTooltip>
		</div>

		<TableWidget>
			<TableWidget.Head>
				<TableWidget.Header>{ __( "Landing page", "wordpress-seo" ) }</TableWidget.Header>
				<TableWidget.Header className="yst-text-end">{ __( "Clicks", "wordpress-seo" ) }</TableWidget.Header>
				<TableWidget.Header className="yst-text-end">{ __( "Impressions", "wordpress-seo" ) }</TableWidget.Header>
				<TableWidget.Header className="yst-text-end">{ __( "CTR", "wordpress-seo" ) }</TableWidget.Header>
				<TableWidget.Header  className="yst-text-end">
					{ __( "Average position", "wordpress-seo" ) }
				</TableWidget.Header>
				<TableWidget.Header className="yst-text-center">
					<div className="yst-flex yst-justify-end yst-items-end">
						<div className="yst-flex yst-justify-center yst-w-16">
							{ __( "SEO score", "wordpress-seo" ) }
						</div>
					</div>
				</TableWidget.Header>
			</TableWidget.Head>
			<TableWidget.Body>
				{ data.map( ( { subject, clicks, impressions, ctr, averagePosition, seoScore }, index ) => (
					<TableWidget.Row key={ `most-popular-content-${ index }` } index={ index }>
						<TableWidget.Cell className="yst-text-slate-900 yst-font-medium">{ subject }</TableWidget.Cell>
						<TableWidget.Cell className="yst-text-end">{ clicks }</TableWidget.Cell>
						<TableWidget.Cell className="yst-text-end">{ impressions }</TableWidget.Cell>
						<TableWidget.Cell className="yst-text-end">{ ctr }</TableWidget.Cell>
						<TableWidget.Cell className="yst-text-end">{ averagePosition }</TableWidget.Cell>
						<TableWidget.Cell><TableWidget.ScoreBullet score={ seoScore } /></TableWidget.Cell>
					</TableWidget.Row>
				) ) }
			</TableWidget.Body>
		</TableWidget>
	</Paper>;
};
