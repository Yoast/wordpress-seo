<?php

namespace Yoast\WP\SEO\Integrations;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Feature_Flag_Conditional;

/**
 * Gathers all feature flags and surfaces them to the JavaScript side of the plugin.
 */
class Feature_Flag_Integration implements Integration_Interface {

	/**
	 * All of known the feature flag conditionals.
	 *
	 * @var Feature_Flag_Conditional[]
	 */
	protected $feature_flags;

	/**
	 * The admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Feature_Flag_Integration constructor.
	 *
	 * @param WPSEO_Admin_Asset_Manager $asset_manager    The admin asset manager.
	 * @param Feature_Flag_Conditional  ...$feature_flags All of the known feature flag conditionals.
	 */
	public function __construct( WPSEO_Admin_Asset_Manager $asset_manager, Feature_Flag_Conditional ...$feature_flags ) {
		$this->feature_flags = $feature_flags;
		$this->asset_manager = $asset_manager;
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return string[] The conditionals based on which this loadable should be active.
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'admin_init', [ $this, 'add_feature_flags' ] );
	}

	/**
	 * Gather all the feature flags and inject them into the JavaScript.
	 */
	public function add_feature_flags() {
		$feature_flag_object = [];
		foreach ( $this->feature_flags as $feature_flag ) {
			$feature_flag_object[ $feature_flag->get_feature_flag() ] = $feature_flag->is_met();
		}

		$this->asset_manager->localize_script( 'feature-flag-package', 'wpseoFeatureFlags', $feature_flag_object );
	}
}
