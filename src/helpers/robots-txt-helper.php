<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for the robots txt file.
 */
class Robots_Txt_Helper {

	/**
	 * Holds an array with allow rules per user agent.
	 *
	 * @var array
	 */
	protected $robots_txt_allow_directives;

	/**
	 * Holds an array with disallow rules per user agent.
	 *
	 * @var array
	 */
	protected $robots_txt_disallow_directives;

	/**
	 * Holds an array with absolute URLs of sitemaps.
	 *
	 * @var array
	 */
	protected $robots_txt_sitemaps;

	/**
	 * Constructor for Robots_Txt_Helper.
	 */
	public function __construct() {
		$this->robots_txt_allow_directives    = [];
		$this->robots_txt_disallow_directives = [];
		$this->robots_txt_sitemaps            = [];
	}

	/**
	 * Add a disallow rule for a specific user agent if it does not exist yet.
	 *
	 * @param string $user_agent The user agent to add the disallow rule to.
	 * @param string $path The path to add as a disallow rule.
	 * @return void
	 */
	public function add_disallow( $user_agent, $path ) {
		if ( \array_key_exists( $user_agent, $this->robots_txt_disallow_directives ) ) {
			if ( ! \in_array( $path, $this->robots_txt_disallow_directives[ $user_agent ], true ) ) {
				$this->robots_txt_disallow_directives[ $user_agent ][] = $path;
			}
		}
		else {
			$this->robots_txt_disallow_directives[ $user_agent ] = [ $path ];
		}
	}

	/**
	 * Add an allow rule for a specific user agent if it does not exist yet.
	 *
	 * @param string $user_agent The user agent to add the allow rule to.
	 * @param string $path The path to add as a allow rule.
	 * @return void
	 */
	public function add_allow( $user_agent, $path ) {
		if ( \array_key_exists( $user_agent, $this->robots_txt_allow_directives ) ) {
			if ( ! \in_array( $path, $this->robots_txt_allow_directives[ $user_agent ], true ) ) {
				$this->robots_txt_allow_directives[ $user_agent ][] = $path;
			}
		}
		else {
			$this->robots_txt_allow_directives[ $user_agent ] = [ $path ];
		}
	}

	/**
	 * Add sitemap to robots.txt if it does not exist yet.
	 *
	 * @param string $absolute_path The absolute path to the sitemap to add.
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
		return $this->robots_txt_disallow_directives;
	}

	/**
	 * Get all registered allow directives per user agent.
	 *
	 * @return array The registered allow directives per user agent.
	 */
	public function get_allow_directives() {
		return $this->robots_txt_allow_directives;
	}

	/**
	 * Get all registered sitemap rules.
	 *
	 * @return array The registered sitemap rules.
	 */
	public function get_sitemap_rules() {
		return $this->robots_txt_sitemaps;
	}
}
