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
 * @returns {JSX.Element} The indexable page select options content decorator component.
 */
const IndexablePageSelectOptionsContent = ( { children, className = "" } ) => (
	<div className={ classNames( "yst-flex yst-items-center yst-justify-center yst-gap-2 yst-py-2 yst-px-3", className ) }>
		{ children }
	</div>
);

IndexablePageSelectOptionsContent.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

/**
 * @param {Object} props The props object.
 * @param {string} props.name The field name.
 * @param {string} props.id The field id.
 * @param {boolean} props.disabled Whether the field is disabled.
 * @returns {JSX.Element} The indexable page select component.
 */
const FormikIndexablePageSelectField = ( { name, id, disabled, ...props } ) => {
	const llmTxtPages = useSelectSettings( "selectPreference", [], "llmTxtPages", {} );
	const indexablePages = useSelectSettings( "selectIndexablePagesWith", [ llmTxtPages ], values( llmTxtPages ) );
	const otherIndexablePages = useSelectSettings( "selectIndexablePagesWith", [ llmTxtPages ], values( llmTxtPages.other_included_pages ) );
	const { fetchIndexablePages } = useDispatchSettings();
	const [ { value, ...field }, , { setTouched, setValue } ] = useField( { type: "select", name, id, ...props } );
	const [ status, setStatus ] = useState( ASYNC_ACTION_STATUS.idle );
	const [ queriedIndexablePageIds, setQueriedIndexablePageIds ] = useState( [] );

	const selectedIndexablePage = useMemo( () => {
		const indexablePageObjects = values( indexablePages );
		const otherIndexablePageObjects = values( otherIndexablePages );
		const allIndexablePageObjects = [ ...indexablePageObjects, ...otherIndexablePageObjects ];

		return find( allIndexablePageObjects, [ "id", value ] );
	}, [ value, indexablePages, otherIndexablePages ] );

	const debouncedFetchIndexablePages = useCallback( debounce( async search => {
		try {
			setStatus( ASYNC_ACTION_STATUS.loading );

			const response = await fetchIndexablePages( { search } );

			setQueriedIndexablePageIds( map( response.payload, "id" ) );
			setStatus( ASYNC_ACTION_STATUS.success );
		} catch ( error ) {
			if ( error instanceof DOMException && error.name === "AbortError" ) {
				// Expected abort errors can be ignored.
				return;
			}
			setQueriedIndexablePageIds( [] );
			setStatus( ASYNC_ACTION_STATUS.error );
		}
	}, FETCH_DELAY ), [ setQueriedIndexablePageIds, setStatus, fetchIndexablePages ] );

	const handleChange = useCallback( newValue => {
		setTouched( true, false );
		setValue( newValue );
	}, [ setValue, setTouched ] );
	const handleQueryChange = useCallback( event => debouncedFetchIndexablePages( event.target.value ), [ debouncedFetchIndexablePages ] );
	const selectableIndexablePages = useMemo( () => isEmpty( queriedIndexablePageIds ) ? map( indexablePages, "id" ) : queriedIndexablePageIds, [ queriedIndexablePageIds, indexablePages ] );
	const hasNoIndexablePages = useMemo( () => ( status === ASYNC_ACTION_STATUS.success && isEmpty( queriedIndexablePageIds ) ), [ queriedIndexablePageIds, status ] );

	return (
		<AutocompleteField
			{ ...field }
			name={ name }
			id={ id }
			// Hack to force re-render of Headless UI Combobox.Input component when selectedPage changes.
			value={ selectedIndexablePage ? value : 0 }
			onChange={ handleChange }
			placeholder={ __( "Select a page...", "wordpress-seo" ) }
			selectedLabel={ selectedIndexablePage?.name }
			onQueryChange={ handleQueryChange }
			nullable={ true }
			disabled={ disabled }
			/* translators: Hidden accessibility text. */
			clearButtonScreenReaderText={ __( "Clear selection", "wordpress-seo" ) }
			{ ...props }
		>
			<>
				{ ( status === ASYNC_ACTION_STATUS.idle || status === ASYNC_ACTION_STATUS.success ) && (
					<>
						{ hasNoIndexablePages ? (
							<IndexablePageSelectOptionsContent>
								{ __( "No pages found.", "wordpress-seo" ) }
							</IndexablePageSelectOptionsContent>
						) : map( selectableIndexablePages, indexablePageId => {
							const indexablePage = indexablePages?.[ indexablePageId ];
							return indexablePage ? (
								<AutocompleteField.Option key={ indexablePage?.id } value={ indexablePage?.id }>
									{ indexablePage?.name }
								</AutocompleteField.Option>
							) : null;
						} ) }
					</>
				) }
				{ status === ASYNC_ACTION_STATUS.loading && (
					<IndexablePageSelectOptionsContent>
						<Spinner variant="primary" />
						{ __( "Searching pages…", "wordpress-seo" ) }
					</IndexablePageSelectOptionsContent>
				) }
				{ status === ASYNC_ACTION_STATUS.error && (
					<IndexablePageSelectOptionsContent className="yst-text-red-600">
						{ __( "Failed to retrieve pages.", "wordpress-seo" ) }
					</IndexablePageSelectOptionsContent>
				) }
			</>
		</AutocompleteField>
	);
};

FormikIndexablePageSelectField.propTypes = {
	name: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
};

export default FormikIndexablePageSelectField;
