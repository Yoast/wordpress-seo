<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Implements server-side user input validation.
 *
 * @since 12.0
 */
class Yoast_Input_Validation {

	/**
	 * The error descriptions.
	 *
	 * @since 12.1
	 *
	 * @var array
	 */
	private static $error_descriptions = array();

	/**
	 * Check whether an option group is a Yoast SEO setting.
	 *
	 * The normal pattern is 'yoast' . $option_name . 'options'.
	 *
	 * @since 12.0
	 *
	 * @param string $group_name The option group name.
	 *
	 * @return bool Whether or not it's an Yoast SEO option group.
	 */
	public static function is_yoast_option_group_name( $group_name ) {
		return ( strpos( $group_name, 'yoast' ) !== false );
	}

	/**
	 * Adds an error message to the document title when submitting a settings
	 * form and errors are returned.
	 *
	 * Uses the WordPress `admin_title` filter in the WPSEO_Option subclasses.
	 *
	 * @since 12.0
	 *
	 * @param string $admin_title The page title, with extra context added.
	 *
	 * @return string $admin_title The modified or original admin title.
	 */
	public static function add_yoast_admin_document_title_errors( $admin_title ) {
		$errors      = get_settings_errors();
		$error_count = 0;

		foreach ( $errors as $error ) {
			// For now, filter the admin title only in the Yoast SEO settings pages.
			if ( self::is_yoast_option_group_name( $error['setting'] ) && $error['code'] !== 'settings_updated' ) {
				$error_count++;
			}
		}

		if ( $error_count > 0 ) {
			return sprintf(
				/* translators: %1$s: amount of errors, %2$s: the admin page title */
				_n( 'The form contains %1$s error. %2$s', 'The form contains %1$s errors. %2$s', $error_count, 'wordpress-seo' ),
				number_format_i18n( $error_count ),
				$admin_title
			);
		}

		return $admin_title;
	}

