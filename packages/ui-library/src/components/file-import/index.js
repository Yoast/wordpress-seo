import { useState, useCallback, useContext, createContext, useMemo } from "@wordpress/element";
import { noop, values, includes, isEmpty } from "lodash";
import { DocumentAddIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import PropTypes from "prop-types";

import Label from "../../elements/label";
import Link from "../../elements/link";

export const FILE_IMPORT_STATUS = {
	idle: "idle",
	loading: "loading",
	success: "success",
	error: "error",
};

const FileImportContext = createContext( { status: FILE_IMPORT_STATUS.idle } );

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
	return status === FILE_IMPORT_STATUS.success ? children : null;
};

/**
 *
 *
 * @param {JSX.node} children The React children.
 * @returns {JSX.Element} Error message component that renders when file import status is 'error'.
 */
const Error = ( { children } ) => {
	const { status } = useFileImportContext();
	return status === FILE_IMPORT_STATUS.error ? children : null;
};

/**
 * The FileImport component.
 *
 * @param {JSX.node} children The React children.
 * @param {string} id The inputs id.
 * @param {string} name The inputs name.
 * @param {string} selectLabel The label for native select file functionality.
 * @param {string} dropLabel The label for custom drop file functionality.
 * @param {JSX.Node} description The description.
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
	id,
	name,
	selectLabel,
	dropLabel,
	srLabel,
	description,
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
		[ FILE_IMPORT_STATUS.loading, FILE_IMPORT_STATUS.success, FILE_IMPORT_STATUS.error ],
		status,
	), [ status ] );

	const handleChange = useCallback( ( event ) => {
		console.warn( event );
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
						"yst-is-drag-over": isDragOver,
					} ) }
				>
					<div className="yst-file-import__select-content">
						<input
							type="file"
							id={ id }
							name={ name }
							onChange={ onChange }
							className="yst-sr-only"
							aria-labelledby={ srLabel }
						/>
						<DocumentAddIcon className="yst-file-import__select-icon" />
						<Label as="span">
							<Link as="label" htmlFor={ id }>{ selectLabel }</Link>
							&nbsp;
							{ dropLabel }
						</Label>
						<span>{ description }</span>
					</div>
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
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	selectLabel: PropTypes.string.isRequired,
	dropLabel: PropTypes.string.isRequired,
	srLabel: PropTypes.string.isRequired,
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
