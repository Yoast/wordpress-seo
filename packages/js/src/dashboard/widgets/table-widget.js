import { Table } from "@yoast/ui-library";
import classNames from "classnames";
import { SCORE_META } from "../scores/score-meta";
import { Widget } from "./widget";

/**
 * @type {import("../index").ScoreType} ScoreType
 */

/**
 * The score bullet component.
 *
 * @param {ScoreType} score The score.
 * @returns {JSX.Element} The element.
 */
const ScoreBullet = ( { score } ) => (
	<div className="yst-flex yst-justify-center">
		<div className={ classNames( "yst-shrink-0 yst-w-3 yst-aspect-square yst-rounded-full", SCORE_META[ score ].color ) }>
			<span className="yst-sr-only">{ SCORE_META[ score ].label }</span>
		</div>
	</div>
);

/**
 * The table head component.
 *
 * @param {JSX.Element} children The table headers.
 * @returns {JSX.Element} The element.
 */
const TableHead = ( { children } ) => {
	return <Table.Head>
		<Table.Row>
			<Table.Header className="yst-px-0">{ "" }</Table.Header>
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
		<Table.Cell className="yst-px-0 yst-text-slate-500">{ index + 1 }. </Table.Cell>
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
		<Widget title={ title }>
			<div className="yst-overflow-auto">
				<Table variant="minimal">
					{ children }
				</Table>
			</div>
		</Widget>
	);
};

TableWidget.Head = TableHead;
TableWidget.Row = TableRow;
TableWidget.ScoreBullet = ScoreBullet;
TableWidget.Cell = Table.Cell;
TableWidget.Header = Table.Header;
TableWidget.Body = Table.Body;
