<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_Handler.
 */
class WPSEO_Redirect_Handler {

	/**
	 * Array where the redirects will stored.
	 *
	 * @var array
	 */
	protected $redirects;

	/**
	 * The matches parts of the URL in case of a matched regex redirect.
	 *
	 * @var array
	 */
	protected $url_matches = array();

	/**
	 * Is the current page being redirected.
	 *
	 * @var bool
	 */
	protected $is_redirected = false;

	/**
	 * The options where the URL redirects are stored.
	 *
	 * @var string
	 */
	private $normal_option_name = 'wpseo-premium-redirects-export-plain';

	/**
	 * The option name where the regex redirects are stored.
	 *
	 * @var string
	 */
	private $regex_option_name = 'wpseo-premium-redirects-export-regex';

	/**
	 * The URL that is called at the moment.
	 *
	 * @var string
	 */
	private $request_url = '';

	/**
	 * Sets the error template to include.
	 *
	 * @var string
	 */
	protected $template_file_path;

	/**
	 * Loads the redirect handler.
	 *
	 * @return void
	 */
	public function load() {
		// Only handle the redirect when the option for php redirects is enabled.
		if ( ! $this->load_php_redirects() ) {
			return;
		}

		// Set the requested URL.
		$this->set_request_url();

		// Check the normal redirects.
		$this->handle_normal_redirects( $this->request_url );

		// Check the regex redirects.
		if ( $this->is_redirected() === false ) {
			$this->handle_regex_redirects();
		}
	}

	/**
	 * Handles the 410 status code.
	 *
	 * @return void
	 */
	public function do_410() {
		$this->set_404();
		$this->status_header( 410 );
	}

	/**
	 * Handles the 451 status code.
	 *
	 * @return void
	 */
	public function do_451() {
		$is_include_hook_set = $this->set_template_include_hook( '451' );

		if ( ! $is_include_hook_set ) {
			$this->set_404();
		}

		$this->status_header( 451, 'Unavailable For Legal Reasons' );
	}

	/**
	 * Returns the template that should be included.
	 *
	 * @param string $template The template that will included before executing hook.
	 *
	 * @return string Returns the template that should be included.
	 */
	public function set_template_include( $template ) {
		if ( ! empty( $this->template_file_path ) ) {
			return $this->template_file_path;
		}

		return $template;
	}

	/**
	 * Replaces the $regex vars with URL matches.
	 *
	 * @param array $matches Array with the matches from the matching redirect.
	 *
	 * @return string The replaced URL.
	 */
	public function format_regex_redirect_url( $matches ) {
		$arr_key = substr( $matches[0], 1 );

		if ( isset( $this->url_matches[ $arr_key ] ) ) {
			return $this->url_matches[ $arr_key ];
		}

		return '';
	}

	/**
	 * Sets the wp_query to 404 when this is an object.
	 *
	 * @return void
	 */
	public function set_404() {
		$wp_query         = $this->get_wp_query();
		$wp_query->is_404 = true;
	}

	/**
	 * Checks if the current URL matches a normal redirect.
	 *
	 * @param string $request_url The request url to look for.
	 *
	 * @return void
	 */
	protected function handle_normal_redirects( $request_url ) {
		// Setting the redirects.
		$redirects       = $this->get_redirects( $this->normal_option_name );
		$this->redirects = $this->normalize_redirects( $redirects );

		// Trim the slashes, to match the variants of a request URL (Like: url, /url, /url/, url/).
		if ( $request_url !== '/' ) {
			$request_url = trim( $request_url, '/' );
		}

		// Get the URL and doing the redirect.
		$redirect_url = $this->find_url( $request_url );
		if ( ! empty( $redirect_url ) ) {
			$this->is_redirected = true;
			$this->do_redirect( $redirect_url['url'], $redirect_url['type'] );
		}
	}

	/**
	 * Checks if the current URL matches a regex.
	 *
	 * @return void
	 */
	protected function handle_regex_redirects() {
		// Setting the redirects.
		$this->redirects = $this->get_redirects( $this->regex_option_name );

		foreach ( $this->redirects as $regex => $redirect ) {
			// Check if the URL matches the $regex.
			$this->match_regex_redirect( $regex, $redirect );
		}
	}

