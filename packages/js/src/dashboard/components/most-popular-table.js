import { __ } from "@wordpress/i18n";
import { TableWidget } from "./table-widget";

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
export const MostPopularTable = ( { data } ) => {
	return <TableWidget title={ __( "Top 5 most popular content", "wordpress-seo" ) }>
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
	</TableWidget>;
};
