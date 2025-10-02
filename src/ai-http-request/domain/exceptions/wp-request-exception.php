<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions;

use Throwable;
/**
 * Class to manage an error response in wp_remote_*() requests.
 *
 * @deprecated
 * @codeCoverageIgnore
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class WP_Request_Exception extends Remote_Request_Exception {

	/**
	 * WP_Request_Exception constructor.
	 *
	 * @deprecated
	 * @codeCoverageIgnore
	 *
	 * @param string          $message  The error message.
	 * @param Throwable| null $previous The previously thrown exception.
	 */
	public function __construct( $message = '', $previous = null ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO ', 'Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\WP_Request_Exception::__construct' );
		parent::__construct( $message, 400, 'WP_HTTP_REQUEST_ERROR', $previous );
	}
}
