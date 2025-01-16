/* eslint-disable complexity */
import { DocumentAddIcon } from "@heroicons/react/outline";
import { useCallback, useMemo, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { AutocompleteField, Spinner } from "@yoast/ui-library";
import classNames from "classnames";
import { useField } from "formik";
import { debounce, find, isEmpty, map, values } from "lodash";
import PropTypes from "prop-types";
import { ASYNC_ACTION_STATUS, FETCH_DELAY } from "../../shared-admin/constants";
import { useDispatchSettings, useSelectSettings } from "../hooks";

/**
 * @param {JSX.node} children The children.
 * @param {string} [className] The className.
 * @returns {JSX.Element} The page select options content decorator component.
 */
const PageSelectOptionsContent = ( { children, className = "" } ) => (
	<div className={ classNames( "yst-flex yst-items-center yst-justify-center yst-gap-2 yst-py-2 yst-px-3", className ) }>
		{ children }
	</div>
);

PageSelectOptionsContent.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

/**
 * @param {Object} props The props object.
 * @param {string} props.name The field name.
 * @param {string} props.id The field id.
 * @returns {JSX.Element} The page select component.
 */
const FormikPageSelectField = ( { name, id, ...props } ) => {
	const siteBasicsPolicies = useSelectSettings( "selectPreference", [], "siteBasicsPolicies", {} );
	const pages = useSelectSettings( "selectPagesWith", [ siteBasicsPolicies ], values( siteBasicsPolicies ) );
	const { fetchPages } = useDispatchSettings();
	const [ { value, ...field }, , { setTouched, setValue } ] = useField( { type: "select", name, id, ...props } );
	const [ status, setStatus ] = useState( ASYNC_ACTION_STATUS.idle );
	const [ queriedPageIds, setQueriedPageIds ] = useState( [] );
	const canCreatePages = useSelectSettings( "selectPreference", [], "canCreatePages", false );
	const createPageUrl = useSelectSettings( "selectPreference", [], "createPageUrl", "" );

	const selectedPage = useMemo( () => {
		const pageObjects = values( pages );
		return find( pageObjects, [ "id", value ] );
	}, [ value, pages ] );

	const debouncedFetchPages = useCallback( debounce( async search => {
		try {
			setStatus( ASYNC_ACTION_STATUS.loading );

			const response = await fetchPages( { search } );

			setQueriedPageIds( map( response.payload, "id" ) );
			setStatus( ASYNC_ACTION_STATUS.success );
		} catch ( error ) {
			if ( error instanceof DOMException && error.name === "AbortError" ) {
				// Expected abort errors can be ignored.
				return;
			}
			setQueriedPageIds( [] );
			setStatus( ASYNC_ACTION_STATUS.error );
		}
	}, FETCH_DELAY ), [ setQueriedPageIds, setStatus, fetchPages ] );

	const handleChange = useCallback( newValue => {
		setTouched( true, false );
		setValue( newValue );
	}, [ setValue, setTouched ] );
	const handleQueryChange = useCallback( event => debouncedFetchPages( event.target.value ), [ debouncedFetchPages ] );
	const selectablePages = useMemo( () => isEmpty( queriedPageIds ) ? map( pages, "id" ) : queriedPageIds, [ queriedPageIds, pages ] );
	const hasNoPages = useMemo( () => ( status === ASYNC_ACTION_STATUS.success && isEmpty( queriedPageIds ) ), [ queriedPageIds, status ] );

	return (
		<AutocompleteField
			{ ...field }
			name={ name }
			id={ id }
			// Hack to force re-render of Headless UI Combobox.Input component when selectedPage changes.
			value={ selectedPage ? value : 0 }
			onChange={ handleChange }
			placeholder={ __( "None", "wordpress-seo" ) }
			selectedLabel={ selectedPage?.name }
			onQueryChange={ handleQueryChange }
			nullable={ true }
			/* translators: Hidden accessibility text. */
			clearButtonScreenReaderText={ __( "Clear selection", "wordpress-seo" ) }
			{ ...props }
		>
			<>
				{ ( status === ASYNC_ACTION_STATUS.idle || status === ASYNC_ACTION_STATUS.success ) && (
					<>
						{ hasNoPages ? (
							<PageSelectOptionsContent>
								{ __( "No pages found.", "wordpress-seo" ) }
							</PageSelectOptionsContent>
						) : map( selectablePages, pageId => {
							const page = pages?.[ pageId ];
							return page ? (
								<AutocompleteField.Option key={ page?.id } value={ page?.id }>
									{ page?.name }
								</AutocompleteField.Option>
							) : null;
						} ) }
						{ canCreatePages && (
							<li className="yst-sticky yst-inset-x-0 yst-bottom-0 yst-group">
								<a
									id={ `link-create_page-${ id }` }
									href={ createPageUrl }
									target="_blank"
									rel="noreferrer"
									className="yst-relative yst-w-full yst-flex yst-items-center yst-py-4 yst-px-3 yst-gap-2 yst-no-underline yst-text-sm yst-text-left yst-bg-white yst-text-slate-700 group-hover:yst-text-white group-hover:yst-bg-primary-500 yst-border-t yst-border-slate-200"
								>
									<DocumentAddIcon
										className="yst-w-5 yst-h-5 yst-text-slate-400 group-hover:yst-text-white"
									/>
									<span>{ __( "Add new page...", "wordpress-seo" ) }</span>
								</a>
							</li>
						) }
					</>
				) }
				{ status === ASYNC_ACTION_STATUS.loading && (
					<PageSelectOptionsContent>
						<Spinner variant="primary" />
						{ __( "Searching pages...", "wordpress-seo" ) }
					</PageSelectOptionsContent>
				) }
				{ status === ASYNC_ACTION_STATUS.error && (
					<PageSelectOptionsContent className="yst-text-red-600">
						{ __( "Failed to retrieve pages.", "wordpress-seo" ) }
					</PageSelectOptionsContent>
				) }
			</>
		</AutocompleteField>
	);
};

FormikPageSelectField.propTypes = {
	name: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
};

export default FormikPageSelectField;
