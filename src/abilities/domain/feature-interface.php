<?php

namespace Yoast\WP\SEO\Abilities\Domain;

/**
 * Describes a feature that agents can enable or disable, like the XML sitemap.
 */
interface Feature_Interface {

	/**
	 * Returns the key of the feature, as agents read it from the abilities.
	 *
	 * @return string The key, e.g. `xml_sitemap`.
	 */
	public function get_key(): string;

	/**
	 * Returns the name of the boolean option that enables the feature.
	 *
	 * @return string The option name.
	 */
	public function get_option_name(): string;

	/**
	 * Returns the human-readable name of the feature.
	 *
	 * @return string The name.
	 */
	public function get_name(): string;

	/**
	 * Returns whether the feature can be changed on the site.
	 *
	 * @return bool Whether the feature can be changed.
	 */
	public function is_available(): bool;

	/**
	 * Returns whether code other than the setting, like a filter, turns the feature off.
	 *
	 * @return bool Whether the feature is turned off programmatically.
	 */
	public function is_disabled_programmatically(): bool;
}
