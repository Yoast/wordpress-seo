<?php /** @noinspection DuplicatedCode */

namespace Yoast\WP\SEO\Services\Importing;

/**
 * Detects plugin conflicts.
 */
class Conflicting_Plugins_Service {
	/**
	 * The plugins that are known to cause functional conflicts with YoastSEO.
	 *
	 * NOTE: When updating this list, be sure to update the arrays in WPSEO_Plugin_Conflict too.
	 *
	 * @var array
	 */
	protected $conflicting_plugins = [
		 // Open_graph plugins.

		'2-click-socialmedia-buttons/2-click-socialmedia-buttons.php',
		// 2 Click Social Media Buttons.
		'add-link-to-facebook/add-link-to-facebook.php',
		// Add Link to Facebook.
		'add-meta-tags/add-meta-tags.php',
		// Add Meta Tags.
		'easy-facebook-share-thumbnails/esft.php',
		// Easy Facebook Share Thumbnail.
		'facebook/facebook.php',
		// Facebook (official plugin).
		'facebook-awd/AWD_facebook.php',
		// Facebook AWD All in one.
		'facebook-featured-image-and-open-graph-meta-tags/fb-featured-image.php',
		// Facebook Featured Image & OG Meta Tags.
		'facebook-meta-tags/facebook-metatags.php',
		// Facebook Meta Tags.
		'wonderm00ns-simple-facebook-open-graph-tags/wonderm00n-open-graph.php',
		// Facebook Open Graph Meta Tags for WordPress.
		'facebook-revised-open-graph-meta-tag/index.php',
		// Facebook Revised Open Graph Meta Tag.
		'facebook-thumb-fixer/_facebook-thumb-fixer.php',
		// Facebook Thumb Fixer.
		'facebook-and-digg-thumbnail-generator/facebook-and-digg-thumbnail-generator.php',
		// Fedmich's Facebook Open Graph Meta.
		'network-publisher/networkpub.php',
		// Network Publisher.
		'nextgen-facebook/nextgen-facebook.php',
		// NextGEN Facebook OG.
		'opengraph/opengraph.php',
		// Open Graph.
		'open-graph-protocol-framework/open-graph-protocol-framework.php',
		// Open Graph Protocol Framework.
		'seo-facebook-comments/seofacebook.php',
		// SEO Facebook Comments.
		'sexybookmarks/sexy-bookmarks.php',
		// Shareaholic.
		'shareaholic/sexy-bookmarks.php',
		// Shareaholic.
		'sharepress/sharepress.php',
		// SharePress.
		'simple-facebook-connect/sfc.php',
		// Simple Facebook Connect.
		'social-discussions/social-discussions.php',
		// Social Discussions.
		'social-sharing-toolkit/social_sharing_toolkit.php',
		// Social Sharing Toolkit.
		'socialize/socialize.php',
		// Socialize.
		'only-tweet-like-share-and-google-1/tweet-like-plusone.php',
		// Tweet, Like, Google +1 and Share.
		'wordbooker/wordbooker.php',
		// Wordbooker.
		'wpsso/wpsso.php',
		// WordPress Social Sharing Optimization.
		'wp-caregiver/wp-caregiver.php',
		// WP Caregiver.
		'wp-facebook-like-send-open-graph-meta/wp-facebook-like-send-open-graph-meta.php',
		// WP Facebook Like Send & Open Graph Meta.
		'wp-facebook-open-graph-protocol/wp-facebook-ogp.php',
		// WP Facebook Open Graph protocol.
		'wp-ogp/wp-ogp.php',
		// WP-OGP.
		'zoltonorg-social-plugin/zosp.php',
		// Zolton.org Social Plugin.

		// XML sitemaps plugins.

		'google-sitemap-plugin/google-sitemap-plugin.php',
		// Google Sitemap (BestWebSoft).
		'xml-sitemaps/xml-sitemaps.php',
		// XML Sitemaps (Denis de Bernardy and Mike Koepke).
		'bwp-google-xml-sitemaps/bwp-simple-gxs.php',
		// Better WordPress Google XML Sitemaps (Khang Minh).
		'google-sitemap-generator/sitemap.php',
		// Google XML Sitemaps (Arne Brachhold).
		'xml-sitemap-feed/xml-sitemap.php',
		// XML Sitemap & Google News feeds (RavanH).
		'google-monthly-xml-sitemap/monthly-xml-sitemap.php',
		// Google Monthly XML Sitemap (Andrea Pernici).
		'simple-google-sitemap-xml/simple-google-sitemap-xml.php',
		// Simple Google Sitemap XML (iTx Technologies).
		'another-simple-xml-sitemap/another-simple-xml-sitemap.php',
		// Another Simple XML Sitemap.
		'xml-maps/google-sitemap.php',
		// Xml Sitemap (Jason Martens).
		'google-xml-sitemap-generator-by-anton-dachauer/adachauer-google-xml-sitemap.php',
		// Google XML Sitemap Generator by Anton Dachauer (Anton Dachauer).
		'wp-xml-sitemap/wp-xml-sitemap.php',
		// WP XML Sitemap (Team Vivacity).
		'sitemap-generator-for-webmasters/sitemap.php',
		// Sitemap Generator for Webmasters (iwebslogtech).
		'xml-sitemap-xml-sitemapcouk/xmls.php',
		// XML Sitemap - XML-Sitemap.co.uk (Simon Hancox).
		'sewn-in-xml-sitemap/sewn-xml-sitemap.php',
		// Sewn In XML Sitemap (jcow).
		'rps-sitemap-generator/rps-sitemap-generator.php',
		// RPS Sitemap Generator (redpixelstudios).

		// Cloaking plugins.

		'rs-head-cleaner/rs-head-cleaner.php',
		// RS Head Cleaner Plus https://wordpress.org/plugins/rs-head-cleaner/.
		'rs-head-cleaner-lite/rs-head-cleaner-lite.php',
		// RS Head Cleaner Lite https://wordpress.org/plugins/rs-head-cleaner-lite/.

		// SEO plugins.

		'all-in-one-seo-pack/all_in_one_seo_pack.php',
		// All in One SEO Pack.
		'seo-ultimate/seo-ultimate.php',
		// SEO Ultimate.
		'seo-by-rank-math/rank-math.php',
		// Rank Math.
	];

