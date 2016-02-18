<?php
/**
 * @package WPSEO\Internals
 * @since      1.8.0
 */

/**
 * Group of utility methods for use by WPSEO
 * All methods are static, this is just a sort of namespacing class wrapper.
 */
class WPSEO_Utils {

	/**
	 * @var bool $has_filters Whether the PHP filter extension is enabled
	 * @static
	 */
	public static $has_filters;

	/**
	 * Holds the options that, when updated, should cause the transient cache to clear
	 *
	 * @var array
	 */
	private static $cache_clear = array();

	/**
	 * @var string Sitemap Cache key prefix
	 */
	private static $sitemap_cache_key_prefix = 'wpseo_sitemap_';

	/**
	 * Check whether the current user is allowed to access the configuration.
	 *
	 * @static
	 *
	 * @return boolean
	 */
	public static function grant_access() {
		if ( ! is_multisite() ) {
			return true;
		}

		$options = get_site_option( 'wpseo_ms' );

		if ( empty( $options['access'] ) || $options['access'] === 'admin' ) {
			return current_user_can( 'manage_options' );
		}

		return is_super_admin();
	}

	/**
	 * Check whether file editing is allowed for the .htaccess and robots.txt files
	 *
	 * @internal current_user_can() checks internally whether a user is on wp-ms and adjusts accordingly.
	 *
	 * @static
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
		 * .htaccess and robots.txt is allowed
		 *
		 * @api bool $allowed Whether file editing is allowed
		 */

