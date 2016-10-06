<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_Handler
 */
class WPSEO_Redirect_Handler {

	/**
	 * @var string The options where the URL redirects are stored.
	 */
	private $normal_option_name = 'wpseo-premium-redirects-export-plain';

	/**
	 * @var string The option name where the regex redirects are stored.
	 */
	private $regex_option_name  = 'wpseo-premium-redirects-export-regex';

	/**
	 * @var string The URL that is called at the moment.
	 */
	private $request_url = '';

	/**
	 * @var array Array where there redirects will stored.
	 */
	private $redirects;

	/**
	 * @var array The matches parts of the URL in case of a matched regex redirect.
	 */
	private $url_matches = array();

	/**
	 * @var string Sets the error template to include.
	 */
	private $template_include;

	/**
	 * @var bool Is the current page being redirected.
	 */
	private $is_redirected = false;

	/**
	 * Constructor
	 */
	public function __construct() {
		// Only handle the redirect when the option for php redirects is enabled.
		if ( $this->load_php_redirects() ) {
			// Set the requested URL.
			$this->set_request_url();

			// Check the normal redirects.
			$this->handle_normal_redirects();

			// Check the regex redirects.
			if ( $this->is_redirected === false ) {
				$this->handle_regex_redirects();
			}

			return;
		}
	}

	/**
	 * Handle the 410 status code
	 */
	public function do_410() {
		$this->set_404();
		status_header( 410 );
	}

	/**
	 * Handle the 451 status code
	 */
	public function do_451() {
		$is_include_hook_set = $this->set_template_include_hook( '451' );

		if ( ! $is_include_hook_set ) {
			$this->set_404();
		}
		status_header( 451, 'Unavailable For Legal Reasons' );
	}

	/**
	 * Returns the template that should be included.
	 *
	 * @param string $template The template that will included before executing hook.
	 *
	 * @return string
	 */
	public function set_template_include( $template ) {
		if ( ! empty( $this->template_include ) ) {
			return $this->template_include;
		}

		return $template;
	}

	/**
	 * Replace the $regex vars with URL matches
	 *
	 * @param array $matches Array with the matches from the matching redirect.
	 *
	 * @return string
	 */
	public function format_regex_redirect_url( $matches ) {
		$arr_key = substr( $matches[0], 1 );

		if ( isset( $this->url_matches[ $arr_key ] ) ) {
			return $this->url_matches[ $arr_key ];
		}

		return '';
	}

	/**
	 * Sets the wp_query to 404 when this is an object
	 */
	public function set_404() {
		global $wp_query;

		if ( is_object( $wp_query ) ) {
			$wp_query->is_404 = true;
		}
	}

	/**
	 * Sets the request URL and sanitize the slashes for it.
	 */
	private function set_request_url() {
		$this->request_url = $this->get_request_uri();
	}

	/**
	 * Checking if current URL matches a normal redirect
	 */
	private function handle_normal_redirects() {
		// Setting the redirects.
		$this->redirects = $this->get_redirects( $this->normal_option_name );

		// Trim the slashes, to match the variants of a request URL (Like: url, /url, /url/, url/).
		$request_url = $this->request_url;
		if ( $request_url !== '/' ) {
			$request_url = trim( $request_url, '/' );
		}

		// Get the URL and doing the redirect.
		if ( $redirect_url = $this->find_url( $request_url ) ) {
			$this->do_redirect( $this->redirect_url( $redirect_url['url'] ), $redirect_url['type'] );
		}
	}

	/**
	 * Check if current URL matches a regex redirect
	 */
	private function handle_regex_redirects() {
		// Setting the redirects.
		$this->redirects = $this->get_redirects( $this->regex_option_name );

		foreach ( $this->redirects as $regex => $redirect ) {
			// Check if the URL matches the $regex.
			$this->match_regex_redirect( $regex, $redirect );
		}
	}

	/**
	 * Check if request URL matches one of the regex redirects
	 *
	 * @param string $regex    The reqular expression to match.
	 * @param array  $redirect The URL that might be matched with the regex.
	 */
	private function match_regex_redirect( $regex, array $redirect ) {
		// Escape the ` because we use ` to delimit the regex to prevent faulty redirects.
		$regex = str_replace( '`', '\\`', $regex );

		// Suppress warning: a faulty redirect will give a warning and not a an exception. So we can't catch it.
		// See issue: https://github.com/Yoast/wordpress-seo-premium/issues/662.
		if ( 1 === @preg_match( "`{$regex}`", $this->request_url, $this->url_matches ) ) {

			// Replace the $regex vars with URL matches.
			$redirect_url = preg_replace_callback( '/\$[0-9]+/', array(
				$this,
				'format_regex_redirect_url',
			), $redirect['url'] );
			$this->do_redirect( $this->redirect_url( $redirect_url ), $redirect['type'] );
		}

		// Reset url_matches.
		$this->url_matches = array();
	}

	/**
	 * Getting the redirects from the options
	 *
	 * @param string $option The option name that wil be fetched.
	 *
	 * @return array
	 */
	private function get_redirects( $option ) {
		static $redirects;

		if ( $redirects === null  ) {
			$redirects = $this->get_redirects_from_options();
		}

		if ( ! empty( $redirects[ $option ] ) ) {
			return unserialize( $redirects[ $option ] );
		}

		return array();
	}

	/**
	 * Check if URL exists in the redirects.
	 *
	 * @param string $url The needed URL.
	 *
	 * @return bool|string
	 */
	private function find_url( $url ) {
		if ( $redirect_url = $this->search( $url ) ) {
			return $redirect_url;
		}

		return $this->find_url_fallback( $url );
	}

