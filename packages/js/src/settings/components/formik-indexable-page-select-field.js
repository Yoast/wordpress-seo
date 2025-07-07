/* eslint-disable complexity */
import { useCallback, useEffect, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { AutocompleteField, Spinner, useToggleState } from "@yoast/ui-library";
import classNames from "classnames";
import { useField } from "formik";
import { debounce, find, isEmpty, values } from "lodash";
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
	const selectedPages = useSelectSettings( "selectPreference", [], "llmTxtPages", {} );
	const { fetchIndexablePages, removeIndexablePagesScope } = useDispatchSettings();
	const [ { value, ...field }, , { setTouched, setValue } ] = useField( { type: "select", name, id, ...props } );
	const {
		query,
		ids: queriedIndexablePageIds,
		status,
		entities: selectableIndexablePages,
	} = useSelectSettings( "selectIndexablePagesScope", [ value ], id );
	const selectedFromIndexablePages = useSelectSettings( "selectIndexablePageById", [ value ], value );
	const selectedFromSelectedPages = useMemo( () => find( values( selectedPages ), [ "id", value ] ), [ selectedPages, value ] );
	const [ hasFocus, , , setFocusTrue, setFocusFalse ] = useToggleState( false );

	const handleChange = useCallback( newValue => {
		setTouched( true, false );
		setValue( newValue );
	}, [ setValue, setTouched ] );
	const handleQueryClear = useCallback( () => {
		fetchIndexablePages( id, { search: "" } );
		handleChange( 0 );
	}, [ fetchIndexablePages, handleChange ] );
	const handleQueryChange = useCallback( debounce( ( event ) => {
		const search = event.target?.value?.trim() || "";
		fetchIndexablePages( id, { search } );
	}, FETCH_DELAY ), [ id, fetchIndexablePages ] );

	useEffect( () => {
		// Remove the scope as cleanup.
		return () => removeIndexablePagesScope( id );
	}, [ id, removeIndexablePagesScope ] );

	const selectedIndexablePage = selectedFromIndexablePages || selectedFromSelectedPages;
	const hasNoIndexablePages = status === ASYNC_ACTION_STATUS.success && isEmpty( queriedIndexablePageIds );

	return (
		<AutocompleteField
			{ ...field }
			name={ name }
			id={ id }
			// Hack to force re-render of Headless UI Combobox.Input component when selectedPage changes.
			value={ selectedIndexablePage ? value : 0 }
			onChange={ handleChange }
			placeholder={ __( "Select a page…", "wordpress-seo" ) }
			selectedLabel={ ( hasFocus ? query?.search : "" ) || selectedIndexablePage?.name || "" }
			onQueryChange={ handleQueryChange }
			onClear={ handleQueryClear }
			onFocus={ setFocusTrue }
			onBlur={ setFocusFalse }
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
						) : selectableIndexablePages.map( ( indexablePage ) => (
							<AutocompleteField.Option key={ indexablePage.id } value={ indexablePage.id }>
								{ indexablePage.name }
							</AutocompleteField.Option>
						) ) }
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
