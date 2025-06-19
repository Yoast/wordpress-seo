/* eslint-disable react/prop-types */
import { useCallback } from "@wordpress/element";
import { Table } from "@yoast/ui-library";
import { TableHeader } from "./table-header";
import { TableRows } from "./table-rows";
import { __ } from "@wordpress/i18n";

/**
 * TableRedirects — A component that renders a table of redirect entries.
 *
 * This component displays a list of redirects in a sortable and selectable table format.
 * It supports the following functionality:
 * - Sorting redirects by a given order.
 * - Selecting individual or all redirects via checkboxes.
 * - Triggering redirect edit and delete actions.
 *
 * @param {Object} selectedRedirect - Currently selected redirect for editing.
 * @param {Function} setSelectedRedirect - Function to set the redirect being edited.
 * @param {Function} handleDeleteModal - Function to toggle the delete confirmation modal.
 * @param {Function} setSelectedDeleteRedirect - Function to set the redirect to be deleted.
 * @param {Array<Object>} redirects - List of redirects sorted by type/order.
 * @param {string} sortOrder - Current sort order ("asc" or "desc").
 * @param {Function} toggleSortOrder - Function to toggle the sort order.
 * @param {Array<string>} selectedRedirects - List of selected redirect IDs (for bulk actions).
 * @param {Function} toggleSelectRedirect - Function to toggle selection of a redirect.
 * @param {Function} clearSelectedRedirects - Function to clear all selected redirects.
 * @param {Function} setSelectedRedirects - Function to set selected redirects.
 *
 * @returns {JSX.Element} Rendered redirect table component.
 */
export const TableRedirects = ( {
	selectedRedirect,
	setSelectedRedirect,
	handleDeleteModal,
	setSelectedDeleteRedirect,
	redirects,
	sortOrder,
	toggleSortOrder,
	selectedRedirects,
	toggleSelectRedirect,
	clearSelectedRedirects,
	setSelectedRedirects,
} ) => {
	const redirectsLength = redirects?.length;

	const allSelected =
		redirectsLength > 0 &&
		redirects.every( ( { id } ) => selectedRedirects.includes( id ) );

	const onSelectAllChange = useCallback(
		( event ) => {
			if ( event.target.checked ) {
				const allIds = redirects.map( ( { id } ) => id );
				setSelectedRedirects( allIds );
			} else {
				clearSelectedRedirects();
			}
		},
		[ redirects, setSelectedRedirects, clearSelectedRedirects ]
	);

	const onToggleSelect = useCallback(
		( event ) => {
			const id = event.target.getAttribute( "data-id" );
			if ( id ) {
				toggleSelectRedirect( id );
			}
		},
		[ toggleSelectRedirect ]
	);

	const handleEditClick = useCallback( ( redirect ) => {
		setSelectedRedirect( redirect );
	}, [ setSelectedRedirect ] );

	return (
		<Table className="yst-mt-4" variant="minimal">
			<TableHeader
				allSelected={ allSelected }
				onSelectAllChange={ onSelectAllChange }
				toggleSortOrder={ toggleSortOrder }
				sortOrder={ sortOrder }
			/>

			<Table.Body>
				{ redirectsLength > 0 ? (
					<TableRows
						redirects={ redirects }
						selectedRedirects={ selectedRedirects }
						onToggleSelect={ onToggleSelect }
						handleDeleteModal={ handleDeleteModal }
						selectedRedirect={ selectedRedirect }
						handleEditClick={ handleEditClick }
						setSelectedDeleteRedirect={ setSelectedDeleteRedirect }
					/>
				) : (
					<Table.Row>
						<Table.Cell />
						<Table.Cell>{ __( "No items found", "wordpress-seo" ) }</Table.Cell>
						<Table.Cell />
					</Table.Row>
				) }
			</Table.Body>
		</Table>
	);
};
