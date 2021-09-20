import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { Editor as TinyEditor } from "@tinymce/tinymce-react";
import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useEffect, useState } from "@wordpress/element";
import { Spinner } from "@yoast/admin-ui-toolkit/components";
import { isLoadingStatus } from "@yoast/admin-ui-toolkit/helpers";
import { debounce } from "lodash";

import { OPTIMIZE_STORE_KEY } from "../constants";
import { PlaceholderInput, PlaceholderTextArea } from "./placeholders";
import MediaList from "./media-list";
import TextInput from "./text-input";

/**
 * @param {string} html HTML string with possible Yoast marks.
 * @returns {string} Clean HTML string.
 */
const cleanHtml = ( html ) => html
	.replace( new RegExp( "<yoastmark[^>]*>", "g" ), "" )
	.replace( new RegExp( "</yoastmark>", "g" ), "" );

/**
 * Hooks to handle the description with marks.
 *
 * @returns {{handleEditorChange: function, html: string}} Props for the TinyMCE editor.
 */
function useEditorWithMarks() {
	const description = useSelect( select => select( OPTIMIZE_STORE_KEY ).getData( "description" ), [] );
	const marks = useSelect( select => select( OPTIMIZE_STORE_KEY ).getMarks(), [] );

	const { setData, resetMarker } = useDispatch( OPTIMIZE_STORE_KEY );

	// Keep the editor HTML separate because it includes the marks.
	const [ html, setHtml ] = useState( description );

	const debouncedSetData = useCallback( debounce( setData, 200 ), [] );
	const handleEditorChange = useCallback( value => {
		// Safety check to ensure we do not reset marks when the HTML did not change.
		if ( value === html ) {
			return;
		}
		setHtml( value );
		if ( marks.length > 0 ) {
			/*
			 Reset the marker when the editor content changed. The marks are stored alongside the analysis results,
			 which are changed when the user types. Resetting is a way to ensure there are no faulty or old marks.
			 */
			resetMarker();
		}
	}, [ html ] );

	// Reset marker on unmount
	useEffect( () => () => resetMarker(), [] );

	// Update the HTML if the description changed outside of the editor.
	useEffect( () => {
		if ( cleanHtml( html ) !== description ) {
			setHtml( description );
		}
	}, [ description ] );

	/*
	 Apply marks to the HTML whenever they changed.
	 Note that the description is left out of the dependencies by design, only set the HTML when the marks changed.
	 */
	useEffect( () => {
		setHtml( marks.reduce( ( marked, mark ) => mark.applyWithReplace( marked ), description ) );
	}, [ marks ] );

	// Update the description when needed, without any marks.
	useEffect( () => {
		if ( cleanHtml( html ) !== description ) {
			debouncedSetData( "description", html );
		}
	}, [ html ] );

	return {
		editorValue: html,
		handleEditorChange,
	};
}

/**
 * The editor with title and text area.
 * @param {Object} props The props.
 * @param {Object} props.contentType The content type options.
 * @param {Object} props.id The detail id.
 * @param {boolean} props.isLoading Wether or not the editor should be in a loading state.
 * @returns {JSX.Element} The Editor component.
 */
export default function Editor( { contentType, id, isLoading } ) {
	const saveStatus = useSelect( select => select( OPTIMIZE_STORE_KEY ).getSaveStatus(), [] );
	const { handleSave } = useDispatch( OPTIMIZE_STORE_KEY );
	const { editorValue, handleEditorChange } = useEditorWithMarks();
	const isSaveLoading = isLoadingStatus( saveStatus );

	const handleSubmit = useCallback( () => {
		// Sent current path with handle save action.
		handleSave( {
			contentType: contentType.slug,
			id,
			...( contentType.requestData ? contentType.requestData : {} ),
		} );
	}, [ contentType.slug ] );

	return (
		<div className="yst-col-span-3 yst-mb-8">
			<div className="yst-bg-white yst-rounded-lg yst-shadow yst-p-8 yst-space-y-8">
				{
					isLoading
						? <PlaceholderInput label={ __( "Title", "admin-ui" ) } />
						: <>
							<TextInput
								id="editor-title"
								label={ __( "Title", "admin-ui" ) }
								dataPath="title"
							/>
						</>
				}
				{
					contentType.hasContentEditor && ( isLoading
						? <>
							<PlaceholderTextArea label={ __( "Description", "admin-ui" ) } />
						</>
						: <>
							<div>
								<label
									className="yst-block yst-mb-2"
									htmlFor="editor-description"
								>
									{ __( "Description", "admin-ui" ) }
								</label>
								<TinyEditor
									init={ {
										height: 500,
										menubar: false,
										branding: false,
										statusbar: false,
										skin: "optimize-ui",
										// eslint-disable-next-line camelcase
										extended_valid_elements: "yoastmark[class]",
									} }
									value={ editorValue }
									onEditorChange={ handleEditorChange }
									plugins={ [ "lists", "link", "image" ] }
									toolbar="formatselect | bold italic underline forecolor | numlist bullist indent outdent | alignleft aligncenter alignright | link image"
								/>
							</div>
						</>
					)
				}
				<MediaList contentType={ contentType.slug } isLoading={ isLoading } />
				<button
					type="button"
					className="yst-button yst-button--primary yst-mt-4"
					disabled={ isLoading || isSaveLoading }
					onClick={ handleSubmit }
				>
					{ isSaveLoading && <Spinner className="yst-mr-3" /> }
					{ __( "Save changes", "admin-ui" ) }
				</button>
			</div>
		</div>
	);
}

Editor.propTypes = {
	contentType: PropTypes.shape( {
		slug: PropTypes.string.isRequired,
		hasContentEditor: PropTypes.bool.isRequired,
		requestData: PropTypes.object,
	} ).isRequired,
	id: PropTypes.string.isRequired,
	isLoading: PropTypes.bool,
};

Editor.defaultProps = {
	isLoading: false,
};
