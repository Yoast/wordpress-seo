import { __ } from "@wordpress/i18n";
import { Table } from "@yoast/ui-library";

/**
 * The table header: the selection toolbar, the bulk-actions toolbar (revealed on selection), and the column
 * header row.
 *
 * @param {Object}          props                    The props.
 * @param {FieldSetField[]} props.fields             The active field set's editable columns.
 *
 * @returns {JSX.Element} The header.
 */
export const BulkEditorHeader = ( { fields } ) => (
	<Table.Head>
		<Table.Row className="[&_th]:!yst-text-slate-800 [&_th]:!yst-py-3 [&_th]:!yst-leading-[19px]">
			<Table.Header scope="col" className="yst-rounded-ss-none sm:yst-w-[38px]">
				<span className="yst-sr-only">{ __( "Select", "wordpress-seo" ) }</span>
			</Table.Header>
			<Table.Header scope="col">{ __( "Title", "wordpress-seo" ) }</Table.Header>
			{ fields.map( ( field ) => (
				<Table.Header key={ field.key } scope="col" className={ field.width }>{ field.label }</Table.Header>
			) ) }
			<Table.Header scope="col" className="yst-rounded-none sm:yst-w-[5%]"><span className="yst-flex yst-justify-end yst-rounded-ss-none">{ __( "Actions", "wordpress-seo" ) }</span></Table.Header>
		</Table.Row>
	</Table.Head>
);
