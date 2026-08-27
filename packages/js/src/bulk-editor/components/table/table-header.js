/* eslint-disable complexity */
import { __ } from "@wordpress/i18n";
import { Table } from "@yoast/ui-library";
import AnimateHeight from "react-animate-height";

/**
 * The table header: the toolbar row (when present), the bulk-actions row, and the column header row.
 *
 * @param {Object}          props                      The props.
 * @param {FieldSetField[]} props.fields               The active field set's editable columns.
 * @param {number}          props.columnCount          The total number of columns (for the full-width toolbar rows).
 * @param {JSX.Element}     [props.selectionToolbar]   The first toolbar row's content (selected-count display, etc.).
 * @param {JSX.Element}     [props.bulkActions]        The bulk-actions toolbar row's content.
 * @param {boolean}         [props.showBulkActions]    Whether the bulk-actions row is expanded (a selection is active).
 * @param {JSX.Element}     [props.filters]            The filters control, rendered at the end of the toolbar row.
 * @param {boolean}         [props.isAllSelected]      Whether all rows are selected (drives the column-header checkbox).
 * @param {boolean}         [props.isIndeterminate]    Whether only some rows are selected (renders as a minus).
 * @param {Function}        [props.onToggleAll]        Called when the column-header checkbox is toggled.
 * @param {string}          [props.checkboxIdSuffix]   Suffix for the checkbox id, keeps it unique across tab tables.
 *
 * @returns {JSX.Element} The header.
 */
export const BulkEditorHeader = ( { fields, columnCount, selectionToolbar, bulkActions, showBulkActions, filters, isAllSelected = false, isIndeterminate = false, onToggleAll, checkboxIdSuffix = "" } ) => (
	<Table.Head>
		{ ( selectionToolbar || filters ) && (
			<Table.Row>
				<Table.Cell colSpan={ columnCount } className="yst-bg-slate-50 yst-rounded-ss-lg yst-rounded-se-lg !yst-py-3.5">
					<div className="yst-flex yst-items-center yst-justify-between yst-gap-4">
						{ selectionToolbar }
						{ filters }
					</div>
				</Table.Cell>
			</Table.Row>
		) }
		{ bulkActions && (
			<Table.Row aria-hidden={ ! showBulkActions }>
				<Table.Cell colSpan={ columnCount } style={ { padding: 0 } }>
					<AnimateHeight easing="ease-in-out" duration={ 300 } height={ showBulkActions ? "auto" : 0 } animateOpacity={ true }>
						{ bulkActions }
					</AnimateHeight>
				</Table.Cell>
			</Table.Row>
		) }
		<Table.Row className="[&_th]:!yst-text-slate-800 [&_th]:!yst-py-3 [&_th]:!yst-leading-[19px]">
			<Table.CheckboxHeader
				id={ `bulk-editor-select-all${ checkboxIdSuffix }` }
				name={ `bulk-editor-select-all${ checkboxIdSuffix }` }
				checked={ isAllSelected }
				indeterminate={ isIndeterminate }
				onChange={ onToggleAll }
				/* translators: Hidden accessible label for the select-all checkbox. */
				aria-label={ __( "Select all", "wordpress-seo" ) }
				scope="col"
				data-tour-id="selection-toolbar"
			/>
			<Table.Header scope="col">{ __( "Title", "wordpress-seo" ) }</Table.Header>
			{ fields.map( ( field ) => (
				<Table.Header key={ field.key } scope="col">{ field.label }</Table.Header>
			) ) }
			<Table.Header scope="col"><span className="yst-flex yst-justify-end">{ __( "Actions", "wordpress-seo" ) }</span></Table.Header>
		</Table.Row>
	</Table.Head>
);
