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
	 * @var array
	 */
	protected $defaults = [
		// Non-form fields, set via (ajax) function.
		'tracking'                                 => null,
		'license_server_version'                   => false,
		'ms_defaults_set'                          => false,
		'ignore_search_engines_discouraged_notice' => false,
		'indexing_first_time'                      => true,
		'indexing_started'                         => null,
		'indexing_reason'                          => '',
		'indexables_indexing_completed'            => false,
		'index_now_key'                            => '',
		// Non-form field, should only be set via validation routine.
		'version'                                  => '', // Leave default as empty to ensure activation/upgrade works.
		'previous_version'                         => '',
		// Form fields.
		'disableadvanced_meta'                     => true,
		'enable_headless_rest_endpoints'           => true,
		'ryte_indexability'                        => true,
		'baiduverify'                              => '', // Text field.
		'googleverify'                             => '', // Text field.
		'msverify'                                 => '', // Text field.
		'yandexverify'                             => '',
		'site_type'                                => '', // List of options.
		'has_multiple_authors'                     => '',
		'environment_type'                         => '',
		'content_analysis_active'                  => true,
		'keyword_analysis_active'                  => true,
		'enable_admin_bar_menu'                    => true,
		'enable_cornerstone_content'               => true,
		'enable_xml_sitemap'                       => true,
		'enable_text_link_counter'                 => true,
		'enable_index_now'                         => false,
		'show_onboarding_notice'                   => false,
		'first_activated_on'                       => false,
		'myyoast-oauth'                            => [
			'config'        => [
				'clientId' => null,
				'secret'   => null,
			],
			'access_tokens' => [],
		],
		'semrush_integration_active'               => true,
		'semrush_tokens'                           => [],
		'semrush_country_code'                     => 'us',
		'permalink_structure'                      => '',
		'home_url'                                 => '',
		'dynamic_permalinks'                       => false,
		'category_base_url'                        => '',
		'tag_base_url'                             => '',
		'custom_taxonomy_slugs'                    => [],
		'enable_enhanced_slack_sharing'            => true,
		'zapier_integration_active'                => false,
		'zapier_subscription'                      => [],
		'zapier_api_key'                           => '',
		'enable_metabox_insights'                  => true,
		'enable_link_suggestions'                  => true,
		'algolia_integration_active'               => false,
		'import_cursors'                           => [],
		'workouts_data'                            => [ 'configuration' => [ 'finishedSteps' => [] ] ],
		'configuration_finished_steps'             => [],
		'dismiss_configuration_workout_notice'     => false,
		'importing_completed'                      => [],
		'wincher_integration_active'               => true,
		'wincher_tokens'                           => [],
		'wincher_automatically_add_keyphrases'     => false,
		'wincher_website_id'                       => '',
		'wordproof_integration_active'             => false,
		'wordproof_integration_changed'            => false,
		'first_time_install'                       => false,
		'should_redirect_after_install_free'       => false,
		'activation_redirect_timestamp_free'       => 0,
		'remove_feed_global'                       => false,
		'remove_feed_global_comments'              => false,
		'remove_feed_post_comments'                => false,
		'remove_feed_authors'                      => false,
		'remove_feed_categories'                   => false,
		'remove_feed_tags'                         => false,
		'remove_feed_custom_taxonomies'            => false,
		'remove_feed_post_types'                   => false,
		'remove_feed_search'                       => false,
		'remove_atom_rdf_feeds'                    => false,
		'remove_shortlinks'                        => false,
		'remove_rest_api_links'                    => false,
		'remove_rsd_wlw_links'                     => false,
		'remove_oembed_links'                      => false,
		'remove_generator'                         => false,
		'remove_emoji_scripts'                     => false,
		'remove_powered_by_header'                 => false,
		'remove_pingback_header'                   => false,
	];

	/**
	 * Sub-options which should not be overloaded with multi-site defaults.
	 *
	 * @var array
	 */
	public $ms_exclude = [
		'ignore_search_engines_discouraged_notice',
		/* Privacy. */
		'baiduverify',
		'googleverify',
		'msverify',
		'yandexverify',
	];

	/**
	 * Possible values for the site_type option.
	 *
	 * @var array
	 */
	protected $site_types = [
		'',
		'blog',
		'shop',
		'news',
		'smallBusiness',
		'corporateOther',
		'personalOther',
	];

	/**
	 * Possible environment types.
	 *
	 * @var array
	 */
	protected $environment_types = [
		'',
		'production',
		'staging',
		'development',
	];

	/**
	 * Possible has_multiple_authors options.
	 *
	 * @var array
	 */
	protected $has_multiple_authors_options = [
		'',
		true,
		false,
	];

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
	 *       is updated early on and if so, change the call to schedule these for a later action on add/update
	 *       instead of running them straight away.
	 */
	protected function __construct() {
		parent::__construct();

		/**
		 * Filter: 'wpseo_enable_tracking' - Enables the data tracking of Yoast SEO Premium.
		 *
		 * @api string $is_enabled The enabled state. Default is false.
		 */
		$this->defaults['tracking'] = apply_filters( 'wpseo_enable_tracking', false );

		/* Clear the cache on update/add. */
		add_action( 'add_option_' . $this->option_name, [ 'WPSEO_Utils', 'clear_cache' ] );
		add_action( 'update_option_' . $this->option_name, [ 'WPSEO_Utils', 'clear_cache' ] );

		add_filter( 'admin_title', [ 'Yoast_Input_Validation', 'add_yoast_admin_document_title_errors' ] );

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
	 * @param array $dirty New value for the option.
	 * @param array $clean Clean value for the option, normally the defaults.
	 * @param array $old   Old value of the option.
	 *
	 * @return array Validated clean value for the option to be saved to the database.
	 */
	protected function validate_option( $dirty, $clean, $old ) {

		foreach ( $clean as $key => $value ) {
			switch ( $key ) {
				case 'version':
					$clean[ $key ] = WPSEO_VERSION;
					break;
				case 'previous_version':
				case 'semrush_country_code':
				case 'license_server_version':
				case 'home_url':
				case 'zapier_api_key':
				case 'index_now_key':
				case 'wincher_website_id':
					if ( isset( $dirty[ $key ] ) ) {
						$clean[ $key ] = $dirty[ $key ];
					}
					break;
				case 'indexing_reason':
					if ( isset( $dirty[ $key ] ) ) {
						$clean[ $key ] = sanitize_text_field( $dirty[ $key ] );
					}
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
				case 'ignore_search_engines_discouraged_notice':
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
				case 'indexing_started':
				case 'activation_redirect_timestamp_free':
					$clean[ $key ] = false;
					if ( isset( $dirty[ $key ] ) ) {
						if ( $dirty[ $key ] === false || WPSEO_Utils::validate_int( $dirty[ $key ] ) ) {
							$clean[ $key ] = $dirty[ $key ];
						}
					}
					break;

				case 'tracking':
					$clean[ $key ] = ( isset( $dirty[ $key ] ) ? WPSEO_Utils::validate_bool( $dirty[ $key ] ) : null );
					break;

				case 'myyoast_oauth':
				case 'semrush_tokens':
				case 'custom_taxonomy_slugs':
				case 'zapier_subscription':
				case 'wincher_tokens':
				case 'workouts_data':
				case 'configuration_finished_steps':
					$clean[ $key ] = $old[ $key ];

					if ( isset( $dirty[ $key ] ) ) {
						$items = $dirty[ $key ];
						if ( ! is_array( $items ) ) {
							$items = json_decode( $dirty[ $key ], true );
						}

						if ( is_array( $items ) ) {
							$clean[ $key ] = $dirty[ $key ];
						}
					}

					break;

				case 'permalink_structure':
				case 'category_base_url':
				case 'tag_base_url':
					if ( isset( $dirty[ $key ] ) ) {
						$clean[ $key ] = sanitize_option( $key, $dirty[ $key ] );
					}
					break;

				case 'import_cursors':
				case 'importing_completed':
					if ( isset( $dirty[ $key ] ) && is_array( $dirty[ $key ] ) ) {
						$clean[ $key ] = $dirty[ $key ];
					}
					break;

				case 'wordproof_integration_active':
					$clean[ $key ] = ( isset( $dirty[ $key ] ) ? WPSEO_Utils::validate_bool( $dirty[ $key ] ) : false );
					// If the setting has changed, record it.
					if ( $old[ $key ] !== $clean[ $key ] ) {
						$clean['wordproof_integration_changed'] = true;
					}
					break;


				/*
				* Boolean (checkbox) fields.
				*/

				/*
				 * Covers:
				 *  'disableadvanced_meta'
				 *  'enable_headless_rest_endpoints'
				 *  'yoast_tracking'
				 *  'dynamic_permalinks'
				 *  'indexing_first_time'
				 *  'first_time_install'
				 *  'remove_feed_global'
				 *  'remove_feed_global_comments'
				 *  'remove_feed_post_comments'
				 *  'remove_feed_authors'
				 *  'remove_feed_categories'
				 *  'remove_feed_tags'
				 *  'remove_feed_custom_taxonomies'
				 *  'remove_feed_post_types'
				 *  'remove_feed_search'
				 *  'remove_atom_rdf_feeds'
				 *  'remove_shortlinks'
				 *  'remove_rest_api_links'
				 *  'remove_rsd_wlw_links'
				 *  'remove_oembed_links'
				 *  'remove_generator'
				 *  'remove_emoji_scripts'
				 *  'remove_powered_by_header'
				 *  'remove_pingback_header'
				 *  'should_redirect_after_install_free'
				 *  and most of the feature variables.
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
	public function verify_features_against_network( $options = [] ) {
		if ( ! is_array( $options ) || empty( $options ) ) {
			return $options;
		}

		// For the feature variables, set their values to off in case they are disabled.
		$feature_vars = [
			'disableadvanced_meta'           => false,
			'ryte_indexability'              => false,
			'content_analysis_active'        => false,
			'keyword_analysis_active'        => false,
			'enable_admin_bar_menu'          => false,
			'enable_cornerstone_content'     => false,
			'enable_xml_sitemap'             => false,
			'enable_text_link_counter'       => false,
			'enable_metabox_insights'        => false,
			'enable_link_suggestions'        => false,
			'enable_headless_rest_endpoints' => false,
			'tracking'                       => false,
			'enable_enhanced_slack_sharing'  => false,
			'semrush_integration_active'     => false,
			'zapier_integration_active'      => false,
			'wincher_integration_active'     => false,
			'remove_feed_global'             => false,
			'remove_feed_global_comments'    => false,
			'remove_feed_post_comments'      => false,
			'enable_index_now'               => false,
			'remove_feed_authors'            => false,
			'remove_feed_categories'         => false,
			'remove_feed_tags'               => false,
			'remove_feed_custom_taxonomies'  => false,
			'remove_feed_post_types'         => false,
			'remove_feed_search'             => false,
			'remove_atom_rdf_feeds'          => false,
			'remove_shortlinks'              => false,
			'remove_rest_api_links'          => false,
			'remove_rsd_wlw_links'           => false,
			'remove_oembed_links'            => false,
			'remove_generator'               => false,
			'remove_emoji_scripts'           => false,
			'remove_powered_by_header'       => false,
			'remove_pingback_header'         => false,
		];

		// We can reuse this logic from the base class with the above defaults to parse with the correct feature values.
		$options = $this->prevent_disabled_options_update( $options, $feature_vars );

		return $options;
	}

	/**
	 * Gets the filter hook name and callback for adjusting the retrieved option value
	 * against the network-allowed features.
	 *
	 * @return array Array where the first item is the hook name, the second is the hook callback,
	 *               and the third is the hook priority.
	 */
	protected function get_verify_features_option_filter_hook() {
		return [
			"option_{$this->option_name}",
			[ $this, 'verify_features_against_network' ],
			11,
		];
	}

	/**
	 * Gets the filter hook name and callback for adjusting the default option value against the network-allowed features.
	 *
	 * @return array Array where the first item is the hook name, the second is the hook callback,
	 *               and the third is the hook priority.
	 */
	protected function get_verify_features_default_option_filter_hook() {
		return [
			"default_option_{$this->option_name}",
			[ $this, 'verify_features_against_network' ],
			11,
		];
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
		// Deal with value change from text string to boolean.
		$value_change = [
			'ignore_search_engines_discouraged_notice',
		];

		$target_values = [
			'ignore',
			'done',
		];

		foreach ( $value_change as $key ) {
			if ( isset( $option_value[ $key ] )
				&& in_array( $option_value[ $key ], $target_values, true )
			) {
				$option_value[ $key ] = true;
			}
		}

		return $option_value;
	}
}
