import { useState, useCallback, useContext, createContext, useMemo } from "@wordpress/element";
import { noop, values, includes, isEmpty } from "lodash";
import { DocumentAddIcon, DocumentTextIcon, XIcon } from "@heroicons/react/outline";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";
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
 * @param {string} screenReaderLabel The screen reader label for the file select.
 * @param {string} abortScreenReaderLabel The screen reader label for the abort button.
 * @param {JSX.Node} description The description.
 * @param {"idle"|"loading"|"success"|"failure"} status The status the component should be in.
 * @param {Function} onChange The callback for when a file is imported.
 * @param {Function} onAbort The callback for when an file import is aborted.
 * @param {string} progressTitle The import progress title.
 * @param {string} progressDescription The import progress description.
 * @param {number} progressMin The import progress min value.
 * @param {number} progressMax The import progress max value.
 * @param {number} progress The import progress.
 * @returns {JSX.Element} The FileImport component.
 */
const FileImport = ( {
	children,
	id,
	name,
	selectLabel,
	dropLabel,
	screenReaderLabel,
	abortScreenReaderLabel,
	description,
	file,
	status,
	onChange,
	onAbort = noop,
	progressTitle,
	progressDescription,
	progressMin,
	progressMax,
	progress = null,
	...props
} ) => {
	const [ isDragOver, setIsDragOver ] = useState( false );

	const hasFeedback = useMemo( () => includes(
		[ FILE_IMPORT_STATUS.loading, FILE_IMPORT_STATUS.success, FILE_IMPORT_STATUS.error ],
		status,
	), [ status ] );

	const handleChange = useCallback( ( event ) => {
		if ( ! isEmpty( event.target.files ) ) {
			onChange( event.target.files[ 0 ] );
		}
	}, [ onChange ] );

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
	}, [ setIsDragOver, onChange ] );

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
							onChange={ handleChange }
							className="yst-sr-only"
							aria-labelledby={ screenReaderLabel }
							{ ...props }
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
						<div className="yst-file-import__progress">
							<div className="yst-file-import__progress-figure"><DocumentTextIcon /></div>
							<div className="yst-flex-1">
								<span className="yst-file-import__progress-title">{ progressTitle }</span>
								<p className="yst-file-import__progress-description">{ progressDescription }</p>
								<div>{ progress }</div>
							</div>
							<div>
								{ status === FILE_IMPORT_STATUS.loading && (
									<button onClick={ onAbort } className="yst-file-import__abort-button">
										<span className="yst-sr-only">{ abortScreenReaderLabel }</span>
										<XIcon />
									</button>
								) }
								{ status === FILE_IMPORT_STATUS.success && <CheckCircleIcon className="yst-file-import__status-icon yst-file-import__status-icon--success" /> }
								{ status === FILE_IMPORT_STATUS.error && <XCircleIcon className="yst-file-import__status-icon yst-file-import__status-icon--error" /> }
							</div>
						</div>
						<div className="yst-file-import__message">
							{ children }
						</div>
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
	screenReaderLabel: PropTypes.string.isRequired,
	abortScreenReaderLabel: PropTypes.string.isRequired,
	progressTitle: PropTypes.string.isRequired,
	progressDescription: PropTypes.string,
	progressMin: PropTypes.number,
	progressMax: PropTypes.number,
	progress: PropTypes.number,
	status: PropTypes.oneOf( values( FILE_IMPORT_STATUS ) ),
	onChange: PropTypes.func.isRequired,
	onAbort: PropTypes.func,
};

FileImport.Success = Success;
FileImport.Error = Error;

export default FileImport;
