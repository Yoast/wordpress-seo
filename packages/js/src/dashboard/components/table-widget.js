import { Paper, Table, Title } from "@yoast/ui-library";

/**
 * The table head component.
 *
 * @param {JSX.Element} children The table headers.
 * @returns {JSX.Element} The element.
 */
const TableHead = ( { children } ) => {
	return <Table.Head>
		<Table.Row>
			<Table.Header className="yst-pe-0">{ "" }</Table.Header>
			{ children }
		</Table.Row>
	</Table.Head>;
};

/**
 * The table row component for the table widget includes numbering of first cell.
 *
 * @param {children} children The row cells.
 * @param {number} index The row index.
 *
 * @returns {JSX.Element} The row element.
 */
const TableRow = ( { children, index } ) => {
	return <Table.Row>
		<Table.Cell className="yst-pe-0">{ index + 1 }. </Table.Cell>
		{ children }
	</Table.Row>;
};

/**
 * The Site Kit table component.
 *
 * @param {string} title The table title.
 * @param {JSX.Element} children The table rows.
 *
 * @returns {JSX.Element} The element.
 */
export const TableWidget = ( { title, children } ) => {
	return (
		<Paper className="yst-@container yst-grow yst-p-8 yst-shadow-md yst-mt-6">
			<Title as="h3" size="2" className="yst-text-slate-900 yst-font-medium">
				{ title }
			</Title>
			<div className="yst-overflow-auto">
				<Table variant="minimal">
					{ children }
				</Table>
			</div>
		</Paper>
	);
};

TableWidget.Head = TableHead;
TableWidget.Row = TableRow;
TableWidget.Cell = Table.Cell;
TableWidget.Header = Table.Header;
TableWidget.Body = Table.Body;

