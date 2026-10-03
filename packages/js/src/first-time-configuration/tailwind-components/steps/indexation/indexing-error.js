import PropTypes from "prop-types";

import RequestError from "../../../../errors/RequestError";
import IndexingErrorContent from "../../../../components/IndexingErrorContent";
import Alert from "../../base/alert";

/**
 * An error that should be shown when indexation has failed.
 *
 * @param {string} message The error message to show.
 * @param {Error|RequestError|ParseError} error The error itself.
 * @param {string} [className=""] Optional class name.
 *
 * @returns {JSX.Element} The indexation error component.
 */
export default function IndexingError( { message, error, className = "" } ) {
	return <Alert
		type={ "error" }
		className={ className }
	>
		<IndexingErrorContent message={ message } error={ error } />
	</Alert>;
}

IndexingError.propTypes = {
	message: PropTypes.string.isRequired,
	error: PropTypes.oneOfType( [
		PropTypes.instanceOf( Error ),
		PropTypes.instanceOf( RequestError ),
	] ).isRequired,
	className: PropTypes.string,
};