	/**
	 * Check if request URL matches one of the regex redirects.
	 *
	 * @param string $regex    The reqular expression to match.
	 * @param array  $redirect The URL that might be matched with the regex.
	 *
	 * @return void
	 */
	protected function match_regex_redirect( $regex, array $redirect ) {
		/*
		 * Escape the ` because we use ` to delimit the regex to prevent faulty redirects.
		 *
		 * Explicitly chosen not to use `preg_quote` because we need to be able to parse
		 * user provided regular expression syntax.
		 */
		$regex = str_replace( '`', '\\`', $regex );

		// Suppress warning: a faulty redirect will give a warning and not an exception. So we can't catch it.
		// See issue: https://github.com/Yoast/wordpress-seo-premium/issues/662.
		if ( 1 === @preg_match( "`{$regex}`", $this->request_url, $this->url_matches ) ) {

			// Replace the $regex vars with URL matches.
			$redirect_url = preg_replace_callback( '/\$[0-9]+/', array(
				$this,
				'format_regex_redirect_url',
			), $redirect['url'] );

			$this->do_redirect( $redirect_url, $redirect['type'] );
		}

		// Reset url_matches.
		$this->url_matches = array();
	}

	/**
	 * Gets the redirects from the options.
	 *
	 * @param string $option The option name that wil be fetched.
	 *
	 * @return array Returns the redirects for the given option.
	 */
	protected function get_redirects( $option ) {
		$redirects = $this->get_redirects_from_options();

		if ( ! empty( $redirects[ $option ] ) ) {
			return $redirects[ $option ];
		}

		return array();
	}

	/**
	 * Performs the redirect.
	 *
	 * @param string $redirect_url  The target URL.
	 * @param string $redirect_type The type of the redirect.
	 *
	 * @return void
	 */
	protected function do_redirect( $redirect_url, $redirect_type ) {
		$redirect_types_without_target = array( 410, 451 );
		if ( in_array( $redirect_type, $redirect_types_without_target, true ) ) {
			$this->handle_redirect_without_target( $redirect_type );

			return;
		}

		$this->add_redirect_by_header();

		$this->redirect( $this->parse_target_url( $redirect_url ), $redirect_type );
	}

	/**
	 * Checks if a redirect has been executed.
	 *
	 * @return bool Whether a redirect has been executed.
	 */
	protected function is_redirected() {
		return $this->is_redirected === true;
	}

	/**
	 * Checks if we should load the PHP redirects.
	 *
	 * If Apache or NginX configuration is selected, don't load PHP redirects.
	 *
	 * @return bool True if PHP redirects should be loaded and used.
	 */
	protected function load_php_redirects() {

		if ( defined( 'WPSEO_DISABLE_PHP_REDIRECTS' ) && true === WPSEO_DISABLE_PHP_REDIRECTS ) {
			return false;
		}

		global $wpdb;

		$options = $wpdb->get_row( "SELECT option_value FROM {$wpdb->options} WHERE option_name = 'wpseo_redirect'" );
		// If the option is not set, load the PHP redirects.
		if ( $options === null ) {
			return true;
		}

		$options = maybe_unserialize( $options->option_value );

		// If the PHP redirects are disabled intentionally, return false.
		if ( ! empty( $options['disable_php_redirect'] ) && $options['disable_php_redirect'] === 'on' ) {
			return false;
		}

		// PHP redirects are the enabled method of redirecting.
		return true;
	}

	/**
	 * Gets the request URI, with fallback for super global.
	 *
	 * @return string
	 */
	protected function get_request_uri() {
		$options     = array( 'options' => array( 'default' => '' ) );
		$request_uri = filter_input( INPUT_SERVER, 'REQUEST_URI', FILTER_SANITIZE_URL, $options );

		// Because there isn't an usable value, try the fallback.
		if ( empty( $request_uri ) && isset( $_SERVER['REQUEST_URI'] ) ) {
			$request_uri = filter_var( $_SERVER['REQUEST_URI'], FILTER_SANITIZE_URL, $options );
		}

		$request_uri = $this->strip_subdirectory( $request_uri );

		return rawurldecode( $request_uri );
	}

