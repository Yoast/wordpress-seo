import React from "react";
import PropTypes from "prop-types";
import { Table, SkeletonLoader } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { isFunction } from "lodash";
import { DifficultyBullet, IntentBadge, TrendGraph } from "../..";

/**
 * The row for the keyphrases table.
 *
 * @param {string} [keyword=""] The keyword.
 * @param {string} [searchVolume=""] The search volume.
 * @param {number[]} [trends=[]] An array of trends for 12 months.
 * @param {number} [keywordDifficultyIndex=-1] The keyword difficulty index.
 * @param {string[]} [intent=[]] An array of intent initials.
 * @param {Function} [renderButton] The render button function.
 * @param {Object[]} [relatedKeyphrases] The related keyphrases.
 *
 * @returns {JSX.Element} The row.
 */
const KeyphrasesTableRow = ( { keyword = "", searchVolume = "", trends = [], keywordDifficultyIndex = -1, intent = [], renderButton, relatedKeyphrases } ) => {
	return (
		<Table.Row>
			<Table.Cell>
				{ keyword }
			</Table.Cell>
			<Table.Cell>
				<div className="yst-flex yst-gap-2">
					{ intent.length > 0 && intent.map( ( value, index ) => (
						<IntentBadge key={ `${ index }-${ keyword }-${ value }` } value={ value } />
					) ) }
				</div>
			</Table.Cell>
			<Table.Cell>
				<div className="yst-flex yst-justify-end">
					{ searchVolume }
				</div>
			</Table.Cell>
			<Table.Cell>
				<TrendGraph data={ trends } />
			</Table.Cell>
			<Table.Cell>
				<div className="yst-flex yst-justify-end">
					<DifficultyBullet value={ keywordDifficultyIndex } />
				</div>
			</Table.Cell>
			{ isFunction( renderButton ) && <Table.Cell>
				{ renderButton( keyword, relatedKeyphrases ) }
			</Table.Cell> }
		</Table.Row>
	);
};

KeyphrasesTableRow.propTypes = {
	keyword: PropTypes.string,
	searchVolume: PropTypes.string,
	trends: PropTypes.arrayOf( PropTypes.number ),
	keywordDifficultyIndex: PropTypes.number,
	intent: PropTypes.arrayOf( PropTypes.string ),
	renderButton: PropTypes.func,
	relatedKeyphrases: PropTypes.arrayOf( PropTypes.shape( {
		key: PropTypes.string,
		keyword: PropTypes.string,
		results: PropTypes.array,
		score: PropTypes.number,
	} ) ),
};

/**
 * Loading keyphrase table row.
 *
 * @param {boolean} withButton Whether the user is with button columns or not.
 *
 * @returns {JSX.Element} The loading row.
 */
const LoadingKeyphrasesTableRow = ( { withButton = false } ) => {
	return (
		<Table.Row>
			<Table.Cell className="yst-w-56">
				<SkeletonLoader className="yst-w-44 yst-h-5" />
			</Table.Cell>
			<Table.Cell>
				<SkeletonLoader className="yst-w-5 yst-h-5" />
			</Table.Cell>
			<Table.Cell>
				<div className="yst-flex yst-justify-end">
					<SkeletonLoader className="yst-w-14 yst-h-5" />
				</div>
			</Table.Cell>
			<Table.Cell>
				<SkeletonLoader className="yst-w-16 yst-h-5" />
			</Table.Cell>
			<Table.Cell>
				<div className="yst-flex yst-gap-2 yst-justify-end">
					<SkeletonLoader className="yst-w-4 yst-h-5" />
					<SkeletonLoader className="yst-w-3 yst-h-5" />
				</div>
			</Table.Cell>
			{ withButton && <Table.Cell>
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
 * @param {string[]} [columnNames=[]] The column names.
 * @param {string[]} [data] The rows to display in the table.
 * @param {Function} [renderButton] The render button function.
 * @param {Object[]} [relatedKeyphrases=[]] The related keyphrases.
 * @param {string} [className=""] The class name for the table.
 * @param {boolean} [isPending=false] Whether the data is still pending.
 *
 * @returns {JSX.Element} The keyphrases table.
 */
export const KeyphrasesTable = ( { columnNames = [], data, renderButton, relatedKeyphrases = [], className = "", isPending = false } ) => {
	const rows = data?.map( row => prepareRow(  columnNames, row ) );

	if ( ( ! rows || rows.length === 0 ) && ! isPending ) {
		return null;
	}

	return <Table className={ className }>
		<Table.Head>
			<Table.Row>
				<Table.Header>
					{ __( "Related keyphrase", "wordpress-seo" ) }
				</Table.Header>
				<Table.Header>
					{ __( "Intent", "wordpress-seo" ) }
				</Table.Header>
				<Table.Header>
					<div className="yst-flex yst-justify-end">
						{ __( "Volume", "wordpress-seo" ) }
					</div>
				</Table.Header>
				<Table.Header>
					{ __( "Trend", "wordpress-seo" ) }
				</Table.Header>
				<Table.Header className="yst-whitespace-nowrap">
					<div className="yst-flex yst-justify-end">
						{ __( "Difficulty %", "wordpress-seo" ) }
					</div>
				</Table.Header>
				{ renderButton && <Table.Header className="yst-min-w-28">
					<div className="yst-flex yst-justify-end">
						{ __( "Add keyphrase", "wordpress-seo" ) }
					</div>
				</Table.Header> }

			</Table.Row>
		</Table.Head>

		<Table.Body>
			{ rows && rows.map( ( rowData, index ) => (
				<KeyphrasesTableRow
					key={ `related-keyphrase-${ index }` }
					renderButton={ renderButton }
					relatedKeyphrases={ relatedKeyphrases }
					{ ...rowData }
				/> ) )
			}

			{ isPending && Array.from( { length: 10 }, ( _, index ) => (
				<LoadingKeyphrasesTableRow key={ `loading-row-${ index }` } withButton={ isFunction( renderButton ) }  /> ) )
			}
		</Table.Body>
	</Table>;
};

KeyphrasesTable.propTypes = {
	columnNames: PropTypes.arrayOf( PropTypes.string ),
	data: PropTypes.arrayOf( PropTypes.arrayOf( PropTypes.string ) ),
	relatedKeyphrases: PropTypes.arrayOf( PropTypes.shape( {
		key: PropTypes.string,
		keyword: PropTypes.string,
		results: PropTypes.array,
		score: PropTypes.number,
	} ) ),
	renderButton: PropTypes.func,
	className: PropTypes.string,
	isPending: PropTypes.bool,
};

KeyphrasesTable.displayName = "KeyphrasesTable";

