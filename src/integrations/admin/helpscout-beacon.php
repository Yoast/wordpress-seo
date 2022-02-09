<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Addon_Manager;
use WPSEO_Admin_Asset_Manager;
use WPSEO_Tracking_Server_Data;
use WPSEO_Utils;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class WPSEO_HelpScout
 */
class HelpScout_Beacon implements Integration_Interface {

	/**
	 * The id for the beacon.
	 *
	 * @var string
	 */
	protected $beacon_id = '2496aba6-0292-489c-8f5d-1c0fba417c2f';

	/**
	 * The id for the beacon for users that have tracking on.
	 *
	 * @var string
	 */
	protected $beacon_id_tracking_users = '6b8e74c5-aa81-4295-b97b-c2a62a13ea7f';

	/**
	 * The products the beacon is loaded for.
	 *
	 * @var array
	 */
	protected $products = [];

	/**
	 * Whether to asks the user's consent before loading in HelpScout.
	 *
	 * @var bool
	 */
	protected $ask_consent = true;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options;

	/**
	 * The array of pages we need to show the beacon on with their respective beacon IDs.
	 *
	 * @var array
	 */
	protected $pages_ids;

	/**
	 * The array of pages we need to show the beacon on.
	 *
	 * @var array
	 */
	protected $base_pages = [
		'wpseo_dashboard',
		'wpseo_titles',
		'wpseo_search_console',
		'wpseo_social',
		'wpseo_tools',
		'wpseo_licenses',
		'wpseo_workouts',
	];

	/**
	 * The current admin page
	 *
	 * @var string
	 */
	protected $page;

	/**
	 * The asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Headless_Rest_Endpoints_Enabled_Conditional constructor.
	 *
	 * @param Options_Helper            $options       The options helper.
	 * @param WPSEO_Admin_Asset_Manager $asset_manager The asset manager.
	 */
	public function __construct( Options_Helper $options, WPSEO_Admin_Asset_Manager $asset_manager ) {
		$this->options       = $options;
		$this->asset_manager = $asset_manager;
		$this->ask_consent   = ! $this->options->get( 'tracking' );
		$this->page          = \filter_input( \INPUT_GET, 'page', \FILTER_SANITIZE_STRING );

		foreach ( $this->base_pages as $page ) {
			if ( $this->ask_consent ) {
				// We want to be able to show surveys to people who have tracking on, so we give them a different beacon.
				$this->pages_ids[ $page ] = $this->beacon_id_tracking_users;
			}
			else {
				$this->pages_ids[ $page ] = $this->beacon_id;
			}
		}
	}

	/**
	 * {@inheritDoc}
	 */
	public function register_hooks() {
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_help_scout_script' ] );
		\add_action( 'admin_footer', [ $this, 'output_beacon_js' ] );
	}

	/**
	 * Enqueues the HelpScout script.
	 */
	public function enqueue_help_scout_script() {
		// Make sure plugins can filter in their "stuff", before we check whether we're outputting a beacon.
		$this->filter_settings();
		if ( ! $this->is_beacon_page() ) {
			return;
		}

		$this->asset_manager->enqueue_script( 'help-scout-beacon' );
	}

	/**
	 * Outputs a small piece of javascript for the beacon.
	 */
	public function output_beacon_js() {
		if ( ! $this->is_beacon_page() ) {
			return;
		}

		\printf(
			'<script type="text/javascript">window.%1$s(\'%2$s\', %3$s)</script>',
			( $this->ask_consent ) ? 'wpseoHelpScoutBeaconConsent' : 'wpseoHelpScoutBeacon',
			\esc_html( $this->pages_ids[ $this->page ] ),
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaping done in format_json_encode.
			WPSEO_Utils::format_json_encode( (array) $this->get_session_data() )
		);
	}

	/**
	 * Checks if the current page is a page containing the beacon.
	 *
	 * @return bool
	 */
	private function is_beacon_page() {
		$return = false;
		if ( ! empty( $this->page ) && $GLOBALS['pagenow'] === 'admin.php' && isset( $this->pages_ids[ $this->page ] ) ) {
			$return = true;
		}

		/**
		 * Filter: 'wpseo_helpscout_show_beacon' - Allows overriding whether we show the HelpScout beacon.
		 *
		 * @api bool - Whether we show the beacon or not.
		 */
		return \apply_filters( 'wpseo_helpscout_show_beacon', $return );
	}

	/**
	 * Retrieves the identifying data.
	 *
	 * @return string The data to pass as identifying data.
	 */
	protected function get_session_data() {
		$current_user = \wp_get_current_user();

		// Do not make these strings translatable! They are for our support agents, the user won't see them!
		$data = [
			'name'               => \trim( $current_user->user_firstname . ' ' . $current_user->user_lastname ),
			'email'              => $current_user->user_email,
			'Is multisite'       => \is_multisite() ? 'True' : 'False',
			'WordPress Version'  => $this->get_wordpress_version(),
			'Server'             => $this->get_server_info(),
			'Theme'              => $this->get_theme_info(),
			'Plugins'            => $this->get_active_plugins(),
		];

		if ( ! empty( $this->products ) ) {
			$addon_manager = new WPSEO_Addon_Manager();
			foreach ( $this->products as $product ) {
				$subscription = $addon_manager->get_subscription( $product );

				if ( ! $subscription ) {
					continue;
				}

				$data[ $subscription->product->name ] = $this->get_product_info( $subscription );
			}
		}

		return WPSEO_Utils::format_json_encode( $data );
	}

