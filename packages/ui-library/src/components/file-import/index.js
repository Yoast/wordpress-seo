import { Transition } from "@headlessui/react";
import { DocumentTextIcon, XIcon } from "@heroicons/react/outline";
import { capitalize, includes, isEmpty, isNull, values } from "lodash";
import PropTypes from "prop-types";
import React, { createContext, forwardRef, useCallback, useContext, useMemo } from "react";
import FileInput from "../../elements/file-input";
import ProgressBar from "../../elements/progress-bar";
import { ValidationIcon } from "../../elements/validation";

export const FILE_IMPORT_STATUS = {
	idle: "idle",
	selected: "selected",
	loading: "loading",
	success: "success",
	aborted: "aborted",
	error: "error",
};

const FileImportContext = createContext( { status: FILE_IMPORT_STATUS.idle } );

/**
 * @returns {Object} The current file import context.
 */
const useFileImportContext = () => useContext( FileImportContext );

const statusIconTransitionProps = {
	enter: "yst-transition-opacity yst-ease-in-out yst-duration-1000 yst-delay-200",
	enterFrom: "yst-opacity-0",
	enterTo: "yst-opacity-100",
	leave: "yst-transition-opacity yst-ease-in-out yst-duration-200",
	leaveFrom: "yst-opacity-0",
	leaveTo: "yst-opacity-100",
	className: "yst-absolute",
};

/**
 * @param {string} status A valid file import status.
 * @returns {JSX.Element} Component that renders conditionally based on given file import status.
 */
