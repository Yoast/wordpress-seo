<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Authentication\Domain;

/**
 * Constants identifying the auth strategy in use for a given AI request.
 *
 * Used by the wpseo_ai_auth_method filter to pin a specific strategy during QA / staged rollout.
 */
final class Auth_Method {

	public const OAUTH = 'oauth';
	public const TOKEN = 'token';
}
