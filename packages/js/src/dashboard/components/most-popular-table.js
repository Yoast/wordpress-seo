import { __ } from "@wordpress/i18n";
import { TableWidget } from "./table-widget";
import { PencilIcon } from "@heroicons/react/outline";
import { Button } from "@yoast/ui-library";

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
					<div className="yst-flex yst-justify-center">
						{ __( "SEO score", "wordpress-seo" ) }
					</div>
				</div>
			</TableWidget.Header>
			<TableWidget.Header className="yst-text-end">{ __( "Actions", "wordpress-seo" ) }</TableWidget.Header>
		</TableWidget.Head>
		<TableWidget.Body>
			{ data.map( ( { subject, clicks, impressions, ctr, averagePosition, seoScore, links }, index ) => (
				<TableWidget.Row key={ `most-popular-content-${ index }` } index={ index }>
					<TableWidget.Cell className="yst-text-slate-900 yst-font-medium">{ subject }</TableWidget.Cell>
					<TableWidget.Cell className="yst-text-end">{ clicks }</TableWidget.Cell>
					<TableWidget.Cell className="yst-text-end">{ impressions }</TableWidget.Cell>
					<TableWidget.Cell className="yst-text-end">{ ctr }</TableWidget.Cell>
					<TableWidget.Cell className="yst-text-end">{ averagePosition }</TableWidget.Cell>
					<TableWidget.Cell><TableWidget.ScoreBullet score={ seoScore } /></TableWidget.Cell>
					<TableWidget.Cell className="yst-text-end">
						<Button
							variant="tertiary"
							size="small"
							as="a"
							href={ links?.edit }
							className="yst-px-0 yst-me-1"
							disabled={ ! links || ! links?.edit }
							aria-disabled={ ! links || ! links?.edit }
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
