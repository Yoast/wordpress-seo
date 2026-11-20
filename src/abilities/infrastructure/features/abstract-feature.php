<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Features;

use Yoast\WP\SEO\Abilities\Domain\Feature_Interface;

/**
 * Shared base for the features: a feature that can always be changed and is only turned off by its setting, unless
 * the extending class says otherwise.
 */
abstract class Abstract_Feature implements Feature_Interface {

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
