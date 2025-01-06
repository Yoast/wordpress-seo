import { ChevronDownIcon } from "@heroicons/react/solid";
import { Paper, Table, Title } from "@yoast/ui-library";

/**
 * The sortable header component.
 * @param {string} columnName The column name.
 * @returns {JSX.Element} The element.
 */
const SortableHeader = ( { columnName } ) => (
	<div className="yst-flex">
		{ columnName }
		<ChevronDownIcon className="yst-text-slate-400 yst-w-5" />
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
	return (
		<Paper className="yst-grow yst-max-w-screen-sm yst-p-8 yst-shadow-md">
			<Title as="h3" size="2">
				{ title }
			</Title>
			<table className="yst-site-kit-widget-table">
				<Table.Head className="yst-bg-white yst-mt-2 yst-border-b-slate-300 yst-border-b yst-border-t-0">
					<Table.Row>

						{ columns.map( ( column ) =>
							<Table.Header
								key={ `${column.name}-${title}` }
								className="yst-align-bottom yst-pb-3"
							>
								{ column.sortable ? <SortableHeader columnName={ column.label } /> : column.label }

							</Table.Header>
							 ) }
					</Table.Row>
				</Table.Head>

				<Table.Body className="yst-parent-numbered-cell">
					{ data.map( ( row, rowIndex ) => (
						<Table.Row key={ `row-${title}-${rowIndex}` }>
							{ row.map( ( cell, cellIndex ) => (
								<Table.Cell key={ `cell-${title}-${cellIndex}` } className="yst-numbered-cell">
									{ cell }
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
