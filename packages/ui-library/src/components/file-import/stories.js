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

const Template = ( args ) => {
	const [ status, setStatus ] = useState( FILE_IMPORT_STATUS.loading );
	const [ progressTitle, setProgressTitle ] = useState( "" );
	const [ progressDescription, setProgressDescription ] = useState( "" );
	const [ progress, setProgress ] = useState( 0 );

	const handleChange = useCallback( async ( file ) => {
		setStatus( FILE_IMPORT_STATUS.loading );
		setProgressTitle( file.name );
		setProgressDescription( file.size.toString() );
		await new Promise( ( resolve ) => {
			let internalProgress = 0;
			// Fake progress in 20 steps (5% per interval)
			const interval = setInterval( () => {
				if ( internalProgress > 100 ) {
					clearInterval( interval );
					return resolve();
				} else {
					setProgress( internalProgress++ );
				}
			}, 20 );
		} )
		setStatus( FILE_IMPORT_STATUS.success );
	}, [ setStatus, setProgressTitle, setProgressDescription, progress, setProgress ] );

	return (
		<FileImport
			{ ...args }
			progressTitle={ progressTitle }
			progressDescription={ progressDescription }
			status={ status }
			progress={ progress }
			onChange={ handleChange }
		/>
	);
};

export const Factory = Template.bind( {} );

Factory.controls = { disable: false },
Factory.args = {
	children: (
		<>
			<FileImport.Success>
				<Alert variant="success">SEO data successfully imported!</Alert>
				<Alert variant="warning">
					However, there were some slight problems with the following data:
					<ul className="yst-list-disc yst-ml-4 yst-mt-4 yst-space-y-2">
						<li>This went wrong</li>
						<li>This also went wrong</li>
					</ul>
				</Alert>
			</FileImport.Success>
			<FileImport.Error>
				<Alert variant="error">Whoops! Something went terribly wrong.</Alert>
			</FileImport.Error>
		</>
	),
	id: "file-import",
	name: "file-import",
	selectLabel: "Select a file",
	dropLabel: "or drag and drop",
	screenReaderLabel: "Import a file",
	abortScreenReaderLabel: "Abort import",
	description: "CSV files only, up to 10MB",
};