	/**
	 * Checks whether a specific form input field was submitted with an invalid value.
	 *
	 * @since 12.1
	 *
	 * @param string $error_code Must be the same slug-name used for the field variable and for `add_settings_error()`.
	 *
	 * @return bool Whether or not the submitted input field contained an invalid value.
	 */
	public static function yoast_form_control_has_error( $error_code ) {
		$errors = get_settings_errors();

		foreach ( $errors as $error ) {
			if ( $error['code'] === $error_code ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Sets the error descriptions.
	 *
	 * @since 12.1
	 *
	 * @param array $descriptions An associative array of error descriptions. For
	 *                            each entry, the key must be the setting variable.
	 */
	public static function set_error_descriptions( $descriptions = array() ) {
		$defaults = array(
			'baiduverify'     => sprintf(
				/* translators: %s: additional message with the submitted invalid value */
				esc_html__( 'Baidu verification codes can only contain letters, numbers, hyphens, and underscores. %s', 'wordpress-seo' ),
				self::get_dirty_value_message( 'baiduverify' )
			),
			'facebook_site'   => sprintf(
				/* translators: %s: additional message with the submitted invalid value */
				esc_html__( 'Please check the format of the Facebook Page URL you entered. %s', 'wordpress-seo' ),
				self::get_dirty_value_message( 'facebook_site' )
			),
			'fbadminapp'      => sprintf(
				/* translators: %s: additional message with the submitted invalid value */
				esc_html__( 'The Facebook App ID you entered doesn\'t exist. %s', 'wordpress-seo' ),
				self::get_dirty_value_message( 'fbadminapp' )
			),
			'googleverify'    => sprintf(
				/* translators: %s: additional message with the submitted invalid value */
				esc_html__( 'Google verification codes can only contain letters, numbers, hyphens, and underscores. %s', 'wordpress-seo' ),
				self::get_dirty_value_message( 'googleverify' )
			),
			'instagram_url'   => sprintf(
				/* translators: %s: additional message with the submitted invalid value */
				esc_html__( 'Please check the format of the Instagram URL you entered. %s', 'wordpress-seo' ),
				self::get_dirty_value_message( 'instagram_url' )
			),
			'linkedin_url'    => sprintf(
				/* translators: %s: additional message with the submitted invalid value */
				esc_html__( 'Please check the format of the Linkedin URL you entered. %s', 'wordpress-seo' ),
				self::get_dirty_value_message( 'linkedin_url' )
			),
			'msverify'        => sprintf(
				/* translators: %s: additional message with the submitted invalid value */
				esc_html__( 'Bing confirmation codes can only contain letters from A to F, numbers, hyphens, and underscores. %s', 'wordpress-seo' ),
				self::get_dirty_value_message( 'msverify' )
			),
			'myspace_url'     => sprintf(
				/* translators: %s: additional message with the submitted invalid value */
				esc_html__( 'Please check the format of the MySpace URL you entered. %s', 'wordpress-seo' ),
				self::get_dirty_value_message( 'myspace_url' )
			),
			'pinterest_url'   => sprintf(
				/* translators: %s: additional message with the submitted invalid value */
				esc_html__( 'Please check the format of the Pinterest URL you entered. %s', 'wordpress-seo' ),
				self::get_dirty_value_message( 'pinterest_url' )
			),
			'pinterestverify' => sprintf(
				/* translators: %s: additional message with the submitted invalid value */
				esc_html__( 'Pinterest confirmation codes can only contain letters from A to F, numbers, hyphens, and underscores. %s', 'wordpress-seo' ),
				self::get_dirty_value_message( 'pinterestverify' )
			),
			'twitter_site'    => sprintf(
				/* translators: %s: additional message with the submitted invalid value */
				esc_html__( 'Twitter usernames can only contain letters, numbers, and underscores. %s', 'wordpress-seo' ),
				self::get_dirty_value_message( 'twitter_site' )
			),
			'wikipedia_url'   => sprintf(
				/* translators: %s: additional message with the submitted invalid value */
				esc_html__( 'Please check the format of the Wikipedia URL you entered. %s', 'wordpress-seo' ),
				self::get_dirty_value_message( 'wikipedia_url' )
			),
			'yandexverify'    => sprintf(
				/* translators: %s: additional message with the submitted invalid value */
				esc_html__( 'Yandex confirmation codes can only contain letters from A to F, numbers, hyphens, and underscores. %s', 'wordpress-seo' ),
				self::get_dirty_value_message( 'yandexverify' )
			),
			'youtube_url'     => sprintf(
				/* translators: %s: additional message with the submitted invalid value */
				esc_html__( 'Please check the format of the Youtube URL you entered. %s', 'wordpress-seo' ),
				self::get_dirty_value_message( 'youtube_url' )
			),
		);

		$descriptions = wp_parse_args( $descriptions, $defaults );

		self::$error_descriptions = $descriptions;
	}

	/**
	 * Gets all the error descriptions.
	 *
	 * @since 12.1
	 *
	 * @return array An associative array of error descriptions.
	 */
	public static function get_error_descriptions() {
		return self::$error_descriptions;
	}

	/**
	 * Gets a specific error description.
	 *
	 * @since 12.1
	 *
	 * @param string $error_code Code of the error set via `add_settings_error()`, normally the variable name.
	 * @return string The error description.
	 */
	public static function get_error_description( $error_code ) {
		if ( ! isset( self::$error_descriptions[ $error_code ] ) ) {
			return null;
		}

		return self::$error_descriptions[ $error_code ];
	}

	/**
	 * Gets the aria-invalid HTML attribute based on the submitted invalid value.
	 *
	 * @since 12.1
	 *
	 * @param string $error_code Code of the error set via `add_settings_error()`, normally the variable name.
	 * @return string The aria-invalid HTML attribute or empty string.
	 */
	public static function get_the_aria_invalid_attribute( $error_code ) {
		if ( self::yoast_form_control_has_error( $error_code ) ) {
			return ' aria-invalid="true"';
		}

		return '';
	}

	/**
	 * Gets the aria-describedby HTML attribute based on the submitted invalid value.
	 *
	 * @since 12.1
	 *
	 * @param string $error_code Code of the error set via `add_settings_error()`, normally the variable name.
	 * @return string The aria-describedby HTML attribute or empty string.
	 */
	public static function get_the_aria_describedby_attribute( $error_code ) {
		if ( self::yoast_form_control_has_error( $error_code ) && self::get_error_description( $error_code ) ) {
			return ' aria-describedby="' . esc_attr( $error_code ) . '-error-description"';
		}

		return '';
	}

	/**
	 * Gets the error description wrapped in a HTML paragraph.
	 *
	 * @since 12.1
	 *
	 * @param string $error_code Code of the error set via `add_settings_error()`, normally the variable name.
	 * @return string The error description HTML or empty string.
	 */
	public static function get_the_error_description( $error_code ) {
		$error_description = self::get_error_description( $error_code );

		if ( self::yoast_form_control_has_error( $error_code ) && $error_description ) {
			return '<p id="' . esc_attr( $error_code ) . '-error-description" class="yoast-input-validation__error-description">' . $error_description . '</p>';
		}

		return '';
	}

	/**
	 * Adds the submitted invalid value to the WordPress `$wp_settings_errors` global.
	 *
	 * @since 12.1
	 *
	 * @param string $error_code  Code of the error set via `add_settings_error()`, normally the variable name.
	 * @param string $dirty_value The submitted invalid value.
	 * @return void
	 */
	public static function add_dirty_value_to_settings_errors( $error_code, $dirty_value ) {
		global $wp_settings_errors;

		if ( ! is_array( $wp_settings_errors ) ) {
			return;
		}

		foreach ( $wp_settings_errors as $index => $error ) {
			if ( $error['code'] === $error_code ) {
				$wp_settings_errors[ $index ]['yoast_dirty_value'] = $dirty_value;
			}
		}
	}

	/**
	 * Gets an invalid submitted value.
	 *
	 * @since 12.1
	 *
	 * @param string $error_code Code of the error set via `add_settings_error()`, normally the variable name.
	 * @return string The submitted invalid input field value.
	 */
	public static function get_dirty_value( $error_code ) {
		$errors = get_settings_errors();

		foreach ( $errors as $error ) {
			if ( $error['code'] === $error_code && isset( $error['yoast_dirty_value'] ) ) {
				return $error['yoast_dirty_value'];
			}
		}

		return '';
	}

	/**
	 * Gets a specific invalid value message.
	 *
	 * @since 12.1
	 *
	 * @param string $error_code Code of the error set via `add_settings_error()`, normally the variable name.
	 * @return string The error invalid value message or empty string.
	 */
	public static function get_dirty_value_message( $error_code ) {
		$dirty_value = self::get_dirty_value( $error_code );

		if ( $dirty_value ) {
			return sprintf(
				/* translators: %s: form value as submitted. */
				esc_html__( 'The submitted value was: %s', 'wordpress-seo' ),
				$dirty_value
			);
		}

		return '';
	}
}
