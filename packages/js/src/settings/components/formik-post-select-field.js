/* eslint-disable complexity */
import { DocumentAddIcon } from "@heroicons/react/outline";
import { useCallback, useEffect, useMemo, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { AutocompleteField, Spinner } from "@yoast/ui-library";
import classNames from "classnames";
import { useField } from "formik";
import { debounce, find, isEmpty, map, values } from "lodash";
import PropTypes from "prop-types";
import { ASYNC_ACTION_STATUS } from "../constants";
import { useDispatchSettings, useSelectSettings } from "../hooks";

let abortController;


/**
 * @param {JSX.node} children The children.
 * @param {string} [className] The className.
 * @returns {JSX.Element} The post select options content decorator component.
 */
const PostSelectOptionsContent = ( { children, className = "" } ) => (
	<div className={ classNames( "yst-flex yst-items-center yst-justify-center yst-gap-2 yst-py-2 yst-px-3", className ) }>
		{ children }
	</div>
);

PostSelectOptionsContent.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

/**
 * @param {Object} props The props object.
 * @param {string} props.name The field name.
 * @param {string} props.id The field id.
 * @param {string} props.className The className.
 * @param {string} props.description The description.
 * @returns {JSX.Element} The post select component.
 */
const FormikPostSelectField = ( { name, id, className = "", ...props } ) => {
	const siteBasicsPolicies = useSelectSettings( "selectPreference", [], "siteBasicsPolicies", {} );
	const posts = useSelectSettings( "selectPostsWith", [ siteBasicsPolicies ], values( siteBasicsPolicies ) );
	const { addManyPosts, fetchPosts } = useDispatchSettings();
	const [ { value, ...field }, , { setTouched, setValue } ] = useField( { type: "select", name, id, ...props } );
	const [ status, setStatus ] = useState( ASYNC_ACTION_STATUS.idle );
	const [ initialPostsFound, setInitialPostsFound ] = useState( false );
	const [ queriedPostIds, setQueriedPostIds ] = useState( [] );
	const canCreatePosts = useSelectSettings( "selectPreference", [], "canCreatePosts", false );
	const createPostUrl = useSelectSettings( "selectPreference", [], "createPostUrl", "" );

	const selectedPost = useMemo( () => {
		const postObjects = values( posts );
		return find( postObjects, [ "id", value ] );
	}, [ value, posts ] );


	const debouncedFetchPosts = useCallback( debounce( async search => {
		try {
			setStatus( ASYNC_ACTION_STATUS.loading );
			// Cleanup previous running request.
			if ( abortController ) {
				abortController?.abort();
			}
			abortController = new AbortController();

			const response = await fetchPosts( { search, per_page: 20 } );

			setQueriedPostIds( map( response.payload, "id" ) );
			//addManyPosts( response );
			setStatus( ASYNC_ACTION_STATUS.success );
		} catch ( error ) {
			if ( error instanceof DOMException && error.name === "AbortError" ) {
				// Expected abort errors can be ignored.
				return;
			}
			setQueriedPostIds( [] );
			setStatus( ASYNC_ACTION_STATUS.error );
		}
	}, 200 ), [ setQueriedPostIds, addManyPosts, setStatus ] );


	const handleChange = useCallback( newValue => {
		setTouched( true, false );
		setValue( newValue );
	}, [ setValue ] );
	const handleQueryChange = useCallback( event => debouncedFetchPosts( event.target.value ), [ debouncedFetchPosts ] );

	useEffect( () => {
		// Get initial options.
		if ( ! initialPostsFound && ! isEmpty( posts ) ) {
			setQueriedPostIds( map( posts, post => post.id ) );
			setInitialPostsFound( true );
		}
	}, [ posts, initialPostsFound ] );

	return (
		<AutocompleteField
			{ ...field }
			name={ name }
			id={ id }
			// Hack to force re-render of Headless UI Combobox.Input component when selectedPost changes.
			value={ selectedPost ? value : 0 }
			onChange={ handleChange }
			placeholder={ __( "Select a post...", "wordpress-seo" ) }
			selectedLabel={ selectedPost?.name }
			onQueryChange={ handleQueryChange }
			className={ className && props.disabled && "yst-autocomplete--disabled" }
			{ ...props }
		>
			<>
				{ ( status === ASYNC_ACTION_STATUS.idle || status === ASYNC_ACTION_STATUS.success ) && (
					<>
						{ isEmpty( queriedPostIds ) ? (
							<PostSelectOptionsContent>
								{ __( "No posts found.", "wordpress-seo" ) }
							</PostSelectOptionsContent>
						) : map( queriedPostIds, postId => {
							const post = posts?.[ postId ];
							return post ? (
								<AutocompleteField.Option key={ post?.id } value={ post?.id }>
									{ post?.name }
								</AutocompleteField.Option>
							) : null;
						} ) }
						{ canCreatePosts && (
							<li className="yst-sticky yst-inset-x-0 yst-bottom-0 yst-group">
								<a
									id={ `link-create_post-${ id }` }
									href={ createPostUrl }
									target="_blank"
									rel="noreferrer"
									className="yst-relative yst-w-full yst-flex yst-items-center yst-py-4 yst-px-3 yst-gap-2 yst-no-underline yst-text-sm yst-text-left yst-bg-white yst-text-slate-700 group-hover:yst-text-white group-hover:yst-bg-primary-500 yst-border-t yst-border-slate-200"
								>
									<DocumentAddIcon
										className="yst-w-5 yst-h-5 yst-text-slate-400 group-hover:yst-text-white" />
									<span>{ __( "Add new post...", "wordpress-seo" ) }</span>
								</a>
							</li>
						) }
					</>
				) }
				{ status === ASYNC_ACTION_STATUS.loading && (
					<PostSelectOptionsContent>
						<Spinner variant="primary" />
						{ __( "Searching posts...", "wordpress-seo" ) }
					</PostSelectOptionsContent>
				) }
				{ status === ASYNC_ACTION_STATUS.error && (
					<PostSelectOptionsContent className="yst-text-red-600">
						{ __( "Failed to retrieve posts.", "wordpress-seo" ) }
					</PostSelectOptionsContent>
				) }
			</>
		</AutocompleteField>
	);
};

FormikPostSelectField.propTypes = {
	name: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	className: PropTypes.string,
	description: PropTypes.string,
};

export default FormikPostSelectField;
