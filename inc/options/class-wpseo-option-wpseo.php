<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals\Options
 */

/**
 * Option: wpseo.
 */
class WPSEO_Option_Wpseo extends WPSEO_Option {

	/**
	 * Option name.
	 *
	 * @var string
	 */
	public $option_name = 'wpseo';

	/**
	 * Array of defaults for the option.
	 *
	 * {@internal Shouldn't be requested directly, use $this->get_defaults();}}
	 *
	 * @var  array
	 */
	protected $defaults = array(
		// Non-form fields, set via (ajax) function.
		'ms_defaults_set'                 => false,
		// Non-form field, should only be set via validation routine.
		'version'                         => '', // Leave default as empty to ensure activation/upgrade works.

		// Form fields.
		'disableadvanced_meta'            => true,
		'onpage_indexability'             => true,
		'baiduverify'                     => '', // Text field.
		'googleverify'                    => '', // Text field.
		'msverify'                        => '', // Text field.
		'yandexverify'                    => '',
		'site_type'                       => '', // List of options.
		'has_multiple_authors'            => '',
		'environment_type'                => '',
		'content_analysis_active'         => true,
		'keyword_analysis_active'         => true,
		'enable_admin_bar_menu'           => true,
		'enable_cornerstone_content'      => true,
		'enable_xml_sitemap'              => true,
		'enable_text_link_counter'        => true,
		'show_onboarding_notice'          => false,
		'first_activated_on'              => false,
		'recalibration_beta'              => false,
	);

	/**
	 * Sub-options which should not be overloaded with multi-site defaults.
	 *
	 * @var array
	 */
	public $ms_exclude = array(
		/* Privacy. */
		'baiduverify',
		'googleverify',
		'msverify',
		'yandexverify',
	);

	/**
	 * Possible values for the site_type option.
	 *
	 * @var array
	 */
	protected $site_types = array(
		'',
		'blog',
		'shop',
		'news',
		'smallBusiness',
		'corporateOther',
		'personalOther',
	);

	/**
	 * Possible environment types.
	 *
	 * @var array
	 */
	protected $environment_types = array(
		'',
		'production',
		'staging',
		'development',
	);

	/**
	 * Possible has_multiple_authors options.
	 *
	 * @var array
	 */
	protected $has_multiple_authors_options = array(
		'',
		true,
		false,
	);

	/**
	 * Name for an option higher in the hierarchy to override setting access.
	 *
	 * @var string
	 */
	protected $override_option_name = 'wpseo_ms';

	/**
	 * Add the actions and filters for the option.
	 *
	 * @todo [JRF => testers] Check if the extra actions below would run into problems if an option
	 * is updated early on and if so, change the call to schedule these for a later action on add/update
	 * instead of running them straight away.
	 *
	 * @return \WPSEO_Option_Wpseo
	 */
	protected function __construct() {
		parent::__construct();

		/* Clear the cache on update/add. */
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
	 * Add filters to make sure that the option is merged with its defaults before being returned.
	 *
	 * @return void
	 */
	public function add_option_filters() {
		parent::add_option_filters();

		list( $hookname, $callback, $priority ) = $this->get_verify_features_option_filter_hook();

		if ( has_filter( $hookname, $callback ) === false ) {
			add_filter( $hookname, $callback, $priority );
		}
	}

	/**
	 * Remove the option filters.
	 * Called from the clean_up methods to make sure we retrieve the original old option.
	 *
	 * @return void
	 */
	public function remove_option_filters() {
		parent::remove_option_filters();

		list( $hookname, $callback, $priority ) = $this->get_verify_features_option_filter_hook();

		remove_filter( $hookname, $callback, $priority );
	}

	/**
	 * Add filters to make sure that the option default is returned if the option is not set.
	 *
	 * @return void
	 */
	public function add_default_filters() {
		parent::add_default_filters();

		list( $hookname, $callback, $priority ) = $this->get_verify_features_default_option_filter_hook();

		if ( has_filter( $hookname, $callback ) === false ) {
			add_filter( $hookname, $callback, $priority );
		}
	}

	/**
	 * Remove the default filters.
	 * Called from the validate() method to prevent failure to add new options.
	 *
	 * @return void
	 */
	public function remove_default_filters() {
		parent::remove_default_filters();

		list( $hookname, $callback, $priority ) = $this->get_verify_features_default_option_filter_hook();

		remove_filter( $hookname, $callback, $priority );
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
				case 'version':
					$clean[ $key ] = WPSEO_VERSION;
					break;

				/* Verification strings. */
				case 'baiduverify':
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
	 * Verifies that the feature variables are turned off if the network is configured so.
	 *
	 * @param mixed $options Value of the option to be returned. Typically an array.
	 *
	 * @return mixed Filtered $options value.
	 */
	public function verify_features_against_network( $options = array() ) {
		if ( ! is_array( $options ) || empty( $options ) ) {
			return $options;
		}

		// For the feature variables, set their values to off in case they are disabled.
		$feature_vars = array(
			'disableadvanced_meta'       => false,
			'onpage_indexability'        => false,
			'content_analysis_active'    => false,
			'keyword_analysis_active'    => false,
			'enable_admin_bar_menu'      => false,
			'enable_cornerstone_content' => false,
			'enable_xml_sitemap'         => false,
			'enable_text_link_counter'   => false,
		);

		// We can reuse this logic from the base class with the above defaults to parse with the correct feature values.
		$options = $this->prevent_disabled_options_update( $options, $feature_vars );

		return $options;
	}

	/**
	 * Gets the filter hook name and callback for adjusting the retrieved option value against the network-allowed features.
	 *
	 * @return array Array where the first item is the hook name, the second is the hook callback,
	 *               and the third is the hook priority.
	 */
	protected function get_verify_features_option_filter_hook() {
		return array(
			"option_{$this->option_name}",
			array( $this, 'verify_features_against_network' ),
			11,
		);
	}

	/**
	 * Gets the filter hook name and callback for adjusting the default option value against the network-allowed features.
	 *
	 * @return array Array where the first item is the hook name, the second is the hook callback,
	 *               and the third is the hook priority.
	 */
	protected function get_verify_features_default_option_filter_hook() {
		return array(
			"default_option_{$this->option_name}",
			array( $this, 'verify_features_against_network' ),
			11,
		);
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
	 * @return  array            Cleaned option.
	 */
	protected function clean_option( $option_value, $current_version = null, $all_old_option_values = null ) {
		return $option_value;
	}
}
