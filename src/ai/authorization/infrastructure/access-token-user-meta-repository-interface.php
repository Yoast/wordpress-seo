<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI\Authorization\Infrastructure;

/**
 * Interface Access_Token_User_Meta_Repository_Interface
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
interface Access_Token_User_Meta_Repository_Interface extends Token_User_Meta_Repository_Interface {
	public const META_KEY = '_yoast_wpseo_ai_generator_access_jwt';
}
