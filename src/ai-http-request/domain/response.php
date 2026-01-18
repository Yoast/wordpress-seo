<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI_HTTP_Request\Domain;

/**
 * Class Response
 * Represents a response from the AI Generator API.
 *
 * @deprecated 26.3
 * @codeCoverageIgnore
 */
class Response {

	/**
	 * The response body.
	 *
	 * @var string
	 */
	private $body;

	/**
	 * The response code.
	 *
	 * @var int
	 */
	private $response_code;

	/**
	 * The response message.
	 *
	 * @var string
	 */
	private $message;

	/**
	 * The error code.
	 *
	 * @var string
	 */
	private $error_code;

	/**
	 * The missing licenses.
	 *
	 * @var array<string>
	 */
	private $missing_licenses;

	/**
	 * Response constructor.
	 *
	 * @deprecated 26.3
	 * @codeCoverageIgnore
	 *
	 * @param string        $body             The response body.
	 * @param int           $response_code    The response code.
	 * @param string        $message          The response message.
	 * @param string        $error_code       The error code.
	 * @param array<string> $missing_licenses The missing licenses.
	 */
	public function __construct( string $body, int $response_code, string $message, string $error_code = '', $missing_licenses = [] ) {
		$this->body             = $body;
		$this->response_code    = $response_code;
		$this->message          = $message;
		$this->error_code       = $error_code;
		$this->missing_licenses = $missing_licenses;
	}

	/**
	 * Gets the response body.
	 *
	 * @deprecated 26.3
	 * @codeCoverageIgnore
	 *
	 * @return string The response body.
	 */
	public function get_body() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.3', 'Yoast\WP\SEO\AI\HTTP_Request\Domain\Response::get_body' );
		return $this->body;
	}

	/**
	 * Gets the response code.
	 *
	 * @deprecated 26.3
	 * @codeCoverageIgnore
	 *
	 * @return int The response code.
	 */
	public function get_response_code(): int {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.3', 'Yoast\WP\SEO\AI\HTTP_Request\Domain\Response::get_response_code' );
		return $this->response_code;
	}

	/**
	 * Gets the response message.
	 *
	 * @deprecated 26.3
	 * @codeCoverageIgnore
	 *
	 * @return string The response message.
	 */
	public function get_message(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.3', 'Yoast\WP\SEO\AI\HTTP_Request\Domain\Response::get_message' );
		return $this->message;
	}

	/**
	 * Gets the error code.
	 *
	 * @deprecated 26.3
	 * @codeCoverageIgnore
	 *
	 * @return string The error code.
	 */
	public function get_error_code(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.3', 'Yoast\WP\SEO\AI\HTTP_Request\Domain\Response::get_error_code' );
		return $this->error_code;
	}

	/**
	 * Gets the missing licenses.
	 *
	 * @deprecated 26.3
	 * @codeCoverageIgnore
	 *
	 * @return array<string> The missing licenses.
	 */
	public function get_missing_licenses(): array {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.3', 'Yoast\WP\SEO\AI\HTTP_Request\Domain\Response::get_missing_licenses' );
		return $this->missing_licenses;
	}
}
