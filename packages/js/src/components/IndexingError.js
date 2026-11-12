import { Alert } from "@yoast/components";
import IndexingErrorContent from "./IndexingErrorContent";

/**
 * An error that should be shown when indexation has failed.
 *
 * @param {Object} props Component props.
 * @param {string} props.message The error message to show.
 * @param {(Error|RequestError|ParseError)} props.error The error itself.
 *
 * @returns {JSX.Element} The indexation error component.
 */
export default function IndexingError( { message, error } ) {
	return <Alert type={ "error" }>
		<IndexingErrorContent message={ message } error={ error } />
	</Alert>;
}
