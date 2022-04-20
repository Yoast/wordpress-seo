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
	const [ value, setValue ] = useState( args.value || "" );
	const handleChange = useCallback( setValue, [ setValue ] );

	return (
		<FileImport { ...args } value={ value } onChange={ handleChange } />
	);
};

export const Factory = {
	component: Template.bind( {} ),
	controls: { disable: false },
	args: {
		children: (
			<>
				<FileImport.Success>My success messsage.</FileImport.Success>
				<FileImport.Error>My error messsage.</FileImport.Error>
			</>
		),
		onChange: noop,
	},
};
