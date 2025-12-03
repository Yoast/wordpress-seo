<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for schema.
 */
class Schema_Helper {

	/**
	 * Add a disallow rule for a specific user agent if it does not exist yet.
	 *
	 * @param string $user_agent The user agent to add the disallow rule to.
	 * @param string $path       The path to add as a disallow rule.
	 *
	 * @return void
	 */
	public function add_disallow( $user_agent, $path ) {
		$user_agent_container = $this->robots_txt_user_agents->get_user_agent( $user_agent );
		$user_agent_container->add_disallow_directive( $path );
	}

	/**
	 * Gets the filtered schema output.
	 *
	 * @return string|array<string> The filtered schema output.
	 */
	public function get_filtered_schema_output() {
		$deprecated_data = [
			'_deprecated' => 'Please use the "wpseo_schema_*" filters to extend the Yoast SEO schema data - see the WPSEO_Schema class.',
		];

		/**
		 * Filter: 'wpseo_json_ld_output' - Allows disabling Yoast's schema output entirely.
		 *
		 * @param mixed  $deprecated If false or an empty array is returned, disable our output.
		 * @param string $empty
		 */
		return \apply_filters( 'wpseo_json_ld_output', $deprecated_data, '' );
	}

	/**
	 * Add sitemap to robots.txt if it does not exist yet.
	 *
	 * @param string $absolute_path The absolute path to the sitemap to add.
	 *
	 * @return void
	 */
	public function add_sitemap( $absolute_path ) {
		if ( ! \in_array( $absolute_path, $this->robots_txt_sitemaps, true ) ) {
			$this->robots_txt_sitemaps[] = $absolute_path;
		}
	}

	/**
	 * Get all registered disallow directives per user agent.
	 *
	 * @return array The registered disallow directives per user agent.
	 */
	public function get_disallow_directives() {
		return $this->robots_txt_user_agents->get_disallow_directives();
	}

	/**
	 * Get all registered allow directives per user agent.
	 *
	 * @return array The registered allow directives per user agent.
	 */
	public function get_allow_directives() {
		return $this->robots_txt_user_agents->get_allow_directives();
	}

	/**
	 * Get all registered sitemap rules.
	 *
	 * @return array The registered sitemap rules.
	 */
	public function get_sitemap_rules() {
		return $this->robots_txt_sitemaps;
	}

	/**
	 * Get all registered user agents
	 *
	 * @return array The registered user agents.
	 */
	public function get_robots_txt_user_agents() {
		return $this->robots_txt_user_agents->get_user_agents();
	}
}
