/* eslint-disable complexity */
import { Combobox } from "@headlessui/react";
import { SearchIcon, XIcon } from "@heroicons/react/outline";
import { useCallback, useMemo, useRef, useState } from "@wordpress/element";
import { __, _n, sprintf } from "@wordpress/i18n";
import { Code, Modal, Title, useNavigationContext, useSvgAria, useToggleState } from "@yoast/ui-library";
import classNames from "classnames";
import { debounce, first, groupBy, includes, isEmpty, map, max, reduce, split, trim, values } from "lodash";
import PropTypes from "prop-types";
import { LiveAnnouncer, LiveMessage } from "react-aria-live";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router-dom";
import { safeToLocaleLower } from "../helpers";
import { useParsedUserAgent, useSelectSettings } from "../hooks";

const POST_TYPE_OR_TAXONOMY_BREADCRUMB_SETTING_REGEXP = new RegExp( /^input-wpseo_titles-(post_types|taxonomy)-(?<name>\S+)-(maintax|ptparent)$/is );

const DUMMY_ITEM = { fieldId: "DUMMY_ITEM" };

/**
 * @param {string} fieldId The item field ID.
 * @param {string} fieldLabel The item label.
 * @returns {JSX.Element} The SearchResultLabel element.
 */
const SearchResultLabel = ( { fieldId, fieldLabel } ) => {
	// Deduce whether field is a breadcrumb option for post type or taxonomy.
	const { isPostTypeOrTaxonomyBreadcrumbSetting, postTypeOrTaxonomyName } = useMemo( () => {
		const matches = POST_TYPE_OR_TAXONOMY_BREADCRUMB_SETTING_REGEXP.exec( fieldId );
		return {
			isPostTypeOrTaxonomyBreadcrumbSetting: Boolean( matches ),
			postTypeOrTaxonomyName: matches?.groups?.name,
		};
	}, [ fieldId, POST_TYPE_OR_TAXONOMY_BREADCRUMB_SETTING_REGEXP ] );

	// Render additional code block with post type or taxonomy name if applicable.
	if ( isPostTypeOrTaxonomyBreadcrumbSetting ) {
		return (
			<>
				{ fieldLabel }
				{ postTypeOrTaxonomyName && (
					<Code className="yst-ml-2 rtl:yst-mr-2 group-hover:yst-bg-primary-200 group-hover:yst-text-primary-800">{ postTypeOrTaxonomyName }</Code>
				) }
			</>
		);
	}

	return fieldLabel;
};

SearchResultLabel.propTypes = {
	fieldId: PropTypes.string.isRequired,
	fieldLabel: PropTypes.string.isRequired,
};

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
 * @param {string} [buttonId] The ID for the search button.
 * @param {string} [modalId] The ID for the modal.
 * @returns {JSX.Element} The element.
 */
