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
 * @returns {JSX.Element} The row.
 */
const KeyphrasesTableRow = ( { keyword, searchVolume, trends, keywordDifficultyIndex, intent, isPremium = false } ) => {
	return (
		<Table.Row>
			<Table.Cell>
				{ keyword }
			</Table.Cell>
			<Table.Cell>
				<div className="yst-flex yst-gap-2">
					{ intent.length > 0 && intent.map( ( initial, index ) => (
						<IntentBadge key={ `${ index }-${ keyword }-${ initial }` } initial={ initial } />
					) ) }
				</div>
			</Table.Cell>
			<Table.Cell>
				{ searchVolume }
			</Table.Cell>
			<Table.Cell>
				<TrendGraph data={ trends } />
			</Table.Cell>
			<Table.Cell>
				<DifficultyBullet value={ keywordDifficultyIndex } />
			</Table.Cell>
			{ isPremium && <Table.Cell className="yst-flex yst-justify-center yst-w-[124px]">
				<TableButton onAdd={ noop } onRemove={ noop } />
			</Table.Cell> }
		</Table.Row>
	);
};

KeyphrasesTableRow.propTypes = {
	keyword: PropTypes.string,
	searchVolume: PropTypes.string,
	trends: PropTypes.array,
	keywordDifficultyIndex: PropTypes.number,
	intent: PropTypes.array,
	isPremium: PropTypes.bool,
};

/**
 * Laoding keyphrase table row.
 * @param {boolean} isPremium Whether the user is premium or not.
 *
 * @returns {JSX.Element} The loading row.
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

const intentMapping = [ "i", "n", "t", "c" ];

/**
 * Prepare the row data.
 * @param {array} columnNames The column names.
 * @param {array} row The row data.
 * @returns {object} The prepared row.
 */
const prepareRow = ( columnNames, row ) => {
	const rowData = {};
	columnNames.forEach( ( columnName, index ) => {
		switch ( columnName ) {
			case "trends":
				rowData[ columnName ] = row[ index ].split( "," ).map( ( value ) => parseFloat( value ) );
				break;
			case "intent":
				rowData[ columnName ] = row[ index ].split( "," ).map( ( value ) => intentMapping[ Number( value ) ] );
				break;
			case "keywordDifficultyIndex":
				rowData[ columnName ] = Number( row[ index ] );
				break;
			default:
				rowData[ columnName ] = row[ index ];
		}
	} );
	return rowData;
};

/**
 *
 * @param {object} data The rows to display in the table.
 * @param {boolean} isPremium Whether the user is premium or not.
 *
 * @returns  {JSX.Element} The keyphrases table.
 */
const KeyphrasesTable = ( { data, isPremium = false } ) => {
	const formattedColumnNames = data?.results?.columnNames?.map( name => name.charAt( 0 ).toLowerCase() + name.replace( /\s/g, "" ).slice( 1 ) );
	const rows = data?.results?.rows?.map( row => prepareRow( formattedColumnNames, row ) );

	return <Table>
		<Table.Head>
			<Table.Row>
				<Table.Header>
					{ __( "Related keyphrase", "wordpress-seo" ) }
				</Table.Header>
				<Table.Header>
					{ __( "Intent", "wordpress-seo" ) }
				</Table.Header>
				<Table.Header>
					{ __( "Volume", "wordpress-seo" ) }
				</Table.Header>
				<Table.Header>
					{ __( "Trend", "wordpress-seo" ) }
				</Table.Header>
				<Table.Header className="yst-w-[98px]">
					{ __( "Keyphrase difficulty %", "wordpress-seo" ) }
				</Table.Header>
				{ isPremium && <Table.Header className="yst-text-right yst-w-20">
					{ __( "Add keyphrase", "wordpress-seo" ) }
				</Table.Header> }
			</Table.Row>
		</Table.Head>

		<Table.Body>

			{ rows ? rows.map( ( rowData, index ) =>
				<KeyphrasesTableRow key={ `related-keyphrase-${ index }` } { ...rowData } isPremium={ isPremium } />,
			)
			// Show 10 loading rows when there are no rows.
				: Array.from( { length: 10 }, ( _, index ) =>
					<LoadingKeyphrasesTableRow key={ `loading-row-${ index }` } isPremium={ isPremium }  /> )
			}
		</Table.Body>
	</Table>;
};

KeyphrasesTable.propTypes = {
	data: PropTypes.object,
	isPremium: PropTypes.bool,
};

export default KeyphrasesTable;