	public function detect_conflicting_plugins() {
		$all_active_plugins = $this->get_active_plugins();

		// Search for active plugins.
		return $this->get_active_conflicting_plugins( $all_active_plugins );
	}

	/**
	 * Deactivates the specified plugin(s) if any, or the entire list of known conflicting plugins.
	 *
	 * @param string|array|false $plugins (optional) The plugin filename, or array of plugin filenames, to deactivate.
	 */
	public function deactivate_conflicting_plugins( $plugins = false ) {
		// If no plugins are specified, deactivate any known conflicting plugins that are active.
		if ( ! $plugins ) {
			$plugins = $this->detect_conflicting_plugins();
		}

		// In case of a single plugin, wrap it in an array.
		if ( \is_string( $plugins ) ) {
			$plugins = [ $plugins ];
		}

		if ( ! is_array( $plugins ) ) {
			return;
		}

		// Deactivate all specified plugins across the network, while retaining their deactivation hook
		\deactivate_plugins( $plugins, false, true );
	}

	/**
	 * Loop through the list of known conflicting plugins to check if one of the plugins is active.
	 *
	 * @param array $all_active_plugins All plugins loaded by WordPress.
	 *
	 * @return array The array of activated conflicting plugins.
	 */
	protected function get_active_conflicting_plugins( $all_active_plugins ) {
		$active_conflicting_plugins = [];

		foreach ( $this->conflicting_plugins as $plugin ) {
			if ( \in_array( $plugin, $all_active_plugins, true ) ) {

				if ( ! \in_array( $plugin, $active_conflicting_plugins, true ) ) {
					$active_conflicting_plugins[] = $plugin;
				}
			}
		}

		return $active_conflicting_plugins;
	}

	/**
	 * Get a list of all plugins active in the current WordPress instance.
	 *
	 * @return false|array The names of all active plugins.
	 */
	protected function get_active_plugins() {
		// request a list of active plugins from WordPress.
		$all_active_plugins = \get_option('active_plugins');

		return $this->ignore_deactivating_plugin( $all_active_plugins );
	}

	/**
	 * While deactivating a plugin, we should ignore the plugin currently being deactivated.
	 *
	 * @param array $all_active_plugins All plugins currently loaded by WordPress.
	 *
	 * @return array The remaining active plugins.
	 */
	protected function ignore_deactivating_plugin( $all_active_plugins ) {
		if ( \filter_input( INPUT_GET, 'action' ) === 'deactivate' ) {
			$deactivated_plugin = \filter_input( INPUT_GET, 'plugin' );
			$key_to_remove      = \array_search( $deactivated_plugin, $all_active_plugins, true );

			if ( $key_to_remove ) {
				unset( $all_active_plugins[ $key_to_remove ] );
			}
		}

		return $all_active_plugins;
	}
}
