/* eslint-disable react/prop-types */
import { Table, Checkbox, Button } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { DESC } from "../constants";
/**
 * TableHeader — Renders the header row for the redirects table.
 *
 * This component includes:
 * - A "Select all" checkbox for bulk selection of redirects.
 * - A sortable "Type" column header with an arrow icon indicating sort direction.
 * - Static column headers for "Old URL" and "New URL".

 * @param {boolean} allSelected - Indicates whether all redirects are currently selected.
 * @param {Function} onSelectAllChange - Callback when the "Select all" checkbox is toggled.
 * @param {Function} toggleSortOrder - Callback to toggle the sorting order for the "Type" column.
 * @param {string} sortOrder - Current sort order; expected values
 * @returns {JSX.Element} The rendered Table header.
*/
export const TableHeader = ( {
	allSelected,
	onSelectAllChange,
	toggleSortOrder,
	sortOrder,
} ) => (
	<Table.Head>
		<Table.Row>
			<Table.Header scope="col" className="yst-flex yst-items-center yst-gap-1">
				<Checkbox
					aria-label={ __( "Select all", "wordpress-seo" ) }
					checked={ allSelected }
					onChange={ onSelectAllChange }
				/>
				{ __( "Type", "wordpress-seo" ) }
				<Button
					aria-label={ __( "Sort by Type", "wordpress-seo" ) }
					as="span"
					variant="tertiary"
					className="yst-p-0 yst-text-slate-400"
					onClick={ toggleSortOrder }
				>
					<ChevronDownIcon
						className={ `yst-w-4 yst-h-4 yst-transition-transform ${
							sortOrder === DESC ? "yst-rotate-180" : ""
						}` }
					/>
				</Button>
			</Table.Header>
			<Table.Header scope="col">{ __( "Old URL", "wordpress-seo" ) }</Table.Header>
			<Table.Header scope="col">{ __( "New URL", "wordpress-seo" ) }</Table.Header>
		</Table.Row>
	</Table.Head>
);
