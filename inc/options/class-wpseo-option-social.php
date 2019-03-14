<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals\Options
 */

/**
 * Option: wpseo_social.
 */
class WPSEO_Option_Social extends WPSEO_Option {

	/**
	 * @var  string  Option name.
	 */
	public $option_name = 'wpseo_social';

	/**
	 * @var  array  Array of defaults for the option.
	 *        Shouldn't be requested directly, use $this->get_defaults();
	 */
	protected $defaults = array(
		// Form fields.
		'facebook_site'         => '', // Text field.
		'instagram_url'         => '',
		'linkedin_url'          => '',
		'myspace_url'           => '',
		'og_default_image'      => '', // Text field.
		'og_default_image_id'   => '',
		'og_frontpage_title'    => '', // Text field.
		'og_frontpage_desc'     => '', // Text field.
		'og_frontpage_image'    => '', // Text field.
		'og_frontpage_image_id' => '',
		'opengraph'             => true,
		'pinterest_url'         => '',
		'pinterestverify'       => '',
		'plus-publisher'        => '', // Text field.
		'twitter'               => true,
		'twitter_site'          => '', // Text field.
		'twitter_card_type'     => 'summary_large_image',
		'youtube_url'           => '',
		'wikipedia_url'         => '',
		// Form field, but not always available.
		'fbadminapp'            => '', // Facebook app ID.
	);

	/**
	 * @var array  Array of sub-options which should not be overloaded with multi-site defaults.
	 */
	public $ms_exclude = array(
		/* Privacy. */
		'pinterestverify',
		'fbadminapp',
	);

	/**
	 * @var  array  Array of allowed twitter card types.
	 *              While we only have the options summary and summary_large_image in the
	 *              interface now, we might change that at some point.
	 *
	 * {@internal Uncomment any of these to allow them in validation *and* automatically
	 *            add them as a choice in the options page.}}
	 */
	public static $twitter_card_types = array(
		'summary'             => '',
		'summary_large_image' => '',
		// 'photo'               => '',
		// 'gallery'             => '',
		// 'app'                 => '',
		// 'player'              => '',
		// 'product'             => '',
	);

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
	 * Translate/set strings used in the option defaults.
	 *
	 * @return void
	 */
	public function translate_defaults() {
		self::$twitter_card_types['summary']             = __( 'Summary', 'wordpress-seo' );
		self::$twitter_card_types['summary_large_image'] = __( 'Summary with large image', 'wordpress-seo' );
	}

