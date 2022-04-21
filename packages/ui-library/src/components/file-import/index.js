import { useState, useCallback, useContext, useEffect, createContext, useMemo } from "@wordpress/element";
import { noop, values, includes, isEmpty } from "lodash";
import classNames from "classnames";
import PropTypes from "prop-types";

export const FILE_IMPORT_STATUS = {
	IDLE: "idle",
	LOADING: "loading",
	SUCCESS: "success",
	ERROR: "error",
};

const FileImportContext = createContext( { status: FILE_IMPORT_STATUS.IDLE } );

/**
 * @returns {Object} The current file import context.
 */
const useFileImportContext = () => useContext( FileImportContext );

/**
 * @param {JSX.node} children The React children.
 * @returns {JSX.Element} Success message component that renders when file import status is 'success'.
 */
const Success = ( { children } ) => {
	const { status } = useFileImportContext();
	return status === FILE_IMPORT_STATUS.SUCCESS ? children : null;
};

/**
 *
 *
 * @param {JSX.node} children The React children.
 * @returns {JSX.Element} Error message component that renders when file import status is 'error'.
 */
const Error = ( { children } ) => {
	const { status } = useFileImportContext();
	return status === FILE_IMPORT_STATUS.ERROR ? children : null;
};

/**
 * The FileImport component.
 *
 * @param {JSX.node} children The React children.
 * @param {string} value The value.
 * @param {"idle"|"loading"|"success"|"failure"} status The status the component should be in.
 * @param {Function} onChange The callback for when a file is imported.
 * @param {Function} onAbort The callback for when an file import is aborted.
 * @param {number} progress The import progress.
 * @param {string} accept Which filetype the file import accepts.
 * @param {number} maxFileSize The maximum file size.
 * @returns {JSX.Element} The FileImport component.
 */
const FileImport = ( {
	children,
	value,
	status,
	onChange,
	onAbort = noop,
	progress = null,
	accept = null,
	maxFileSize = Infinity,
} ) => {
	const [ isDragOver, setIsDragOver ] = useState( false );
	const [ file, setFile ] = useState( {} );

	const hasFeedback = useMemo( () => includes(
		[ FILE_IMPORT_STATUS.LOADING, FILE_IMPORT_STATUS.SUCCESS, FILE_IMPORT_STATUS.ERROR ],
		status,
	), [ status ] );

	const handleChange = useCallback( ( event ) => {

	}, [ onChange ] );

	const handleAbort = useCallback( () => {

	}, [ onAbort ] );

	const handleDragEnter = useCallback( ( event ) => {
		event.preventDefault();
		if ( ! isEmpty( event.dataTransfer.items ) ) {
			setIsDragOver( true );
		}
	}, [] );
	const handleDragLeave = useCallback( ( event ) => {
		event.preventDefault();
		setIsDragOver( false );
	}, [] );

	const handleDragOver = useCallback( ( event ) => {
		event.preventDefault();
	}, [] );

	const handleDrop = useCallback( ( event ) => {
		event.preventDefault();
		setIsDragOver( false );
		if ( ! isEmpty( event.dataTransfer.files ) ) {
			onChange( event.dataTransfer.files[ 0 ] );
		}
	}, [ onChange ] );

	return (
		<FileImportContext.Provider value={ { status } }>
			<div className="yst-file-import">
				<div
					onDragEnter={ handleDragEnter }
					onDragLeave={ handleDragLeave }
					onDragOver={ handleDragOver }
					onDrop={ handleDrop }
					className={ classNames( "yst-file-import__select", {
						"yst-border-black": isDragOver,
					} ) }
				>
					Select file
				</div>
				{ hasFeedback && (
					<div className="yst-file-import__feedback">
						<div className="yst-mb-3">
							Progress bar
						</div>
						{ children }
					</div>
				) }
			</div>
		</FileImportContext.Provider>
	);
};

FileImport.propTypes = {
	children: PropTypes.node,
	value: PropTypes.shape( {

	} ),
	status: PropTypes.oneOf( values( FILE_IMPORT_STATUS ) ),
	onChange: PropTypes.func.isRequired,
	onAbort: PropTypes.func,
	progress: PropTypes.number,
	accept: PropTypes.string,
	maxFileSize: PropTypes.number,
};

FileImport.Success = Success;
FileImport.Error = Error;

export default FileImport;