const createStatusConditionalRender = ( status ) => {
	/**
	 * @param {JSX.node} children The React children.
	 * @returns {JSX.Element} Component that renders conditionally based on given file import status.
	 */
	const HOC = ( { children } ) => {
		const { status: currentStatus } = useFileImportContext();
		return (
			<Transition
				show={ currentStatus === status }
				enter="yst-transition-opacity yst-ease-in-out yst-duration-1000 yst-delay-200"
				enterFrom="yst-opacity-0"
				enterTo="yst-opacity-100"
				className="yst-mt-6"
			>
				{ children }
			</Transition>
		);
	};
	HOC.propTypes = { children: PropTypes.node };
	// Provide meaningful display name for React dev tools.
	HOC.displayName = `FileImport.${ capitalize( status ) }`;

	return HOC;
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
 * @param {JSX.node} selectDescription The selectDescription.
 * @param {"idle"|"loading"|"success"|"failure"} status The status the component should be in.
 * @param {function(File)} onChange The callback for when a file is imported.
 * @param {Function} onAbort The callback for when an file import is aborted.
 * @param {string} feedbackTitle The import feedback title.
 * @param {string} feedbackDescription The import feedback selectDescription.
 * @param {number} progressMin The import progress min value.
 * @param {number} progressMax The import progress max value.
 * @param {number} progress The import progress.
 * @returns {JSX.Element} The FileImport component.
 */
const FileImport = forwardRef( ( {
	children = "",
	id,
	name,
	selectLabel,
	dropLabel,
	screenReaderLabel,
	abortScreenReaderLabel,
	selectDescription,
	status,
	onChange,
	onAbort,
	feedbackTitle,
	feedbackDescription,
	progressMin,
	progressMax,
	progress,
}, ref ) => {
	const isSelected = useMemo( () => status === FILE_IMPORT_STATUS.selected, [ status ] );
	const isLoading = useMemo( () => status === FILE_IMPORT_STATUS.loading, [ status ] );
	const isSuccess = useMemo( () => status === FILE_IMPORT_STATUS.success, [ status ] );
	const isAborted = useMemo( () => status === FILE_IMPORT_STATUS.aborted, [ status ] );
	const isError = useMemo( () => status === FILE_IMPORT_STATUS.error, [ status ] );

	const hasFeedback = useMemo( () => includes(
		[ FILE_IMPORT_STATUS.selected, FILE_IMPORT_STATUS.loading, FILE_IMPORT_STATUS.success, FILE_IMPORT_STATUS.aborted, FILE_IMPORT_STATUS.error ],
		status,
	), [ status ] );

	const handleChange = useCallback( ( event ) => {
		if ( ! isEmpty( event.target.files ) ) {
			onChange( event.target.files[ 0 ] );
		}
	}, [ onChange ] );

	const handleDrop = useCallback( ( event ) => {
		if ( ! isEmpty( event.dataTransfer.files ) ) {
			const file = event.dataTransfer.files[ 0 ];
			if ( file ) {
				onChange( file );
			}
		}
	}, [ onChange ] );

	return (
		<FileImportContext.Provider value={ { status } }>
			<div className="yst-file-import">
				<FileInput
					ref={ ref }
					id={ id }
					name={ name }
					// Don't control value here to allow consecutive imports of the same file.
					value=""
					onChange={ handleChange }
					onDrop={ handleDrop }
					className="yst-file-import__input"
					aria-labelledby={ screenReaderLabel }
					disabled={ isLoading }
					selectLabel={ selectLabel }
					dropLabel={ dropLabel }
					screenReaderLabel={ screenReaderLabel }
					selectDescription={ selectDescription }
				/>
				<Transition
					show={ hasFeedback }
					enter="yst-transition-opacity yst-ease-in-out yst-duration-1000 yst-delay-200"
					enterFrom="yst-opacity-0"
					enterTo="yst-opacity-100"
				>
					<div className="yst-file-import__feedback">
						<header className="yst-file-import__feedback-header">
							<div className="yst-file-import__feedback-figure"><DocumentTextIcon /></div>
							<div className="yst-flex-1">
								<span className="yst-file-import__feedback-title">{ feedbackTitle }</span>
								<p className="yst-file-import__feedback-description">{ feedbackDescription }</p>
								{ ! isNull( progress ) && (
									<ProgressBar min={ progressMin } max={ progressMax } progress={ progress } className="yst-mt-1.5" />
								) }
							</div>
							<div className="yst-relative yst-h-5 yst-w-5">
								<Transition show={ isSelected } { ...statusIconTransitionProps }>
									<ValidationIcon variant="info" className="yst-w-5 yst-h-5" />
								</Transition>
								<Transition show={ isLoading } { ...statusIconTransitionProps }>
									<button type="button" onClick={ onAbort } className="yst-file-import__abort-button">
										<span className="yst-sr-only">{ abortScreenReaderLabel }</span>
										<XIcon />
									</button>
								</Transition>
								<Transition show={ isSuccess } { ...statusIconTransitionProps }>
									<ValidationIcon variant="success" className="yst-w-5 yst-h-5" />
								</Transition>
								<Transition show={ isAborted } { ...statusIconTransitionProps }>
									<ValidationIcon variant="warning" className="yst-w-5 yst-h-5" />
								</Transition>
								<Transition show={ isError } { ...statusIconTransitionProps }>
									<ValidationIcon variant="error" className="yst-w-5 yst-h-5" />
								</Transition>
							</div>
						</header>
						{ children }
					</div>
				</Transition>
			</div>
		</FileImportContext.Provider>
	);
} );

FileImport.displayName = "FileImport";
FileImport.propTypes = {
	children: PropTypes.node,
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	selectLabel: PropTypes.string.isRequired,
	dropLabel: PropTypes.string.isRequired,
	screenReaderLabel: PropTypes.string.isRequired,
	abortScreenReaderLabel: PropTypes.string.isRequired,
	selectDescription: PropTypes.string,
	feedbackTitle: PropTypes.string.isRequired,
	feedbackDescription: PropTypes.string,
	progressMin: PropTypes.number,
	progressMax: PropTypes.number,
	progress: PropTypes.number,
	status: PropTypes.oneOf( values( FILE_IMPORT_STATUS ) ),
	onChange: PropTypes.func.isRequired,
	onAbort: PropTypes.func.isRequired,
};
FileImport.defaultProps = {
	children: null,
	selectDescription: "",
	feedbackDescription: "",
	progressMin: null,
	progressMax: null,
	progress: null,
	status: FILE_IMPORT_STATUS.idle,
};

FileImport.Selected = createStatusConditionalRender( FILE_IMPORT_STATUS.selected );
FileImport.Loading = createStatusConditionalRender( FILE_IMPORT_STATUS.loading );
FileImport.Success = createStatusConditionalRender( FILE_IMPORT_STATUS.success );
FileImport.Aborted = createStatusConditionalRender( FILE_IMPORT_STATUS.aborted );
FileImport.Error = createStatusConditionalRender( FILE_IMPORT_STATUS.error );

export default FileImport;
