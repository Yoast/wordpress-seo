/* eslint-disable complexity */
import { useCallback, useEffect, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { AutocompleteField, Spinner } from "@yoast/ui-library";
import classNames from "classnames";
import { useField } from "formik";
import { debounce } from "lodash";
import PropTypes from "prop-types";
import { ASYNC_ACTION_STATUS, FETCH_DELAY } from "../../shared-admin/constants";
import { useDispatchSettings, useSelectSettings } from "../hooks";

const MAX_INDEXABLE_PAGES = 10;

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
 * @param {number[]} [props.selectedIds=[]] The currently selected indexable page IDs, to filter the options.
 * @param {...Object} [props] Additional props to pass to the field.
 * @returns {JSX.Element} The indexable page select component.
 */
const FormikIndexablePageSelectField = ( { name, id, disabled, selectedIds = [], ...props } ) => {
	const { fetchIndexablePages, removeIndexablePagesScope } = useDispatchSettings();
	const [ { value, ...field }, , { setTouched, setValue } ] = useField( { type: "select", name, id, ...props } );
	const {
		ids: queriedIndexablePageIds,
		query,
		status,
	} = useSelectSettings( "selectIndexablePagesScope", [ value ], id );
	// Notice: no scope/ID is passed here, so we get the "global" status.
	const { status: globalStatus } = useSelectSettings( "selectIndexablePagesScope", [ value ] );
	const queriedIndexablePages = useSelectSettings( "selectIndexablePagesById", [ queriedIndexablePageIds ], queriedIndexablePageIds );
	const selectedIndexablePage = useSelectSettings( "selectIndexablePageById", [ value ], value );
	const selectableIndexablePages = useMemo( () => {
		// Filter out the pages that are already selected, except our own value. And then limit the results to MAX_INDEXABLE_PAGES.
		return queriedIndexablePages
			.filter( ( indexablePage ) => indexablePage.id === value || ! selectedIds.includes( indexablePage.id ) )
			.slice( 0, MAX_INDEXABLE_PAGES );
	}, [ queriedIndexablePages, selectedIds, value ] );

	const handleChange = useCallback( newValue => {
		setTouched( true, false );
		setValue( newValue );
	}, [ setValue, setTouched ] );
	const handleQueryClear = useCallback( () => {
		fetchIndexablePages( id, { search: "" } );
		handleChange( 0 );
	}, [ id, fetchIndexablePages, handleChange ] );
	const handleQueryChange = useCallback( debounce( ( event ) => {
		const search = event.target?.value?.trim() || "";
		fetchIndexablePages( id, { search } );
	}, FETCH_DELAY ), [ id, fetchIndexablePages ] );

	useEffect( () => {
		// Remove the scope as cleanup.
		return () => removeIndexablePagesScope( id );
	}, [ id, removeIndexablePagesScope ] );

	const selectedLabel = selectedIndexablePage?.name || query?.search || "";

	const hasError = status === ASYNC_ACTION_STATUS.error;
	const isLoading = status === ASYNC_ACTION_STATUS.loading || ( globalStatus === ASYNC_ACTION_STATUS.loading && ! hasError );

	return (
		<AutocompleteField
			{ ...field }
			name={ name }
			id={ id }
			// Hack to force re-render of Headless UI Combobox.Input component when selectedPage changes.
			value={ selectedIndexablePage ? value : 0 }
			onChange={ handleChange }
			placeholder={ __( "Search or select a page…", "wordpress-seo" ) }
			selectedLabel={ selectedLabel }
			onQueryChange={ handleQueryChange }
			onClear={ handleQueryClear }
			nullable={ true }
			disabled={ disabled }
			/* translators: Hidden accessibility text. */
			clearButtonScreenReaderText={ __( "Clear selection", "wordpress-seo" ) }
			{ ...props }
		>
			<>
				{ ! hasError && ! isLoading && (
					<>
						{ selectableIndexablePages.length === 0 ? (
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
				{ isLoading && (
					<IndexablePageSelectOptionsContent>
						<Spinner variant="primary" />
						{ __( "Searching pages…", "wordpress-seo" ) }
					</IndexablePageSelectOptionsContent>
				) }
				{ hasError && (
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
