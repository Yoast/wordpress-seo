<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Class WPSEO_HelpScout
 */
class WPSEO_HelpScout implements WPSEO_WordPress_Integration {

	/**
	 * The id for the beacon.
	 *
	 * @var string
	 */
	protected $beacon_id;

	/**
	 * The pages where the beacon is loaded.
	 *
	 * @var array
	 */
	protected $pages;

	/**
	 * The products the beacon is loaded for.
	 *
	 * @var array
	 */
	protected $products;

	/**
	 * Whether to asks the user's consent before loading in HelpScout.
	 *
	 * @var bool
	 */
	protected $ask_consent;

	/**
	 * WPSEO_HelpScout constructor.
	 *
	 * @param string $beacon_id   The beacon id.
	 * @param array  $pages       The pages where the beacon is loaded.
	 * @param array  $products    The products the beacon is loaded for.
	 * @param bool   $ask_consent Optional. Whether to ask for consent before loading in HelpScout.
	 */
	public function __construct( $beacon_id, array $pages, array $products, $ask_consent = false ) {
		$this->beacon_id   = $beacon_id;
		$this->pages       = $pages;
		$this->products    = $products;
		$this->ask_consent = $ask_consent;
	}

	/**
	 * {@inheritDoc}
	 */
	public function register_hooks() {
		if ( ! $this->is_beacon_page() ) {
			return;
		}

		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_help_scout_script' ] );
		add_action( 'admin_footer', [ $this, 'output_beacon_js' ] );
	}

	/**
	 * Enqueues the HelpScout script.
	 */
	public function enqueue_help_scout_script() {
		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_script( 'help-scout-beacon' );
	}

	/**
	 * Outputs a small piece of javascript for the beacon.
	 */
	public function output_beacon_js() {
		printf(
			'<script type="text/javascript">window.%1$s(\'%2$s\', %3$s)</script>',
			( $this->ask_consent ) ? 'wpseoHelpScoutBeaconConsent' : 'wpseoHelpScoutBeacon',
			esc_html( $this->beacon_id ),
			WPSEO_Utils::format_json_encode( $this->get_session_data() )
		);
	}

	/**
	 * Checks if the current page is a page containing the beacon.
	 *
	 * @return bool
	 */
	private function is_beacon_page() {
		return in_array( $this->get_current_page(), $this->pages, true );
	}

	/**
	 * Retrieves the value of the current page.
	 *
	 * @return string The current page.
	 */
	private function get_current_page() {
		$page = filter_input( INPUT_GET, 'page' );
		if ( isset( $page ) && $page !== false ) {
			return $page;
		}

		return '';
	}

	/**
	 * Retrieves the identifying data.
	 *
	 * @return string The data to pass as identifying data.
	 */
	protected function get_session_data() {
		/** @noinspection PhpUnusedLocalVariableInspection */
		// Do not make these strings translatable! They are for our support agents, the user won't see them!
		$current_user = wp_get_current_user();

		$data = [
			'name'                                                  => trim( $current_user->user_firstname . ' ' . $current_user->user_lastname ),
			'email'                                                 => $current_user->user_email,
			'WordPress Version'                                     => $this->get_wordpress_version(),
			'Server'                                                => $this->get_server_info(),
			'<a href="' . admin_url( 'themes.php' ) . '">Theme</a>' => $this->get_theme_info(),
			'<a href="' . admin_url( 'plugins.php' ) . '">Plugins</a>' => $this->get_active_plugins(),
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
				$server_info .= sprintf( '<tr><td>%1$s</td><td>%2$s</td></tr>', esc_html( $label ), esc_html( $server_data[ $field_to_use ] ) );
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
		if ( is_multisite() ) {
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
		$theme = wp_get_theme();

		$theme_info = sprintf(
			'<a href="%1$s">%2$s</a> v%3$s by %4$s',
			esc_attr( $theme->display( 'ThemeURI' ) ),
			esc_html( $theme->display( 'Name' ) ),
			esc_html( $theme->display( 'Version' ) ),
			esc_html( $theme->display( 'Author' ) )
		);

		if ( is_child_theme() ) {
			$theme_info .= sprintf( '<br />Child theme of: %1$s', esc_html( $theme->display( 'Template' ) ) );
		}

		return $theme_info;
	}

	/**
	 * Returns a formatted HTML list of all active plugins.
	 *
	 * @return string The active plugins.
	 */
	private function get_active_plugins() {
		$updates_available = get_site_transient( 'update_plugins' );

		$active_plugins = '';
		foreach ( wp_get_active_and_valid_plugins() as $plugin ) {
			$plugin_data = get_plugin_data( $plugin );
			$plugin_file = str_replace( trailingslashit( WP_PLUGIN_DIR ), '', $plugin );

			if ( isset( $updates_available->response[ $plugin_file ] ) ) {
				$active_plugins .= '<i class="icon-close1"></i> ';
			}

			$active_plugins .= sprintf(
				'<a href="%1$s">%2$s</a> v%3$s',
				esc_attr( $plugin_data['PluginURI'] ),
				esc_html( $plugin_data['Name'] ),
				esc_html( $plugin_data['Version'] )
			);
		}

		return $active_plugins;
	}
}
