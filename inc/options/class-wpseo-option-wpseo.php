<?php
/**
 * @package WPSEO\Internals\Options
 */

/**
 * Option: wpseo
 */
class WPSEO_Option_Wpseo extends WPSEO_Option {

	/**
	 * @var  string  option name
	 */
	public $option_name = 'wpseo';

	/**
	 * @var  array  Array of defaults for the option
	 *        Shouldn't be requested directly, use $this->get_defaults();
	 */
	protected $defaults = array(
		// Non-form fields, set via (ajax) function.
		'blocking_files'                  => array(),
		'ms_defaults_set'                 => false,
		// Non-form field, should only be set via validation routine.
		'version'                         => '', // Leave default as empty to ensure activation/upgrade works.

		// Form fields.
		'company_logo'                    => '',
		'company_name'                    => '',
		'company_or_person'               => '',
		'disableadvanced_meta'            => true,
		'onpage_indexability'             => true,
		'googleverify'                    => '', // Text field.
		'msverify'                        => '', // Text field.
		'person_name'                     => '',
		'website_name'                    => '',
		'alternate_website_name'          => '',
		'yandexverify'                    => '',
		'site_type'                       => '', // List of options.
		'has_multiple_authors'            => '',
		'environment_type'                => '',
		'content_analysis_active'         => true,
		'keyword_analysis_active'         => true,
		'enable_setting_pages'            => true,
		'enable_admin_bar_menu'           => true,
		'enable_cornerstone_content'      => true,
		'enable_text_link_counter'        => true,
		'show_onboarding_notice'          => false,
		'first_activated_on'              => false,
	);

	/**
	 * @var array Sub-options which should not be overloaded with multi-site defaults
	 */
	public $ms_exclude = array(
		/* privacy */
		'alexaverify',
		'googleverify',
		'msverify',
		'yandexverify',
	);

	/** @var array Possible values for the site_type option */
	protected $site_types = array(
		'',
		'blog',
		'shop',
		'news',
		'smallBusiness',
		'corporateOther',
		'personalOther',
	);

	/** @var array Possible environment types. */
	protected $environment_types = array(
		'',
		'production',
		'staging',
		'development',
	);

	/** @var array Possible has_multiple_authors options. */
	protected $has_multiple_authors_options = array(
		'',
		true,
		false,
	);


	/**
	 * Add the actions and filters for the option
	 *
	 * @todo [JRF => testers] Check if the extra actions below would run into problems if an option
	 * is updated early on and if so, change the call to schedule these for a later action on add/update
	 * instead of running them straight away
	 *
	 * @return \WPSEO_Option_Wpseo
	 */
	protected function __construct() {
		parent::__construct();

		/* Clear the cache on update/add */
		add_action( 'add_option_' . $this->option_name, array( 'WPSEO_Utils', 'clear_cache' ) );
		add_action( 'update_option_' . $this->option_name, array( 'WPSEO_Utils', 'clear_cache' ) );

		/**
		 * Filter the `wpseo` option defaults.
		 *
		 * @param array $defaults Array the defaults for the `wpseo` option attributes.
		 */
		$this->defaults = apply_filters( 'wpseo_option_wpseo_defaults', $this->defaults );
	}


