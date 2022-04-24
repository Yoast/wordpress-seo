import { useState, useCallback } from "@wordpress/element";
import { noop, values } from "lodash";

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
	const [ status, setStatus ] = useState( args.status || FILE_IMPORT_STATUS.idle );
	const handleChange = useCallback( async ( event ) => {
		setStatus( FILE_IMPORT_STATUS.loading );
		await new Promise( ( resolve ) => setTimeout( resolve, 3000 ) );
		setStatus( args.endStatus );
	}, [ setStatus ] );

	return (
		<FileImport { ...args } status={ status } onChange={ handleChange } />
	);
};

export const Factory = Template.bind( {} );

Factory.controls = { disable: false },
Factory.args = {
	children: (
		<>
			<FileImport.Success>My success messsage.</FileImport.Success>
			<FileImport.Error>My error messsage.</FileImport.Error>
		</>
	),
	id: "file-import",
	name: "file-import",
	selectLabel: "Select a file",
	dropLabel: "or drag and drop",
	srLabel: "Import a file",
	description: "CSV files only, up to 10MB",
	endStatus: FILE_IMPORT_STATUS.success,
};
