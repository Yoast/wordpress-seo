<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\HTTP_Request\Application;

use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Bad_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Internal_Server_Error_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Not_Found_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Payment_Required_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Request_Timeout_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Service_Unavailable_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Too_Many_Requests_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;

/**
 * Maps a parsed Response to the matching typed exception for non-200 responses.
 *
 * Centralises the status-code switch used by every auth strategy after dispatch, so the OAuth
 * (MyYoast_Client-backed) and Token (legacy JWT) paths translate yoast-ai responses identically.
 *
 * @makePublic
 */
class Response_Validator {

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber -- The @throws list documents the exception family produced by this method.

	/**
	 * Returns the response on success (HTTP 200); throws the matching typed exception otherwise.
	 *
	 * @param Response $response The parsed response.
	 *
	 * @return Response The same response, on HTTP 200.
	 *
	 * @throws Bad_Request_Exception When the response code is anything other than the codes below (including transport failure, where code is 0).
	 * @throws Forbidden_Exception When the response code is 403.
	 * @throws Internal_Server_Error_Exception When the response code is 500.
	 * @throws Not_Found_Exception When the response code is 404.
	 * @throws Payment_Required_Exception When the response code is 402.
	 * @throws Request_Timeout_Exception When the response code is 408.
	 * @throws Service_Unavailable_Exception When the response code is 503.
	 * @throws Too_Many_Requests_Exception When the response code is 429.
	 * @throws Unauthorized_Exception When the response code is 401.
	 */
	public function assert_success( Response $response ): Response {
		$headers = $response->get_headers();

		// phpcs:disable WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Exception data is internal, not output.
		switch ( $response->get_response_code() ) {
			case 200:
				return $response;
			case 401:
				throw new Unauthorized_Exception( $response->get_message(), $response->get_response_code(), $response->get_error_code(), null, $headers );
			case 402:
				throw new Payment_Required_Exception( $response->get_message(), $response->get_response_code(), $response->get_error_code(), null, $response->get_missing_licenses(), $headers );
			case 403:
				throw new Forbidden_Exception( $response->get_message(), $response->get_response_code(), $response->get_error_code(), null, $headers );
			case 404:
				throw new Not_Found_Exception( $response->get_message(), $response->get_response_code(), $response->get_error_code(), null, $headers );
			case 408:
				throw new Request_Timeout_Exception( $response->get_message(), $response->get_response_code(), $response->get_error_code(), null, $headers );
			case 429:
				throw new Too_Many_Requests_Exception( $response->get_message(), $response->get_response_code(), $response->get_error_code(), null, $response->get_missing_licenses(), $headers );
			case 500:
				throw new Internal_Server_Error_Exception( $response->get_message(), $response->get_response_code(), $response->get_error_code(), null, $headers );
			case 503:
				throw new Service_Unavailable_Exception( $response->get_message(), $response->get_response_code(), $response->get_error_code(), null, $headers );
			default:
				throw new Bad_Request_Exception( $response->get_message(), $response->get_response_code(), $response->get_error_code(), null, $headers );
		}
		// phpcs:enable WordPress.Security.EscapeOutput.ExceptionNotEscaped
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber
}
