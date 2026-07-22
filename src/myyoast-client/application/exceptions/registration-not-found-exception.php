<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Exceptions;

/**
 * Exception thrown when the authorization server reports that the registration
 * no longer exists (HTTP 401/404 on RFC 7592 read).
 *
 * Extends Registration_Failed_Exception so existing catch sites keep working.
 */
class Registration_Not_Found_Exception extends Registration_Failed_Exception {

}
