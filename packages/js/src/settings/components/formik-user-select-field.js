/* eslint-disable complexity */
import apiFetch from "@wordpress/api-fetch";
import { useCallback, useEffect, useMemo, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { buildQueryString } from "@wordpress/url";
import { AutocompleteField, Spinner } from "@yoast/ui-library";
import classNames from "classnames";
import { useField } from "formik";
import { debounce, find, isEmpty, map, trim, values } from "lodash";
import PropTypes from "prop-types";
import { ASYNC_ACTION_STATUS } from "../constants";
import { useDispatchSettings, useSelectSettings } from "../hooks";

let abortController;

/**
 * @param {JSX.node} children The children.
 * @param {string} [className] The className.
 * @returns {JSX.Element} The user select options content decorator component.
 */
const UserSelectOptionsContent = ( { children, className = "" } ) => (
	<div className={ classNames( "yst-flex yst-items-center yst-justify-center yst-gap-2 yst-py-2 yst-px-3", className ) }>
		{ children }
	</div>
);

UserSelectOptionsContent.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

/**
 * @param {Object} props The props object.
 * @param {string} props.name The field name.
 * @param {string} props.id The field id.
 * @param {string} props.className The className.
 * @returns {JSX.Element} The user select component.
 */
const FormikUserSelectField = ( { name, id, className = "", ...props } ) => {
	const users = useSelectSettings( "selectUsers", [] );
	const { addManyUsers } = useDispatchSettings();
	const [ { value, ...field }, , { setTouched, setValue } ] = useField( { type: "select", name, id, ...props } );
	const [ status, setStatus ] = useState( ASYNC_ACTION_STATUS.idle );
	const [ queriedUserIds, setQueriedUserIds ] = useState( [] );

	const selectedUser = useMemo( () => {
		const userObjects = values( users );
		return find( userObjects, [ "id", value ] );
	}, [ value, users ] );

	const debouncedFetchUsers = useCallback( debounce( async search => {
		try {
			setStatus( ASYNC_ACTION_STATUS.loading );
			// Cleanup previous running request.
			if ( abortController ) {
				abortController?.abort();
			}
			abortController = new AbortController();

			const response = await apiFetch( {
				// eslint-disable-next-line camelcase
				path: `/wp/v2/users?${ buildQueryString( { search, per_page: 20 } ) }`,
				signal: abortController?.signal,
			} );

			setQueriedUserIds( map( response, "id" ) );
			addManyUsers( response );
			setStatus( ASYNC_ACTION_STATUS.success );
		} catch ( error ) {
			if ( error instanceof DOMException && error.name === "AbortError" ) {
				// Expected abort errors can be ignored.
				return;
			}
			setQueriedUserIds( [] );
			setStatus( ASYNC_ACTION_STATUS.error );

			console.error( error.message );
		}
	}, 200 ), [ setQueriedUserIds, addManyUsers, setStatus ] );

	const handleChange = useCallback( newValue => {
		setTouched( true, false );
		setValue( newValue );
	}, [ setValue ] );
	const handleQueryChange = useCallback( event => debouncedFetchUsers( event.target.value ), [ debouncedFetchUsers ] );

	useEffect( () => {
		// Get initial options.
		debouncedFetchUsers( "" );
	}, [] );

	return (
		<AutocompleteField
			{ ...field }
			name={ name }
			id={ id }
			// Hack to force re-render of Headless UI Combobox.Input component when selectedUser changes.
			value={ selectedUser ? value : 0 }
			onChange={ handleChange }
			placeholder={ __( "Select a user...", "wordpress-seo" ) }
			selectedLabel={ trim( selectedUser?.name ) || selectedUser?.username }
			onQueryChange={ handleQueryChange }
			className={ className }
			{ ...props }
		>
			<>
				{ status === ASYNC_ACTION_STATUS.idle || status === ASYNC_ACTION_STATUS.success && (
					<>
						{ isEmpty( queriedUserIds ) ? (
							<UserSelectOptionsContent>
								{ __( "No users found.", "wordpress-seo" ) }
							</UserSelectOptionsContent>
						) : map( queriedUserIds, userId => {
							const user = users?.[ userId ];
							return user ? (
								<AutocompleteField.Option key={ user?.id } value={ user?.id }>
									{ trim( user?.name ) || user?.slug }
								</AutocompleteField.Option>
							) : null;
						} ) }
					</>
				) }
				{ status === ASYNC_ACTION_STATUS.loading && (
					<UserSelectOptionsContent>
						<Spinner variant="primary" />
						{ __( "Searching users...", "wordpress-seo" ) }
					</UserSelectOptionsContent>
				) }
				{ status === ASYNC_ACTION_STATUS.error && (
					<UserSelectOptionsContent className="yst-text-red-600">
						{ __( "Failed to retrieve users.", "wordpress-seo" ) }
					</UserSelectOptionsContent>
				) }
			</>
		</AutocompleteField>
	);
};

FormikUserSelectField.propTypes = {
	name: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	className: PropTypes.string,
};

export default FormikUserSelectField;
