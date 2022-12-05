/* eslint-disable complexity */
import { Combobox } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/outline";
import { useCallback, useRef, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Modal, Title, useSvgAria, useToggleState } from "@yoast/ui-library";
import classNames from "classnames";
import { debounce, first, groupBy, includes, isEmpty, map, max, reduce, split, trim, values } from "lodash";
import PropTypes from "prop-types";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router-dom";
import { useParsedUserAgent, useSelectSettings } from "../hooks";

const QUERY_MIN_CHARS = 3;

/**
 * @param {string} title The title.
 * @param {JSX.node} children The children nodes.
 * @returns {JSX.Element} The SearchNoResultsContent component.
 */
const SearchNoResultsContent = ( { title, children } ) => (
	<div className="yst-border-t yst-border-slate-100 yst-p-6 yst-py-12 yst-space-3 yst-text-center yst-text-sm">
		<span className="yst-block yst-font-semibold yst-text-slate-900">{ title }</span>
		{ children }
	</div>
);

SearchNoResultsContent.propTypes = {
	title: PropTypes.node.isRequired,
	children: PropTypes.node.isRequired,
};

/**
 * @returns {JSX.Element} The element.
 */
const Search = () => {
	// eslint-disable-next-line no-unused-vars
	const [ isOpen, , , setOpen, setClose ] = useToggleState( false );
	const [ query, setQuery ] = useState( "" );
	const queryableSearchIndex = useSelectSettings( "selectQueryableSearchIndex" );
	const [ results, setResults ] = useState( [] );
	const ariaSvgProps = useSvgAria();
	const navigate = useNavigate();
	const inputRef = useRef( null );
	const { platform, os } = useParsedUserAgent();

	// Only bind hotkeys when platform type is desktop.
	useHotkeys(
		// Note: Update the `"ctrl+k, cmd+k"` hotkeys to `"ctrl+k, meta+k"` when switching `react-hotkeys-hook` to v4.
		"ctrl+k, cmd+k",
		event => {
			event.preventDefault();
			if ( platform?.type === "desktop" && ! isOpen ) {
				setOpen();
			}
		},
		{
			// Note: Update the `enableOnTags: [],` option to `enableOnFormTags: true,` when switching `react-hotkeys-hook` to v4.
			enableOnTags: [ "INPUT", "TEXTAREA", "SELECT" ],
			enableOnContentEditable: true,
		},
		[ isOpen, setOpen, platform ]
	);

	const handleNavigate = useCallback( ( { route, fieldId } ) => {
		setClose();
		setQuery( "" );
		setResults( [] );
		navigate( `${ route }#${ fieldId }` );
	}, [ setClose, setQuery ] );

	const debouncedSearch = useCallback( debounce( newQuery => {
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

			// Bail if no hits found.
			if ( hits === 0 ) {
				return queryResultsAcc;
			}

			return [
				...queryResultsAcc,
				{
					...item,
					// Store hits for later sorting.
					hits,
				},
			];
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
	}, 100 ), [ queryableSearchIndex ] );

	const handleQueryChange = useCallback( event => {
		setQuery( event.target.value );
		debouncedSearch( event.target.value );
	}, [ setQuery, debouncedSearch ] );

	const handleOptionActiveState = useCallback( ( { active } ) => classNames(
		"yst-group yst-block yst-no-underline yst-text-sm yst-text-slate-800 yst-select-none yst-py-3 yst-px-4 hover:yst-bg-primary-600 hover:yst-text-white focus:yst-bg-primary-600 focus:yst-text-white",
		active && "yst-text-white yst-bg-primary-600"
	), [] );

	return <>
		<button
			type="button"
			className="yst-w-full yst-flex yst-items-center yst-bg-white yst-text-sm yst-leading-6 yst-text-slate-500 yst-rounded-md yst-border yst-border-slate-300 yst-shadow-sm yst-py-1.5 yst-pl-2 yst-pr-3 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-primary-500"
			onClick={ setOpen }
		>
			<SearchIcon
				className="yst-flex-none yst-w-5 yst-h-5 yst-mr-3 yst-text-slate-400"
				{ ...ariaSvgProps }
			/>
			<span className="yst-overflow-hidden yst-whitespace-nowrap yst-text-ellipsis">{ query || __( "Quick search...", "wordpress-seo" ) }</span>
			{ platform?.type === "desktop" && (
				<span className="yst-ml-auto yst-flex-none yst-text-xs yst-font-semibold yst-text-slate-400">
					{ os?.name === "macOS" ? __( "⌘K", "wordpress-seo" ) : __( "CtrlK", "wordpress-seo" ) }
				</span>
			) }
		</button>
		<Modal
			className="yst-modal--top"
			onClose={ setClose }
			isOpen={ isOpen }
			initialFocus={ inputRef }
		>
			<Combobox as="div" className="yst--m-6 yst--mt-5" onChange={ handleNavigate }>
				<div className="yst-relative">
					<SearchIcon
						className="yst-pointer-events-none yst-absolute yst-top-3.5 yst-left-4 yst-h-5 yst-w-5 yst-text-slate-400"
						{ ...ariaSvgProps }
					/>
					<Combobox.Input
						ref={ inputRef }
						id="input-search"
						placeholder={ __( "Search...", "wordpress-seo" ) }
						value={ query }
						onChange={ handleQueryChange }
						className="yst-h-12 yst-w-full yst-border-0 yst-bg-transparent yst-px-11 yst-text-slate-800 yst-placeholder-slate-400 focus:yst-ring-0 sm:yst-text-sm"
					/>
				</div>
				{ query.length >= QUERY_MIN_CHARS && ! isEmpty( results ) && (
					<Combobox.Options
						static={ true }
						className="yst-max-h-[calc(90vh-10rem)] yst-scroll-pt-11 yst-scroll-pb-2 yst-space-y-2 yst-overflow-y-auto yst-pb-2"
					>
						{ map( results, ( groupedItems, index ) => (
							<li key={ groupedItems?.[ 0 ]?.route || `group-${ index }` }>
								<Title as="h4" size="3" className="yst-bg-slate-100 yst-py-3 yst-px-4">{ first( groupedItems ).routeLabel }</Title>
								<ul>
									{ map( groupedItems, ( item, name ) => (
										<Combobox.Option
											key={ name }
											value={ item }
											className={ handleOptionActiveState }
										>
											{ item.fieldLabel }
										</Combobox.Option>
									) ) }
								</ul>
							</li>
						) ) }
					</Combobox.Options>
				) }
				{ query.length < QUERY_MIN_CHARS && (
					<SearchNoResultsContent title={ __( "Search", "wordpress-seo" ) }>
						<p className="yst-text-slate-500">{ __( "Please enter a search term with at least 3 characters.", "wordpress-seo" ) }</p>
					</SearchNoResultsContent>
				) }
				{ query.length >= QUERY_MIN_CHARS && isEmpty( results ) && (
					<SearchNoResultsContent title={ __( "No results found", "wordpress-seo" ) }>
						<p className="yst-text-slate-500">{ __( "We couldn’t find anything with that term.", "wordpress-seo" ) }</p>
					</SearchNoResultsContent>
				) }
			</Combobox>
		</Modal>
	</>;
};

export default Search;