	/**
	 * Search for the given URL in the redirects array.
	 *
	 * @param string $url The URL to search for.
	 *
	 * @return string|bool
	 */
	private function search( $url ) {
		if ( ! empty( $this->redirects[ $url ] ) ) {
			return $this->redirects[ $url ];
		}

		return false;
	}

	/**
	 * Fallback if requested URL isn't found. This will add a slash if there isn't a slash or it will remove a
	 * trailing slash when there isn't one.
	 *
	 * @discuss: Maybe we should add slashes to all the values we handle instead of using a fallback
	 *
	 * @param string $url The URL that have to be matched.
	 *
	 * @return bool|string
	 */
	private function find_url_fallback( $url ) {
		// Check if last character is a slash, if so trim it.
		if ( substr( $url, -1 ) === '/' && $redirect_url = $this->search( rtrim( $url, '/' ) ) ) {
			return $redirect_url;
		}

		// There was no trailing slash, so add this to check.
		if ( $redirect_url = $this->search( $url . '/' ) ) {
			return $redirect_url;
		}

		return false;
	}

	/**
	 * Getting the redirect URL by given $url
	 *
	 * @param string $redirect_url The URL that has to be redirected.
	 *
	 * @return string
	 */
	private function redirect_url( $redirect_url ) {
		if ( '/' === substr( $redirect_url, 0, 1 ) ) {
			$redirect_url = home_url( $redirect_url );
		}

		return $redirect_url;
	}

	/**
	 * Perform the redirect
	 *
	 * @param string $redirect_url  The target URL.
	 * @param string $redirect_type The type of the redirect.
	 */
	private function do_redirect( $redirect_url, $redirect_type ) {

		$this->is_redirected = true;

		if ( 410 === $redirect_type ) {
			add_action( 'wp', array( $this, 'do_410' ) );
			return;
		}

		if ( 451 === $redirect_type ) {
			add_action( 'wp', array( $this, 'do_451' ) );
			return;
		}

		if ( ! function_exists( 'wp_redirect' ) ) {
			require_once( ABSPATH . 'wp-includes/pluggable.php' );
		}

		/**
		 * Filter: 'wpseo_add_x_redirect' - can be used to remove the X-Redirect-By header Yoast SEO creates
		 * (only available in Yoast SEO Premium, defaults to true, which is adding it)
		 *
		 * @api bool
		 */
		if ( apply_filters( 'wpseo_add_x_redirect', true ) === true ) {
			header( 'X-Redirect-By: Yoast SEO Premium' );
		}

		wp_redirect( $this->parse_target_url( $redirect_url ), $redirect_type );
		exit;
	}

	/**
	 * Parses the target URL.
	 *
	 * @param string $target_url The URL to parse. When there isn't found a scheme, just parse it based on the home URL.
	 *
	 * @return string
	 */
	private function parse_target_url( $target_url ) {
		$scheme = parse_url( $target_url, PHP_URL_SCHEME );
		if ( empty( $scheme ) ) {
			// Add slash to target URL when permalink structure ends with a slash.
			if ( WPSEO_Redirect_Util::requires_trailing_slash( $target_url ) ) {
				$target_url = trailingslashit( $target_url );
			}

			if ( is_multisite() ) {
				$blog_details = get_blog_details();
				if ( $blog_details && ! empty( $blog_details->path ) ) {
					$blog_path = ltrim( $blog_details->path, '/' );
					if ( ! empty( $blog_path ) &&  0 === strpos( $target_url, $blog_path ) ) {
						$target_url = substr( $target_url, strlen( $blog_path ) );
					}
				}
			}

			$target_url = home_url( $target_url );
		}

		return $target_url;

	}

	/**
	 * Getting the redirects from the option table in the database.
	 *
	 * @return array
	 */
	private function get_redirects_from_options() {
		global $wpdb;

		$redirects = array();
		$results   = $wpdb->get_results( "SELECT option_name, option_value FROM  {$wpdb->options} WHERE option_name = '{$this->normal_option_name}' || option_name = '{$this->regex_option_name}'" );
		foreach ( $results as $result ) {
			$redirects[ $result->option_name ] = $result->option_value;
		}

		return $redirects;
	}

	/**
	 * Check if we should load the php redirects.
	 *
	 * @return bool
	 */
	private function load_php_redirects() {

		if ( defined( 'WPSEO_DISABLE_PHP_REDIRECTS' ) && true === WPSEO_DISABLE_PHP_REDIRECTS ) {
			return false;
		}

		global $wpdb;
		if ( $options = $wpdb->get_row( "SELECT option_value FROM {$wpdb->options} WHERE option_name = 'wpseo_redirect'" ) ) {
			$options = unserialize( $options->option_value );

			if ( ! empty( $options['disable_php_redirect'] ) && $options['disable_php_redirect'] === 'on' ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Sets the hook for setting the template include. This is the file that we want to show.
	 *
	 * @param string $template_to_set The template to look for..
	 *
	 * @return bool
	 */
	private function set_template_include_hook( $template_to_set ) {
		$this->template_include = get_query_template( $template_to_set );
		if ( ! empty( $this->template_include ) ) {
			add_filter( 'template_include', array( $this, 'set_template_include' ) );

			return true;
		}

		return false;
	}

	/**
	 * Gets the quest uri, with fallback for super global
	 *
	 * @return string
	 */
	private function get_request_uri() {
		$options     = array( 'options' => array( 'default' => '' ) );
		$request_uri = filter_input( INPUT_SERVER, 'REQUEST_URI', FILTER_SANITIZE_URL, $options );

		// Because there isn't an usable value, try the fallback.
		if ( empty( $request_uri ) ) {
			$request_uri = filter_var( $_SERVER['REQUEST_URI'], FILTER_SANITIZE_URL, $options );
		}

		return rawurldecode( $request_uri );
	}
}
