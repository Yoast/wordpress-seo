<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 * @since   1.8.0
 */

/**
 * Group of utility methods for use by WPSEO.
 * All methods are static, this is just a sort of namespacing class wrapper.
 */
class WPSEO_Utils {

	/**
	 * Whether the PHP filter extension is enabled.
	 *
	 * @since 1.8.0
	 *
	 * @var bool $has_filters
	 */
	public static $has_filters;

	/**
	 * Check whether file editing is allowed for the .htaccess and robots.txt files.
	 *
	 * {@internal current_user_can() checks internally whether a user is on wp-ms and adjusts accordingly.}}
	 *
	 * @since 1.8.0
	 *
	 * @return bool
	 */
	public static function allow_system_file_edit() {
		$allowed = true;

		if ( current_user_can( 'edit_files' ) === false ) {
			$allowed = false;
		}

		/**
		 * Filter: 'wpseo_allow_system_file_edit' - Allow developers to change whether the editing of
		 * .htaccess and robots.txt is allowed.
		 *
		 * @api bool $allowed Whether file editing is allowed.
		 */

		return apply_filters( 'wpseo_allow_system_file_edit', $allowed );
	}

	/**
	 * Check if the web server is running on Apache.
	 *
	 * @since 1.8.0
	 *
	 * @return bool
	 */
	public static function is_apache() {
		if ( ! isset( $_SERVER['SERVER_SOFTWARE'] ) ) {
			return false;
		}

		$software = sanitize_text_field( wp_unslash( $_SERVER['SERVER_SOFTWARE'] ) );

		return stripos( $software, 'apache' ) !== false;
	}

	/**
	 * Check if the web server is running on Nginx.
	 *
	 * @since 1.8.0
	 *
	 * @return bool
	 */
	public static function is_nginx() {
		if ( ! isset( $_SERVER['SERVER_SOFTWARE'] ) ) {
			return false;
		}

		$software = sanitize_text_field( wp_unslash( $_SERVER['SERVER_SOFTWARE'] ) );

		return stripos( $software, 'nginx' ) !== false;
	}

	/**
	 * Check whether a url is relative.
	 *
	 * @since 1.8.0
	 *
	 * @param string $url URL string to check.
	 *
	 * @return bool
	 */
	public static function is_url_relative( $url ) {
		return YoastSEO()->helpers->url->is_relative( $url );
	}

	/**
	 * Recursively trim whitespace round a string value or of string values within an array.
	 * Only trims strings to avoid typecasting a variable (to string).
	 *
	 * @since 1.8.0
	 *
	 * @param mixed $value Value to trim or array of values to trim.
	 *
	 * @return mixed Trimmed value or array of trimmed values.
	 */
	public static function trim_recursive( $value ) {
		if ( is_string( $value ) ) {
			$value = trim( $value );
		}
		elseif ( is_array( $value ) ) {
			$value = array_map( [ __CLASS__, 'trim_recursive' ], $value );
		}

		return $value;
	}

	/**
	 * Translates a decimal analysis score into a textual one.
	 *
	 * @since 1.8.0
	 *
	 * @param int  $val       The decimal score to translate.
	 * @param bool $css_value Whether to return the i18n translated score or the CSS class value.
	 *
	 * @return string
	 */
	public static function translate_score( $val, $css_value = true ) {
		$seo_rank = WPSEO_Rank::from_numeric_score( $val );

		if ( $css_value ) {
			return $seo_rank->get_css_class();
		}

		return $seo_rank->get_label();
	}

