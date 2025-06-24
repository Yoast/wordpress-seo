/* eslint-disable react/prop-types */
import { useCallback, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Select, TextField, useSvgAria, Button } from "@yoast/ui-library";
import { SearchIcon } from "@heroicons/react/outline";
import { BULK_ACTIONS_OPTIONS, FORMAT_PLAIN, REDIRECT_TYPE_OPTIONS } from "../constants";
import { useRedirectFilters, useSelectRedirects } from "../hooks";

/**
 * FilterControls component
 *
 * This component displays the search filters and actions for the redirect list,
 * allowing users to:
 * - Apply bulk actions to selected redirects.
 * - Filter redirects by their redirect type (e.g., 301, 302).
 * - Search for redirects using a keyword input.
 * @param {string} format - The format of the redirects being managed. Can be "plain" or "regex".
 *
 * @returns {JSX.Element} The rendered filter controls section.
 */
export const FilterControls = ( { format = FORMAT_PLAIN } ) => {
	const ariaSvgProps = useSvgAria();
	const redirects = useSelectRedirects( "selectAllRedirects" );

	const {
		isDeleteRedirectsLoading,
		isLoading,
		filters: { searchRedirects, filterRedirectType },
		setters: { applyBulkAction, setFilterRedirectType, setSearchRedirects },
	} = useRedirectFilters( format );
	const [ localBulkAction, setLocalBulkAction ] = useState( "" );
	const isExistsItems = redirects.length > 0;

	const handleBulkActionsChange = useCallback(
		( value ) => setLocalBulkAction( value ),
		[ setLocalBulkAction ]
	);

	const handleFilterRedirectTypeChange = useCallback(
		( value ) => setFilterRedirectType( value ),
		[ setFilterRedirectType ]
	);

	const handleSearchRedirectsChange = useCallback(
		( e ) => setSearchRedirects( e.target.value ),
		[ setSearchRedirects ]
	);

	const handleApplyBulkAction = useCallback( () => {
		applyBulkAction( localBulkAction );
	}, [ localBulkAction, applyBulkAction ] );

	if ( isLoading ) {
		return null;
	}

	return (
		<div className="yst-flex yst-gap-8 yst-items-start xl:yst-items-end yst-flex-col xl:yst-flex-row yst-pb-4">
			{ isExistsItems && (
				<div className="yst-relative yst-w-full xl:yst-max-w-[256px] yst-search-block">
					<SearchIcon
						className="yst-pointer-events-none yst-absolute yst-mt-5 yst-start-3 yst-h-4 yst-w-4 yst-text-slate-400 yst-z-10"
						{ ...ariaSvgProps }
					/>
					<TextField
						id={ `yst-search-redirects-${format}` }
						name="searchRedirects"
						placeholder={ __( "Search…", "wordpress-seo" ) }
						value={ searchRedirects }
						onChange={ handleSearchRedirectsChange }
					/>
				</div>
			) }
			<div className={ `yst-flex ${isExistsItems ? "yst-justify-end" : "yst-justify-start" }  yst-items-end yst-flex-col xl:yst-flex-row yst-w-full yst-gap-6` }>
				<div className="yst-flex yst-items-end xl:yst-max-w-[256px] yst-w-full">
					<Select
						id={ `yst-filter-redirect-type-${format}` }
						name="filterRedirectType"
						options={ [ { value: "", label: __( "All", "wordpress-seo" ) }, ...REDIRECT_TYPE_OPTIONS ]  }
						className="yst-w-full"
						label={ __( "Filter Redirect type", "wordpress-seo" ) }
						value={ filterRedirectType }
						onChange={ handleFilterRedirectTypeChange }
					/>
				</div>
				{ isExistsItems && (
					<div className="yst-flex yst-items-end yst-gap-2 yst-w-full xl:yst-w-auto">
						<Select
							id={ `yst-bulk-actions-${format}` }
							name="bulkAction"
							options={ BULK_ACTIONS_OPTIONS }
							label={ __( "Bulk actions", "wordpress-seo" ) }
							hideLabel={ true }
							value={ localBulkAction }
							onChange={ handleBulkActionsChange }
							className="yst-w-full xl:yst-min-w-[256px]"
						/>
						<Button
							variant="secondary"
							size="large"
							onClick={ handleApplyBulkAction }
							isLoading={ isDeleteRedirectsLoading }
						>
							{ __( "Apply", "wordpress-seo" ) }
						</Button>
					</div>
				) }
			</div>
		</div>
	);
};
