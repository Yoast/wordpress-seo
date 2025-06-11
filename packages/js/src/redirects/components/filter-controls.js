import { useCallback } from "@wordpress/element";
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
		filters: { bulkAction, filterRedirectType, searchRedirects },
		setters: { setBulkAction, setFilterRedirectType, setSearchRedirects },
	} = useRedirectFilters();

	const handleBulkActionsChange = useCallback(
		( value ) => setBulkAction( value ),
		[ setBulkAction ]
	);

	const handleFilterRedirectTypeChange = useCallback(
		( value ) => setFilterRedirectType( value ),
		[ setFilterRedirectType ]
	);

	const handleSearchRedirectsChange = useCallback(
		( e ) => setSearchRedirects( e.target.value ),
		[ setSearchRedirects ]
	);

	return (
		<div className="yst-grid yst-grid-cols-3 yst-gap-8 yst-mt-4 yst-items-end">
			<div className="yst-flex yst-items-end yst-gap-2 yst-w-full">
				<Select
					id="yst-bulk-actions"
					name="bulkAction"
					options={ BULK_ACTIONS_OPTIONS }
					label={ __( "Bulk actions", "wordpress-seo" ) }
					hideLabel={ true }
					value={ bulkAction }
					onChange={ handleBulkActionsChange }
					className="yst-w-full"
				/>
				<Button
					variant="secondary"
					size="large"
				>
					{ __( "Apply", "wordpress-seo" ) }
				</Button>
			</div>

			<div className="yst-flex yst-items-end yst-gap-2 yst-w-full">
				<Select
					id="yst-filter-redirect-type"
					name="filterRedirectType"
					options={ REDIRECT_TYPE_OPTIONS }
					className="yst-w-full"
					label={ __( "Redirect type", "wordpress-seo" ) }
					value={ filterRedirectType }
					onChange={ handleFilterRedirectTypeChange }
				/>
				<Button
					variant="secondary"
					size="large"
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
