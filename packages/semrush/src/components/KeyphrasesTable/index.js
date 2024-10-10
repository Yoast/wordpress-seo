import React from "react";
import PropTypes from "prop-types";
import { Table, SkeletonLoader } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { noop } from "lodash";
import TrendGraph from "../../elements/TrendGraph";
import IntentBadge from "../../elements/IntentBadge";
import DifficultyBullet from "../../elements/DifficultyBullet";
import TableButton from "../../elements/TableButton";


/**
 * The row for the keyphrases table.
 *
 * @param {array} data The data for the row.
 * @param {boolean} isPremium Whether the user is premium or not.
 *
 * @returns {wp.Element} The row.
 */
const KeyphrasesTableRow = ( { data, isPremium = false } ) => {
	const [ relatedKeyphrase, volume, trend, difficulty, intent ] = data;
	const intentInitials = intent ? intent.split( "," ) : [];
	const chartPoints = trend.split( "," ).map( ( value, index ) => ( { x: index, y: parseFloat( value ) } ) );

	return (
		<Table.Row>
			<Table.Cell>
				{ relatedKeyphrase }
			</Table.Cell>
			<Table.Cell>
				<div className="yst-flex yst-gap-2">
					{ intentInitials.length > 0 && intentInitials.map( ( initial, index ) => (
						<IntentBadge key={ `${ index }-${ relatedKeyphrase }-${ initial }` } initial={ initial } />
					) ) }
				</div>
			</Table.Cell>
			<Table.Cell>
				{ volume }
			</Table.Cell>
			<Table.Cell>
				<TrendGraph data={ chartPoints } />
			</Table.Cell>
			<Table.Cell>
				<DifficultyBullet value={ Number( difficulty ) } />
			</Table.Cell>
			{ isPremium && <Table.Cell className="yst-flex yst-justify-center yst-w-[124px]">
				<TableButton add={ noop } remove={ noop } />
			</Table.Cell> }
		</Table.Row>
	);
};

KeyphrasesTableRow.propTypes = {
	data: PropTypes.array.isRequired,
	isPremium: PropTypes.bool,
};

/**
 * Laoding keyphrase table row.
 * @param {boolean} isPremium Whether the user is premium or not.
 *
 * @returns {wp.Element} The loading row.
 */
const LoadingKeyphrasesTableRow = ( { isPremium = false } ) => {
	return (
		<Table.Row>
			<Table.Cell className="yst-w-56">
				<SkeletonLoader as="span" className="yst-w-[167px] yst-h-5" />
			</Table.Cell>
			<Table.Cell>
				<SkeletonLoader className="yst-w-5 yst-h-5" />
			</Table.Cell>
			<Table.Cell>
				<SkeletonLoader className="yst-w-[54px] yst-h-5" />
			</Table.Cell>
			<Table.Cell>
				<SkeletonLoader className="yst-w-[66px] yst-h-5" />
			</Table.Cell>
			<Table.Cell>
				<div className="yst-flex yst-gap-2">
					<SkeletonLoader className="yst-w-[17px] yst-h-5" />
					<SkeletonLoader className="yst-w-[11px] yst-h-5" />
				</div>
			</Table.Cell>
			{ isPremium &&
			<Table.Cell>
				<SkeletonLoader className="yst-w-16 yst-h-7" />
			</Table.Cell>
			}
		</Table.Row>
	);
};

LoadingKeyphrasesTableRow.propTypes = {
	isPremium: PropTypes.bool,
};

/**
 *
 * @param {object} rows The rows to display in the table.
 * @param {boolean} isPremium Whether the user is premium or not.
 *
 * @returns  {wp.Element} The keyphrases table.
 */
const KeyphrasesTable = ( { rows, isPremium = false } ) => {
	return <Table>
		<Table.Head>
			<Table.Row>
				<Table.Header className="yst-font-medium">
					{ __( "Related keyphrase", "wordpress-seo" ) }
				</Table.Header>
				<Table.Header className="yst-font-medium">
					{ __( "Intent", "wordpress-seo" ) }
				</Table.Header>
				<Table.Header className="yst-font-medium">
					{ __( "Volume", "wordpress-seo" ) }
				</Table.Header>
				<Table.Header className="yst-font-medium">
					{ __( "Trend", "wordpress-seo" ) }
				</Table.Header>
				<Table.Header className="yst-w-24 yst-font-medium">
					{ __( "Keyphrase difficulty %", "wordpress-seo" ) }
				</Table.Header>
				{ isPremium && <Table.Header className="yst-font-medium yst-text-right yst-w-20">
					{ __( "Add keyphrase", "wordpress-seo" ) }
				</Table.Header> }
			</Table.Row>
		</Table.Head>

		<Table.Body>

			{ rows && rows.length > 0 ? rows.map( ( data, index ) =>
				<KeyphrasesTableRow key={ `related-keyphrase-${ index }` } data={ data } isPremium={ isPremium } />,
			)
			// Show 10 loading rows when there are no rows.
				: Array.from( { length: 10 }, ( _, index ) =>
					<LoadingKeyphrasesTableRow key={ `loading-row-${ index }` } isPremium={ isPremium }  /> )
			}
		</Table.Body>
	</Table>;
};

KeyphrasesTable.propTypes = {
	rows: PropTypes.array,
	isPremium: PropTypes.bool,
};

export default KeyphrasesTable;
