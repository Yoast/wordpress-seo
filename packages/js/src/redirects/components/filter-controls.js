// eslint-disable-next-line no-restricted-imports
import { useCallback } from "react";
import { __ } from "@wordpress/i18n";
import { Select, TextField, useSvgAria, Button } from "@yoast/ui-library";
import { SearchIcon } from "@heroicons/react/outline";
import { BULK_ACTIONS_OPTIONS, REDIRECT_TYPE_OPTIONS } from "../constants";
import { useRedirectFilters } from "../hooks";

/**
 * @returns {JSX.Element} The element.
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
					id="bulk-actions"
					name="bulkAction"
					options={ BULK_ACTIONS_OPTIONS }
					label={ __( "Bulk actions", "wordpress-seo" ) }
					hideLabel={ true }
					value={ bulkAction }
					onChange={ handleBulkActionsChange }
					className="yst-w-full"
				/>
				<Button
					type="button"
					variant="secondary"
					className="yst-min-h-[40px]"
				>
					{ __( "Apply", "wordpress-seo" ) }
				</Button>
			</div>

			<div className="yst-flex yst-items-end yst-gap-2 yst-w-full">
				<Select
					id="filter-redirect-type"
					name="filterRedirectType"
					options={ REDIRECT_TYPE_OPTIONS }
					className="yst-w-full"
					label={ __( "Redirect type", "wordpress-seo" ) }
					value={ filterRedirectType }
					onChange={ handleFilterRedirectTypeChange }
				/>
				<Button
					type="button"
					variant="secondary"
					className="yst-min-h-[40px]"
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
					id="search-redirects"
					name="searchRedirects"
					placeholder={ __( "Search…", "wordpress-seo" ) }
					value={ searchRedirects }
					onChange={ handleSearchRedirectsChange }
				/>
			</div>
		</div>
	);
};
