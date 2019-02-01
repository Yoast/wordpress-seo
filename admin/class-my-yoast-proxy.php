<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * @class WPSEO_MyYoast_Proxy Loads the MyYoast proxy.
 *
 * This class registers a proxy page on `admin.php`. Which is reached with the `page=PAGE_IDENTIFIER` parameter.
 * It will read external files and serves them like they are located locally.
 */
class WPSEO_My_Yoast_Proxy implements WPSEO_WordPress_Integration {

	/**
	 * The page identifier used in WordPress to register the MyYoast proxy page.
	 *
	 * @var string
	 */
	const PAGE_IDENTIFIER = 'wpseo_myyoast_proxy';

	/**
	 * The cache control's max age. Used in the header of a successful proxy response.
	 *
	 * @var int
	 */
	const CACHE_CONTROL_MAX_AGE = DAY_IN_SECONDS;

	/**
	 * Registers the hooks when the user is on the right page.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_hooks() {
		if ( ! $this->is_proxy_page() ) {
			return;
		}

		// Register the page for the proxy.
		add_action( 'admin_menu', array( $this, 'add_proxy_page' ) );
		add_action( 'admin_init', array( $this, 'handle_proxy_page' ) );
	}

	/**
	 * Registers the proxy page. It does not actually add a link to the dashboard.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function add_proxy_page() {
		add_dashboard_page( '', '', 'read', self::PAGE_IDENTIFIER, '' );
	}

	/**
	 * Renders the requested proxy page and exits to prevent the WordPress UI from loading.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function handle_proxy_page() {
		$this->render_proxy_page();
		exit;
	}

	/**
	 * Renders the requested proxy page.
	 *
	 * This is separated from the exits to be able to test it.
	 *
	 * @return void
	 */
	public function render_proxy_page() {
		$proxy_options = $this->determine_proxy_options();
		if ( $proxy_options === array() ) {
			// Do not accept any other file than implemented.
			$this->set_header( 'HTTP/1.0 501 Requested file not implemented' );
			return;
		}

		if ( $this->should_load_url_directly() ) {
			$this->set_header( 'Content-Type: ' . $proxy_options['content_type'] );
			$this->set_header( 'Cache-Control: max-age=' . self::CACHE_CONTROL_MAX_AGE );

			/*
			 * If an error occurred, fallback to the next proxy method (`wp_remote_get`).
			 * Otherwise, we are done here.
			 */
			if ( $this->load_url( $proxy_options['url'] ) ) {
				return;
			}

			/*
			 * Due to the minimum PHP of 5.2 the header_remove() function can not be used here.
			 * Overwrite the headers instead.
			 */
			$this->set_header( 'Content-Type: text/plain' );
			$this->set_header( 'Cache-Control: max-age=0' );
		}

		$response = wp_remote_get( $proxy_options['url'] );
		if ( $response instanceof WP_Error ) {
			$this->set_header( 'HTTP/1.0 500 Unable to retrieve file from MyYoast' );
			return;
		}

		if ( wp_remote_retrieve_response_code( $response ) === 200 ) {
			$this->set_header( 'Content-Type: ' . $proxy_options['content_type'] );
			$this->set_header( 'Cache-Control: max-age=' . self::CACHE_CONTROL_MAX_AGE );
			echo wp_remote_retrieve_body( $response );
			return;
		}

		$this->set_header( 'HTTP/1.0 500 Received unexpected response from MyYoast' );

		// Prevent the WordPress UI from loading.
		return;
	}

	/**
	 * Tries to load the given url.
	 *
	 * @see https://php.net/manual/en/function.readfile.php
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $url The filename to read.
	 *
	 * @return bool False if an error occurred.
	 */
	protected function load_url( $url ) {
		return readfile( $url ) !== false;
	}

	/**
	 * Determines the proxy options based on the file and plugin version arguments.
	 *
	 * When the file is known it returns an array like this:
	 * <code>
	 * $array = array(
	 * 	'content_type' => 'the content type'
	 * 	'url'          => 'the url, possibly with the plugin version'
	 * )
	 * </code>
	 *
	 * @return array Empty for an unknown file. See format above for known files.
	 */
	protected function determine_proxy_options() {
		if ( $this->get_proxy_file() === 'research-webworker' ) {
			return array(
				'content_type' => 'text/javascript; charset=UTF-8',
				'url'          => 'https://my.yoast.com/api/downloads/file/analysis-worker?plugin_version=' . $this->get_plugin_version(),
			);
		}

		return array();
	}

	/**
	 * Checks the PHP configuration of allow_url_fopen.
	 *
	 * @codeCoverageIgnore
	 *
	 * @see https://php.net/manual/en/filesystem.configuration.php#ini.allow-url-fopen
	 *
	 * @return bool True when the PHP configuration allows for url loading via readfile.
	 */
	protected function should_load_url_directly() {
		return ! ! ini_get( 'allow_url_fopen' );
	}

	/**
	 * Checks if the current page is the MyYoast proxy page.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return bool True when the page request parameter equals the proxy page.
	 */
	protected function is_proxy_page() {
		return filter_input( INPUT_GET, 'page' ) === self::PAGE_IDENTIFIER;
	}

	/**
	 * Returns the proxy file from the HTTP request parameters.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return string The sanitized file request parameter.
	 */
	protected function get_proxy_file() {
		return filter_input( INPUT_GET, 'file', FILTER_SANITIZE_STRING );
	}

	/**
	 * Returns the plugin version from the HTTP request parameters.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return string The sanitized plugin_version request parameter.
	 */
	protected function get_plugin_version() {
		$plugin_version = filter_input( INPUT_GET, 'plugin_version', FILTER_SANITIZE_STRING );
		// Replace slashes to secure against requiring a file from another path.
		$plugin_version = str_replace( array( '/', '\\' ), '_', $plugin_version );

		return $plugin_version;
	}

	/**
	 * Sets the HTTP header.
	 *
	 * This is a tiny helper function to enable better testing.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $header The header to set.
	 *
	 * @return void
	 */
	protected function set_header( $header ) {
		header( $header );
	}
}