		return apply_filters( 'wpseo_allow_system_file_edit', $allowed );
	}

	/**
	 * Check if the web server is running on Apache
	 *
	 * @static
	 *
	 * @return bool
	 */
	public static function is_apache() {
		if ( isset( $_SERVER['SERVER_SOFTWARE'] ) && stristr( $_SERVER['SERVER_SOFTWARE'], 'apache' ) !== false ) {
			return true;
		}

		return false;
	}

	/**
	 * Check if the web server is running on Nginx
	 *
	 * @static
	 *
	 * @return bool
	 */
	public static function is_nginx() {
		if ( isset( $_SERVER['SERVER_SOFTWARE'] ) && stristr( $_SERVER['SERVER_SOFTWARE'], 'nginx' ) !== false ) {
			return true;
		}

		return false;
	}

	/**
	 * Check whether a url is relative
	 *
	 * @param string $url URL string to check.
	 *
	 * @return bool
	 */
	public static function is_url_relative( $url ) {
		return ( strpos( $url, 'http' ) !== 0 && strpos( $url, '//' ) !== 0 );
	}

	/**
	 * List all the available user roles
	 *
	 * @static
	 *
	 * @return array $roles
	 */
	public static function get_roles() {
		global $wp_roles;

		if ( ! isset( $wp_roles ) ) {
			$wp_roles = new WP_Roles();
		}

		$roles = $wp_roles->get_names();

		return $roles;
	}

	/**
	 * Standardize whitespace in a string
	 *
	 * Replace line breaks, carriage returns, tabs with a space, then remove double spaces.
	 *
	 * @param string $string String input to standardize.
	 *
	 * @return string
	 */
	public static function standardize_whitespace( $string ) {
		return trim( str_replace( '  ', ' ', str_replace( array( "\t", "\n", "\r", "\f" ), ' ', $string ) ) );
	}

	/**
	 * Strip out the shortcodes with a filthy regex, because people don't properly register their shortcodes.
	 *
	 * @static
	 *
	 * @param string $text Input string that might contain shortcodes.
	 *
	 * @return string $text string without shortcodes
	 */
	public static function strip_shortcode( $text ) {
		return preg_replace( '`\[[^\]]+\]`s', '', $text );
	}

	/**
	 * Recursively trim whitespace round a string value or of string values within an array
	 * Only trims strings to avoid typecasting a variable (to string)
	 *
	 * @static
	 *
	 * @param mixed $value Value to trim or array of values to trim.
	 *
	 * @return mixed Trimmed value or array of trimmed values
	 */
	public static function trim_recursive( $value ) {
		if ( is_string( $value ) ) {
			$value = trim( $value );
		}
		elseif ( is_array( $value ) ) {
			$value = array_map( array( __CLASS__, 'trim_recursive' ), $value );
		}

		return $value;
	}

	/**
	 * Translates a decimal analysis score into a textual one.
	 *
	 * @static
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
	 * Emulate the WP native sanitize_text_field function in a %%variable%% safe way
	 *
	 * @see https://core.trac.wordpress.org/browser/trunk/src/wp-includes/formatting.php for the original
	 *
	 * Sanitize a string from user input or from the db
	 *
	 * check for invalid UTF-8,
	 * Convert single < characters to entity,
	 * strip all tags,
	 * remove line breaks, tabs and extra white space,
	 * strip octets - BUT DO NOT REMOVE (part of) VARIABLES WHICH WILL BE REPLACED.
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

		return apply_filters( 'sanitize_text_field', $filtered, $value );
	}

	/**
	 * Sanitize a url for saving to the database
	 * Not to be confused with the old native WP function
	 *
	 * @todo [JRF => whomever] check/improve url verification
	 *
	 * @param string $value             String URL value to sanitize.
	 * @param array  $allowed_protocols Optional set of allowed protocols.
	 *
	 * @return string
	 */
	public static function sanitize_url( $value, $allowed_protocols = array( 'http', 'https' ) ) {
		return esc_url_raw( sanitize_text_field( rawurldecode( $value ) ), $allowed_protocols );
	}

	/**
	 * Validate a value as boolean
	 *
	 * @static
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
	 * Cast a value to bool
	 *
	 * @static
	 *
	 * @param mixed $value Value to cast.
	 *
	 * @return bool
	 */
	public static function emulate_filter_bool( $value ) {
		$true  = array(
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

		);
		$false = array(
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
		);

		if ( is_bool( $value ) ) {
			return $value;
		}
		else if ( is_int( $value ) && ( $value === 0 || $value === 1 ) ) {
			return (bool) $value;
		}
		else if ( ( is_float( $value ) && ! is_nan( $value ) ) && ( $value === (float) 0 || $value === (float) 1 ) ) {
			return (bool) $value;
		}
		else if ( is_string( $value ) ) {
			$value = trim( $value );
			if ( in_array( $value, $true, true ) ) {
				return true;
			}
			else if ( in_array( $value, $false, true ) ) {
				return false;
			}
			else {
				return false;
			}
		}

		return false;
	}

	/**
	 * Validate a value as integer
	 *
	 * @static
	 *
	 * @param mixed $value Value to validate.
	 *
	 * @return int|bool int or false in case of failure to convert to int
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
	 * Cast a value to integer
	 *
	 * @static
	 *
	 * @param mixed $value Value to cast.
	 *
	 * @return int|bool
	 */
	public static function emulate_filter_int( $value ) {
		if ( is_int( $value ) ) {
			return $value;
		}
		else if ( is_float( $value ) ) {
			if ( (int) $value == $value && ! is_nan( $value ) ) {
				return (int) $value;
			}
			else {
				return false;
			}
		}
		else if ( is_string( $value ) ) {
			$value = trim( $value );
			if ( $value === '' ) {
				return false;
			}
			else if ( ctype_digit( $value ) ) {
				return (int) $value;
			}
			else if ( strpos( $value, '-' ) === 0 && ctype_digit( substr( $value, 1 ) ) ) {
				return (int) $value;
			}
			else {
				return false;
			}
		}

		return false;
	}

	/**
	 * Clears the WP or W3TC cache depending on which is used
	 *
	 * @static
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
	 * Flush W3TC cache after succesfull update/add of taxonomy meta option
	 *
	 * @todo [JRF => whomever] check the above and this function to see if they should be combined or really
	 * do something significantly different
	 *
	 * @static
	 */
	public static function flush_w3tc_cache() {
		if ( defined( 'W3TC_DIR' ) && function_exists( 'w3tc_objectcache_flush' ) ) {
			w3tc_objectcache_flush();
		}
	}

	/**
	 * Clear rewrite rules
	 *
	 * @static
	 */
	public static function clear_rewrites() {
		delete_option( 'rewrite_rules' );
	}

	/**
	 * Adds a hook that when given option is updated, the XML sitemap transient cache is cleared
	 *
	 * @param string $option Option name.
	 * @param string $type   Sitemap type.
	 */
	public static function register_cache_clear_option( $option, $type = '' ) {
		self::$cache_clear[ $option ] = $type;
		add_action( 'update_option', array( 'WPSEO_Utils', 'clear_transient_cache' ) );
	}

	/**
	 * Clears the transient cache when a given option is updated, if that option has been registered before
	 *
	 * @param string $option The option that's being updated.
	 */
	public static function clear_transient_cache( $option ) {
		if ( array_key_exists( $option, self::$cache_clear ) ) {
			$types = array();

			if ( ! empty( self::$cache_clear[ $option ] ) ) {
				$types[] = self::$cache_clear[ $option ];
			}

			// Trigger cache clear.
			self::clear_sitemap_cache( $types );
		}
	}

	/**
	 * Clear entire XML sitemap cache
	 *
	 * @param array $types Set of sitemap types to invalidate cache for.
	 */
	public static function clear_sitemap_cache( array $types = array() ) {
		// Filter out optional empty items.
		$types = array_filter( $types );

		// Clear all cache.
		if ( empty( $types ) ) {
			self::invalidate_sitemap_cache();

			return;
		}

		// Make sure the index cache always gets invalidated.
		if ( ! in_array( '1', $types ) ) {
			array_unshift( $types, '1' );
		}

		// Invalidate separate type caches.
		foreach ( $types as $type ) {
			self::invalidate_sitemap_cache( $type );
		}
	}

	/**
	 * Invalidate sitemap cache
	 *
	 * @param null|string $type The type to get the key for. Null for all cache.
	 */
	private static function invalidate_sitemap_cache( $type = null ) {
		// Global validator gets cleared when not type is provided.
		$old_validator = null;

		// Get the current type validator.
		if ( ! is_null( $type ) ) {
			$old_validator = self::get_sitemap_cache_validator( $type );
		}

		// Refresh validator.
		self::new_sitemap_cache_validator( $type );

		if ( ! wp_using_ext_object_cache() ) {
			// Clean up current cache from the database.
			self::cleanup_sitemap_database_cache( $type, $old_validator );
		}

		// External object cache pushes old and unretrieved items out by itself so we don't have to do anything for that.
	}

	/**
	 * Cleanup invalidated database cache
	 *
	 * @param null|string $type The type of sitemap to clear cache for.
	 * @param null|string $validator The validator to clear cache of.
	 *
	 * @return void
	 */
	private static function cleanup_sitemap_database_cache( $type = null, $validator = null ) {
		global $wpdb;

		if ( is_null( $type ) ) {
			// Clear all cache if no type is provided.
			$where = sprintf( "option_name LIKE '_transient_%s%%'", self::$sitemap_cache_key_prefix );
		}
		else {
			if ( ! is_null( $validator ) ) {
				// Clear all cache for provided type-validator.
				$where = sprintf( "option_name LIKE '_transient_%%_%s'", $validator );
			}
			else {
				// Clear type cache for all type keys.
				$where = sprintf( "option_name LIKE '_transient_%s%s_%%'", self::$sitemap_cache_key_prefix, $type );
			}
		}

		$query = sprintf( 'DELETE FROM %s WHERE %s', $wpdb->options, $where );
		$wpdb->query( $query );
	}

	/**
	 * Get the cache key for a certain type and page
	 *
	 * @param null|string $type The type to get the key for. Null or '1' for index cache.
	 * @param int         $page The page of cache to get the key for.
	 *
	 * @return string The key where the cache is stored on.
	 */
	public static function get_sitemap_cache_key( $type = null, $page = 1 ) {
		// Using '1' for sitemap index cache.
		$type = is_null( $type ) ? 1 : $type;

		$global_cache_validator = self::get_sitemap_cache_validator();
		$type_cache_validator   = self::get_sitemap_cache_validator( $type );

		$prefix = self::$sitemap_cache_key_prefix;
		$postfix = sprintf( ':%d:%s:%s', $page, $global_cache_validator, $type_cache_validator );

		$type = self::get_safe_sitemap_cache_type( $type, $prefix, $postfix );

		// Build key.
		$full_key = $prefix . $type . $postfix;

		return $full_key;
	}

	/**
	 * If the type is over length make sure we compact it so we don't have any database problems
	 *
	 * When there are more 'extremely long' post types, changes are they have variations in either the start or ending.
	 * Because of this, we cut out the excess in the middle which should result in less chance of collision.
	 *
	 * @param string $type The type of sitemap to be used.
	 * @param string $prefix The part before the type in the cache key. Only the length is used.
	 * @param string $postfix The part after the type in the cache key. Only the length is used.
	 *
	 * @return string The type with a safe length to use
	 */
	private static function get_safe_sitemap_cache_type( $type, $prefix = '', $postfix = '' ) {
		// Length of key should not be over 53.
		$max_length = 53;
		$max_length -= strlen( $prefix );
		$max_length -= strlen( $postfix );

		// If we go below 15 problems with overlap will surely occur.
		$max_length = max( 15, $max_length );

		if ( strlen( $type ) > $max_length ) {
			$half = ( $max_length / 2 );

			$first_part = substr( $type, 0, ( ceil( $half ) - 1 ) );
			$last_part  = substr( $type, ( - 1 - floor( $half ) ) );

			$type = $first_part . '..' . $last_part;
		}

		return $type;
	}

	/**
	 * Get the cache validator for the specified type
	 *
	 * @param string|null $type Provide a type for a specific type validator, null for global validator.
	 *
	 * @return string Validator to be used to generate the cache key.
	 */
	private static function get_sitemap_cache_validator_key( $type = null ) {
		if ( is_null( $type ) ) {
			return 'wpseo_sitemap_cache_validator_global';
		}

		return sprintf( 'wpseo_sitemap_%s_cache_validator', $type );
	}

	/**
	 * Get the current cache validator
	 *
	 * Without the type the global validator is returned.
	 *  This can invalidate -all- keys in cache at once
	 *
	 * With the type parameter the validator for that specific
	 *  type can be invalidated
	 *
	 * @param string|null $type Provide a type for a specific type validator, null for global validator.
	 *
	 * @return null|string The validator for the supplied type.
	 */
	private static function get_sitemap_cache_validator( $type = null ) {
		$key = self::get_sitemap_cache_validator_key( $type );

		$current = get_option( $key, null );
		if ( ! is_null( $current ) ) {
			return $current;
		}

		if ( self::new_sitemap_cache_validator( $type ) ) {
			return self::get_sitemap_cache_validator( $type );
		}

		return null;
	}

	/**
	 * Refresh the cache validator value
	 *
	 * @param string|null $type Provide a type for a specific type validator, null for global validator.
	 *
	 * @return bool True if validator key has been saved as option.
	 */
	private static function new_sitemap_cache_validator( $type = null ) {
		$key = self::get_sitemap_cache_validator_key( $type );

		// Generate new validator.
		$microtime = microtime();

		// Remove space.
		list( $milliseconds, $seconds ) = explode( ' ', $microtime );

		// Transients are purged every 24h.
		$seconds      = ( $seconds % 86400 );
		$milliseconds = substr( $milliseconds, 2, 5 );

		// Combine seconds and milliseconds and convert to integer.
		$validator = intval( $seconds . '' . $milliseconds, 10 );

		// Apply base 61 encoding.
		$compressed = self::convert_base10_to_base61( $validator );

		return update_option( $key, $compressed );
	}

	/**
	 * Encode to base61 format.
	 *
	 * This is base64 (numeric + alpha + alpha upper case) without the 0.
	 *
	 * @param int $input The number that has to be converted to base 61.
	 *
	 * @return string Base 61 converted string.
	 *
	 * @throws InvalidArgumentException When the input is not an integer.
	 */
	public static function convert_base10_to_base61( $input ) {
		if ( ! is_int( $input ) ) {
			throw new InvalidArgumentException( 'Expected integer as input.' );
		}

		$characters = '123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$length     = strlen( $characters );

		$index    = ( $input % $length );
		$output   = $characters[ $index ];
		$position = floor( $input / $length );
		while ( $position ) {
			$index    = ( $position % $length );
			$output   = $characters[ $index ] . $output;
			$position = floor( $position / $length );
		}

		return $output;
	}

	/**
	 * Do simple reliable math calculations without the risk of wrong results
	 *
	 * @see   http://floating-point-gui.de/
	 * @see   the big red warning on http://php.net/language.types.float.php
	 *
	 * In the rare case that the bcmath extension would not be loaded, it will return the normal calculation results
	 *
	 * @static
	 *
	 * @since 1.5.0
	 *
	 * @param mixed  $number1   Scalar (string/int/float/bool).
	 * @param string $action    Calculation action to execute. Valid input:
	 *                            '+' or 'add' or 'addition',
	 *                            '-' or 'sub' or 'subtract',
	 *                            '*' or 'mul' or 'multiply',
	 *                            '/' or 'div' or 'divide',
	 *                            '%' or 'mod' or 'modulus'
	 *                            '=' or 'comp' or 'compare'.
	 * @param mixed  $number2   Scalar (string/int/float/bool).
	 * @param bool   $round     Whether or not to round the result. Defaults to false.
	 *                          Will be disregarded for a compare operation.
	 * @param int    $decimals  Decimals for rounding operation. Defaults to 0.
	 * @param int    $precision Calculation precision. Defaults to 10.
	 *
	 * @return mixed            Calculation Result or false if either or the numbers isn't scalar or
	 *                          an invalid operation was passed
	 *                          - for compare the result will always be an integer
	 *                          - for all other operations, the result will either be an integer (preferred)
	 *                            or a float
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
				elseif ( $number2 != 0 ) {
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
					$result = bcmod( $number1, $number2, $precision ); // String, or NULL if modulus is 0.
				}
				elseif ( $number2 != 0 ) {
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
					$result = ( $number1 == $number2 ) ? 0 : ( ( $number1 > $number2 ) ? 1 : - 1 );
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
					$result = ( intval( $result ) == $result ) ? intval( $result ) : floatval( $result );
				}
			}

			return $result;
		}

		return false;
	}

	/**
	 * Wrapper for the PHP filter input function.
	 *
	 * This is used because stupidly enough, the `filter_input` function is not available on all hosts...
	 *
	 * @deprecated Passes through to PHP call, no longer used in code.
	 *
	 * @param int    $type          Input type constant.
	 * @param string $variable_name Variable name to get.
	 * @param int    $filter        Filter to apply.
	 *
	 * @return mixed
	 */
	public static function filter_input( $type, $variable_name, $filter = FILTER_DEFAULT ) {
		return filter_input( $type, $variable_name, $filter );
	}

	/**
	 * Trim whitespace and NBSP (Non-breaking space) from string
	 *
	 * @param string $string String input to trim.
	 *
	 * @return string
	 */
	public static function trim_nbsp_from_string( $string ) {
		$find   = array( '&nbsp;', chr( 0xC2 ) . chr( 0xA0 ) );
		$string = str_replace( $find, ' ', $string );
		$string = trim( $string );

		return $string;
	}

	/**
	 * Check if a string is a valid datetime
	 *
	 * @param string $datetime String input to check as valid input for DateTime class.
	 *
	 * @return bool
	 */
	public static function is_valid_datetime( $datetime ) {
		if ( substr( $datetime, 0, 1 ) != '-' ) {
			try {
				// Use the DateTime class ( PHP 5.2 > ) to check if the string is a valid datetime.
				if ( new DateTime( $datetime ) !== false ) {
					return true;
				}
			}
			catch ( Exception $exc ) {
				return false;
			}
		}

		return false;
	}

	/**
	 * Format the URL to be sure it is okay for using as a redirect url.
	 *
	 * This method will parse the URL and combine them in one string.
	 *
	 * @param string $url URL string.
	 *
	 * @return mixed
	 */
	public static function format_url( $url ) {
		$parsed_url = parse_url( $url );

		$formatted_url = '';
		if ( ! empty( $parsed_url['path'] ) ) {
			$formatted_url = $parsed_url['path'];
		}

		// Prepend a slash if first char != slash.
		if ( stripos( $formatted_url, '/' ) !== 0 ) {
			$formatted_url = '/' . $formatted_url;
		}

		// Append 'query' string if it exists.
		if ( isset( $parsed_url['query'] ) && '' != $parsed_url['query'] ) {
			$formatted_url .= '?' . $parsed_url['query'];
		}

		return apply_filters( 'wpseo_format_admin_url', $formatted_url );
	}


	/**
	 * Get plugin name from file
	 *
	 * @param string $plugin Plugin path relative to plugins directory.
	 *
	 * @return string|bool
	 */
	public static function get_plugin_name( $plugin ) {
		$plugin_details = get_plugin_data( WP_PLUGIN_DIR . '/' . $plugin );

		if ( $plugin_details['Name'] != '' ) {
			return $plugin_details['Name'];
		}

		return false;
	}

	/**
	 * Retrieves the sitename.
	 *
	 * @return string
	 */
	public static function get_site_name() {
		return trim( strip_tags( get_bloginfo( 'name' ) ) );
	}

	/**
	 * Retrieves the title separator.
	 *
	 * @return string
	 */
	public static function get_title_separator() {
		$replacement = WPSEO_Options::get_default( 'wpseo_titles', 'separator' );

		// Get the titles option and the separator options.
		$titles_options    = WPSEO_Options::get_option( 'wpseo_titles' );
		$seperator_options = WPSEO_Option_Titles::get_instance()->get_separator_options();

		// This should always be set, but just to be sure.
		if ( isset( $seperator_options[ $titles_options['separator'] ] ) ) {
			// Set the new replacement.
			$replacement = $seperator_options[ $titles_options['separator'] ];
		}

		/**
		 * Filter: 'wpseo_replacements_filter_sep' - Allow customization of the separator character(s)
		 *
		 * @api string $replacement The current separator
		 */
		return apply_filters( 'wpseo_replacements_filter_sep', $replacement );
	}

	/**
	 * Wrapper for encoding the array as a json string. Includes a fallback if wp_json_encode doesn't exists
	 *
	 * @param array $array_to_encode The array which will be encoded.
	 * @param int   $options		 Optional. Array with options which will be passed in to the encoding methods.
	 * @param int   $depth    		 Optional. Maximum depth to walk through $data. Must be greater than 0. Default 512.
	 *
	 * @return false|string
	 */
	public static function json_encode( array $array_to_encode, $options = 0, $depth = 512 ) {
		if ( function_exists( 'wp_json_encode' ) ) {
			return wp_json_encode( $array_to_encode, $options, $depth );
		}

		// @codingStandardsIgnoreStart
		return json_encode( $array_to_encode );
		// @codingStandardsIgnoreEnd
	}

	/**
	 * Check if the current opened page is a Yoast SEO page.
	 *
	 * @return bool
	 */
	public static function is_yoast_seo_page() {
		static $is_yoast_seo;

		if ( $is_yoast_seo === null ) {
			$current_page = filter_input( INPUT_GET, 'page' );
			$is_yoast_seo = ( substr( $current_page, 0, 6 ) === 'wpseo_' );
		}

		return $is_yoast_seo;
	}

	/**
	 * Determine if Yoast SEO is in development mode?
	 *
	 * Inspired by JetPack (https://github.com/Automattic/jetpack/blob/master/class.jetpack.php#L1383-L1406).
	 *
	 * @return bool
	 */
	public static function is_development_mode() {
		$development_mode = false;

		if ( defined( 'WPSEO_DEBUG' ) ) {
			$development_mode = WPSEO_DEBUG;
		}
		elseif ( site_url() && false === strpos( site_url(), '.' ) ) {
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

} /* End of class WPSEO_Utils */
