import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import { useState, useCallback } from "@wordpress/element";
import classNames from "classnames";
import { SCORE_META } from "../scores/score-meta";
import { Paper, Table, Title } from "@yoast/ui-library";

/**
 * @type {import("../index").Column} Column
 * @type {import("../index").Data} Data
 */

/**
 * The sortable header component.
 *
 * @param {string} columnName The column name.
 * @param {boolean} isAscending Whether the sorting is ascending.
 * @param {Function} onClick The click handler.
 * @param {number} index The index of the column.
 * @returns {JSX.Element} The element.
 */
const SortableHeader = ( { columnName, isAscending, onClick, index } ) =>  {
	const handleSort = useCallback( () => {
		onClick( index );
	}, [ onClick, index ] );

	const ChevronIcon = isAscending ? ChevronDownIcon : ChevronUpIcon;

	return <span className="yst-text-end"><button className="yst-inline-flex yst-gap-1" onClick={ handleSort }>
		{ columnName }
		<ChevronIcon className="yst-text-slate-400 yst-w-5" />
	</button></span>;
};

/**
 * The score bullet component.
 *
 * @param {string} score The score.
 * @returns {JSX.Element} The element.
 */
const ScoreBullet = ( { score } ) => (
	<div className="yst-flex yst-justify-end yst-items-center">
		<div className="yst-flex yst-justify-center yst-w-16">
			<span className={ classNames( "yst-shrink-0 yst-w-3 yst-aspect-square yst-rounded-full", SCORE_META[ score ].color ) }>
				<span className="yst-sr-only">{ SCORE_META[ score ].label }</span>
			</span>
		</div>
	</div>
);

/**
 * The Site Kit table component.
 *
 * @param {string} title The table title.
 * @param {Column[]} columns The columns properties.
 * @param {Data} data The rows data.
 *
 * @returns {JSX.Element} The element.
 */
export const DashboardTable = ( { title, columns, data } ) => {
	const [ sortConfig, setSortConfig ] = useState( { key: null, ascending: true } );

	const sortedData = [ ...data ].sort( ( a, b ) => {
		if ( sortConfig.key === null ) {
			return 0;
		}
		const aValue = a[ sortConfig.key ];
		const bValue = b[ sortConfig.key ];
		if ( aValue < bValue ) {
			return sortConfig.ascending ? -1 : 1;
		}
		if ( aValue > bValue ) {
			return sortConfig.ascending ? 1 : -1;
		}
		return 0;
	} );

	const handleSort = useCallback( ( columnIndex ) => {
		let ascending = true;
		if ( sortConfig.key === columnIndex && sortConfig.ascending ) {
			ascending = false;
		}
		setSortConfig( { key: columnIndex, ascending } );
	}, [ sortConfig, setSortConfig ] );

	return (
		<Paper className="yst-@container yst-grow yst-max-w-screen-sm yst-p-8 yst-shadow-md">
			<Title as="h3" size="2" className="yst-text-slate-900 yst-font-medium">
				{ title }
			</Title>
			<div className="yst-overflow-auto">
				<table className="yst-site-kit-widget-table">
					<Table.Head className="yst-bg-white yst-mt-2 yst-border-b-slate-300 yst-border-b yst-border-t-0">
						<Table.Row>
							<Table.Header>{ "" }</Table.Header>
							{ columns.map( ( column, index ) =>
								<Table.Header
									key={ `${column.name}-${title}` }
									className="yst-align-bottom yst-pb-3 yst-text-slate-900 yst-font-medium"
								>
									{ column.sortable ? (
										<SortableHeader
											columnName={ column.label }
											isAscending={ sortConfig.ascending }
											index={ index }
											onClick={ handleSort }
										/>
									) : <div className={ column.className }>{ column.label }</div> }
								</Table.Header>
							) }
						</Table.Row>
					</Table.Head>
					<Table.Body>
						{ sortedData.map( ( row, rowIndex ) => (
							<Table.Row key={ `row-${title}-${rowIndex}` }>
								<Table.Cell>{ rowIndex + 1 }. </Table.Cell>
								{ row.map( ( cell, cellIndex ) => (
									<Table.Cell key={ `cell-${title}-${cellIndex}` } className="yst-numbered-cell">
										{ columns[ cellIndex ].name === "seo-score" ? <ScoreBullet score={ cell } /> : <div
											className={ classNames( columns[ cellIndex ].sortable ? "yst-text-end yst-pe-5" : "",
												cellIndex === 0 ? "yst-text-slate-900 yst-font-medium" : "",
												columns[ cellIndex ].className ) }
										>{ cell }</div> }
									</Table.Cell> ) ) }
							</Table.Row>
						) ) }
					</Table.Body>
				</table>
			</div>
		</Paper>
	);
};
