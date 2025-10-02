<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI_Authorization\Infrastructure;

/**
 * Interface Refresh_Token_User_Meta_Repository_Interface
 *
 * @deprecated
 * @codeCoverageIgnore
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
interface Refresh_Token_User_Meta_Repository_Interface extends Token_User_Meta_Repository_Interface {
	public const META_KEY = '_yoast_wpseo_ai_generator_refresh_jwt';
}