	/**
	 * Get the singleton instance of this class
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
	 * Validate the option
	 *
	 * @param  array $dirty New value for the option.
	 * @param  array $clean Clean value for the option, normally the defaults.
	 * @param  array $old   Old value of the option.
	 *
	 * @return  array      Validated clean value for the option to be saved to the database
	 */
	protected function validate_option( $dirty, $clean, $old ) {

		foreach ( $clean as $key => $value ) {
			switch ( $key ) {
				case 'version':
					$clean[ $key ] = WPSEO_VERSION;
					break;


				case 'blocking_files':
					/*
					 * {@internal [JRF] To really validate this we should also do a file_exists()
					 * on each array entry and remove files which no longer exist, but that might be overkill.}}
					 */
					if ( isset( $dirty[ $key ] ) && is_array( $dirty[ $key ] ) ) {
						$clean[ $key ] = array_unique( $dirty[ $key ] );
					}
					elseif ( isset( $old[ $key ] ) && is_array( $old[ $key ] ) ) {
						$clean[ $key ] = array_unique( $old[ $key ] );
					}
					break;

				case 'company_or_person':
					if ( isset( $dirty[ $key ] ) && $dirty[ $key ] !== '' ) {
						if ( in_array( $dirty[ $key ], array( 'company', 'person' ) ) ) {
							$clean[ $key ] = $dirty[ $key ];
						}
					}
					break;

				/* text fields */
				case 'company_name':
				case 'person_name':
				case 'website_name':
				case 'alternate_website_name':
					if ( isset( $dirty[ $key ] ) && $dirty[ $key ] !== '' ) {
						$clean[ $key ] = sanitize_text_field( $dirty[ $key ] );
					}
					break;

				case 'company_logo':
					$this->validate_url( $key, $dirty, $old, $clean );
					break;

				/* verification strings */
				case 'googleverify':
				case 'msverify':
				case 'yandexverify':
					$this->validate_verification_string( $key, $dirty, $old, $clean );
					break;

				/*
				 * Boolean dismiss warnings - not fields - may not be in form
				 * (and don't need to be either as long as the default is false).
				 */
				case 'ms_defaults_set':
					if ( isset( $dirty[ $key ] ) ) {
						$clean[ $key ] = WPSEO_Utils::validate_bool( $dirty[ $key ] );
					}
					elseif ( isset( $old[ $key ] ) ) {
						$clean[ $key ] = WPSEO_Utils::validate_bool( $old[ $key ] );
					}
					break;

				case 'site_type':
					$clean[ $key ] = $old[ $key ];
					if ( isset( $dirty[ $key ] ) && in_array( $dirty[ $key ], $this->site_types, true ) ) {
						$clean[ $key ] = $dirty[ $key ];
					}
					break;

				case 'environment_type':
					$clean[ $key ] = $old[ $key ];
					if ( isset( $dirty[ $key ] ) && in_array( $dirty[ $key ], $this->environment_types, true ) ) {
						$clean[ $key ] = $dirty[ $key ];
					}
					break;

				case 'has_multiple_authors':
					$clean[ $key ] = $old[ $key ];
					if ( isset( $dirty[ $key ] ) && in_array( $dirty[ $key ], $this->has_multiple_authors_options, true ) ) {
						$clean[ $key ] = $dirty[ $key ];
					}

					break;

				case 'first_activated_on':
					$clean[ $key ] = false;
					if ( isset( $dirty[ $key ] ) ) {
						if ( $dirty[ $key ] === false || WPSEO_Utils::validate_int( $dirty[ $key ] ) ) {
							$clean[ $key ] = $dirty[ $key ];
						}
					}
					break;

				/*
				 * Boolean (checkbox) fields.
				 */

				/*
				 * Covers:
				 *  'disableadvanced_meta'
				 *  'yoast_tracking'
				 */
				default:
					$clean[ $key ] = ( isset( $dirty[ $key ] ) ? WPSEO_Utils::validate_bool( $dirty[ $key ] ) : false );
					break;
			}
		}

		return $clean;
	}


	/**
	 * Clean a given option value
	 *
	 * @param  array  $option_value          Old (not merged with defaults or filtered) option value to
	 *                                       clean according to the rules for this option.
	 * @param  string $current_version       (optional) Version from which to upgrade, if not set,
	 *                                       version specific upgrades will be disregarded.
	 * @param  array  $all_old_option_values (optional) Only used when importing old options to have
	 *                                       access to the real old values, in contrast to the saved ones.
	 *
	 * @return  array            Cleaned option
	 */
	protected function clean_option( $option_value, $current_version = null, $all_old_option_values = null ) {
		return $option_value;
	}
}
