/* eslint-disable react/prop-types */
import { Table, Checkbox } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { DESC } from "../constants";

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
				<button
					type="button"
					aria-label={ __( "Sort by Type", "wordpress-seo" ) }
					onClick={ toggleSortOrder }
				>
					<ChevronDownIcon
						className={ `yst-w-4 yst-h-4 yst-transition-transform ${
							sortOrder === DESC ? "yst-rotate-180" : ""
						}` }
					/>
				</button>
			</Table.Header>
			<Table.Header scope="col">{ __( "Old URL", "wordpress-seo" ) }</Table.Header>
			<Table.Header scope="col">{ __( "New URL", "wordpress-seo" ) }</Table.Header>
		</Table.Row>
	</Table.Head>
);
