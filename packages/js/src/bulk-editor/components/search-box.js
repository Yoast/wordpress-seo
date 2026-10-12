import SearchIcon from "@heroicons/react/outline/SearchIcon";
import { useDispatch } from "@wordpress/data";
import { useCallback, useEffect, useMemo, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button } from "@yoast/ui-library";
import { debounce } from "lodash";
import { FETCH_DELAY } from "../../shared-admin/constants";
import { MIN_SEARCH_LENGTH, STORE_NAME } from "../constants";

const SEARCH_ID = "bulk-editor-search";

/**
 * The search box that drives the table query in the store.
 *
 * Searches as you type (debounced, once the term is long enough), and the Search button or Enter
 * commits the term immediately at any length.
 *
 * @param {Object} props                 The props.
 * @param {string} props.contentTypeLabel The active content type label, used in the placeholder.
 *
 * @returns {JSX.Element} The search box.
 */
export const SearchBox = ( { contentTypeLabel } ) => {
	const { setSearch } = useDispatch( STORE_NAME );
	const [ value, setValue ] = useState( "" );

	const debouncedAutoSearch = useMemo(
		// Auto-search needs the minimum length; an empty term resets, but 1-2 chars wait for the button.
		() => debounce( ( term ) => {
			const trimmed = term.trim();
			if ( trimmed.length === 0 || trimmed.length >= MIN_SEARCH_LENGTH ) {
				setSearch( trimmed );
			}
		}, FETCH_DELAY ),
		[ setSearch ]
	);

	// Flush any pending auto-search when the box unmounts so a late debounce can't dispatch into an unmounted tree.
	useEffect( () => () => debouncedAutoSearch.cancel(), [ debouncedAutoSearch ] );

	const handleChange = useCallback( ( event ) => {
		setValue( event.target.value );
		debouncedAutoSearch( event.target.value );
	}, [ debouncedAutoSearch ] );

	const handleSubmit = useCallback( ( event ) => {
		event.preventDefault();
		// The button has no minimum length; cancel the pending auto-search so the term isn't dispatched twice.
		debouncedAutoSearch.cancel();
		setSearch( value.trim() );
	}, [ value, setSearch, debouncedAutoSearch ] );

	let label = __( "Search", "wordpress-seo" );
	let placeholder = __( "Search…", "wordpress-seo" );
	if ( contentTypeLabel ) {
		label = sprintf(
			/* translators: %s expands to the lowercase content type label, e.g. "pages". */
			__( "Search for %s", "wordpress-seo" ),
			contentTypeLabel.toLowerCase()
		);
		placeholder = `${ label }…`;
	}

	return (
		<form role="search" onSubmit={ handleSubmit } className="yst-w-full sm:yst-w-80">
			<label htmlFor={ SEARCH_ID } className="yst-sr-only">
				{ label }
			</label>
			<div className="yst-flex yst-h-10 yst-items-stretch yst-rounded-md yst-border yst-border-slate-300 yst-bg-white yst-shadow-sm focus-within:yst-border-primary-500 focus-within:yst-ring-1 focus-within:yst-ring-primary-500">
				<div className="yst-relative yst-flex-1">
					<SearchIcon
						className="yst-pointer-events-none yst-absolute yst-top-1/2 yst--translate-y-1/2 yst-start-3 yst-h-5 yst-w-5 yst-text-slate-400"
						aria-hidden="true"
					/>
					<input
						id={ SEARCH_ID }
						type="search"
						value={ value }
						onChange={ handleChange }
						placeholder={ placeholder }
						className="yst-w-full yst-border-0 yst-bg-transparent yst-py-1.5 yst-ps-10 yst-pe-3 yst-text-sm yst-text-slate-800 yst-placeholder-slate-500 focus:yst-outline-none focus:yst-ring-0"
					/>
				</div>
				<Button
					type="submit"
					variant="tertiary"
					className="yst-flex-none yst-rounded-none yst-border-s yst-border-slate-300 yst-px-4 yst-text-slate-700 hover:yst-text-slate-900 focus-visible:yst-outline-none focus-visible:yst-ring-2 focus-visible:yst-ring-inset focus-visible:yst-ring-primary-500"
				>
					{ __( "Search", "wordpress-seo" ) }
				</Button>
			</div>
		</form>
	);
};
