<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions;

use Throwable;

/**
 * Class to manage a 402 - payment required response.
 */
class Payment_Required_Exception extends Remote_Request_Exception {

	/**
	 * The missing plugin licenses.
	 *
	 * @var string[]
	 */
	private $missing_licenses;

	/**
	 * Payment_Required_Exception constructor.
	 *
	 * @param string                              $message          The error message.
	 * @param int                                 $code             The error status code.
	 * @param string                              $error_identifier The error code identifier, used to identify a type of error.
	 * @param Throwable| null                     $previous         The previously thrown exception.
	 * @param string[]                            $missing_licenses The missing plugin licenses.
	 * @param array<string, string|array<string>> $response_headers The response headers associated with the error.
	 */
	public function __construct( $message = '', $code = 0, $error_identifier = '', $previous = null, $missing_licenses = [], array $response_headers = [] ) {
		$this->missing_licenses = $missing_licenses;
		parent::__construct( $message, $code, $error_identifier, $previous, $response_headers );
	}

	/**
	 * Gets the missing plugin licences.
	 *
	 * @return string[] The missing plugin licenses.
	 */
	public function get_missing_licenses() {
		return $this->missing_licenses;
	}
}
