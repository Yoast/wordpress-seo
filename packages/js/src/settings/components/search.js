/* eslint-disable complexity */
import { SearchIcon } from "@heroicons/react/outline";
import { useCallback, useRef, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Modal, useSvgAria, useToggleState, TextInput, Title } from "@yoast/ui-library";
import { debounce, filter, first, isEmpty, map, reduce, trim, includes } from "lodash";
import { Link } from "react-router-dom";
import { useSelectSettings } from "../hooks";

const QUERY_MIN_CHARS = 3;

/**
 * @param {Object} items The search index items.
 * @returns {Object} The grouped items.
 */
const groupItemsByRoute = items => reduce( items, ( acc, value ) => ( {
	...acc,
	[ value.route ]: [
		...( acc[ value.route ] || [] ),
		value,
	],
} ), {} );

/**
 * @returns {JSX.Element} The element.
 */
const Search = () => {
	// eslint-disable-next-line no-unused-vars
	const [ isOpen, , , setOpen, setClose ] = useToggleState( false );
	const [ query, setQuery ] = useState( "" );
	const searchIndex = useSelectSettings( "selectSearchIndex" );
	const queryableSearchIndex = useSelectSettings( "selectQueryableSearchIndex" );
	const [ results, setResults ] = useState( [] );
	const ariaSvgProps = useSvgAria();
	const inputRef = useRef( null );

	const handleNavigate = useCallback( () => {
		setClose();
		setQuery( "" );
	}, [ setClose, setQuery ] );

	const debouncedSearch = useCallback( debounce( newQuery => {
		const trimmedQuery = trim( newQuery );

		if ( trimmedQuery.length > QUERY_MIN_CHARS ) {
			setResults( groupItemsByRoute(
				filter( queryableSearchIndex, item => includes( item?.keywords, trimmedQuery ) )
			) );
		}
	}, 500 ), [ queryableSearchIndex, searchIndex ] );

	const handleQueryChange = useCallback( event => {
		setQuery( event.target.value );
		debouncedSearch( event.target.value );
	}, [ setQuery, debouncedSearch ] );

	return <>
		<button
			className="yst-w-full yst-flex yst-items-center yst-bg-white yst-text-sm yst-leading-6 yst-text-slate-500 yst-rounded-md yst-border yst-border-slate-300 yst-shadow-sm yst-py-1.5 yst-pl-2 yst-pr-3 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-primary-500"
			onClick={ setOpen }
		>
			<SearchIcon
				className="yst-flex-none yst-w-5 yst-h-5 yst-mr-3 yst-text-slate-400"
				{ ...ariaSvgProps }
			/>
			<span>{ query || __( "Quick search...", "wordpress-seo" ) }</span>
		</button>
		<Modal
			onClose={ setClose }
			isOpen={ isOpen }
			initialFocus={ inputRef }
		>
			<div className="yst--m-6 yst--mt-5">
				<div className="yst-relative">
					<SearchIcon
						className="yst-pointer-events-none yst-absolute yst-top-3.5 yst-left-4 yst-h-5 yst-w-5 yst-text-slate-400"
						{ ...ariaSvgProps }
					/>
					<TextInput
						ref={ inputRef }
						id="input-search"
						placeholder={ __( "Search...", "wordpress-seo" ) }
						value={ query }
						onChange={ handleQueryChange }
						className="yst-h-12 yst-w-full yst-border-0 yst-bg-transparent yst-px-11 yst-text-slate-800 yst-placeholder-slate-400 focus:yst-ring-0 sm:yst-text-sm"
					/>
				</div>
				{ query.length > QUERY_MIN_CHARS && ! isEmpty( results ) && (
					<ul className="yst-max-h-80 yst-scroll-pt-11 yst-scroll-pb-2 yst-overflow-y-auto yst-pb-2">
						{ map( results, ( groupedItems, route ) => (
							<li key={ route }>
								<Title as="h4" size="3" className="yst-bg-slate-100 yst-py-3 yst-px-4">{ first( groupedItems ).routeLabel }</Title>
								<ul>
									{ map( groupedItems, ( item, name ) => (
										<li key={ name }>
											<Link
												to={ `${ item.route }#${ item.fieldId }` }
												onClick={ handleNavigate }
												className="yst-block yst-no-underline yst-text-sm yst-text-slate-800 yst-select-none yst-py-3 yst-px-4 hover:yst-bg-primary-600 hover:yst-text-white focus:yst-bg-primary-600 focus:yst-text-white"
											>
												{ item.fieldLabel }
											</Link>
										</li>
									) ) }
								</ul>
							</li>
						) ) }
					</ul>
				) }
				{ query.length <= QUERY_MIN_CHARS && (
					<div className="yst-border-t yst-border-slate-100 yst-p-6 yst-space-3 yst-text-center yst-text-sm sm:yst-px-14">
						<p className="yst-font-semibold yst-text-slate-900">{ __( "Search", "wordpress-seo" ) }</p>
						<p className="yst-text-slate-500">{ __( "Please enter a search term that is longer than 3 characters.", "wordpress-seo" ) }</p>
					</div>
				) }
				{ query.length > QUERY_MIN_CHARS && isEmpty( results ) && (
					<div className="yst-border-t yst-border-slate-100 yst-p-6 yst-space-3 yst-text-center yst-text-sm sm:yst-px-14">
						<p className="yst-font-semibold yst-text-slate-900">{ __( "No results found", "wordpress-seo" ) }</p>
						<p className="yst-text-slate-500">{ __( "We couldn’t find anything with that term.", "wordpress-seo" ) }</p>
					</div>
				) }
			</div>
		</Modal>
	</>;
};

export default Search;
