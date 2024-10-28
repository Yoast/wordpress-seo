import React from "react";
import PropTypes from "prop-types";
import { Table, SkeletonLoader } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { isUndefined } from "lodash";
import TrendGraph from "../../elements/TrendGraph";
import IntentBadge from "../../elements/IntentBadge";
import DifficultyBullet from "../../elements/DifficultyBullet";

/**
 * The row for the keyphrases table.
 *
 * @param {Object} props The props.
 * @param {string} props.keyword The keyword.
 * @param {string} props.searchVolume The search volume.
 * @param {Array} props.trends The trends.
 * @param {number} props.keywordDifficultyIndex The keyword difficulty index.
 * @param {Array} props.intent The intent.
 * @param {Function} props.renderButton The render button function.
 * @param {Array} props.relatedKeyphrases The related keyphrases.
 *
 * @returns {JSX.Element} The row.
 */
const KeyphrasesTableRow = ( { keyword, searchVolume, trends, keywordDifficultyIndex, intent, renderButton, relatedKeyphrases } ) => {
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
			{ renderButton && <Table.Cell className="yst-flex yst-justify-center yst-w-[124px]">
				{ renderButton( keyword, relatedKeyphrases ) }
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
	renderButton: PropTypes.func,
	relatedKeyphrases: PropTypes.array,
};

/**
 * Laoding keyphrase table row.
 *
 * @param {boolean} withButton Whether the user is with button columns or not.
 *
 * @returns {JSX.Element} The loading row.
 */
const LoadingKeyphrasesTableRow = ( { withButton = false } ) => {
	return (
		<Table.Row>
			<Table.Cell className="yst-w-56">
				<SkeletonLoader as="span" className="yst-w-[167px] yst-h-5" />
			</Table.Cell>
			<Table.Cell>
				<SkeletonLoader className="yst-w-5 yst-h-5" />
			</Table.Cell>
			<Table.Cell>
				<SkeletonLoader className="yst-w-14 yst-h-5" />
			</Table.Cell>
			<Table.Cell>
				<SkeletonLoader className="yst-w-16 yst-h-5" />
			</Table.Cell>
			<Table.Cell>
				<div className="yst-flex yst-gap-2">
					<SkeletonLoader className="yst-w-4 yst-h-5" />
					<SkeletonLoader className="yst-w-3 yst-h-5" />
				</div>
			</Table.Cell>
			{ withButton &&
			<Table.Cell>
				<SkeletonLoader className="yst-w-16 yst-h-7" />
			</Table.Cell>
			}
		</Table.Row>
	);
};

LoadingKeyphrasesTableRow.propTypes = {
	withButton: PropTypes.bool,
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
			case "Trends":
				rowData.trends = row[ index ].split( "," ).map( ( value ) => parseFloat( value ) );
				break;
			case "Intent":
				rowData.intent = row[ index ].split( "," ).map( ( value ) => intentMapping[ Number( value ) ] );
				break;
			case "Keyword Difficulty Index":
				rowData.keywordDifficultyIndex = Number( row[ index ] );
				break;
			case "Search Volume":
				rowData.searchVolume = row[ index ];
				break;
			default:
				rowData[ columnName.toLowerCase() ] = row[ index ];
		}
	} );
	return rowData;
};

/**
 *
 * @param {object} data The rows to display in the table.
 * @param {Function} renderButton The render button function.
 * @param {Array} relatedKeyphrases The related keyphrases.
 *
 * @returns  {JSX.Element} The keyphrases table.
 */
const KeyphrasesTable = ( { data, renderButton, relatedKeyphrases } ) => {
	const rows = data?.results?.rows?.map( row => prepareRow(  data.results.columnNames, row ) );

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
				<Table.Header>
					{ __( "Difficulty %", "wordpress-seo" ) }
				</Table.Header>
				{ renderButton && <Table.Header className="yst-text-right yst-w-20">
					{ __( "Add keyphrase", "wordpress-seo" ) }
				</Table.Header> }
			</Table.Row>
		</Table.Head>

		<Table.Body>

			{ rows ? rows.map( ( rowData, index ) =>
				<KeyphrasesTableRow
					key={ `related-keyphrase-${ index }` }
					renderButton={ renderButton }
					relatedKeyphrases={ relatedKeyphrases }
					{ ...rowData }
				/>,
			)
			// Show 10 loading rows when there are no rows.
				: Array.from( { length: 10 }, ( _, index ) =>
					<LoadingKeyphrasesTableRow key={ `loading-row-${ index }` } withButton={ ! isUndefined( renderButton ) }  /> )
			}
		</Table.Body>
	</Table>;
};

KeyphrasesTable.propTypes = {
	data: PropTypes.object,
	relatedKeyphrases: PropTypes.array,
	renderButton: PropTypes.func,
};

KeyphrasesTable.displayName = "KeyphrasesTable";

export default KeyphrasesTable;
