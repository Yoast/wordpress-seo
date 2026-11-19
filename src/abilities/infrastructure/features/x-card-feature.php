<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Features;

/**
 * The X card data feature, which outputs the X card meta tags.
 */
class X_Card_Feature extends Abstract_Feature {

	/**
	 * The key of the feature.
	 *
	 * @var string
	 */
	public const KEY = 'x_card';

	/**
	 * Returns the key of the feature.
	 *
	 * @return string The key.
	 */
	public function get_key(): string {
		return self::KEY;
	}

	/**
	 * Returns the name of the boolean option that enables the feature.
	 *
	 * @return string The option name.
	 */
	public function get_option_name(): string {
		return 'twitter';
	}

	/**
	 * Returns the human-readable name of the feature.
	 *
	 * @return string The name.
	 */
	public function get_name(): string {
		return 'X card data';
	}
}
