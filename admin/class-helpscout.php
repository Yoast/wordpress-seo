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
	private $beacon_id;

	/**
	 * The pages where the beacon is loaded.
	 *
	 * @var array
	 */
	private $pages;

	/**
	 * The products the beacon is loaded for.
	 *
	 * @var array
	 */
	private $products;

	/**
	 * WPSEO_HelpScout constructor.
	 *
	 * @param string $beacon_id The beacon id.
	 * @param array  $pages     The pages where the beacon is loaded.
	 * @param array  $products  The products the beacon is loaded for.
	 */
	public function __construct( $beacon_id, array $pages, array $products ) {
		$this->beacon_id = $beacon_id;
		$this->pages     = $pages;
		$this->products  = $products;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		if ( ! $this->is_beacon_page() ) {
			return;
		}

		add_action( 'admin_footer', array( $this, 'output_beacon_js' ) );
	}

	/**
	 * Outputs a small piece of javascript for the beacon
	 */
	public function output_beacon_js() {
		echo '<script type="text/javascript">!function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});</script>';
		printf( '<script type="text/javascript">window.Beacon(\'init\', \'%1$s\')</script>', $this->beacon_id );
		printf( '<script type="text/javascript">window.Beacon(\'session-data\', %1$s )</script>', $this->get_session_data() );

	}

	/**
	 * Checks if the current page is a page containing the beacon.
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
		$page      = filter_input( INPUT_GET, 'page' );
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
	private function get_session_data() {
		/** @noinspection PhpUnusedLocalVariableInspection */
		// Do not make these strings translatable! They are for our support agents, the user won't see them!
		$current_user = wp_get_current_user();

		$data = array(
			'name'                                                     => trim( $current_user->user_firstname . ' ' . $current_user->user_lastname ),
			'email'                                                    => $current_user->user_email,
			'WordPress Version'                                        => $this->get_wordpress_version(),
			'Server'                                                   => $this->get_server_info(),
			'<a href="' . admin_url( 'themes.php' ) . '">Theme</a>'    => $this->get_theme_info(),
			'<a href="' . admin_url( 'plugins.php' ) . '">Plugins</a>' => $this->get_active_plugins(),
		);

		if ( ! empty( $this->products ) ) {
			$addon_manager = new WPSEO_Addon_Manager();
			foreach ( $this->products as $product ) {
				$subscription = $addon_manager->get_subscription( $product );

				$data[ $subscription->product->name ] = $this->get_product_info( $subscription );
			}
		}

		return wp_json_encode( $data );
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

		$fields_to_use = array(
			'IP'       => 'ip',
			'Hostname' => 'Hostname',
			'OS'       => 'os',
			'PHP'      => 'PhpVersion',
			'CURL'     => 'CurlVersion',
		);

		$server_data['CurlVersion'] = $server_data['CurlVersion']['version'] . '(SSL Support' . $server_data['CurlVersion']['sslSupport'] . ')';

		$server_info = '<table>';

		foreach ( $fields_to_use as $label => $field_to_use ) {
			$server_info .= sprintf( '<tr><td>%1$s</td><td>%2$s</td></tr>', esc_html( $label ), esc_html( $server_data[ $field_to_use ] ) );
		}

		$server_info .= '</table>';

		return $server_info;
	}

	/**
	 * Returns info about the Yoast SEO plugin version and license.
	 *
	 * @param object $product  The product.
	 *
	 * @return string The product info.
	 */
	private function get_product_info( $plugin ) {
		if ( empty( $plugin ) ) {
			return '';
		}

		$product_info = '<table>';
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
