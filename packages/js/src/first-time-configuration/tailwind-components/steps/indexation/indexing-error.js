import IndexingErrorContent from "../../../../components/IndexingErrorContent";
import Alert from "../../base/alert";

/**
 * An error that should be shown when indexation has failed.
 *
 * @param {Object} props Component props.
 * @param {string} props.message The error message to show.
 * @param {(Error|RequestError|ParseError)} props.error The error itself.
 * @param {string} [props.className=""] Optional class name.
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