	/**
	 * Normalizes the redirects by raw url decoding the origin.
	 *
	 * @param array $redirects The redirects to normalize.
	 *
	 * @return array The normalized redirects.
	 */
	protected function normalize_redirects( $redirects ) {
		$normalized_redirects = array();

		foreach ( $redirects as $origin => $redirect ) {
			$normalized_redirects[ rawurldecode( $origin ) ] = $redirect;
		}

		return $normalized_redirects;
	}

	/**
	 * Sets the request URL and sanitize the slashes for it.
	 *
	 * @return void
	 */
	protected function set_request_url() {
		$this->request_url = $this->get_request_uri();
	}

	/**
	 * Finds the URL in the redirects.
	 *
	 * @param string $url The needed URL.
	 *
	 * @return bool|string The found url or false if not found.
	 */
	protected function find_url( $url ) {
		$redirect_url = $this->search( $url );
		if ( ! empty( $redirect_url ) ) {
			return $redirect_url;
		}

		return $this->find_url_fallback( $url );
	}

	/**
	 * Searches for the given URL in the redirects array.
	 *
	 * @param string $url The URL to search for.
	 *
	 * @return string|bool The found url or false if not found.
	 */
	protected function search( $url ) {
		if ( ! empty( $this->redirects[ $url ] ) ) {
			return $this->redirects[ $url ];
		}

		return false;
	}

	/**
	 * Searches for alternatives with slashes if requested URL isn't found.
	 *
	 * This will add a slash if there isn't a slash or it will remove a trailing slash when there isn't one.
	 *
	 * @discuss: Maybe we should add slashes to all the values we handle instead of using a fallback.
	 *
	 * @param string $url The URL that have to be matched.
	 *
	 * @return bool|string The found url or false if not found.
	 */
	protected function find_url_fallback( $url ) {
		$no_trailing_slash = rtrim( $url, '/' );

		$checks = array(
			'no_trailing_slash' => $no_trailing_slash,
			'trailing_slash'    => $no_trailing_slash . '/',
		);

		foreach ( $checks as $check ) {
			$redirect_url = $this->search( $check );
			if ( ! empty( $redirect_url ) ) {
				return $redirect_url;
			}
		}

		return false;
	}

	/**
	 * Parses the target URL.
	 *
	 * @param string $target_url The URL to parse. When there isn't found a scheme, just parse it based on the home URL.
	 *
	 * @return string The parsed url.
	 */
	protected function parse_target_url( $target_url ) {
		if ( $this->has_url_scheme( $target_url ) ) {
			return $target_url;
		}

		$target_url = $this->trailingslashit( $target_url );
		$target_url = $this->format_for_multisite( $target_url );

		return $this->home_url( $target_url );
	}

	/**
	 * Checks if given url has a scheme.
	 *
	 * @param string $url The url to check.
	 *
	 * @return bool True when url has scheme.
	 */
	protected function has_url_scheme( $url ) {
		$scheme = wp_parse_url( $url, PHP_URL_SCHEME );

		return ! empty( $scheme );
	}

	/**
	 * Determines whether the target URL ends with a slash and adds one if necessary.
	 *
	 * @param string $target_url The url to format.
	 *
	 * @return string The url with trailing slash.
	 */
	protected function trailingslashit( $target_url ) {
		// Adds slash to target URL when permalink structure ends with a slash.
		if ( $this->requires_trailing_slash( $target_url ) ) {
			return trailingslashit( $target_url );
		}

		return $target_url;
	}

	/**
	 * Formats the target url for the multisite if needed.
	 *
	 * @param string $target_url The url to format.
	 *
	 * @return string The formatted url.
	 */
	protected function format_for_multisite( $target_url ) {
		if ( ! is_multisite() ) {
			return $target_url;
		}

		$blog_details = get_blog_details();
		if ( $blog_details && ! empty( $blog_details->path ) ) {
			$blog_path = ltrim( $blog_details->path, '/' );
			if ( ! empty( $blog_path ) && 0 === strpos( $target_url, $blog_path ) ) {
				$target_url = substr( $target_url, strlen( $blog_path ) );
			}
		}

		return $target_url;
	}

	/**
	 * Gets the redirect URL by given URL.
	 *
	 * @param string $redirect_url The URL that has to be redirected.
	 *
	 * @return string The redirect url.
	 */
	protected function home_url( $redirect_url ) {
		$redirect_url = $this->strip_subdirectory( $redirect_url );

		return home_url( $redirect_url );
	}

