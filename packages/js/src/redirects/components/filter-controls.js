import { useCallback, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Select, TextField, useSvgAria, Button } from "@yoast/ui-library";
import { SearchIcon } from "@heroicons/react/outline";
import { BULK_ACTIONS_OPTIONS, REDIRECT_TYPE_OPTIONS } from "../constants";
import { useRedirectFilters } from "../hooks";

/**
 * FilterControls component
 *
 * This component displays the search filters and actions for the redirect list,
 * allowing users to:
 * - Apply bulk actions to selected redirects.
 * - Filter redirects by their redirect type (e.g., 301, 302).
 * - Search for redirects using a keyword input.
 * @returns {JSX.Element} The rendered filter controls section.
 */
export const FilterControls = () => {
	const ariaSvgProps = useSvgAria();

	const {
		filters: { searchRedirects },
		setters: { setBulkAction, setFilterRedirectType, setSearchRedirects },
	} = useRedirectFilters();
	const [ localRedirectType, setLocalRedirectType ] = useState( "" );
	const [ localBulkAction, setLocalBulkAction ] = useState( "" );

	const handleBulkActionsChange = useCallback(
		( value ) => setLocalBulkAction( value ),
		[ setLocalBulkAction ]
	);

	const handleFilterRedirectTypeChange = useCallback(
		( value ) => setLocalRedirectType( value ),
		[ setLocalRedirectType ]
	);

	const handleSearchRedirectsChange = useCallback(
		( e ) => setSearchRedirects( e.target.value ),
		[ setSearchRedirects ]
	);

	const applyFilters = useCallback( () => {
		setFilterRedirectType( localRedirectType );
	}, [ localRedirectType, setFilterRedirectType ] );

	const applyBulkAction = useCallback( () => {
		setBulkAction( localBulkAction );
	}, [ localBulkAction, setBulkAction ] );

	return (
		<div className="yst-grid yst-grid-cols-3 yst-gap-8 yst-mt-4 yst-items-end">
			<div className="yst-flex yst-items-end yst-gap-2 yst-w-full">
				<Select
					id="yst-bulk-actions"
					name="bulkAction"
					options={ BULK_ACTIONS_OPTIONS }
					label={ __( "Bulk actions", "wordpress-seo" ) }
					hideLabel={ true }
					value={ localBulkAction }
					onChange={ handleBulkActionsChange }
					className="yst-w-full"
				/>
				<Button
					variant="secondary"
					size="large"
					onClick={ applyBulkAction }
				>
					{ __( "Apply", "wordpress-seo" ) }
				</Button>
			</div>

			<div className="yst-flex yst-items-end yst-gap-2 yst-w-full">
				<Select
					id="yst-filter-redirect-type"
					name="filterRedirectType"
					options={ [ { value: "", label: __( "Select…", "wordpress-seo" ) }, ...REDIRECT_TYPE_OPTIONS ]  }
					className="yst-w-full"
					label={ __( "Redirect type", "wordpress-seo" ) }
					value={ localRedirectType }
					onChange={ handleFilterRedirectTypeChange }
				/>
				<Button
					variant="secondary"
					size="large"
					onClick={ applyFilters }
				>
					{ __( "Filter", "wordpress-seo" ) }
				</Button>
			</div>
			<div className="yst-relative yst-w-full">
				<SearchIcon
					className="yst-pointer-events-none yst-absolute yst-top-4 yst-start-4 yst-h-5 yst-w-5 yst-text-slate-400"
					{ ...ariaSvgProps }
				/>
				<TextField
					id="yst-search-redirects"
					name="searchRedirects"
					placeholder={ __( "Search…", "wordpress-seo" ) }
					value={ searchRedirects }
					onChange={ handleSearchRedirectsChange }
				/>
			</div>
		</div>
	);
};
