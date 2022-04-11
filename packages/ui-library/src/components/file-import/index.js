import { useState, useCallback, useEffect } from "@wordpress/element";
import { noop, values } from "lodash";
import PropTypes from "prop-types";

const STATUS = {
	IDLE: "idle",
	LOADING: "loading",
	SUCCESS: "success",
	ERROR: "error",
};

/**
 * The FileImport component.
 *
 * @param {string} value
 * @param {string} status
 * @param {Function} onChange
 * @param {Function} onAbort
 * @param {number} progress
 * @param {string} accept
 * @param {number} maxFileSize
 * @param {JSX.Element} successAs
 * @param {JSX.Element} errorAs
 * @returns {JSX.Element} The FileImport component.
 */
const FileImport = ( {
	value,
	status,
	onChange,
	onAbort = noop,
	progress = null,
	accept = null,
	maxFileSize = Infinity,
	successAs: SuccessComponent = "",
	errorAs: ErrorComponent = "",
} ) => {
	const [ file, setFile ] = useState( {} );

	const test = async () => {

	};

	const handleChange = useCallback( () => {

	}, [ onChange ] );

	const handleDrop = useCallback( () => {

	}, [ onChange ] );

	const handleAbort = useCallback( () => {

	}, [ onAbort ] );

	return (
		<div className="yst-file-import">

			<div className="yst-file-import__result">
				{ status === STATUS.SUCCESS && <SuccessComponent /> }
				{ status === STATUS.ERROR && <ErrorComponent /> }
			</div>
		</div>
	);
};

FileImport.propTypes = {
	value: PropTypes.string,
	status: PropTypes.oneOf( values( STATUS ) ),
	onChange: PropTypes.func.isRequired,
	onAbort: PropTypes.func,
	progress: PropTypes.number,
	accept: PropTypes.string,
	maxFileSize: PropTypes.number,
	successAs: PropTypes.node,
	errorAs: PropTypes.node,
};

export default FileImport;
