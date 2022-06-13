<?php

namespace Yoast\WP\SEO\Integrations\Front_End;

use Yoast\WP\SEO\Conditionals\Robots_Txt_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Handles adding the sitemap to the `robots.txt`.
 */
class Robots_Txt_Integration implements Integration_Interface {

	/**
	 * Holds the options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Sets the helpers.
	 *
	 * @param Options_Helper $options_helper Options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Robots_Txt_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_filter( 'robots_txt', [ $this, 'filter_robots' ], 99999, 2 );
	}

	/**
	 * Filters the robots.txt output.
	 *
	 * @param string $robots_txt The robots.txt output from WordPress.
	 * @param string $public     Option that says whether the site is public or not.
	 *
	 * @return string $output Filtered robots.txt output.
	 */
	public function filter_robots( $robots_txt, $public ) {
		// If the site isn't public, bail.
		if ( $public === '0' ) {
			return $robots_txt;
		}

		$robots_txt = $this->change_default_robots( $robots_txt );
		$robots_txt = $this->add_xml_sitemap( $robots_txt );

		return $this->add_subdirectory_multisite_xml_sitemaps( $robots_txt );
	}

	/**
	 * Replaces the default WordPress robots.txt output.
	 *
	 * @param string $robots_txt Input robots.txt.
	 *
	 * @return string
	 */
	protected function change_default_robots( $robots_txt ) {
		return \str_replace(
			"User-agent: *\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php",
			"User-agent: *\nDisallow:",
			$robots_txt
		);
	}

	/**
	 * Adds XML sitemap reference to robots.txt.
	 *
	 * @param string $robots_txt Robots.txt input.
	 *
	 * @return string
	 */
	protected function add_xml_sitemap( $robots_txt ) {
		// If the XML sitemap is disabled, bail.
		if ( ! $this->options_helper->get( 'enable_xml_sitemap', false ) ) {
			return $robots_txt;
		}

		$sitemap = 'Sitemap: ' . \esc_url( \WPSEO_Sitemaps_Router::get_base_url( 'sitemap_index.xml' ) );

		// If our sitemap is already output, bail.
		if ( \strpos( $robots_txt, $sitemap ) !== false ) {
			return $robots_txt;
		};

		return \trim( $robots_txt ) . "\n\n" . $sitemap . "\n";
	}

	/**
	 * Adds subdomain multisite' XML sitemap references to robots.txt.
	 *
	 * @param string $robots_txt Robots.txt input.
	 *
	 * @return string
	 */
	protected function add_subdirectory_multisite_xml_sitemaps( $robots_txt ) {
		// If not on a multisite subdirectory, bail.
		if ( ! \is_multisite() || \is_subdomain_install() ) {
			return $robots_txt;
		}

		$sitemaps_enabled = $this->get_xml_sitemaps_enabled();
		$sitemaps         = "\n\n";
		foreach ( $sitemaps_enabled as $blog_id => $is_sitemap_enabled ) {
			if ( ! $is_sitemap_enabled ) {
				continue;
			}

			$sitemap = 'Sitemap: ' . \esc_url( \get_home_url( $blog_id, 'sitemap_index.xml' ) );

			// If our sitemap is already output, bail.
			if ( \strpos( $robots_txt, $sitemap ) !== false ) {
				continue;
			};

			$sitemaps .= $sitemap . "\n";
		}

		return \trim( $robots_txt ) . $sitemaps;
	}

	/**
	 * Retrieves whether the XML sitemaps are enabled, keyed by blog ID.
	 *
	 * @return array
	 */
	protected function get_xml_sitemaps_enabled() {
		$is_allowed = $this->is_sitemap_allowed();
		$blog_ids   = $this->get_blog_ids();
		$is_enabled = [];
		foreach ( $blog_ids as $blog_id ) {
			$is_enabled[ $blog_id ] = $is_allowed && $this->is_sitemap_enabled_for( $blog_id );
		}

		return $is_enabled;
	}

	/**
	 * Retrieves whether the sitemap is allowed on a sub site.
	 *
	 * @return bool
	 */
	protected function is_sitemap_allowed() {
		$options = \get_network_option( null, 'wpseo_ms' );
		if ( ! $options || ! isset( $options['allow_enable_xml_sitemap'] ) ) {
			// Default is enabled.
			return true;
		}

		return (bool) $options['allow_enable_xml_sitemap'];
	}

	/**
	 * Retrieves whether the sitemap is enabled on a site.
	 *
	 * @param int $blog_id The blog ID.
	 *
	 * @return bool
	 */
	protected function is_sitemap_enabled_for( $blog_id ) {
		if ( ! $this->is_yoast_active_on( $blog_id ) ) {
			return false;
		}

		$options = \get_blog_option( $blog_id, 'wpseo' );
		if ( ! $options || ! isset( $options['enable_xml_sitemap'] ) ) {
			// Default is enabled.
			return true;
		}

		return (bool) $options['enable_xml_sitemap'];
	}

	/**
	 * Determines whether Yoast SEO is active.
	 *
	 * @param int $blog_id The blog ID.
	 *
	 * @return bool
	 */
	protected function is_yoast_active_on( $blog_id ) {
		return \in_array( 'wordpress-seo/wp-seo.php', (array) \get_blog_option( $blog_id, 'active_plugins', [] ), true ) || $this->is_yoast_active_for_network();
	}

	/**
	 * Determines whether Yoast SEO is active for the entire network.
	 *
	 * @return bool
	 */
	protected function is_yoast_active_for_network() {
		$plugins = \get_network_option( null, 'active_sitewide_plugins' );
		if ( isset( $plugins['wordpress-seo/wp-seo.php'] ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Retrieves the blog IDs of public, "active" sites on the network.
	 *
	 * @return array
	 */
	protected function get_blog_ids() {
		$criteria = [
			'archived'   => 0,
			'deleted'    => 0,
			'public'     => 1,
			'spam'       => 0,
			'fields'     => 'ids',
			'network_id' => \get_current_network_id(),
		];

		return \get_sites( $criteria );
	}
}