	/**
	 * Validate the option.
	 *
	 * @param  array $dirty New value for the option.
	 * @param  array $clean Clean value for the option, normally the defaults.
	 * @param  array $old   Old value of the option.
	 *
	 * @return  array      Validated clean value for the option to be saved to the database.
	 */
	protected function validate_option( $dirty, $clean, $old ) {

		foreach ( $clean as $key => $value ) {
			switch ( $key ) {
				/* text fields */
				case 'og_frontpage_desc':
				case 'og_frontpage_title':
					if ( isset( $dirty[ $key ] ) && $dirty[ $key ] !== '' ) {
						$clean[ $key ] = WPSEO_Utils::sanitize_text_field( $dirty[ $key ] );
					}
					break;

				case 'og_default_image_id':
				case 'og_frontpage_image_id':
					if ( isset( $dirty[ $key ] ) ) {
						$clean[ $key ] = (int) $dirty[ $key ];

						if ( $dirty[ $key ] === '' ) {
							$clean[ $key ] = $dirty[ $key ];
						}
					}
					break;

				/* URL text fields - no ftp allowed. */
				case 'facebook_site':
				case 'instagram_url':
				case 'linkedin_url':
				case 'myspace_url':
				case 'pinterest_url':
				case 'plus-publisher':
				case 'og_default_image':
				case 'og_frontpage_image':
				case 'youtube_url':
				case 'wikipedia_url':
					$this->validate_url( $key, $dirty, $old, $clean );
					break;

				case 'pinterestverify':
					$this->validate_verification_string( $key, $dirty, $old, $clean );
					break;

				/* twitter user name */
				case 'twitter_site':
					if ( isset( $dirty[ $key ] ) && $dirty[ $key ] !== '' ) {
						$twitter_id = sanitize_text_field( ltrim( $dirty[ $key ], '@' ) );
						/**
						 * From the Twitter documentation about twitter screen names:
						 * Typically a maximum of 15 characters long, but some historical accounts
						 * may exist with longer names.
						 * A username can only contain alphanumeric characters (letters A-Z, numbers 0-9)
						 * with the exception of underscores.
						 *
						 * @link https://support.twitter.com/articles/101299-why-can-t-i-register-certain-usernames
						 * @link https://dev.twitter.com/docs/platform-objects/users
						 */
						if ( preg_match( '`^[A-Za-z0-9_]{1,25}$`', $twitter_id ) ) {
							$clean[ $key ] = $twitter_id;
						}
						elseif ( preg_match( '`^http(?:s)?://(?:www\.)?twitter\.com/(?P<handle>[A-Za-z0-9_]{1,25})/?$`', $twitter_id, $matches ) ) {
							$clean[ $key ] = $matches['handle'];
						}
						else {
							if ( isset( $old[ $key ] ) && $old[ $key ] !== '' ) {
								$twitter_id = sanitize_text_field( ltrim( $old[ $key ], '@' ) );
								if ( preg_match( '`^[A-Za-z0-9_]{1,25}$`', $twitter_id ) ) {
									$clean[ $key ] = $twitter_id;
								}
							}
							if ( function_exists( 'add_settings_error' ) ) {
								add_settings_error(
									$this->group_name, // Slug title of the setting.
									'_' . $key, // Suffix-id for the error message box.
									sprintf(
										/* translators: %s expands to a twitter user name. */
										__( '%s does not seem to be a valid Twitter user-id. Please correct.', 'wordpress-seo' ),
										'<strong>' . esc_html( sanitize_text_field( $dirty[ $key ] ) ) . '</strong>'
									), // The error message.
									'error' // Error type, either 'error' or 'updated'.
								);
							}
						}
						unset( $twitter_id );
					}
					break;

				case 'twitter_card_type':
					if ( isset( $dirty[ $key ], self::$twitter_card_types[ $dirty[ $key ] ] ) && $dirty[ $key ] !== '' ) {
						$clean[ $key ] = $dirty[ $key ];
					}
					break;

				/* boolean fields */
				case 'opengraph':
				case 'twitter':
					$clean[ $key ] = ( isset( $dirty[ $key ] ) ? WPSEO_Utils::validate_bool( $dirty[ $key ] ) : false );
					break;

				case 'fbadminapp':
					if ( isset( $dirty[ $key ] ) && ! empty( $dirty[ $key ] ) ) {
						$clean[ $key ] = $dirty[ $key ];
					}
					break;
			}
		}

		return $clean;
	}

	/**
	 * Clean a given option value.
	 *
	 * @param  array  $option_value          Old (not merged with defaults or filtered) option value to
	 *                                       clean according to the rules for this option.
	 * @param  string $current_version       Optional. Version from which to upgrade, if not set,
	 *                                       version specific upgrades will be disregarded.
	 * @param  array  $all_old_option_values Optional. Only used when importing old options to have
	 *                                       access to the real old values, in contrast to the saved ones.
	 *
	 * @return  array Cleaned option.
	 */
	protected function clean_option( $option_value, $current_version = null, $all_old_option_values = null ) {

		/* Move options from very old option to this one. */
		$old_option = null;
		if ( isset( $all_old_option_values ) ) {
			// Ok, we have an import.
			if ( isset( $all_old_option_values['wpseo_indexation'] ) && is_array( $all_old_option_values['wpseo_indexation'] ) && $all_old_option_values['wpseo_indexation'] !== array() ) {
				$old_option = $all_old_option_values['wpseo_indexation'];
			}
		}
		else {
			$old_option = get_option( 'wpseo_indexation' );
		}

		if ( is_array( $old_option ) && $old_option !== array() ) {
			$move = array(
				'opengraph',
			);
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
