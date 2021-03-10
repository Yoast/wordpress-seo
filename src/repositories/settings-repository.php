<?php

namespace Yoast\WP\SEO\Repositories;

use Yoast\WP\SEO\Models\Settings\Open_Graph_Settings;
use Yoast\WP\SEO\Models\Settings\Search_Engine_Verify_Settings;
use Yoast\WP\SEO\Models\Settings\Social_Settings;
use Yoast\WP\SEO\Models\Settings_Model;

/**
 * Class Settings_Repository.
 *
 * @method Open_Graph_Settings           for_open_graph()
 * @method Search_Engine_Verify_Settings for_search_engine_verifications()
 * @method Social_Settings               for_social()
 */
class Settings_Repository {

	/**
	 * Represents the option name.
	 */
	const OPTION_NAME = 'yoast_seo_settings';

	/**
	 * The initializers for the different settings classes.
	 *
	 * @var array<string, string>
	 */
	protected $initializers = [
		'social'                      => Social_Settings::class,
		'open-graph'                  => Open_Graph_Settings::class,
		'search-engine-verifications' => Search_Engine_Verify_Settings::class,
	];

	/**
	 * Holds the initialized settings where the key is the setting name and the value is the instance.
	 *
	 * @var array<string, Settings_Model>
	 */
	protected $settings = [];

	/**
	 * Represents the current state for the option value from that database.
	 *
	 * @var array
	 */
	protected $option_value;

	/**
	 * Sets the current options state with value from the option.
	 */
	public function __construct() {
		$this->option_value = \get_option( self::OPTION_NAME, [] );
	}

	/**
	 * Magic method that magically makes an instance of a Settings Model for requested method.
	 *
	 * @param string $method    The requested method.
	 * @param array  $arguments The arguments that are given.
	 *
	 * @return Settings_Model
	 *
	 * @phpcs:disable Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed -- $arguments will be implemented later.
	 */
	public function __call( $method, $arguments ) {
		if ( strpos( $method, 'for_' ) !== 0 ) {
			return null;
		}

		$settings_name = substr( $method, 4 );
		$settings_name = str_replace( '_', '-', $settings_name );

		if ( ! array_key_exists( $settings_name, $this->initializers ) ) {
			return null;
		}

		return $this->get_setting( $settings_name );
	}

	// 	phpcs:enable Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed

	/**
	 * Gets the settings class for given settings name.
	 *
	 * @param string $settings_name The name to get the settings class for.
	 *
	 * @return Settings_Model The initialized class for given settings name.
	 */
	protected function get_setting( $settings_name ) {
		if ( ! array_key_exists( $settings_name, $this->settings ) ) {
			$class_name = $this->initializers[ $settings_name ];

			$this->settings[ $settings_name ] = new $class_name( $this );
		}

		return $this->settings[ $settings_name ];
	}
}
