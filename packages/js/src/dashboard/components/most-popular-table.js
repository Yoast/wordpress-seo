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
			<TableWidget.Header>{ __( "Clicks", "wordpress-seo" ) }</TableWidget.Header>
			<TableWidget.Header>{ __( "Impressions", "wordpress-seo" ) }</TableWidget.Header>
			<TableWidget.Header>{ __( "CTR", "wordpress-seo" ) }</TableWidget.Header>
			<TableWidget.Header>{ __( "Average position", "wordpress-seo" ) }</TableWidget.Header>
			<TableWidget.Header>
				<div className="yst-flex yst-justify-end">
					{ __( "SEO score", "wordpress-seo" ) }
				</div>
			</TableWidget.Header>
		</TableWidget.Head>
		<TableWidget.Body>
			{ data.map( ( { subject, clicks, impressions, ctr, averagePosition, seoScore }, index ) => (
				<TableWidget.Row key={ `most-popular-content-${ index }` } index={ index }>
					<TableWidget.Cell>{ subject }</TableWidget.Cell>
					<TableWidget.Cell>{ clicks }</TableWidget.Cell>
					<TableWidget.Cell>{ impressions }</TableWidget.Cell>
					<TableWidget.Cell>{ ctr }</TableWidget.Cell>
					<TableWidget.Cell>{ averagePosition }</TableWidget.Cell>
					<TableWidget.Cell><TableWidget.ScoreBullet score={ seoScore } /></TableWidget.Cell>
				</TableWidget.Row>
			) ) }
		</TableWidget.Body>
	</TableWidget>;
};
