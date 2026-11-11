<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals\Options
 */

/**
 * Option: wpseo_premium.
 * This should act as a replacement for premium in free users, therefore avoid displaying any errors
 */
class WPSEO_Option_Free extends WPSEO_Option {
	/**
	 * Add the actions and filters for the option.
	 */
	protected function __construct() {
		parent::__construct();
	}

	/**
	 * Get the singleton instance of this class.
	 *
	 * @return object
	 */
	public static function get_instance() {
		if ( ! ( self::$instance instanceof self ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	

	/**
	 * Validate the option.
	 *
	 * @param array $dirty New value for the option.
	 * @param array $clean Clean value for the option, normally the defaults.
	 * @param array $old   Old value of the option.
	 *
	 * @return array Validated clean value for the option to be saved to the database.
	 */
	protected function validate_option( $dirty, $clean, $old ) {

		foreach ( $clean as $key => $value ) {
			switch ( $key ) {
				case 'access':
					if ( isset( $dirty[ $key ] ) && in_array( $dirty[ $key ], self::$allowed_access_options, true ) ) {
						$clean[ $key ] = $dirty[ $key ];
					}
					elseif ( function_exists( 'add_settings_error' ) ) {
						add_settings_error(
							$this->group_name, // Slug title of the setting.
							$key, // Suffix-ID for the error message box.
							/* translators: %1$s expands to the option name and %2$sexpands to Yoast SEO */
							sprintf( __( '%1$s is not a valid choice for who should be allowed access to the %2$s settings. Value reset to the default.', 'wordpress-seo' ), esc_html( sanitize_text_field( $dirty[ $key ] ) ), 'Yoast SEO' ), // The error message.
							'error' // Message type.
						);
					}
					break;

				case 'defaultblog':
					if ( isset( $dirty[ $key ] ) && ( $dirty[ $key ] !== '' && $dirty[ $key ] !== '-' ) ) {
						$int = WPSEO_Utils::validate_int( $dirty[ $key ] );
						if ( $int !== false && $int > 0 ) {
							// Check if a valid blog number has been received.
							$exists = get_blog_details( $int, false );
							if ( $exists && $exists->deleted === '0' ) {
								$clean[ $key ] = $int;
							}
							elseif ( function_exists( 'add_settings_error' ) ) {
								add_settings_error(
									$this->group_name, // Slug title of the setting.
									$key, // Suffix-ID for the error message box.
									esc_html__( 'The default blog setting must be the numeric blog id of the blog you want to use as default.', 'wordpress-seo' )
										. '<br>'
										. sprintf(
											/* translators: %s is the ID number of a blog. */
											esc_html__( 'This must be an existing blog. Blog %s does not exist or has been marked as deleted.', 'wordpress-seo' ),
											'<strong>' . esc_html( sanitize_text_field( $dirty[ $key ] ) ) . '</strong>'
										), // The error message.
									'error' // Message type.
								);
							}
							unset( $exists );
						}
						elseif ( function_exists( 'add_settings_error' ) ) {
							add_settings_error(
								$this->group_name, // Slug title of the setting.
								$key, // Suffix-ID for the error message box.
								esc_html__( 'The default blog setting must be the numeric blog id of the blog you want to use as default.', 'wordpress-seo' ) . '<br>' . esc_html__( 'No numeric value was received.', 'wordpress-seo' ), // The error message.
								'error' // Message type.
							);
						}
						unset( $int );
					}
					break;

				default:
					$clean[ $key ] = ( isset( $dirty[ $key ] ) ? WPSEO_Utils::validate_bool( $dirty[ $key ] ) : false );
					break;
			}
		}

		return $clean;
	}

	/**
	 * Clean a given option value.
	 *
	 * @param array       $option_value          Old (not merged with defaults or filtered) option value to
	 *                                           clean according to the rules for this option.
	 * @param string|null $current_version       Optional. Version from which to upgrade, if not set,
	 *                                           version specific upgrades will be disregarded.
	 * @param array|null  $all_old_option_values Optional. Only used when importing old options to have
	 *                                           access to the real old values, in contrast to the saved ones.
	 *
	 * @return array Cleaned option.
	 */
	protected function clean_option( $option_value, $current_version = null, $all_old_option_values = null ) {

		/* Move options from very old option to this one. */
		$old_option = null;
		if ( isset( $all_old_option_values ) ) {
			// Ok, we have an import.
			if ( isset( $all_old_option_values['wpseo_indexation'] ) && is_array( $all_old_option_values['wpseo_indexation'] ) && $all_old_option_values['wpseo_indexation'] !== [] ) {
				$old_option = $all_old_option_values['wpseo_indexation'];
			}
		}
		else {
			$old_option = get_option( 'wpseo_indexation' );
		}

		if ( is_array( $old_option ) && $old_option !== [] ) {
			$move = [
				'opengraph',
			];
			foreach ( $move as $key ) {
				if ( isset( $old_option[ $key ] ) && ! isset( $option_value[ $key ] ) ) {
					$option_value[ $key ] = $old_option[ $key ];
				}
			}
			unset( $move, $key );
		}
		unset( $old_option );

		return $option_value;
	}
}
