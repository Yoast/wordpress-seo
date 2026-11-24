import { __ } from "@wordpress/i18n";
import { Table } from "@yoast/ui-library";

/**
 * The table header: the column header row.
 *
 * @param {Object}          props                    The props.
 * @param {FieldSetField[]} props.fields             The active field set's editable columns.
 *
 * @returns {JSX.Element} The header.
 */
export const BulkEditorHeader = ( { fields } ) => (
	<Table.Head>
		<Table.Row className="[&_th]:!yst-text-slate-800 [&_th]:!yst-py-3 [&_th]:!yst-leading-[19px]">
			<Table.Header className="first:yst-rounded-ss-none" scope="col">
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
			<Table.Header scope="col" className="last:yst-rounded-se-none"><span className="yst-flex yst-justify-end">{ __( "Actions", "wordpress-seo" ) }</span></Table.Header>
		</Table.Row>
	</Table.Head>
);
