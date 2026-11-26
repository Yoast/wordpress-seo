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
	 * The name of the boolean option that enables the feature.
	 *
	 * @var string
	 */
	public const OPTION_NAME = 'twitter';

	/**
	 * The human-readable name of the feature.
	 *
	 * @var string
	 */
	public const NAME = 'X card data';

	/**
	 * Returns whether code other than the setting turns the feature off, through the `wpseo_output_twitter_card`
	 * filter.
	 *
	 * @return bool Whether the feature is turned off programmatically.
	 */
	public function is_disabled_programmatically(): bool {
		return \apply_filters( 'wpseo_output_twitter_card', true ) === false;
	}
}