	/**
	 * Returns basic info about the server software.
	 *
	 * @return string
	 */
	private function get_server_info() {
		$server_tracking_data = new WPSEO_Tracking_Server_Data();
		$server_data          = $server_tracking_data->get();
		$server_data          = $server_data['server'];

		$fields_to_use = [
			'IP'       => 'ip',
			'Hostname' => 'Hostname',
			'OS'       => 'os',
			'PHP'      => 'PhpVersion',
			'CURL'     => 'CurlVersion',
		];

		$server_data['CurlVersion'] = $server_data['CurlVersion']['version'] . '(SSL Support' . $server_data['CurlVersion']['sslSupport'] . ')';

		$server_info = '<table>';

		foreach ( $fields_to_use as $label => $field_to_use ) {
			if ( isset( $server_data[ $field_to_use ] ) ) {
				$server_info .= \sprintf( '<tr><td>%1$s</td><td>%2$s</td></tr>', \esc_html( $label ), \esc_html( $server_data[ $field_to_use ] ) );
			}
		}

		$server_info .= '</table>';

		return $server_info;
	}

	/**
	 * Returns info about the Yoast SEO plugin version and license.
	 *
	 * @param object $plugin The plugin.
	 *
	 * @return string The product info.
	 */
	private function get_product_info( $plugin ) {
		if ( empty( $plugin ) ) {
			return '';
		}

		$product_info  = '<table>';
		$product_info .= '<tr><td>Version</td><td>' . $plugin->product->version . '</td></tr>';
		$product_info .= '<tr><td>Expiration date</td><td>' . $plugin->expiry_date . '</td></tr>';
		$product_info .= '</table>';

		return $product_info;
	}

	/**
	 * Returns the WordPress version + a suffix if current WP is multi site.
	 *
	 * @return string The WordPress version string.
	 */
	private function get_wordpress_version() {
		global $wp_version;

		$wordpress_version = $wp_version;
		if ( \is_multisite() ) {
			$wordpress_version .= ' MULTI-SITE';
		}

		return $wordpress_version;
	}

	/**
	 * Returns a formatted HTML string for the current theme.
	 *
	 * @return string The theme info as string.
	 */
	private function get_theme_info() {
		$theme = \wp_get_theme();

		$theme_info = \sprintf(
			'<a href="%1$s">%2$s</a> v%3$s by %4$s',
			\esc_attr( $theme->display( 'ThemeURI' ) ),
			\esc_html( $theme->display( 'Name' ) ),
			\esc_html( $theme->display( 'Version' ) ),
			\esc_html( $theme->display( 'Author' ) )
		);

		if ( \is_child_theme() ) {
			$theme_info .= \sprintf( '<br />Child theme of: %1$s', \esc_html( $theme->display( 'Template' ) ) );
		}

		return $theme_info;
	}

	/**
	 * Returns a formatted HTML list of all active plugins.
	 *
	 * @return string The active plugins.
	 */
	private function get_active_plugins() {
		$updates_available = \get_site_transient( 'update_plugins' );

		$active_plugins = '';
		foreach ( \wp_get_active_and_valid_plugins() as $plugin ) {
			$plugin_data = \get_plugin_data( $plugin );
			$plugin_file = \str_replace( \trailingslashit( \WP_PLUGIN_DIR ), '', $plugin );

			if ( isset( $updates_available->response[ $plugin_file ] ) ) {
				$active_plugins .= '<i class="icon-close1"></i> ';
			}

			$active_plugins .= \sprintf(
				'<a href="%1$s">%2$s</a> v%3$s',
				\esc_attr( $plugin_data['PluginURI'] ),
				\esc_html( $plugin_data['Name'] ),
				\esc_html( $plugin_data['Version'] )
			);
		}

		return $active_plugins;
	}

	/**
	 * Returns the conditionals based on which this integration should be active.
	 *
	 * @return array The array of conditionals.
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Allows filtering of the HelpScout settings. Hooked to admin_head to prevent timing issues, not too early, not too late.
	 */
	protected function filter_settings() {
		/**
		 * Filter: 'wpseo_helpscout_beacon_settings' - Allows overriding the HelpScout beacon settings.
		 *
		 * @api string - The HelpScout beacon settings.
		 */
		$filterable_helpscout_setting = [
			'products'  => $this->products,
			'pages_ids' => $this->pages_ids,
		];

		$helpscout_settings = \apply_filters( 'wpseo_helpscout_beacon_settings', $filterable_helpscout_setting );

		$this->products  = $helpscout_settings['products'];
		$this->pages_ids = $helpscout_settings['pages_ids'];
	}
}