	/**
	 * Strips the subdirectory from the given url.
	 *
	 * @param string $url The url to strip the subdirectory from.
	 *
	 * @return string The url with the stripped subdirectory.
	 */
	protected function strip_subdirectory( $url ) {
		return WPSEO_Redirect_Util::strip_base_url_path_from_url( $this->get_home_url(), $url );
	}

	/**
	 * Returns the URL PATH from the home url.
	 *
	 * @return string|null The url path or null if there isn't one.
	 */
	protected function get_home_url() {
		return home_url();
	}

	/**
	 * Returns the redirects from the option table in the database.
	 *
	 * @return array The stored redirects.
	 */
	protected function get_redirects_from_options() {
		static $redirects;

		if ( $redirects !== null ) {
			return $redirects;
		}

		global $wpdb;

		$redirects = array();
		$results   = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT option_name, option_value
					FROM  {$wpdb->options}
					WHERE option_name = %s || option_name = %s",
				$this->normal_option_name,
				$this->regex_option_name
			)
		);
		foreach ( $results as $result ) {
			$redirects[ $result->option_name ] = maybe_unserialize( $result->option_value );
		}

		return $redirects;
	}

	/**
	 * Sets the hook for setting the template include. This is the file that we want to show.
	 *
	 * @param string $template_to_set The template to look for.
	 *
	 * @return bool True when template should be included.
	 */
	protected function set_template_include_hook( $template_to_set ) {
		$this->template_file_path = $this->get_query_template( $template_to_set );
		if ( ! empty( $this->template_file_path ) ) {
			add_filter( 'template_include', array( $this, 'set_template_include' ) );

			return true;
		}

		return false;
	}

	/**
	 * Wraps the WordPress status_header function.
	 *
	 * @param int    $code        HTTP status code.
	 * @param string $description Optional. A custom description for the HTTP status.
	 *
	 * @return void
	 */
	protected function status_header( $code, $description = '' ) {
		status_header( $code, $description );
	}

	/**
	 * Returns instance of WP_Query.
	 *
	 * @return WP_Query Instance of WP_Query.
	 */
	protected function get_wp_query() {
		global $wp_query;

		if ( is_object( $wp_query ) ) {
			return $wp_query;
		}

		return new WP_Query();
	}

	/**
	 * Handles the redirects without a target by setting the needed hooks.
	 *
	 * @param string $redirect_type The type of the redirect.
	 *
	 * @return void
	 */
	protected function handle_redirect_without_target( $redirect_type ) {
		if ( 410 === $redirect_type ) {
			add_action( 'wp', array( $this, 'do_410' ) );
		}

		if ( 451 === $redirect_type ) {
			add_action( 'wp', array( $this, 'do_451' ) );
		}
	}

	/**
	 * Adds a X-Redirect-By hook if needed.
	 *
	 * @return void
	 */
	protected function add_redirect_by_header() {
		/**
		 * Filter: 'wpseo_add_x_redirect' - can be used to remove the X-Redirect-By header Yoast SEO creates
		 * (only available in Yoast SEO Premium, defaults to true, which is adding it)
		 *
		 * @api bool
		 */
		if ( apply_filters( 'wpseo_add_x_redirect', true ) === true ) {
			header( 'X-Redirect-By: Yoast SEO Premium' );
		}
	}

	/**
	 * Wrapper method for doing the actual redirect.
	 *
	 * @param string $location The path to redirect to.
	 * @param int    $status   Status code to use.
	 *
	 * @return void
	 */
	protected function redirect( $location, $status = 302 ) {
		if ( ! function_exists( 'wp_redirect' ) ) {
			require_once ABSPATH . 'wp-includes/pluggable.php';
		}

		wp_redirect( $location, $status );
		exit;
	}

	/**
	 * Returns whether or not a target URL requires a trailing slash.
	 *
	 * @param string $target_url The target URL to check.
	 *
	 * @return bool True when trailing slash is required.
	 */
	protected function requires_trailing_slash( $target_url ) {
		return WPSEO_Redirect_Util::requires_trailing_slash( $target_url );
	}

	/**
	 * Returns the query template.
	 *
	 * @param string $filename Filename without extension.
	 *
	 * @return string Full path to template file.
	 */
	protected function get_query_template( $filename ) {
		return get_query_template( $filename );
	}
}
