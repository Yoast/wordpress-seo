import { __ } from "@wordpress/i18n";
import { Table } from "@yoast/ui-library";
import AnimateHeight from "react-animate-height";

/**
 * The table header: the selection toolbar, the bulk-actions toolbar (revealed on selection), and the column
 * header row.
 *
 * @param {Object}          props                    The props.
 * @param {FieldSetField[]} props.fields             The active field set's editable columns.
 * @param {number}          props.columnCount        The total number of columns (for the full-width toolbar rows).
 * @param {JSX.Element}     [props.selectionToolbar] The first toolbar row's content (master checkbox + Select menu).
 * @param {JSX.Element}     [props.bulkActions]      The bulk-actions toolbar row's content.
 * @param {boolean}         [props.showBulkActions]  Whether the bulk-actions row is expanded (a selection is active).
 * @param {JSX.Element}     [props.filters]          The filters control, rendered at the end of the toolbar row.
 *
 * @returns {JSX.Element} The header.
 */
export const BulkEditorHeader = ( { fields, columnCount, selectionToolbar, bulkActions, showBulkActions, filters } ) => (
	<Table.Head>
		{ selectionToolbar && (
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
			<Table.Header scope="col">
				<span className="yst-sr-only">
					{
					/* translators: Hidden accessibility text. */
						__( "Select", "wordpress-seo" )
					}
				</span>
			</Table.Header>
			<Table.Header scope="col">{ __( "Title", "wordpress-seo" ) }</Table.Header>
			{ fields.map( ( field ) => (
				<Table.Header key={ field.key } scope="col">{ field.label }</Table.Header>
			) ) }
			<Table.Header scope="col"><span className="yst-flex yst-justify-end">{ __( "Actions", "wordpress-seo" ) }</span></Table.Header>
		</Table.Row>
	</Table.Head>
);
