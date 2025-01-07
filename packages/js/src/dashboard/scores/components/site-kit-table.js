import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import { useState, useCallback } from "@wordpress/element";
import classNames from "classnames";
import { SCORE_META } from "../score-meta";
import { Paper, Table, Title } from "@yoast/ui-library";

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

	return <div className="yst-text-end"><button className="yst-inline-flex" onClick={ handleSort }>
		{ columnName }
		<ChevronIcon className="yst-text-slate-400 yst-w-5" />
	</button></div>;
};

/**
 * The score bullet component.
 *
 * @param {string} score The score.
 * @returns {JSX.Element} The element.
 */
const ScoreBullet = ( { score } ) => (
	<div className="yst-flex yst-justify-end yst-items-center">
		<span className={ classNames( "yst-shrink-0 yst-w-3 yst-aspect-square yst-rounded-full", SCORE_META[ score ].color ) }>
			<span className="yst-sr-only">{ SCORE_META[ score ].label }</span>
		</span>
	</div>
);

/**
 * The Site Kit table component.
 *
 * @param {string} title The table title.
 * @param {[object]} columns The columns properties.
 * @param {[object]} data The rows data.
 *
 * @returns {JSX.Element} The element.
 */
const SiteKitTable = ( { title, columns, data } ) => {
	const [ sortConfig, setSortConfig ] = useState( { key: null, direction: "ascending" } );

	const sortedData = [ ...data ].sort( ( a, b ) => {
		if ( sortConfig.key === null ) {
			return 0;
		}
		const aValue = a[ sortConfig.key ];
		const bValue = b[ sortConfig.key ];
		if ( aValue < bValue ) {
			return sortConfig.direction === "ascending" ? -1 : 1;
		}
		if ( aValue > bValue ) {
			return sortConfig.direction === "ascending" ? 1 : -1;
		}
		return 0;
	} );

	const handleSort = useCallback( ( columnIndex ) => {
		let direction = "ascending";
		if ( sortConfig.key === columnIndex && sortConfig.direction === "ascending" ) {
			direction = "descending";
		}
		setSortConfig( { key: columnIndex, direction } );
	}, [ sortConfig, setSortConfig ] );

	return (
		<Paper className="yst-grow yst-p-8 yst-shadow-md">
			<Title as="h3" size="2" className="yst-text-slate-900 yst-font-medium">
				{ title }
			</Title>
			<table className="yst-site-kit-widget-table">
				<Table.Head className="yst-bg-white yst-mt-2 yst-border-b-slate-300 yst-border-b yst-border-t-0">
					<Table.Row>
						{ columns.map( ( column, index ) =>
							<Table.Header
								key={ `${column.name}-${title}` }
								className="yst-align-bottom yst-pb-3 yst-text-slate-900 yst-font-medium"
							>
								{ column.sortable ? (
									<SortableHeader
										columnName={ column.label }
										isAscending={ sortConfig.direction === "ascending" }
										index={ index }
										onClick={ handleSort }
									/>
								) : <div className={ column.className }>{ column.label }</div> }
							</Table.Header>
						) }
					</Table.Row>
				</Table.Head>
				<Table.Body className="yst-parent-numbered-cell">
					{ sortedData.map( ( row, rowIndex ) => (
						<Table.Row key={ `row-${title}-${rowIndex}` }>
							{ row.map( ( cell, cellIndex ) => (
								<Table.Cell key={ `cell-${title}-${cellIndex}` } className="yst-numbered-cell">
									{ columns[ cellIndex ].name === "seo-score" ? <ScoreBullet score={ cell } /> : <div
										className={ classNames( columns[ cellIndex ].sortable ? "yst-text-end yst-pe-5" : "",
											columns[ cellIndex ].className ) }
									>{ cell }</div> }
								</Table.Cell> ) ) }
						</Table.Row>
					) ) }
				</Table.Body>
			</table>
		</Paper>
	);
};

SiteKitTable.SortableHeader = SortableHeader;

export { SiteKitTable };
