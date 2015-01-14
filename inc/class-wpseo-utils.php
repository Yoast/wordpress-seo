<?php
/**
 * @package Internals
 */

/**
 * Group of utility methods for use by WPSEO
 * All methods are static, this is just a sort of namespacing class wrapper.
 *
 * @package    WordPress\Plugins\WPSeo
 * @subpackage Internals
 * @since      1.6.1
 * @version    1.6.1
 */
class WPSEO_Utils {

	/**
	 * @static
	 * @var bool $has_filters Whether the PHP filter extension is enabled
	 */
	public static $has_filters;

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
		if ( $options['access'] === 'admin' && current_user_can( 'manage_options' ) ) {
			return true;
		}

		if ( $options['access'] === 'superadmin' && ! is_super_admin() ) {
			return false;
		}

		return true;
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
	 * @static
	 *
	 * @param string $url
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
	 * @static
	 *
	 * @param string $string
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
	 * @param string $text input string that might contain shortcodes
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
	 * @param   mixed $value Value to trim or array of values to trim
	 *
	 * @return  mixed      Trimmed value or array of trimmed values
	 */
	public static function trim_recursive( $value ) {
		if ( is_string( $value ) ) {
			$value = trim( $value );
		} elseif ( is_array( $value ) ) {
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
		if ( $val > 10 ) {
			$val = round( $val / 10 );
		}
		switch ( $val ) {
			case 0:
				$score = __( 'N/A', 'wordpress-seo' );
				$css   = 'na';
				break;
			case 4:
			case 5:
				$score = __( 'Poor', 'wordpress-seo' );
				$css   = 'poor';
				break;
			case 6:
			case 7:
				$score = __( 'OK', 'wordpress-seo' );
				$css   = 'ok';
				break;
			case 8:
			case 9:
			case 10:
				$score = __( 'Good', 'wordpress-seo' );
				$css   = 'good';
				break;
			default:
				$score = __( 'Bad', 'wordpress-seo' );
				$css   = 'bad';
		}

		if ( $css_value ) {
			return $css;
		} else {
			return $score;
		}
	}

	/**
	 * Emulate the WP native sanitize_text_field function in a %%variable%% safe way
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
	 * @static
	 *
	 * @param string $value
	 *
	 * @return string
	 */
	public static function sanitize_text_field( $value ) {
		$filtered = wp_check_invalid_utf8( $value );

		if ( strpos( $filtered, '<' ) !== false ) {
			$filtered = wp_pre_kses_less_than( $filtered );
			// This will strip extra whitespace for us.
			$filtered = wp_strip_all_tags( $filtered, true );
		} else {
			$filtered = trim( preg_replace( '`[\r\n\t ]+`', ' ', $filtered ) );
		}

		$found = false;
		while ( preg_match( '`[^%](%[a-f0-9]{2})`i', $filtered, $match ) ) {
			$filtered = str_replace( $match[1], '', $filtered );
			$found    = true;
		}

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
	 * @static
	 *
	 * @param  string $value
	 * @param  array  $allowed_protocols
	 *
	 * @return  string
	 */
	public static function sanitize_url( $value, $allowed_protocols = array( 'http', 'https' ) ) {
		return esc_url_raw( sanitize_text_field( rawurldecode( $value ) ), $allowed_protocols );
	}

	/**
	 * Validate a value as boolean
	 *
	 * @static
	 *
	 * @param  mixed $value
	 *
	 * @return  bool
	 */
	public static function validate_bool( $value ) {
		if ( ! isset( self::$has_filters ) ) {
			self::$has_filters = extension_loaded( 'filter' );
		}

		if ( self::$has_filters ) {
			return filter_var( $value, FILTER_VALIDATE_BOOLEAN );
		} else {
			return self::emulate_filter_bool( $value );
		}
	}

	/**
	 * Cast a value to bool
	 *
	 * @static
	 *
	 * @param    mixed $value Value to cast
	 *
	 * @return    bool
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
			'On',

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
		} else if ( is_int( $value ) && ( $value === 0 || $value === 1 ) ) {
			return (bool) $value;
		} else if ( ( is_float( $value ) && ! is_nan( $value ) ) && ( $value === (float) 0 || $value === (float) 1 ) ) {
			return (bool) $value;
		} else if ( is_string( $value ) ) {
			$value = trim( $value );
			if ( in_array( $value, $true, true ) ) {
				return true;
			} else if ( in_array( $value, $false, true ) ) {
				return false;
			} else {
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
	 * @param  mixed $value
	 *
	 * @return  mixed  int or false in case of failure to convert to int
	 */
	public static function validate_int( $value ) {
		if ( ! isset( self::$has_filters ) ) {
			self::$has_filters = extension_loaded( 'filter' );
		}

		if ( self::$has_filters ) {
			return filter_var( $value, FILTER_VALIDATE_INT );
		} else {
			return self::emulate_filter_int( $value );
		}
	}

	/**
	 * Cast a value to integer
	 *
	 * @static
	 *
	 * @param    mixed $value Value to cast
	 *
	 * @return    int|bool
	 */
	public static function emulate_filter_int( $value ) {
		if ( is_int( $value ) ) {
			return $value;
		} else if ( is_float( $value ) ) {
			if ( (int) $value == $value && ! is_nan( $value ) ) {
				return (int) $value;
			} else {
				return false;
			}
		} else if ( is_string( $value ) ) {
			$value = trim( $value );
			if ( $value === '' ) {
				return false;
			} else if ( ctype_digit( $value ) ) {
				return (int) $value;
			} else if ( strpos( $value, '-' ) === 0 && ctype_digit( substr( $value, 1 ) ) ) {
				return (int) $value;
			} else {
				return false;
			}
		}
		return false;
	}

	/**
	 * (Un-)schedule the yoast tracking cronjob if the tracking option has changed
	 *
	 * @todo     - [JRF => Yoast] check if this has any impact on other Yoast plugins which may
	 * use the same tracking schedule hook. If so, maybe get any other yoast plugin options,
	 * check for the tracking status and unschedule based on the combined status.
	 *
	 * @static
	 *
	 * @param  mixed $disregard        Not needed - passed by add/update_option action call
	 *                                 Option name if option was added, old value if option was updated
	 * @param  array $value            The (new/current) value of the wpseo option
	 * @param  bool  $force_unschedule Whether to force an unschedule (i.e. on deactivate)
	 *
	 * @return  void
	 */
	public static function schedule_yoast_tracking( $disregard, $value, $force_unschedule = false ) {
		$current_schedule = wp_next_scheduled( 'yoast_tracking' );

		if ( $force_unschedule !== true && ( $value['yoast_tracking'] === true && $current_schedule === false ) ) {
			// The tracking checks daily, but only sends new data every 7 days.
			wp_schedule_event( time(), 'daily', 'yoast_tracking' );
		} elseif ( $force_unschedule === true || ( $value['yoast_tracking'] === false && $current_schedule !== false ) ) {
			wp_clear_scheduled_hook( 'yoast_tracking' );
		}
	}

	/**
	 * Clears the WP or W3TC cache depending on which is used
	 *
	 * @static
	 */
	public static function clear_cache() {
		if ( function_exists( 'w3tc_pgcache_flush' ) ) {
			w3tc_pgcache_flush();
		} elseif ( function_exists( 'wp_cache_clear_cache' ) ) {
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
	 * Clear entire XML sitemap cache
	 *
	 * @param array $types
	 */
	public static function clear_sitemap_cache( $types = array() ) {
		global $wpdb;

		$query = "DELETE FROM $wpdb->options WHERE";

		if( ! empty( $types ) ) {
			$first = true;

			foreach ( $types as $sitemap_type ) {
				if ( ! $first ) {
					$query .= ' OR ';
				}

				$query .= " option_name LIKE '_transient_timeout_wpseo_sitemap_cache_" . $sitemap_type . "_%'";

				$first = false;
			}
		}
		else {
			$query .= " option_name LIKE '_transient_timeout_wpseo_sitemap_%'";
		}

		$wpdb->query( $query );
	}

	/**
	 * Do simple reliable math calculations without the risk of wrong results
	 * @see   http://floating-point-gui.de/
	 * @see   the big red warning on http://php.net/language.types.float.php
	 *
	 * In the rare case that the bcmath extension would not be loaded, it will return the normal calculation results
	 *
	 * @static
	 *
	 * @since 1.5.0
	 *
	 * @param    mixed  $number1      Scalar (string/int/float/bool)
	 * @param    string $action       Calculation action to execute. Valid input:
	 *                                '+' or 'add' or 'addition',
	 *                                '-' or 'sub' or 'subtract',
	 *                                '*' or 'mul' or 'multiply',
	 *                                '/' or 'div' or 'divide',
	 *                                '%' or 'mod' or 'modulus'
	 *                                '=' or 'comp' or 'compare'
	 * @param    mixed  $number2      Scalar (string/int/float/bool)
	 * @param    bool   $round        Whether or not to round the result. Defaults to false.
	 *                                Will be disregarded for a compare operation
	 * @param    int    $decimals     Decimals for rounding operation. Defaults to 0.
	 * @param    int    $precision    Calculation precision. Defaults to 10.
	 *
	 * @return    mixed                Calculation Result or false if either or the numbers isn't scalar or
	 *                                an invalid operation was passed
	 *                                - for compare the result will always be an integer
	 *                                - for all other operations, the result will either be an integer (preferred)
	 *                                or a float
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
					$result = bcdiv( $number1, $number2, $precision ); // string, or NULL if right_operand is 0
				}
				elseif ( $number2 != 0 ) {
					$result = $number1 / $number2;
				}

				if ( ! isset( $result ) ) {
					$result = 0;
				}
				break;

			case '%':
			case 'mod':
			case 'modulus':
				if ( $bc ) {
					$result = bcmod( $number1, $number2, $precision ); // string, or NULL if modulus is 0.
				}
				elseif ( $number2 != 0 ) {
					$result = $number1 % $number2;
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
					$result = bccomp( $number1, $number2, $precision ); // returns int 0, 1 or -1
				} else {
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
				} else {
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
	 * @param int    $type
	 * @param string $variable_name
	 * @param int    $filter
	 *
	 * @return mixed
	 */
	public static function filter_input( $type, $variable_name, $filter = FILTER_DEFAULT ) {
		if ( function_exists( 'filter_input' ) ) {
			return filter_input( $type, $variable_name, $filter );
		} else {
			switch ( $type ) {
				case INPUT_GET:
					$type = $_GET;
					break;
				case INPUT_POST:
					$type = $_POST;
					break;
				case INPUT_SERVER:
					$type = $_SERVER;
					break;
				default:
					return false;
					break;
			}

			if ( isset( $type[$variable_name] ) ) {
				$out = $type[$variable_name];
			} else {
				return false;
			}

			switch ( $filter ) {
				case FILTER_VALIDATE_INT:
					return self::emulate_filter_int( $out );
					break;
				case FILTER_VALIDATE_BOOLEAN:
					return self::emulate_filter_bool( $out );
					break;
				default:
					return (string) $out;
					break;
			}
		}
	}

} /* End of class WPSEO_Utils */
