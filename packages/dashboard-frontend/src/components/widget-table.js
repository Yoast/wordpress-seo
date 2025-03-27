import { Table, TooltipContainer, TooltipTrigger, TooltipWithContext } from "@yoast/ui-library";
import classNames from "classnames";
import { SCORE_META } from "../scores/score-meta";
import { XIcon } from "@heroicons/react/solid";
import { __ } from "@wordpress/i18n";

/**
 * @type {import("../index").ScoreType} ScoreType
 */

/**
 * The disabled score component.
 *
 * @param {string} tooltip The tooltip.
 * @param {string} id The id.
 *
 * @returns {JSX.Element} The element.
 */
const DisabledScore = ( { tooltip, id } ) => (
	<TooltipContainer className="yst-h-4">
		<TooltipTrigger ariaDescribedby={ id }>
			<XIcon className="yst-w-4 yst-h-4 yst-text-slate-400" />
			<span className="yst-sr-only">{ __( "Disabled", "wordpress-seo" ) }</span>
		</TooltipTrigger>
		{  tooltip && <TooltipWithContext position="left" id={ id }>{  tooltip }</TooltipWithContext> }
	</TooltipContainer> );

/**
 * The score bullet component.
 *
 * @param {ScoreType} score The score.
 * @param {string} id The id.
 *
 * @returns {JSX.Element} The element.
 */
const ScoreBullet = ( { score, id } ) => ( <TooltipContainer className="yst-h-4 yst-flex yst-items-center yst-justify-center">
	<TooltipTrigger ariaDescribedby={ id }>
		<div className={ classNames( "yst-shrink-0 yst-w-3 yst-aspect-square yst-rounded-full", SCORE_META[ score ].color ) }>
			<span className="yst-sr-only">{ SCORE_META[ score ].label }</span>
		</div>
	</TooltipTrigger>
	{ SCORE_META[ score ]?.tooltip && <TooltipWithContext position="left" id={ id }>
		{ score === "notAnalyzed" ? __( "Content analysis hasn't started. Please open this page in your editor, enter a focus keyphrase and save.", "wordpress-seo" )
			: SCORE_META[ score ].tooltip }

	</TooltipWithContext> }
</TooltipContainer>
);

/**
 * The score component.
 *
 * @param {ScoreType} score The score.
 * @param {boolean} isIndexablesEnabled Whether indexables are enabled.
 * @param {boolean} isSeoAnalysisEnabled Whether SEO analysis is enabled.
 * @param {boolean} isEditable Whether the data is editable.
 * @param {string} id The id.
 *
 * @returns {JSX.Element} The element.
 */
export const Score = ( { score, isIndexablesEnabled, isSeoAnalysisEnabled, isEditable, id } ) => {
	if ( ! isIndexablesEnabled || ! isSeoAnalysisEnabled ) {
		return <DisabledScore id={ id } />;
	}
	if ( ! isEditable ) {
		return <DisabledScore
			id={ id }
			tooltip={ __( "We can’t provide an SEO score for this page.", "wordpress-seo" ) }
		/>;
	}
	return <ScoreBullet score={ score } id={ id } />;
};

/**
 * The table head component.
 *
 * @param {JSX.Element} children The table headers.
 * @returns {JSX.Element} The element.
 */
const TableHead = ( { children } ) => {
	return <Table.Head>
		<Table.Row>
			<Table.Header className="yst-px-0 yst-w-5">{ "" }</Table.Header>
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
 * @param {JSX.Element} children The table rows.
 *
 * @returns {JSX.Element} The element.
 */
export const WidgetTable = ( { children } ) => {
	return (
		<div className="yst-overflow-auto">
			<Table variant="minimal">
				{ children }
			</Table>
		</div>
	);
};

WidgetTable.Head = TableHead;
WidgetTable.Row = TableRow;
WidgetTable.Cell = Table.Cell;
WidgetTable.Header = Table.Header;
WidgetTable.Body = Table.Body;
