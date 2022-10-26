/* eslint-disable complexity */
import { SearchIcon } from "@heroicons/react/outline";
import { useCallback, useRef, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Modal, useSvgAria, useToggleState, TextInput, Title } from "@yoast/ui-library";
import { debounce, max, first, isEmpty, map, reduce, trim, includes, split, values, groupBy } from "lodash";
import { Link } from "react-router-dom";
import { useSelectSettings } from "../hooks";

const QUERY_MIN_CHARS = 3;

/**
 * @returns {JSX.Element} The element.
 */
const Search = () => {
	// eslint-disable-next-line no-unused-vars
	const [ isOpen, , , setOpen, setClose ] = useToggleState( false );
	// const [ isLoading, setIsLoading ] = useState( false );
	const [ query, setQuery ] = useState( "" );
	const searchIndex = useSelectSettings( "selectSearchIndex" );
	const queryableSearchIndex = useSelectSettings( "selectQueryableSearchIndex" );
	const [ results, setResults ] = useState( [] );
	const ariaSvgProps = useSvgAria();
	const inputRef = useRef( null );

	const handleNavigate = useCallback( () => {
		setClose();
		setQuery( "" );
		setResults( [] );
	}, [ setClose, setQuery ] );

	const search = useCallback( newQuery => {
		const trimmedQuery = trim( newQuery );

		// Bail if query is too short.
		if ( trimmedQuery.length < QUERY_MIN_CHARS ) {
			return false;
		}

		// Split query into words.
		const splitQuery = split( trimmedQuery, " " );

		// Filter search index by split query and store number of hits.
		// A hit is registered if a single word from split query in found in a fields keywords.
		const queryResults = reduce( queryableSearchIndex, ( queryResultsAcc, item ) => {
			const hits = reduce( splitQuery, ( hitsAcc, queryWord ) => includes( item?.keywords, queryWord ) ? ++hitsAcc : hitsAcc, 0 );

			if ( hits > 0 ) {
				return [
					...queryResultsAcc,
					{
						...item,
						hits,
					},
				];
			}

			return queryResultsAcc;
		}, [] );

		// Sort query results by number of hits on field, highest number of hits first.
		const sortedQueryResults = queryResults.sort( ( a, b ) => b.hits - a.hits );

		// Group query results by route.
		const groupedQueryResults = groupBy( sortedQueryResults, "route" );

		// Sort route groups by max hits of single field, highest number of max hits first.
		// Ie. if group A contains a field with 2 hits and group B contains 2 fields with 1 hit, group A will be sorted first.
		const sortedGroupedQueryResults = values( groupedQueryResults ).sort( ( a, b ) => {
			const aMaxHits = reduce( a, ( maxHitsAcc, queryResult ) => max( [ maxHitsAcc, queryResult.hits ] ), 0 );
			const bMaxHits = reduce( b, ( maxHitsAcc, queryResult ) => max( [ maxHitsAcc, queryResult.hits ] ), 0 );
			return bMaxHits - aMaxHits;
		} );

		setResults( sortedGroupedQueryResults );
	}, [ queryableSearchIndex, searchIndex ] );

	const handleQueryChange = useCallback( event => {
		setQuery( event.target.value );
		search( event.target.value );
	}, [ setQuery, search ] );

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
				{ query.length >= QUERY_MIN_CHARS && ! isEmpty( results ) && (
					<ul className="yst-max-h-80 yst-scroll-pt-11 yst-scroll-pb-2 yst-overflow-y-auto yst-pb-2">
						{ map( results, ( groupedItems, index ) => (
							<li key={ groupedItems?.[ 0 ]?.route || `group-${ index }` }>
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
				{ query.length < QUERY_MIN_CHARS && (
					<div className="yst-border-t yst-border-slate-100 yst-p-6 yst-space-3 yst-text-center yst-text-sm sm:yst-px-14">
						<p className="yst-font-semibold yst-text-slate-900">{ __( "Search", "wordpress-seo" ) }</p>
						<p className="yst-text-slate-500">{ __( "Please enter a search term that is longer than 3 characters.", "wordpress-seo" ) }</p>
					</div>
				) }
				{ query.length >= QUERY_MIN_CHARS && isEmpty( results ) && (
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
