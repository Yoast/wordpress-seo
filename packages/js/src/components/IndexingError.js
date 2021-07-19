import PropTypes from "prop-types";
import { Alert } from "@yoast/components";
import { __ } from "@wordpress/i18n";
import { RequestError } from "../errors/RequestError";
import styled from "styled-components";

const ErrorDetails = styled.div`
	margin-top: 8px;
`;

const ErrorStackTrace = styled.pre`
	overflow-x: scroll;
	max-width: 500px;
	border: 1px solid;
	padding: 16px;
`;

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
	if ( typeof value === "undefined" ) {
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
 * An error that should be shown when indexation has failed.
 *
 * @param {string} message The error message to show.
 * @param {Error|RequestError} error The error itself.
 *
 * @returns {JSX.Element} The indexation error component.
 */
export default function IndexingError( { message, error } ) {
	return <Alert type={ "error" }>
		<div dangerouslySetInnerHTML={ { __html: message } } />
		<details>
			<summary>{ __( "Error details (click to show/hide)", "wordpress-seo" ) }</summary>
			<ErrorDetails>
				<ErrorLine title={ __( "Request URL", "wordpress-seo" ) } value={ error.url } />
				<ErrorLine title={ __( "Request method", "wordpress-seo" ) } value={ error.method } />
				<ErrorLine title={ __( "Status code", "wordpress-seo" ) } value={ error.statusCode } />
				<ErrorLine title={ __( "Error message", "wordpress-seo" ) } value={ error.message } />
				<details>
					<summary>{ __( "Error stack trace", "wordpress-seo" ) }</summary>
					<ErrorStackTrace>
						{ error.stackTrace }
					</ErrorStackTrace>
				</details>
			</ErrorDetails>
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
