<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Domain;

/**
 * RFC 7009 token_type_hint values used for token revocation requests.
 */
final class Token_Type_Hint {

	public const ACCESS_TOKEN  = 'access_token';
	public const REFRESH_TOKEN = 'refresh_token';
}
