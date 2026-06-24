import { __ } from "@wordpress/i18n";
import { strings } from "@yoast/helpers";
import PropTypes from "prop-types";
import RequestError from "../errors/RequestError";

const { stripTagsFromHtmlString } = strings;

const ALLOWED_TAGS = [ "a", "p" ];

/**
 * Shows a value for in the error details.
 *
 * If the value is `undefined`, nothing is shown.
 *
 * @param {string} title The label for the value.
 * @param {any} [value=""] The value to show.
 *
 * @returns {JSX.Element|null} The error line component, or `null` if the value is `undefined`.
 */
function ErrorLine( { title, value = "" } ) {
	if ( ! value ) {
		return null;
	}
	return <p>
		<strong>{ title }</strong><br />
		{ value }
	</p>;
}

ErrorLine.propTypes = {
	title: PropTypes.string.isRequired,
	value: PropTypes.any,
};

/**
 * Renders a collapsible error box. For bigger error messages or stack traces.
 *
 * @param {string} title The label for the value.
 * @param {string} [value=""] The value.
 *
 * @returns {JSX.Element|null} The stack trace component, or `null` if no stack trace is available.
 */
function ErrorBox( { title, value = "" } ) {
	if ( ! value ) {
		return null;
	}

	return <details>
		<summary>{ title }</summary>
		<pre style={ { overflowX: "scroll", maxWidth: "500px", border: "1px solid", padding: "16px" } }>
			{ value }
		</pre>
	</details>;
}

ErrorBox.propTypes = {
	title: PropTypes.string.isRequired,
	value: PropTypes.string,
};

/**
 * The body of an indexation error: the message plus the collapsible request/error details.
 *
 * Rendered inside an `Alert` by the styling-specific `IndexingError` wrappers; the inline styles
 * keep it neutral so it works in both the style-guide and the Tailwind contexts.
 *
 * @param {string} message The error message to show.
 * @param {Error|RequestError|ParseError} error The error itself.
 *
 * @returns {JSX.Element} The indexation error body.
 */
export default function IndexingErrorContent( { message, error } ) {
	return <>
		<div dangerouslySetInnerHTML={ { __html: stripTagsFromHtmlString( message, ALLOWED_TAGS ) } } />
		<details>
			<summary>{ __( "Error details", "wordpress-seo" ) }</summary>
			<div style={ { marginTop: "8px" } }>
				<ErrorLine
					title={ __( "Failing object", "wordpress-seo" ) }
					value={ error.objectId ? `${ error.objectType } #${ error.objectId }` : "" }
				/>
				<ErrorLine title={ __( "Request URL", "wordpress-seo" ) } value={ error.url } />
				<ErrorLine title={ __( "Request method", "wordpress-seo" ) } value={ error.method } />
				<ErrorLine title={ __( "Status code", "wordpress-seo" ) } value={ error.statusCode } />
				<ErrorLine title={ __( "Error message", "wordpress-seo" ) } value={ error.message } />
				<ErrorBox title={ __( "Response", "wordpress-seo" ) } value={ error.parseString } />
				<ErrorBox title={ __( "Error stack trace", "wordpress-seo" ) } value={ error.stackTrace } />
			</div>
		</details>
	</>;
}

IndexingErrorContent.propTypes = {
	message: PropTypes.string.isRequired,
	error: PropTypes.oneOfType( [
		PropTypes.instanceOf( Error ),
		PropTypes.instanceOf( RequestError ),
	] ).isRequired,
};
