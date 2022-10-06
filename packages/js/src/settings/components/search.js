import { Combobox } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/outline";
import { useCallback, useRef, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Modal, useSvgAria, useToggleState } from "@yoast/ui-library";
import classNames from "classnames";
import { constant, debounce, filter, first, isEmpty, map, reduce, trim } from "lodash";
import { useNavigate } from "react-router-dom";
import { useSelectSettings } from "../hooks";

const QUERY_MIN_CHARS = 2;

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
	const items = useSelectSettings( "selectFlatSearchIndex" );
	const [ results, setResults ] = useState( [] );
	const ariaSvgProps = useSvgAria();
	const inputRef = useRef();
	const navigate = useNavigate();

	const handleChange = useCallback( item => {
		navigate( `${ item.route }#${ item.fieldId }` );
		setClose();
	}, [ navigate, setClose ] );
	const handleSearch = useCallback( debounce( event => {
		const q = trim( event.target.value );

		if ( q.length > QUERY_MIN_CHARS ) {
			setResults( groupItemsByRoute(
				filter( items, item => item?.fieldLabel?.includes( q ) )
			) );
		}

		setQuery( event.target.value );
	}, 500 ), [ items ] );

	return <>
		<button
			className="yst-w-full yst-flex yst-items-center yst-bg-white yst-text-sm yst-leading-6 yst-text-slate-500 yst-rounded-md yst-border yst-border-slate-300 yst-shadow-sm yst-py-1.5 yst-pl-2 yst-pr-3 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-primary-500"
			// onClick={ setOpen }
		>
			<SearchIcon
				className="yst-flex-none yst-w-5 yst-h-5 yst-mr-3 yst-text-slate-400"
				{ ...ariaSvgProps }
			/>
			<span>{ __( "Quick search...", "wordpress-seo" ) }</span>
		</button>
		<Modal
			onClose={ setClose }
			isOpen={ isOpen }
			initialFocus={ inputRef }
		>
			<Combobox as="div" className="yst--m-6 yst--mt-5" onChange={ handleChange }>
				<div className="yst-relative">
					<SearchIcon
						className="yst-pointer-events-none yst-absolute yst-top-3.5 yst-left-4 yst-h-5 yst-w-5 yst-text-slate-400"
						{ ...ariaSvgProps }
					/>
					<Combobox.Input
						className="yst-h-12 yst-w-full yst-border-0 yst-bg-transparent yst-px-11 yst-text-slate-800 yst-placeholder-slate-400 focus:yst-ring-0 sm:yst-text-sm"
						placeholder={ __( "Search...", "wordpress-seo" ) }
						onChange={ handleSearch }
						displayValue={ constant( query ) }
						ref={ inputRef }
					/>
				</div>
				{ query.length > 2 && ! isEmpty( results ) && (
					<Combobox.Options
						static={ true }
						className="yst-max-h-80 yst-scroll-pt-11 yst-scroll-pb-2 yst-space-y-2 yst-overflow-y-auto yst-pb-2"
					>
						{ map( results, ( groupedItems, route ) => (
							<li key={ route }>
								<h2 className="yst-bg-slate-100 yst-py-2.5 yst-px-4 yst-text-xs yst-font-semibold yst-text-slate-900">{ first( groupedItems ).routeLabel }</h2>
								<ul className="yst-mt-2 yst-text-sm yst-text-slate-800">
									{ map( groupedItems, ( item, name ) => (
										<Combobox.Option
											key={ name }
											value={ item }
											className={ ( { active } ) =>
												classNames( "yst-cursor-default yst-select-none yst-px-4 yst-py-2", active && "yst-bg-primary-600 yst-text-white" )
											}
										>
											{ item.fieldLabel }
										</Combobox.Option>
									) ) }
								</ul>
							</li>
						) ) }
					</Combobox.Options>
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
			</Combobox>
		</Modal>
	</>;
};

export default Search;