const Search = ( { buttonId = "button-search", modalId = "modal-search" } ) => {
	const [ isOpen, , , setOpen, setClose ] = useToggleState( false );
	const [ query, setQuery ] = useState( "" );
	const userLocale = useSelectSettings( "selectPreference", [], "userLocale" );
	const queryableSearchIndex = useSelectSettings( "selectQueryableSearchIndex" );
	const [ results, setResults ] = useState( [] );
	const ariaSvgProps = useSvgAria();
	const navigate = useNavigate();
	const inputRef = useRef( null );
	const { platform, os } = useParsedUserAgent();
	const { isMobileMenuOpen, setMobileMenuOpen } = useNavigationContext();
	const [ a11yMessage, setA11yMessage ] = useState( "" );

	// Determines the minimum characters to start a search, based on the user locale.
	const queryMinChars = useMemo( () => {
		switch ( userLocale ) {
			// Korean, Chinese, Chinese (Hong Kong), Chinese (Taiwan).
			case "ko-KR":
			case "zh-CN":
			case "zh-HK":
			case "zh-TW":
				return 1;
			default:
				return 2;
		}
	}, [ userLocale ] );

	useHotkeys(
		"meta+k",
		event => {
			event.preventDefault();
			// Only bind hotkeys when platform type is desktop.
			if ( platform?.type === "desktop" && ! isOpen && ! isMobileMenuOpen ) {
				setOpen();
			}
		},
		{
			enableOnFormTags: true,
			enableOnContentEditable: true,
		},
		[ isOpen, setOpen, platform, isMobileMenuOpen ]
	);

	const handleNavigate = useCallback( ( { route, fieldId } ) => {
		if ( fieldId === DUMMY_ITEM.fieldId ) {
			// The item is our dummy, do not navigate.
			return;
		}
		setMobileMenuOpen( false );
		setClose();
		setQuery( "" );
		setResults( [] );
		navigate( `${ route }#${ fieldId }` );
	}, [ setClose, setQuery, setMobileMenuOpen ] );

	const debouncedSearch = useCallback( debounce( newQuery => {
		const trimmedQuery = trim( newQuery );

		// Reset the a11y message to make it announce again after the query changed.
		setA11yMessage( "" );

		// Bail if query is too short.
		if ( trimmedQuery.length < queryMinChars ) {
			setA11yMessage( __( "Search", "wordpress-seo" ) );
			return false;
		}

		// Lowercase and split query into words.
		const splitQuery = split( safeToLocaleLower( trimmedQuery, userLocale ), " " );

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

		if ( isEmpty( queryResults ) ) {
			setA11yMessage( __( "No results found", "wordpress-seo" ) );
		} else {
			setA11yMessage( sprintf(
				/* translators: %d expands to the number of results found. */
				_n(
					"%d result found, use up and down arrow keys to navigate",
					"%d results found, use up and down arrow keys to navigate",
					queryResults.length,
					"wordpress-seo"
				),
				queryResults.length
			) );
		}

		setResults( sortedGroupedQueryResults );
	}, 100 ), [ queryableSearchIndex, userLocale, setA11yMessage ] );

	const handleQueryChange = useCallback( event => {
		setQuery( event.target.value );
		debouncedSearch( event.target.value );
	}, [ setQuery, debouncedSearch ] );

	const handleOptionActiveState = useCallback( ( { active } ) => classNames(
		"yst-group yst-block yst-no-underline yst-text-sm  yst-select-none yst-py-3 yst-px-4 hover:yst-bg-primary-600 hover:yst-text-white focus:yst-bg-primary-600 focus:yst-text-white",
		active ? "yst-text-white yst-bg-primary-600" : "yst-text-slate-800"
	), [] );

	return <>
		<button
			id={ buttonId }
			type="button"
			className="yst-w-full yst-flex yst-items-center yst-bg-white yst-text-sm yst-leading-6 yst-text-slate-500 yst-rounded-md yst-border yst-border-slate-300 yst-shadow-sm yst-py-1.5 yst-pl-2 yst-pr-3 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-primary-500"
			onClick={ setOpen }
		>
			<SearchIcon
				className="yst-flex-none yst-w-5 yst-h-5 yst-me-3 yst-text-slate-400"
				{ ...ariaSvgProps }
			/>
			<span className="yst-overflow-hidden yst-whitespace-nowrap yst-text-ellipsis">{ query || __( "Quick search...", "wordpress-seo" ) }</span>
			{ platform?.type === "desktop" && (
				<span className="yst-ms-auto yst-flex-none yst-text-xs yst-font-semibold yst-text-slate-400">
					{ os?.name === "macOS" ? __( "⌘K", "wordpress-seo" ) : __( "CtrlK", "wordpress-seo" ) }
				</span>
			) }
		</button>
		<Modal
			id={ modalId }
			onClose={ setClose }
			isOpen={ isOpen }
			initialFocus={ inputRef }
			position="top-center"
			aria-label={ __( "Search", "wordpress-seo" ) }
		>
			<Modal.Panel hasCloseButton={ false }>
				<LiveAnnouncer>
					{ a11yMessage && <LiveMessage message={ a11yMessage } aria-live="polite" /> }
				</LiveAnnouncer>
				<Combobox as="div" className="yst--m-6" onChange={ handleNavigate }>
					<div className="yst-relative">
						<SearchIcon
							className="yst-pointer-events-none yst-absolute yst-top-3.5 yst-start-4 yst-h-5 yst-w-5 yst-text-slate-400"
							{ ...ariaSvgProps }
						/>
						<Combobox.Input
							ref={ inputRef }
							id="input-search"
							placeholder={ __( "Search...", "wordpress-seo" ) }
							aria-label={ __( "Search", "wordpress-seo" ) }
							value={ query }
							onChange={ handleQueryChange }
							className="yst-h-12 yst-w-full yst-border-0 yst-rounded-lg sm:yst-text-sm yst-bg-transparent yst-px-11 yst-text-slate-800 yst-placeholder-slate-500 focus:yst-outline-none focus:yst-ring-inset focus:yst-ring-2 focus:yst-ring-primary-500 focus:yst-border-primary-500"
						/>
						{ /* Implement own close button to match the visual order to the DOM order, for a11y. */ }
						<div className="yst-modal__close">
							<button
								type="button"
								onClick={ setClose }
								className="yst-modal__close-button"
							>
								<span className="yst-sr-only">{ __( "Close", "wordpress-seo" ) }</span>
								<XIcon className="yst-h-6 yst-w-6" { ...ariaSvgProps } />
							</button>
						</div>
					</div>
					{ query.length >= queryMinChars && ! isEmpty( results ) && (
						<Combobox.Options
							static={ true }
							className="yst-max-h-[calc(90vh-10rem)] yst-scroll-pt-11 yst-scroll-pb-2 yst-space-y-2 yst-overflow-y-auto yst-pb-2"
						>
							{ map( results, ( groupedItems, index ) => (
								<div key={ groupedItems?.[ 0 ]?.route || `group-${ index }` } role="presentation">
									<Title
										id={ `group-${ index }-title` } as="h4" size="5"
										className="yst-bg-slate-100 yst-font-semibold yst-py-3 yst-px-4" role="presentation" aria-hidden="true"
									>
										{ first( groupedItems ).routeLabel }
									</Title>
									{ /* Don't use the `role="group"` here, or Voice Over no longer reads the items. */ }
									<div role="presentation">
										{ map( groupedItems, ( item ) => (
											<Combobox.Option
												key={ item.fieldId }
												value={ item }
												className={ handleOptionActiveState }
											>
												<SearchResultLabel { ...item } />
											</Combobox.Option>
										) ) }
									</div>
								</div>
							) ) }
						</Combobox.Options>
					) }
					{ query.length < queryMinChars && (
						<SearchNoResultsContent title={ __( "Search", "wordpress-seo" ) }>

							<p className="yst-text-slate-500">{
								sprintf(
									/* translators: %d expands to the minimum number of characters needed (numerical). */
									__( "Please enter a search term with at least %d characters.", "wordpress-seo" ),
									queryMinChars
								)
							}</p>
						</SearchNoResultsContent>
					) }
					{ query.length >= queryMinChars && isEmpty( results ) && (
						<>
							<SearchNoResultsContent title={ __( "No results found", "wordpress-seo" ) }>
								<p className="yst-text-slate-500">{ __( "We couldn’t find anything with that term.", "wordpress-seo" ) }</p>
							</SearchNoResultsContent>
							{ /* This dummy prevents a reset of the Combobox.Input when pressing enter (via a dummy check in the onChange). */ }
							<Combobox.Options className="yst-visible-">
								<Combobox.Option value={ DUMMY_ITEM } />
							</Combobox.Options>
						</>
					) }
				</Combobox>
			</Modal.Panel>
		</Modal>
	</>;
};

Search.propTypes = {
	buttonId: PropTypes.string,
	modalId: PropTypes.string,
};

export default Search;
