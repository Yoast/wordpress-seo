<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Features;

use Yoast\WP\SEO\Abilities\Domain\Feature_Interface;

/**
 * Shared base for the features: a feature that can always be changed and is only turned off by its setting, unless
 * the extending class says otherwise.
 *
 * Extending classes must define the `KEY`, `OPTION_NAME` and `NAME` constants, which the getters read through late
 * static binding.
 */
abstract class Abstract_Feature implements Feature_Interface {

	/**
	 * Returns the key of the feature.
	 *
	 * @return string The key.
	 */
	public function get_key(): string {
		return static::KEY;
	}

	/**
	 * Returns the name of the boolean option that enables the feature.
	 *
	 * @return string The option name.
	 */
	public function get_option_name(): string {
		return static::OPTION_NAME;
	}

	/**
	 * Returns the human-readable name of the feature.
	 *
	 * @return string The name.
	 */
	public function get_name(): string {
		return static::NAME;
	}

	/**
	 * Returns whether the feature can be changed on the site, which it always can unless the extending class says
	 * otherwise.
	 *
	 * @return bool Whether the feature can be changed.
	 */
	public function is_available(): bool {
		return true;
	}

	/**
	 * Returns whether code other than the setting, like a filter, turns the feature off, which it never does unless
	 * the extending class says otherwise.
	 *
	 * @return bool Whether the feature is turned off programmatically.
	 */
	public function is_disabled_programmatically(): bool {
		return false;
	}
}
