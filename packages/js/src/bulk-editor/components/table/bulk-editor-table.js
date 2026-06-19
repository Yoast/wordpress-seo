import { __ } from "@wordpress/i18n";
import { Table } from "@yoast/ui-library";
import { noop } from "lodash";
import { BulkEditorBody } from "./table-body";
import { BulkEditorHeader } from "./table-header";
import { getColumnCount } from "./table-helpers";

/**
 * The bulk editor selection.
 *
 * @typedef {Object} BulkEditorSelection
 * @property {number[]}  [selectedIds]   IDs of the selected items.
 * @property {boolean}   [isAllSelected] Whether the header "select all" checkbox is checked.
 * @property {Function}  [onToggleRow]   Called with an item id when its checkbox is toggled.
 * @property {Function}  [onToggleAll]   Called when the header "select all" checkbox is toggled.
 */
/**
 * The bulk editor inline-edit props. Several rows can edit at once: a row's Edit opens its field-set fields,
 * then the row's Save saves every open field and Cancel discards all of them at once.
 *
 * @typedef {Object} BulkEditorEditing
 * @property {Object}   [editingRows]    Edit state keyed by item id: `{ [id]: { openFields, draft, savingFields } }`.
 * @property {Function} [onStartEdit]    Called with an item id to enter edit mode.
 * @property {Function} [onChangeField]  Called with `{ id, key, value }` when a field changes.
 * @property {Function} [onApplyField]   Called with `{ id, key }` to save that field.
 * @property {Function} [onCancelEdit]   Called with an item id to cancel all of its open fields at once.
 */

/**
 * The bulk editor data table.
 *
 * It renders the items it is given for the active field set (the Search or Social tab).
 *
 * @param {Object}              props             The props.
 * @param {BulkEditorItem[]}    props.items       The items to render.
 * @param {FieldSet}            props.fieldSet    The active field set (its `fields` drive the editable columns).
 * @param {BulkEditorSelection} [props.selection] The selection props.
 * @param {BulkEditorEditing}   [props.editing]   The inline-edit props.
 * @param {boolean}             [props.isLoading] Whether to render skeleton rows instead of data.
 *
 * @returns {JSX.Element} The table.
 */
export const BulkEditorTable = ( { items, fieldSet, selection = {}, editing = {}, isLoading = false } ) => {
	const columnCount = getColumnCount( fieldSet.fields );
	const selectionState = { selectedIds: [], isAllSelected: false, onToggleRow: noop, onToggleAll: noop, ...selection };
	const editingState = {
		editingRows: {},
		onStartEdit: noop,
		onChangeField: noop,
		onApplyField: noop,
		onCancelEdit: noop,
		...editing,
	};

	return (
		<>
			<div role="status" className="yst-sr-only">
				{ isLoading ? __( "Loading content…", "wordpress-seo" ) : "" }
			</div>
			<Table aria-label={ fieldSet.label } aria-busy={ isLoading } className="yst-table-auto sm:yst-table-fixed yst-w-full [&_thead]:!yst-border-t-0 [&_td]:yst-align-top [&_th]:yst-align-top [&_th]:yst-font-medium">
				<colgroup>
					<col className="sm:yst-w-[4%]" />
					<col className="sm:yst-w-[20%]" />
					{ fieldSet.fields.map( ( field ) => (
						<col key={ field.key } className={ field.width } />
					) ) }
					<col className="sm:yst-w-[5%]" />
				</colgroup>
				<BulkEditorHeader fields={ fieldSet.fields } columnCount={ columnCount } selection={ selectionState } isLoading={ isLoading } />
				<Table.Body>
					<BulkEditorBody
						items={ items }
						fields={ fieldSet.fields }
						columnCount={ columnCount }
						selection={ selectionState }
						editing={ editingState }
						isLoading={ isLoading }
					/>
				</Table.Body>
			</Table>
		</>
	);
};
