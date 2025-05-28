import { Table, Checkbox } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { useRedirectFilters } from "../hooks";
import { useCallback } from "@wordpress/element";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { DESC } from "../constants";

export const ListRedirects = () => {
	const {
		sortedRedirects,
		sortOrder,
		toggleSortOrder,
		selectedRedirects,
		setters: { toggleSelectRedirect, clearSelectedRedirects, setSelectedRedirects },
	} = useRedirectFilters();

	const allSelected = sortedRedirects.length > 0 &&
		sortedRedirects.every( ( { id } ) => selectedRedirects.includes( id ) );

	const onSelectAllChange = useCallback( ( event ) => {
		if ( event.target.checked ) {
			const allIds = sortedRedirects.map( ( { id } ) => id );
			setSelectedRedirects( allIds );
		} else {
			clearSelectedRedirects();
		}
	}, [ sortedRedirects, setSelectedRedirects, clearSelectedRedirects ] );

	const onToggleSelect = useCallback(
		( event ) => {
			const id = event.target.getAttribute( "data-id" );
			if ( ! id ) {
				return;
			}
			toggleSelectRedirect( +id );
		},
		[ toggleSelectRedirect ]
	);

	return (
		<Table className="yst-mt-6" variant="minimal">
			<Table.Head>
				<Table.Row>
					<Table.Header>
						<Checkbox
							aria-label={ __( "Select all", "wordpress-seo" ) }
							checked={ allSelected }
							onChange={ onSelectAllChange }
						/>
					</Table.Header>
					<Table.Header scope="col" className="yst-flex yst-items-center yst-gap-1">
						{ __( "Type", "wordpress-seo" ) }
						<button
							type="button"
							aria-label={ __( "Sort by Type", "wordpress-seo" ) }
							onClick={ toggleSortOrder }
						>
							<ChevronDownIcon
								className={ `yst-w-4 yst-h-4 yst-transition-transform ${sortOrder === DESC ? "yst-rotate-180" : ""}` }
							/>
						</button>
					</Table.Header>
					<Table.Header scope="col">{ __( "Old URL", "wordpress-seo" ) }</Table.Header>
					<Table.Header scope="col">{ __( "New URL", "wordpress-seo" ) }</Table.Header>
				</Table.Row>
			</Table.Head>

			<Table.Body>
				{ sortedRedirects.length ? sortedRedirects.map( ( { id, type, oldUrl, newUrl }, index ) => (
					<Table.Row key={ id }>
						<Table.Cell>
							<Checkbox
								checked={ selectedRedirects.includes( id ) }
								onChange={ onToggleSelect }
								aria-label={ __( "Select redirects", "wordpress-seo" ) }
								data-id={ id }
							/>
						</Table.Cell>
						<Table.Cell>{ type }</Table.Cell>
						<Table.Cell>{ oldUrl }</Table.Cell>
						<Table.Cell>{ newUrl }</Table.Cell>
						{ index === 0 && (
							<Table.Cell className="yst-text-end">
								{ sortedRedirects.length } { __( "Items", "wordpress-seo" ) }
							</Table.Cell>
						) }
					</Table.Row>
				) ) : (
					<Table.Row>
						<Table.Cell>{ __( "No items found", "wordpress-seo" ) }</Table.Cell>
					</Table.Row>
				) }
			</Table.Body>
		</Table>
	);
};
