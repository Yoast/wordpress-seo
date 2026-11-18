<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI\Authentication\Domain\Exceptions;

use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Remote_Request_Exception;

/**
 * Thrown when an auth strategy cannot satisfy its preconditions to dispatch a request — for example
 * when the site token cannot be acquired. Distinct from the HTTP-response exception family because
 * no request was made; extends Remote_Request_Exception so AI_Request_Sender treats it as a
 * fallback-eligible failure rather than an OAuth-specific sentinel.
 */
class Auth_Strategy_Unavailable_Exception extends Remote_Request_Exception {

}
