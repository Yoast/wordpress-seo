import { useState, useCallback } from "@wordpress/element";
import { noop, values } from "lodash";

import Alert from "../../elements/alert";

import FileImport, { FILE_IMPORT_STATUS } from ".";

export default {
	title: "2. Components/File Import",
	component: FileImport,
	argTypes: {
		children: { control: "text" },
		status: { options: values( FILE_IMPORT_STATUS ) },
	},
	parameters: {
		docs: {
			description: {
				component: "A file import component.",
			},
		},
	},
};

const Template = ( { endStatus, ...args } ) => {
	const [ status, setStatus ] = useState( FILE_IMPORT_STATUS.idle );
	const [ feedbackTitle, setFeedbackTitle ] = useState( "" );
	const [ feedbackDescription, setFeedbackDescription ] = useState( "" );
	const [ progress, setProgress ] = useState( 0 );
	let abort = null;

	const handleChange = useCallback( async file => {
		setStatus( FILE_IMPORT_STATUS.loading );
		setFeedbackTitle( file.name );
		setFeedbackDescription( `${ Math.round( file.size.toString() / 1024 ) }Kb` );
		await new Promise( ( resolve, reject ) => {
			abort = reject;
			let internalProgress = 0;
			// Fake progress in 20 steps (5% per interval)
			const interval = setInterval( () => {
				if ( internalProgress > 100 ) {
					clearInterval( interval );
					return resolve();
				}
				setProgress( internalProgress++ );
			}, 20 );
		} )
			.then( () => setStatus( endStatus ) )
			.catch( () => setStatus( FILE_IMPORT_STATUS.idle ) );
	}, [ setStatus, setFeedbackTitle, setFeedbackDescription, progress, setProgress ] );

	const handleAbort = useCallback( () => {
		// eslint-disable-next-line no-alert
		if ( window.confirm( "Are you sure you want to abort?" ) ) {
			abort ? abort() : setStatus( FILE_IMPORT_STATUS.idle );
			setFeedbackTitle( "" );
			setFeedbackDescription( "" );
			setProgress( 0 );
		}
	}, [ setStatus, setFeedbackTitle, setFeedbackDescription, setProgress ] );

	return (
		<FileImport
			{ ...args }
			feedbackTitle={ feedbackTitle }
			feedbackDescription={ feedbackDescription }
			status={ status }
			progress={ progress }
			onChange={ handleChange }
			onAbort={ handleAbort }
		/>
	);
};

export const Factory = ( args ) => <FileImport { ...args } />;
Factory.controls = { disable: false };
Factory.args = {
	children: (
		<>
			<FileImport.Success>
				Success message
			</FileImport.Success>
			<FileImport.Error>
				Error message
			</FileImport.Error>
		</>
	),
	id: "file-import-1",
	name: "file-import-1",
	selectLabel: "Select label",
	dropLabel: "drag an drop label",
	screenReaderLabel: "Screen reader label",
	abortScreenReaderLabel: "Abort screen reader label",
	selectDescription: "Select description",
	feedbackTitle: "Progress title",
	feedbackDescription: "Progress description",
	progressMin: 0,
	progressMax: 100,
	onChange: noop,
	onAbort: noop,
};

export const EndingInSuccess = Template.bind( {} );
EndingInSuccess.args = {
	children: (
		<>
			<FileImport.Success>
				<Alert variant="success" role="alert">SEO data successfully imported!</Alert>
				<Alert variant="warning" role="alert">
					However, there were some slight problems with the following data:
					<ul className="yst-list-disc yst-ml-4 yst-mt-4 yst-space-y-2">
						<li>This went wrong</li>
						<li>This also went wrong</li>
					</ul>
				</Alert>
			</FileImport.Success>
			<FileImport.Error>
				<Alert variant="error" role="alert">Whoops! Something went terribly wrong.</Alert>
			</FileImport.Error>
		</>
	),
	id: "file-import-2",
	name: "file-import-2",
	selectLabel: "Select a file",
	dropLabel: "or drag and drop",
	screenReaderLabel: "Import a file",
	abortScreenReaderLabel: "Abort import",
	selectDescription: "CSV files only, up to 10MB",
	progressMin: 0,
	progressMax: 100,
	endStatus: FILE_IMPORT_STATUS.success,
};

export const EndingInError = Template.bind( {} );
EndingInError.args = {
	children: (
		<>
			<FileImport.Success>
				<Alert variant="success" role="alert">SEO data successfully imported!</Alert>
				<Alert variant="warning" role="alert">
					However, there were some slight problems with the following data:
					<ul className="yst-list-disc yst-ml-4 yst-mt-4 yst-space-y-2">
						<li>This went wrong</li>
						<li>This also went wrong</li>
					</ul>
				</Alert>
			</FileImport.Success>
			<FileImport.Error>
				<Alert variant="error" role="alert">Whoops! Something went terribly wrong.</Alert>
			</FileImport.Error>
		</>
	),
	id: "file-import-3",
	name: "file-import-3",
	selectLabel: "Select a file",
	dropLabel: "or drag and drop",
	screenReaderLabel: "Import a file",
	abortScreenReaderLabel: "Abort import",
	selectDescription: "CSV files only, up to 10MB",
	progressMin: 0,
	progressMax: 100,
	endStatus: FILE_IMPORT_STATUS.error,
};
