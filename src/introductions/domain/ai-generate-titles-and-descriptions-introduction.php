<?php

namespace Yoast\WP\SEO\Introductions\Domain;

use WPSEO_Addon_Manager;

/**
 * Represents the introduction for the AI generate titles and introduction upsell.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 *
 * @makePublic
 */
class Ai_Generate_Titles_And_Descriptions_Introduction implements Introduction_Interface {

	/**
	 * Returns the unique name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'ai-generate-titles-and-descriptions-upsell';
	}

	/**
	 * Returns the slug of the plugin this feature belongs to.
	 * This is used in the version compare.
	 *
	 * @return string
	 */
	public function get_plugin() {
		return WPSEO_Addon_Manager::FREE_SLUG;
	}

	/**
	 * Returns the version when the feature was introduced.
	 *
	 * @return string
	 */
	public function get_version() {
		return '21.0-RC0';
	}

	/**
	 * Returns the required user capabilities.
	 *
	 * @return string[]
	 */
	public function get_capabilities() {
		return [ 'edit_posts' ];
	}

	/**
	 * Returns the applicable pages. Empty for all.
	 *
	 * @return string[]
	 */
	public function get_pages() {
		return [];
	}

	/**
	 * Returns the requested pagination priority. Lower means earlier.
	 *
	 * @return int
	 */
	public function get_priority() {
		return 10;
	}

	/**
	 * Returns can override (in another plugin).
	 *
	 * @return bool
	 */
	public function get_can_override() {
		return false;
	}
}
