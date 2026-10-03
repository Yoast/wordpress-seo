import { Table } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";

/**
 * The TaskListTable component to display the task list in a table.
 *
 * @param {JSX.Element} children The table rows to display inside the table body.
 * @param {string} [className] Optional class names for the table.
 * @returns {JSX.Element} The TaskListTable component.
 */
export const TaskListTable = ( { children, className } ) => (
	<Table className={ className }>
		<Table.Head>
			<Table.Row>
				<Table.Header>{ __( "Task", "wordpress-seo" ) }</Table.Header>
				<Table.Header className="yst-max-w-36 yst-hidden sm:yst-table-cell sm:yst-bg-slate-50">{ __( "Priority", "wordpress-seo" ) }</Table.Header>
				<Table.Header className="yst-max-w-36 yst-hidden sm:yst-table-cell sm:yst-bg-slate-50">{ __( "Est. duration", "wordpress-seo" ) }</Table.Header>
				<Table.Header className="yst-max-w-44 yst-hidden sm:yst-table-cell sm:yst-bg-slate-50">{ __( "Progress", "wordpress-seo" ) }</Table.Header>
			</Table.Row>
		</Table.Head>
		<Table.Body>
			{ children }
		</Table.Body>
	</Table>
);
