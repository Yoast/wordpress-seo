import PropTypes from "prop-types";
import Alert from "./alert";
import { __ } from "@wordpress/i18n";
import RequestError from "../../errors/RequestError";

/**
 * Shows a value for in the error details.
 *
 * If the value is `undefined`, nothing is shown.
 *
 * @param {string} title The title of the thing.
 * @param {any} value The value to show.
 *
 * @returns {JSX.Element|null} The error line component, or `null` if the value is `undefined`.
 */
function ErrorLine( { title, value } ) {
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

ErrorLine.defaultProps = {
	value: "",
};

/**
 * Renders a collapsible error box. For bigger error messages or stack traces.
 *
 * @param {string} title The title of the element.
 * @param {string} value The value.
 *
 * @returns {JSX.Element|null} The stack trace component, or `null` if no stack trace is available.
 */
function ErrorBox( { title, value } ) {
	if ( ! value ) {
		return null;
	}

	return <details>
		<summary>{ title }</summary>
		<pre className="yst-overflow-x-scroll yst-max-w-[500px] yst-border-px yst-p-4">
			{ value }
		</pre>
	</details>;
}

ErrorBox.propTypes = {
	title: PropTypes.string.isRequired,
	value: PropTypes.string,
};

ErrorBox.defaultProps = {
	value: "",
};

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
		<div dangerouslySetInnerHTML={ { __html: message } } />
		<details>
			<summary>{ __( "Error details", "wordpress-seo" ) }</summary>
			<div className="yst-mt-2">
				<ErrorLine title={ __( "Request URL", "wordpress-seo" ) } value={ error.url } />
				<ErrorLine title={ __( "Request method", "wordpress-seo" ) } value={ error.method } />
				<ErrorLine title={ __( "Status code", "wordpress-seo" ) } value={ error.statusCode } />
				<ErrorLine title={ __( "Error message", "wordpress-seo" ) } value={ error.message } />
				<ErrorBox title={ __( "Response", "wordpress-seo" ) } value={ error.parseString } />
				<ErrorBox title={ __( "Error stack trace", "wordpress-seo" ) } value={ error.stackTrace } />
			</div>
		</details>
	</Alert>;
}

IndexingError.propTypes = {
	message: PropTypes.string.isRequired,
	error: PropTypes.oneOfType( [
		PropTypes.instanceOf( Error ),
		PropTypes.instanceOf( RequestError ),
	] ).isRequired,
};
