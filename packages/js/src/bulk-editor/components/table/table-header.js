import { __ } from "@wordpress/i18n";
import { Checkbox, Table } from "@yoast/ui-library";

/**
 * The table header: the multi-select toolbar row and the column header row.
 *
 * @param {Object}              props             The props.
 * @param {FieldSetField[]}     props.fields      The active field set's editable columns.
 * @param {number}              props.columnCount The total number of columns.
 * @param {BulkEditorSelection} props.selection   The selection props.
 * @param {boolean}             props.isLoading   Whether the table is loading (disables "select all").
 * @param {JSX.Element}         [props.filters]   The filters control.
 *
 * @returns {JSX.Element} The header.
 */
export const BulkEditorHeader = ( { fields, columnCount, selection, isLoading, filters } ) => {
	const { isAllSelected, onToggleAll } = selection;

	return (
		<Table.Head>
			<Table.Row>
				<Table.Cell colSpan={ columnCount } className="yst-bg-slate-50 yst-rounded-ss-lg yst-rounded-se-lg">
					<div className="yst-flex yst-items-center yst-justify-between yst-gap-4">
						<Checkbox
							id="bulk-editor-select-all"
							name="bulk-editor-select-all"
							value="all"
							aria-label={ __( "Select all", "wordpress-seo" ) }
							checked={ isAllSelected }
							onChange={ onToggleAll }
							disabled={ isLoading }
						/>
						{ filters }
					</div>
				</Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Header scope="col">
					<span className="yst-sr-only">{ __( "Select", "wordpress-seo" ) }</span>
				</Table.Header>
				<Table.Header scope="col">{ __( "Title", "wordpress-seo" ) }</Table.Header>
				{ fields.map( ( field ) => (
					<Table.Header key={ field.key } scope="col">{ field.label }</Table.Header>
				) ) }
				<Table.Header scope="col"><span className="yst-flex yst-justify-end">{ __( "Actions", "wordpress-seo" ) }</span></Table.Header>
			</Table.Row>
		</Table.Head>
	);
};