	/**
	 * Emulate the WP native sanitize_text_field function in a %%variable%% safe way.
	 *
	 * @link https://core.trac.wordpress.org/browser/trunk/src/wp-includes/formatting.php for the original.
	 *
	 * Sanitize a string from user input or from the db.
	 *
	 * - Check for invalid UTF-8;
	 * - Convert single < characters to entity;
	 * - Strip all tags;
	 * - Remove line breaks, tabs and extra white space;
	 * - Strip octets - BUT DO NOT REMOVE (part of) VARIABLES WHICH WILL BE REPLACED.
	 *
	 * @since 1.8.0
	 *
	 * @param string $value String value to sanitize.
	 *
	 * @return string
	 */
	public static function sanitize_text_field( $value ) {
		$filtered = wp_check_invalid_utf8( $value );

		if ( strpos( $filtered, '<' ) !== false ) {
			$filtered = wp_pre_kses_less_than( $filtered );
			// This will strip extra whitespace for us.
			$filtered = wp_strip_all_tags( $filtered, true );
		}
		else {
			$filtered = trim( preg_replace( '`[\r\n\t ]+`', ' ', $filtered ) );
		}

		$found = false;
		while ( preg_match( '`[^%](%[a-f0-9]{2})`i', $filtered, $match ) ) {
			$filtered = str_replace( $match[1], '', $filtered );
			$found    = true;
		}
		unset( $match );

		if ( $found ) {
			// Strip out the whitespace that may now exist after removing the octets.
			$filtered = trim( preg_replace( '` +`', ' ', $filtered ) );
		}

		/**
		 * Filter a sanitized text field string.
		 *
		 * @since WP 2.9.0
		 *
		 * @param string $filtered The sanitized string.
		 * @param string $str      The string prior to being sanitized.
		 */
		return apply_filters( 'sanitize_text_field', $filtered, $value ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- Using WP native filter.
	}

	/**
	 * Sanitize a url for saving to the database.
	 * Not to be confused with the old native WP function.
	 *
	 * @since 1.8.0
	 *
	 * @param string $value             String URL value to sanitize.
	 * @param array  $allowed_protocols Optional set of allowed protocols.
	 *
	 * @return string
	 */
	public static function sanitize_url( $value, $allowed_protocols = [ 'http', 'https' ] ) {

		$url   = '';
		$parts = wp_parse_url( $value );

		if ( isset( $parts['scheme'], $parts['host'] ) ) {
			$url = $parts['scheme'] . '://';

			if ( isset( $parts['user'] ) ) {
				$url .= rawurlencode( $parts['user'] );
				$url .= isset( $parts['pass'] ) ? ':' . rawurlencode( $parts['pass'] ) : '';
				$url .= '@';
			}

			$parts['host'] = preg_replace(
				'`[^a-z0-9-.:\[\]\\x80-\\xff]`',
				'',
				strtolower( $parts['host'] )
			);

			$url .= $parts['host'] . ( isset( $parts['port'] ) ? ':' . intval( $parts['port'] ) : '' );
		}

		if ( isset( $parts['path'] ) && strpos( $parts['path'], '/' ) === 0 ) {
			$path = explode( '/', wp_strip_all_tags( $parts['path'] ) );
			$path = self::sanitize_encoded_text_field( $path );
			$url .= implode( '/', $path );
		}

		if ( ! $url ) {
			return '';
		}

		if ( isset( $parts['query'] ) ) {
			wp_parse_str( $parts['query'], $parsed_query );

			$parsed_query = array_combine(
				self::sanitize_encoded_text_field( array_keys( $parsed_query ) ),
				self::sanitize_encoded_text_field( array_values( $parsed_query ) )
			);

			$url = add_query_arg( $parsed_query, $url );
		}

		if ( isset( $parts['fragment'] ) ) {
			$url .= '#' . self::sanitize_encoded_text_field( $parts['fragment'] );
		}

		if ( strpos( $url, '%' ) !== false ) {
			$url = preg_replace_callback(
				'`%[a-fA-F0-9]{2}`',
				function( $octects ) {
					return strtolower( $octects[0] );
				},
				$url
			);
		}

		return esc_url_raw( $url, $allowed_protocols );
	}

	/**
	 * Decode, sanitize and encode the array of strings or the string.
	 *
	 * @since 13.3
	 *
	 * @param array|string $value The value to sanitize and encode.
	 *
	 * @return array|string The sanitized value.
	 */
	public static function sanitize_encoded_text_field( $value ) {
		if ( is_array( $value ) ) {
			return array_map( [ __CLASS__, 'sanitize_encoded_text_field' ], $value );
		}

		return rawurlencode( sanitize_text_field( rawurldecode( $value ) ) );
	}

	/**
	 * Validate a value as boolean.
	 *
	 * @since 1.8.0
	 *
	 * @param mixed $value Value to validate.
	 *
	 * @return bool
	 */
	public static function validate_bool( $value ) {
		if ( ! isset( self::$has_filters ) ) {
			self::$has_filters = extension_loaded( 'filter' );
		}

		if ( self::$has_filters ) {
			return filter_var( $value, FILTER_VALIDATE_BOOLEAN );
		}
		else {
			return self::emulate_filter_bool( $value );
		}
	}

	/**
	 * Cast a value to bool.
	 *
	 * @since 1.8.0
	 *
	 * @param mixed $value Value to cast.
	 *
	 * @return bool
	 */
	public static function emulate_filter_bool( $value ) {
		$true  = [
			'1',
			'true',
			'True',
			'TRUE',
			'y',
			'Y',
			'yes',
			'Yes',
			'YES',
			'on',
			'On',
			'ON',
		];
		$false = [
			'0',
			'false',
			'False',
			'FALSE',
			'n',
			'N',
			'no',
			'No',
			'NO',
			'off',
			'Off',
			'OFF',
		];

		if ( is_bool( $value ) ) {
			return $value;
		}
		elseif ( is_int( $value ) && ( $value === 0 || $value === 1 ) ) {
			return (bool) $value;
		}
		elseif ( ( is_float( $value ) && ! is_nan( $value ) ) && ( $value === (float) 0 || $value === (float) 1 ) ) {
			return (bool) $value;
		}
		elseif ( is_string( $value ) ) {
			$value = trim( $value );
			if ( in_array( $value, $true, true ) ) {
				return true;
			}
			elseif ( in_array( $value, $false, true ) ) {
				return false;
			}
			else {
				return false;
			}
		}

		return false;
	}

	/**
	 * Validate a value as integer.
	 *
	 * @since 1.8.0
	 *
	 * @param mixed $value Value to validate.
	 *
	 * @return int|bool Int or false in case of failure to convert to int.
	 */
	public static function validate_int( $value ) {
		if ( ! isset( self::$has_filters ) ) {
			self::$has_filters = extension_loaded( 'filter' );
		}

		if ( self::$has_filters ) {
			return filter_var( $value, FILTER_VALIDATE_INT );
		}
		else {
			return self::emulate_filter_int( $value );
		}
	}

	/**
	 * Cast a value to integer.
	 *
	 * @since 1.8.0
	 *
	 * @param mixed $value Value to cast.
	 *
	 * @return int|bool
	 */
	public static function emulate_filter_int( $value ) {
		if ( is_int( $value ) ) {
			return $value;
		}
		elseif ( is_float( $value ) ) {
			// phpcs:ignore WordPress.PHP.StrictComparisons -- Purposeful loose comparison.
			if ( (int) $value == $value && ! is_nan( $value ) ) {
				return (int) $value;
			}
			else {
				return false;
			}
		}
		elseif ( is_string( $value ) ) {
			$value = trim( $value );
			if ( $value === '' ) {
				return false;
			}
			elseif ( ctype_digit( $value ) ) {
				return (int) $value;
			}
			elseif ( strpos( $value, '-' ) === 0 && ctype_digit( substr( $value, 1 ) ) ) {
				return (int) $value;
			}
			else {
				return false;
			}
		}

		return false;
	}

	/**
	 * Clears the WP or W3TC cache depending on which is used.
	 *
	 * @since 1.8.0
	 */
	public static function clear_cache() {
		if ( function_exists( 'w3tc_pgcache_flush' ) ) {
			w3tc_pgcache_flush();
		}
		elseif ( function_exists( 'wp_cache_clear_cache' ) ) {
			wp_cache_clear_cache();
		}
	}

	/**
	 * Clear rewrite rules.
	 *
	 * @since 1.8.0
	 */
	public static function clear_rewrites() {
		delete_option( 'rewrite_rules' );
	}

	/**
	 * Do simple reliable math calculations without the risk of wrong results.
	 *
	 * @link http://floating-point-gui.de/
	 * @link http://php.net/language.types.float.php See the big red warning.
	 *
	 * In the rare case that the bcmath extension would not be loaded, it will return the normal calculation results.
	 *
	 * @since 1.5.0
	 * @since 1.8.0 Moved from stand-alone function to this class.
	 *
	 * @param mixed  $number1   Scalar (string/int/float/bool).
	 * @param string $action    Calculation action to execute. Valid input:
	 *                          '+' or 'add' or 'addition',
	 *                          '-' or 'sub' or 'subtract',
	 *                          '*' or 'mul' or 'multiply',
	 *                          '/' or 'div' or 'divide',
	 *                          '%' or 'mod' or 'modulus'
	 *                          '=' or 'comp' or 'compare'.
	 * @param mixed  $number2   Scalar (string/int/float/bool).
	 * @param bool   $round     Whether or not to round the result. Defaults to false.
	 *                          Will be disregarded for a compare operation.
	 * @param int    $decimals  Decimals for rounding operation. Defaults to 0.
	 * @param int    $precision Calculation precision. Defaults to 10.
	 *
	 * @return mixed Calculation Result or false if either or the numbers isn't scalar or
	 *               an invalid operation was passed.
	 *               - For compare the result will always be an integer.
	 *               - For all other operations, the result will either be an integer (preferred)
	 *                 or a float.
	 */
	public static function calc( $number1, $action, $number2, $round = false, $decimals = 0, $precision = 10 ) {
		static $bc;

		if ( ! is_scalar( $number1 ) || ! is_scalar( $number2 ) ) {
			return false;
		}

		if ( ! isset( $bc ) ) {
			$bc = extension_loaded( 'bcmath' );
		}

		if ( $bc ) {
			$number1 = number_format( $number1, 10, '.', '' );
			$number2 = number_format( $number2, 10, '.', '' );
		}

		$result  = null;
		$compare = false;

		switch ( $action ) {
			case '+':
			case 'add':
			case 'addition':
				$result = ( $bc ) ? bcadd( $number1, $number2, $precision ) /* string */ : ( $number1 + $number2 );
				break;

			case '-':
			case 'sub':
			case 'subtract':
				$result = ( $bc ) ? bcsub( $number1, $number2, $precision ) /* string */ : ( $number1 - $number2 );
				break;

			case '*':
			case 'mul':
			case 'multiply':
				$result = ( $bc ) ? bcmul( $number1, $number2, $precision ) /* string */ : ( $number1 * $number2 );
				break;

			case '/':
			case 'div':
			case 'divide':
				if ( $bc ) {
					$result = bcdiv( $number1, $number2, $precision ); // String, or NULL if right_operand is 0.
				}
				elseif ( $number2 != 0 ) { // phpcs:ignore WordPress.PHP.StrictComparisons -- Purposeful loose comparison.
					$result = ( $number1 / $number2 );
				}

				if ( ! isset( $result ) ) {
					$result = 0;
				}
				break;

			case '%':
			case 'mod':
			case 'modulus':
				if ( $bc ) {
					$result = bcmod( $number1, $number2 ); // String, or NULL if modulus is 0.
				}
				elseif ( $number2 != 0 ) { // phpcs:ignore WordPress.PHP.StrictComparisons -- Purposeful loose comparison.
					$result = ( $number1 % $number2 );
				}

				if ( ! isset( $result ) ) {
					$result = 0;
				}
				break;

			case '=':
			case 'comp':
			case 'compare':
				$compare = true;
				if ( $bc ) {
					$result = bccomp( $number1, $number2, $precision ); // Returns int 0, 1 or -1.
				}
				else {
					// phpcs:ignore WordPress.PHP.StrictComparisons -- Purposeful loose comparison.
					$result = ( $number1 == $number2 ) ? 0 : ( ( $number1 > $number2 ) ? 1 : -1 );
				}
				break;
		}

		if ( isset( $result ) ) {
			if ( $compare === false ) {
				if ( $round === true ) {
					$result = round( floatval( $result ), $decimals );
					if ( $decimals === 0 ) {
						$result = (int) $result;
					}
				}
				else {
					// phpcs:ignore WordPress.PHP.StrictComparisons -- Purposeful loose comparison.
					$result = ( intval( $result ) == $result ) ? intval( $result ) : floatval( $result );
				}
			}

			return $result;
		}

		return false;
	}

	/**
	 * Trim whitespace and NBSP (Non-breaking space) from string.
	 *
	 * @since 2.0.0
	 *
	 * @param string $string String input to trim.
	 *
	 * @return string
	 */
	public static function trim_nbsp_from_string( $string ) {
		$find   = [ '&nbsp;', chr( 0xC2 ) . chr( 0xA0 ) ];
		$string = str_replace( $find, ' ', $string );
		$string = trim( $string );

		return $string;
	}

	/**
	 * Check if a string is a valid datetime.
	 *
	 * @since 2.0.0
	 *
	 * @param string $datetime String input to check as valid input for DateTime class.
	 *
	 * @return bool
	 */
	public static function is_valid_datetime( $datetime ) {
		return YoastSEO()->helpers->date->is_valid_datetime( $datetime );
	}

	/**
	 * Format the URL to be sure it is okay for using as a redirect url.
	 *
	 * This method will parse the URL and combine them in one string.
	 *
	 * @since 2.3.0
	 *
	 * @param string $url URL string.
	 *
	 * @return mixed
	 */
	public static function format_url( $url ) {
		$parsed_url = wp_parse_url( $url );

		$formatted_url = '';
		if ( ! empty( $parsed_url['path'] ) ) {
			$formatted_url = $parsed_url['path'];
		}

		// Prepend a slash if first char != slash.
		if ( stripos( $formatted_url, '/' ) !== 0 ) {
			$formatted_url = '/' . $formatted_url;
		}

		// Append 'query' string if it exists.
		if ( ! empty( $parsed_url['query'] ) ) {
			$formatted_url .= '?' . $parsed_url['query'];
		}

		return apply_filters( 'wpseo_format_admin_url', $formatted_url );
	}

	/**
	 * Retrieves the sitename.
	 *
	 * @since 3.0.0
	 *
	 * @return string
	 */
	public static function get_site_name() {
		return YoastSEO()->helpers->site->get_site_name();
	}

	/**
	 * Check if the current opened page is a Yoast SEO page.
	 *
	 * @since 3.0.0
	 *
	 * @return bool
	 */
	public static function is_yoast_seo_page() {
		return YoastSEO()->helpers->current_page->is_yoast_seo_page();
	}

	/**
	 * Check if the current opened page belongs to Yoast SEO Free.
	 *
	 * @since 3.3.0
	 *
	 * @param string $current_page The current page the user is on.
	 *
	 * @return bool
	 */
	public static function is_yoast_seo_free_page( $current_page ) {
		$yoast_seo_free_pages = [
			'wpseo_dashboard',
			'wpseo_titles',
			'wpseo_social',
			'wpseo_advanced',
			'wpseo_tools',
			'wpseo_search_console',
			'wpseo_licenses',
		];

		return in_array( $current_page, $yoast_seo_free_pages, true );
	}

	/**
	 * Checks if we are in the premium or free plugin.
	 *
	 * @deprecated 16.0
	 * @codeCoverageIgnore
	 *
	 * @return bool True when we are in the premium plugin.
	 */
	public static function is_yoast_seo_premium() {
		_deprecated_function( __FUNCTION__, '16.0', 'YoastSEO()->helpers->product->is_premium' );
		return YoastSEO()->helpers->product->is_premium();
	}

	/**
	 * Determine if Yoast SEO is in development mode?
	 *
	 * Inspired by JetPack (https://github.com/Automattic/jetpack/blob/master/class.jetpack.php#L1383-L1406).
	 *
	 * @since 3.0.0
	 *
	 * @return bool
	 */
	public static function is_development_mode() {
		$development_mode = false;

		if ( defined( 'YOAST_ENVIRONMENT' ) && YOAST_ENVIRONMENT === 'development' ) {
			$development_mode = true;
		}
		elseif ( defined( 'WPSEO_DEBUG' ) ) {
			$development_mode = WPSEO_DEBUG;
		}
		elseif ( site_url() && strpos( site_url(), '.' ) === false ) {
			$development_mode = true;
		}

		/**
		 * Filter the Yoast SEO development mode.
		 *
		 * @since 3.0
		 *
		 * @param bool $development_mode Is Yoast SEOs development mode active.
		 */
		return apply_filters( 'yoast_seo_development_mode', $development_mode );
	}

	/**
	 * Retrieve home URL with proper trailing slash.
	 *
	 * @since 3.3.0
	 *
	 * @param string      $path   Path relative to home URL.
	 * @param string|null $scheme Scheme to apply.
	 *
	 * @return string Home URL with optional path, appropriately slashed if not.
	 */
	public static function home_url( $path = '', $scheme = null ) {
		return YoastSEO()->helpers->url->home( $path, $scheme );
	}

	/**
	 * Checks if the WP-REST-API is available.
	 *
	 * @since 3.6
	 * @since 3.7 Introduced the $minimum_version parameter.
	 *
	 * @param string $minimum_version The minimum version the API should be.
	 *
	 * @return bool Returns true if the API is available.
	 */
	public static function is_api_available( $minimum_version = '2.0' ) {
		return ( defined( 'REST_API_VERSION' )
			&& version_compare( REST_API_VERSION, $minimum_version, '>=' ) );
	}

	/**
	 * Determine whether or not the metabox should be displayed for a post type.
	 *
	 * @param string|null $post_type Optional. The post type to check the visibility of the metabox for.
	 *
	 * @return bool Whether or not the metabox should be displayed.
	 */
	protected static function display_post_type_metabox( $post_type = null ) {
		if ( ! isset( $post_type ) ) {
			$post_type = get_post_type();
		}

		if ( ! isset( $post_type ) || ! WPSEO_Post_Type::is_post_type_accessible( $post_type ) ) {
			return false;
		}

		if ( $post_type === 'attachment' && WPSEO_Options::get( 'disable-attachment' ) ) {
			return false;
		}

		return apply_filters( 'wpseo_enable_editor_features_' . $post_type, WPSEO_Options::get( 'display-metabox-pt-' . $post_type ) );
	}

	/**
	 * Determine whether or not the metabox should be displayed for a taxonomy.
	 *
	 * @param string|null $taxonomy Optional. The post type to check the visibility of the metabox for.
	 *
	 * @return bool Whether or not the metabox should be displayed.
	 */
	protected static function display_taxonomy_metabox( $taxonomy = null ) {
		if ( ! isset( $taxonomy ) || ! in_array( $taxonomy, get_taxonomies( [ 'public' => true ], 'names' ), true ) ) {
			return false;
		}

		return WPSEO_Options::get( 'display-metabox-tax-' . $taxonomy );
	}

	/**
	 * Determines whether the metabox is active for the given identifier and type.
	 *
	 * @param string $identifier The identifier to check for.
	 * @param string $type       The type to check for.
	 *
	 * @return bool Whether or not the metabox is active.
	 */
	public static function is_metabox_active( $identifier, $type ) {
		if ( $type === 'post_type' ) {
			return self::display_post_type_metabox( $identifier );
		}

		if ( $type === 'taxonomy' ) {
			return self::display_taxonomy_metabox( $identifier );
		}

		return false;
	}

	/**
	 * Determines whether the plugin is active for the entire network.
	 *
	 * @return bool Whether or not the plugin is network-active.
	 */
	public static function is_plugin_network_active() {
		static $network_active = null;

		if ( ! is_multisite() ) {
			return false;
		}

		// If a cached result is available, bail early.
		if ( $network_active !== null ) {
			return $network_active;
		}

		$network_active_plugins = wp_get_active_network_plugins();

		// Consider MU plugins and network-activated plugins as network-active.
		$network_active = strpos( wp_normalize_path( WPSEO_FILE ), wp_normalize_path( WPMU_PLUGIN_DIR ) ) === 0
			|| in_array( WP_PLUGIN_DIR . '/' . WPSEO_BASENAME, $network_active_plugins, true );

		return $network_active;
	}

	/**
	 * Gets the type of the current post.
	 *
	 * @return string The post type, or an empty string.
	 */
	public static function get_post_type() {
		global $post;

		if ( isset( $post->post_type ) ) {
			return $post->post_type;
		}
		elseif ( isset( $_GET['post_type'] ) ) {
			return sanitize_text_field( wp_unslash( $_GET['post_type'] ) );
		}

		return '';
	}

	/**
	 * Gets the type of the current page.
	 *
	 * @return string Returns 'post' if the current page is a post edit page. Taxonomy in other cases.
	 */
	public static function get_page_type() {
		global $pagenow;
		if ( WPSEO_Metabox::is_post_edit( $pagenow ) ) {
			return 'post';
		}

		return 'taxonomy';
	}

	/**
	 * Getter for the Adminl10n array. Applies the wpseo_admin_l10n filter.
	 *
	 * @return array The Adminl10n array.
	 */
	public static function get_admin_l10n() {
		$post_type = self::get_post_type();
		$page_type = self::get_page_type();

		$label_object = false;
		$no_index     = false;

		if ( $page_type === 'post' ) {
			$label_object = get_post_type_object( $post_type );
			$no_index     = WPSEO_Options::get( 'noindex-' . $post_type, false );
		}
		else {
			$label_object = WPSEO_Taxonomy::get_labels();

			$taxonomy_slug = filter_input( INPUT_GET, 'taxonomy', FILTER_DEFAULT, [ 'options' => [ 'default' => '' ] ] );
			$no_index      = WPSEO_Options::get( 'noindex-tax-' . $taxonomy_slug, false );
		}

		$wpseo_admin_l10n = [
			'displayAdvancedTab'    => WPSEO_Capability_Utils::current_user_can( 'wpseo_edit_advanced_metadata' ) || ! WPSEO_Options::get( 'disableadvanced_meta' ),
			'noIndex'               => (bool) $no_index,
			'isPostType'            => (bool) get_post_type(),
			'postType'              => get_post_type(),
			'postTypeNamePlural'    => ( $page_type === 'post' ) ? $label_object->label : $label_object->name,
			'postTypeNameSingular'  => ( $page_type === 'post' ) ? $label_object->labels->singular_name : $label_object->singular_name,
			'isBreadcrumbsDisabled' => WPSEO_Options::get( 'breadcrumbs-enable', false ) !== true && ! current_theme_supports( 'yoast-seo-breadcrumbs' ),
			// phpcs:ignore Generic.ControlStructures.DisallowYodaConditions -- Bug: squizlabs/PHP_CodeSniffer#2962.
			'isPrivateBlog'         => ( (string) get_option( 'blog_public' ) ) === '0',
		];

		$additional_entries = apply_filters( 'wpseo_admin_l10n', [] );
		if ( is_array( $additional_entries ) ) {
			$wpseo_admin_l10n = array_merge( $wpseo_admin_l10n, $additional_entries );
		}

		return $wpseo_admin_l10n;
	}

	/**
	 * Retrieves the analysis worker log level. Defaults to errors only.
	 *
	 * Uses bool YOAST_SEO_DEBUG as flag to enable logging. Off equals ERROR.
	 * Uses string YOAST_SEO_DEBUG_ANALYSIS_WORKER as log level for the Analysis
	 * Worker. Defaults to INFO.
	 * Can be: TRACE, DEBUG, INFO, WARN or ERROR.
	 *
	 * @return string The log level to use.
	 */
	public static function get_analysis_worker_log_level() {
		if ( defined( 'YOAST_SEO_DEBUG' ) && YOAST_SEO_DEBUG ) {
			return defined( 'YOAST_SEO_DEBUG_ANALYSIS_WORKER' ) ? YOAST_SEO_DEBUG_ANALYSIS_WORKER : 'INFO';
		}

		return 'ERROR';
	}

	/**
	 * Returns the unfiltered home URL.
	 *
	 * In case WPML is installed, returns the original home_url and not the WPML version.
	 * In case of a multisite setup we return the network_home_url.
	 *
	 * @return string The home url.
	 *
	 * @codeCoverageIgnore
	 */
	public static function get_home_url() {

		/**
		 * Action: 'wpseo_home_url' - Allows overriding of the home URL.
		 */
		do_action( 'wpseo_home_url' );

		// If the plugin is network-activated, use the network home URL.
		if ( self::is_plugin_network_active() ) {
			return network_home_url();
		}

		return home_url();
	}

	/**
	 * Prepares data for outputting as JSON.
	 *
	 * @param array $data The data to format.
	 *
	 * @return false|string The prepared JSON string.
	 */
	public static function format_json_encode( $data ) {
		$flags = JSON_UNESCAPED_SLASHES;

		if ( self::is_development_mode() ) {
			$flags = ( $flags | JSON_PRETTY_PRINT );

			/**
			 * Filter the Yoast SEO development mode.
			 *
			 * @api array $data Allows filtering of the JSON data for debug purposes.
			 */
			$data = apply_filters( 'wpseo_debug_json_data', $data );
		}

		// phpcs:ignore Yoast.Yoast.AlternativeFunctions.json_encode_wp_json_encodeWithAdditionalParams -- This is the definition of format_json_encode.
		return wp_json_encode( $data, $flags );
	}

	/**
	 * Extends the allowed post tags with accessibility-related attributes.
	 *
	 * @param array $allowed_post_tags The allowed post tags.
	 * @codeCoverageIgnore
	 *
	 * @return array The allowed tags including post tags, input tags and select tags.
	 */
	public static function extend_kses_post_with_a11y( $allowed_post_tags ) {
		static $a11y_tags;

		if ( isset( $a11y_tags ) === false ) {
			$a11y_tags = [
				'button'   => [
					'aria-expanded' => true,
					'aria-controls' => true,
				],
				'div'      => [
					'tabindex' => true,
				],
				// Below are attributes that are needed for backwards compatibility (WP < 5.1).
				'span'     => [
					'aria-hidden' => true,
				],
				'input'    => [
					'aria-describedby' => true,
				],
				'select'   => [
					'aria-describedby' => true,
				],
				'textarea' => [
					'aria-describedby' => true,
				],
			];

			// Add the global allowed attributes to each html element.
			$a11y_tags = array_map( '_wp_add_global_attributes', $a11y_tags );
		}

		return array_merge_recursive( $allowed_post_tags, $a11y_tags );
	}

	/**
	 * Extends the allowed post tags with input, select and option tags.
	 *
	 * @param array $allowed_post_tags The allowed post tags.
	 * @codeCoverageIgnore
	 *
	 * @return array The allowed tags including post tags, input tags, select tags and option tags.
	 */
	public static function extend_kses_post_with_forms( $allowed_post_tags ) {
		static $input_tags;

		if ( isset( $input_tags ) === false ) {
			$input_tags = [
				'input' => [
					'accept'          => true,
					'accesskey'       => true,
					'align'           => true,
					'alt'             => true,
					'autocomplete'    => true,
					'autofocus'       => true,
					'checked'         => true,
					'contenteditable' => true,
					'dirname'         => true,
					'disabled'        => true,
					'draggable'       => true,
					'dropzone'        => true,
					'form'            => true,
					'formaction'      => true,
					'formenctype'     => true,
					'formmethod'      => true,
					'formnovalidate'  => true,
					'formtarget'      => true,
					'height'          => true,
					'hidden'          => true,
					'lang'            => true,
					'list'            => true,
					'max'             => true,
					'maxlength'       => true,
					'min'             => true,
					'multiple'        => true,
					'name'            => true,
					'pattern'         => true,
					'placeholder'     => true,
					'readonly'        => true,
					'required'        => true,
					'size'            => true,
					'spellcheck'      => true,
					'src'             => true,
					'step'            => true,
					'tabindex'        => true,
					'translate'       => true,
					'type'            => true,
					'value'           => true,
					'width'           => true,

					/*
					 * Below are attributes that are needed for backwards compatibility (WP < 5.1).
					 * They are used for the social media image in the metabox.
					 * These can be removed once we move to the React versions of the social previews.
					 */
					'data-target'     => true,
					'data-target-id'  => true,
				],
				'select' => [
					'accesskey'       => true,
					'autofocus'       => true,
					'contenteditable' => true,
					'disabled'        => true,
					'draggable'       => true,
					'dropzone'        => true,
					'form'            => true,
					'hidden'          => true,
					'lang'            => true,
					'multiple'        => true,
					'name'            => true,
					'onblur'          => true,
					'onchange'        => true,
					'oncontextmenu'   => true,
					'onfocus'         => true,
					'oninput'         => true,
					'oninvalid'       => true,
					'onreset'         => true,
					'onsearch'        => true,
					'onselect'        => true,
					'onsubmit'        => true,
					'required'        => true,
					'size'            => true,
					'spellcheck'      => true,
					'tabindex'        => true,
					'translate'       => true,
				],
				'option' => [
					'class'    => true,
					'disabled' => true,
					'id'       => true,
					'label'    => true,
					'selected' => true,
					'value'    => true,
				],
			];

			// Add the global allowed attributes to each html element.
			$input_tags = array_map( '_wp_add_global_attributes', $input_tags );
		}

		return array_merge_recursive( $allowed_post_tags, $input_tags );
	}

	/**
	 * Gets an array of enabled features.
	 *
	 * @return string[] The array of enabled features.
	 */
	public static function retrieve_enabled_features() {
		$enabled_features = [];
		if ( defined( 'YOAST_SEO_ENABLED_FEATURES' ) ) {
			$enabled_features = preg_split( '/,\W*/', YOAST_SEO_ENABLED_FEATURES );
		}
		// Make the array of enabled features filterable, so features can be enabled at will.
		$enabled_features = apply_filters( 'wpseo_enable_feature', $enabled_features );

		return $enabled_features;
	}

	/* ********************* DEPRECATED METHODS ********************* */

	/**
	 * List all the available user roles.
	 *
	 * @since 1.8.0
	 * @deprecated 15.0
	 * @codeCoverageIgnore
	 *
	 * @return array $roles
	 */
	public static function get_roles() {
		_deprecated_function( __METHOD__, '15.0', 'wp_roles()->get_names()' );
		$yoast_seo_wp_roles = wp_roles();

		$roles = $yoast_seo_wp_roles->get_names();

		return $roles;
	}

	/**
	 * Checks if the current installation supports MyYoast access tokens.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return bool True if access_tokens are supported.
	 *
	 * @deprecated 15.0
	 */
	public static function has_access_token_support() {
		_deprecated_function( __METHOD__, 'WPSEO 15.0' );
		return false;
	}

	/**
	 * Standardize whitespace in a string.
	 *
	 * Replace line breaks, carriage returns, tabs with a space, then remove double spaces.
	 *
	 * @deprecated 15.2
	 * @codeCoverageIgnore
	 *
	 * @since 1.8.0
	 *
	 * @param string $string String input to standardize.
	 *
	 * @return string
	 */
	public static function standardize_whitespace( $string ) {
		_deprecated_function( __METHOD__, 'WPSEO 15.2' );

		return YoastSEO()->helpers->string->standardize_whitespace( $string );
	}

	/**
	 * First strip out registered and enclosing shortcodes using native WordPress strip_shortcodes function.
	 * Then strip out the shortcodes with a filthy regex, because people don't properly register their shortcodes.
	 *
	 * @deprecated 15.2
	 * @codeCoverageIgnore
	 *
	 * @since 1.8.0
	 *
	 * @param string $text Input string that might contain shortcodes.
	 *
	 * @return string $text String without shortcodes.
	 */
	public static function strip_shortcode( $text ) {
		_deprecated_function( __METHOD__, 'WPSEO 15.2' );

		return YoastSEO()->helpers->string->strip_shortcode( $text );
	}

	/**
	 * Retrieves the title separator.
	 *
	 * @deprecated 15.2
	 * @codeCoverageIgnore
	 *
	 * @since 3.0.0
	 *
	 * @return string
	 */
	public static function get_title_separator() {
		_deprecated_function( __METHOD__, 'WPSEO 15.2', 'Yoast\WP\SEO\Helpers\Options_Helper::get_title_separator' );

		return YoastSEO()->helpers->options->get_title_separator();
	}

	/**
	 * Flush W3TC cache after successful update/add of taxonomy meta option.
	 *
	 * @deprecated 15.3
	 * @codeCoverageIgnore
	 *
	 * @since 1.8.0
	 */
	public static function flush_w3tc_cache() {
		_deprecated_function( __METHOD__, 'WPSEO 15.3' );
	}

	/**
	 * Determines whether or not WooCommerce is active.
	 *
	 * @deprecated 15.3
	 * @codeCoverageIgnore
	 *
	 * @return bool Whether or not WooCommerce is active.
	 */
	public static function is_woocommerce_active() {
		_deprecated_function( __METHOD__, 'WPSEO 15.3' );

		return YoastSEO()->helpers->woocommerce->is_active();
	}

	/**
	 * Outputs a Schema blob.
	 *
	 * @deprecated 15.5
	 * @codeCoverageIgnore
	 *
	 * @param array  $graph The Schema graph array to output.
	 * @param string $class The (optional) class to add to the script tag.
	 *
	 * @return bool
	 */
	public static function schema_output( $graph, $class = 'yoast-schema-graph' ) {
		_deprecated_function( __METHOD__, 'WPSEO 15.5' );

		if ( ! is_array( $graph ) || empty( $graph ) ) {
			return false;
		}

		// phpcs:ignore WordPress.Security.EscapeOutput -- Escaping happens in WPSEO_Utils::schema_tag, which should be whitelisted.
		echo self::schema_tag( $graph, $class );
		return true;
	}

	/**
	 * Returns a script tag with Schema blob.
	 *
	 * @deprecated 15.5
	 * @codeCoverageIgnore
	 *
	 * @param array  $graph The Schema graph array to output.
	 * @param string $class The (optional) class to add to the script tag.
	 *
	 * @return false|string A schema blob with script tags.
	 */
	public static function schema_tag( $graph, $class = 'yoast-schema-graph' ) {
		_deprecated_function( __METHOD__, 'WPSEO 15.5' );

		if ( ! is_array( $graph ) || empty( $graph ) ) {
			return false;
		}

		$output = [
			'@context' => 'https://schema.org',
			'@graph'   => $graph,
		];
		return "<script type='application/ld+json' class='" . esc_attr( $class ) . "'>" . self::format_json_encode( $output ) . '</script>' . "\n";
	}

	/**
	 * Returns the SVG for the traffic light in the metabox.
	 *
	 * @deprecated 15.5
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public static function traffic_light_svg() {
		_deprecated_function( __METHOD__, 'WPSEO 15.5' );

		return <<<'SVG'
<svg class="yst-traffic-light init" version="1.1" xmlns="http://www.w3.org/2000/svg"
	 role="img" aria-hidden="true" focusable="false"
	 x="0px" y="0px" viewBox="0 0 30 47" enable-background="new 0 0 30 47" xml:space="preserve">
<g id="BG_1_">
</g>
<g id="traffic_light">
	<g>
		<g>
			<g>
				<path fill="#5B2942" d="M22,0H8C3.6,0,0,3.6,0,7.9v31.1C0,43.4,3.6,47,8,47h14c4.4,0,8-3.6,8-7.9V7.9C30,3.6,26.4,0,22,0z
					 M27.5,38.8c0,3.1-2.6,5.7-5.8,5.7H8.3c-3.2,0-5.8-2.5-5.8-5.7V8.3c0-1.5,0.6-2.9,1.7-4c1.1-1,2.5-1.6,4.1-1.6h13.4
					c1.5,0,3,0.6,4.1,1.6c1.1,1.1,1.7,2.5,1.7,4V38.8z"/>
			</g>
			<g class="traffic-light-color traffic-light-red">
				<ellipse fill="#C8C8C8" cx="15" cy="23.5" rx="5.7" ry="5.6"/>
				<ellipse fill="#DC3232" cx="15" cy="10.9" rx="5.7" ry="5.6"/>
				<ellipse fill="#C8C8C8" cx="15" cy="36.1" rx="5.7" ry="5.6"/>
			</g>
			<g class="traffic-light-color traffic-light-orange">
				<ellipse fill="#F49A00" cx="15" cy="23.5" rx="5.7" ry="5.6"/>
				<ellipse fill="#C8C8C8" cx="15" cy="10.9" rx="5.7" ry="5.6"/>
				<ellipse fill="#C8C8C8" cx="15" cy="36.1" rx="5.7" ry="5.6"/>
			</g>
			<g class="traffic-light-color traffic-light-green">
				<ellipse fill="#C8C8C8" cx="15" cy="23.5" rx="5.7" ry="5.6"/>
				<ellipse fill="#C8C8C8" cx="15" cy="10.9" rx="5.7" ry="5.6"/>
				<ellipse fill="#63B22B" cx="15" cy="36.1" rx="5.7" ry="5.6"/>
			</g>
			<g class="traffic-light-color traffic-light-empty">
				<ellipse fill="#C8C8C8" cx="15" cy="23.5" rx="5.7" ry="5.6"/>
				<ellipse fill="#C8C8C8" cx="15" cy="10.9" rx="5.7" ry="5.6"/>
				<ellipse fill="#C8C8C8" cx="15" cy="36.1" rx="5.7" ry="5.6"/>
			</g>
			<g class="traffic-light-color traffic-light-init">
				<ellipse fill="#C8C8C8" cx="15" cy="23.5" rx="5.7" ry="5.6"/>
				<ellipse fill="#C8C8C8" cx="15" cy="10.9" rx="5.7" ry="5.6"/>
				<ellipse fill="#C8C8C8" cx="15" cy="36.1" rx="5.7" ry="5.6"/>
			</g>
		</g>
	</g>
</g>
</svg>
SVG;
	}

	/**
	 * Gets the plugin name from file.
	 *
	 * @deprecated 15.5
	 * @codeCoverageIgnore
	 *
	 * @since 2.3.3
	 *
	 * @param string $plugin Plugin path relative to plugins directory.
	 *
	 * @return string|bool
	 */
	public static function get_plugin_name( $plugin ) {
		_deprecated_function( __METHOD__, 'WPSEO 15.5' );

		$plugin_details = get_plugin_data( WP_PLUGIN_DIR . '/' . $plugin );

		if ( $plugin_details['Name'] !== '' ) {
			return $plugin_details['Name'];
		}

		return false;
	}

	/**
	 * Returns a base64 URL for the svg for use in the menu.
	 *
	 * @deprecated 15.5
	 * @codeCoverageIgnore
	 *
	 * @since 3.3.0
	 *
	 * @param bool $base64 Whether or not to return base64'd output.
	 *
	 * @return string
	 */
	public static function get_icon_svg( $base64 = true ) {
		_deprecated_function( __METHOD__, 'WPSEO 15.5' );

		$svg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="100%" height="100%" style="fill:#82878c" viewBox="0 0 512 512" role="img" aria-hidden="true" focusable="false"><g><g><g><g><path d="M203.6,395c6.8-17.4,6.8-36.6,0-54l-79.4-204h70.9l47.7,149.4l74.8-207.6H116.4c-41.8,0-76,34.2-76,76V357c0,41.8,34.2,76,76,76H173C189,424.1,197.6,410.3,203.6,395z"/></g><g><path d="M471.6,154.8c0-41.8-34.2-76-76-76h-3L285.7,365c-9.6,26.7-19.4,49.3-30.3,68h216.2V154.8z"/></g></g><path stroke-width="2.974" stroke-miterlimit="10" d="M338,1.3l-93.3,259.1l-42.1-131.9h-89.1l83.8,215.2c6,15.5,6,32.5,0,48c-7.4,19-19,37.3-53,41.9l-7.2,1v76h8.3c81.7,0,118.9-57.2,149.6-142.9L431.6,1.3H338z M279.4,362c-32.9,92-67.6,128.7-125.7,131.8v-45c37.5-7.5,51.3-31,59.1-51.1c7.5-19.3,7.5-40.7,0-60l-75-192.7h52.8l53.3,166.8l105.9-294h58.1L279.4,362z"/></g></g></svg>';

		if ( $base64 ) {
			//phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode -- This encoding is intended.
			return 'data:image/svg+xml;base64,' . base64_encode( $svg );
		}

		return $svg;
	}

	/**
	 * Checks whether the current user is allowed to access the configuration.
	 *
	 * @deprecated 15.5
	 * @codeCoverageIgnore
	 *
	 * @since 1.8.0
	 *
	 * @return boolean
	 */
	public static function grant_access() {
		_deprecated_function( __METHOD__, 'WPSEO 15.5' );

		if ( ! is_multisite() ) {
			return true;
		}

		$options = get_site_option( 'wpseo_ms' );

		if ( empty( $options['access'] ) || $options['access'] === 'admin' ) {
			return current_user_can( 'wpseo_manage_options' );
		}

		return is_super_admin();
	}
}
