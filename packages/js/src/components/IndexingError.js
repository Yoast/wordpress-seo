import { Alert } from "@yoast/components";
import PropTypes from "prop-types";
import RequestError from "../errors/RequestError";
import IndexingErrorContent from "./IndexingErrorContent";

/**
 * An error that should be shown when indexation has failed.
 *
 * @param {string} message The error message to show.
 * @param {Error|RequestError|ParseError} error The error itself.
 *
 * @returns {JSX.Element} The indexation error component.
 */
export default function IndexingError( { message, error } ) {
	return <Alert type={ "error" }>
		<IndexingErrorContent message={ message } error={ error } />
	</Alert>;
}

IndexingError.propTypes = {
	message: PropTypes.string.isRequired,
	error: PropTypes.oneOfType( [
		PropTypes.instanceOf( Error ),
		PropTypes.instanceOf( RequestError ),
	] ).isRequired,
};
