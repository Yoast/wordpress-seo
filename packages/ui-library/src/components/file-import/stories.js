import { noop, values } from "lodash";
import React, { useCallback, useState } from "react";
import FileImport, { FILE_IMPORT_STATUS } from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import Alert from "../../elements/alert";
import { success } from "../notifications/docs";
import { aborted, component, error, loading, selected } from "./docs";

const defaultArgs = {
	selectLabel: "Select a file",
	dropLabel: "or drag and drop",
	screenReaderLabel: "Import a file",
	abortScreenReaderLabel: "Abort import",
	selectDescription: "CSV files only, up to 10MB",
	feedbackTitle: "file.csv",
	progressMin: 0,
	progressMax: 100,
	onChange: noop,
	onAbort: noop,
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
			let internalProgress = 0;
			// Fake progress in 20 steps (5% per interval)
			const interval = setInterval( () => {
				if ( internalProgress > 100 ) {
					clearInterval( interval );
					return resolve();
				}
				setProgress( internalProgress++ );
			}, 20 );

			abort = () => {
				clearInterval( interval );
				setStatus( FILE_IMPORT_STATUS.aborted );
				setProgress( 0 );
			};
		} )
			.then( () => setStatus( endStatus ) );
	}, [ setStatus, setFeedbackTitle, setFeedbackDescription, progress, setProgress ] );

	const handleAbort = useCallback( () => {
		// eslint-disable-next-line no-alert
		if ( window.confirm( "Are you sure you want to abort?" ) ) {
			abort();
		}
	}, [ abort, setStatus, setFeedbackTitle, setFeedbackDescription, setProgress ] );

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

export const Factory = {
	render: Template.bind( {} ),
	parameters: {
		controls: { disable: false },
	},
	args: {
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
		...defaultArgs,
		endStatus: FILE_IMPORT_STATUS.success,
	},
};

export const Selected = {
	parameters: {
		controls: { disable: false },
		docs: { description: { story: selected } },
	},
	args: {
		children: (
			<FileImport.Selected>
				<Alert variant="info" role="alert">
					A file has been selected for import.
				</Alert>
			</FileImport.Selected>
		),
		id: "file-import-selected",
		name: "file-import-selected",
		...defaultArgs,
		progress: 60,
		status: FILE_IMPORT_STATUS.selected,
	},
};

export const Loading = {
	parameters: {
		controls: { disable: false },
		docs: { description: { story: loading } },
	},
	args: {
		children: (
			<FileImport.Loading>
				<Alert variant="info" role="alert">
					The import is loading.
				</Alert>
			</FileImport.Loading>
		),
		id: "file-import-loading",
		name: "file-import-loading",
		...defaultArgs,
		progress: 60,
		status: FILE_IMPORT_STATUS.loading,
	},
};

export const Aborted = {
	parameters: {
		controls: { disable: false },
		docs: { description: { story: aborted } },
	},
	args: {
		children: (
			<FileImport.Aborted>
				<Alert variant="warning" role="alert">
					The import was aborted.
				</Alert>
			</FileImport.Aborted>
		),
		id: "file-import-aborted",
		name: "file-import-aborted",
		...defaultArgs,
		progress: 60,
		status: FILE_IMPORT_STATUS.aborted,
	},
};

export const Success = {
	parameters: {
		controls: { disable: false },
		docs: { description: { story: success } },
	},
	args: {
		children: (
			<FileImport.Success>
				<Alert variant="success" role="alert" className="yst-mb-2">SEO data successfully imported!</Alert>
				<Alert variant="warning" role="alert">
					However, there were some slight problems with the following data:
					<ul className="yst-list-disc yst-ms-4 yst-mt-4 yst-space-y-2">
						<li>This went wrong</li>
						<li>This also went wrong</li>
					</ul>
				</Alert>
			</FileImport.Success>
		),
		id: "file-import-success",
		name: "file-import-success",
		...defaultArgs,
		progress: 100,
		status: FILE_IMPORT_STATUS.success,
	},
};

export const Error = {
	parameters: {
		controls: { disable: false },
		docs: { description: { story: error } },
	},
	args: {
		children: (
			<FileImport.Error>
				<Alert variant="error" role="alert">Whoops! Something went terribly wrong.</Alert>
			</FileImport.Error>
		),
		id: "file-import-error",
		name: "file-import-error",
		...defaultArgs,
		progress: 60,
		status: FILE_IMPORT_STATUS.error,
	},
};

export default {
	title: "2) Components/File import",
	component: FileImport,
	argTypes: {
		children: { control: "text" },
		status: { options: values( FILE_IMPORT_STATUS ) },
		endStatus: {
			options: values( FILE_IMPORT_STATUS ),
			type: "select",
			description: "The status to end the import with (only for testing).",
		},
	},
	parameters: {
		docs: {
			description: {
				component,
			},
			page: () => <InteractiveDocsPage stories={ [ Selected, Loading, Aborted, Success, Error ] } />,
		},
	},
};
