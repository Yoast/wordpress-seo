<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Domain;

/**
 * Authorization header token schemes supported by the OAuth client.
 */
final class Auth_Token_Type {

	public const BEARER = 'Bearer';
	public const DPOP   = 'DPoP';
}
