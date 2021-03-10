<?php

namespace Yoast\WP\SEO\Repositories;

use Exception;
use InvalidArgumentException;
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
	protected $models = [];

	/**
	 * Represents the current state for the settings.
	 *
	 * @var array
	 */
	protected $settings;

	/**
	 * Sets the current settings state with value from the option.
	 */
	public function __construct() {
		$this->settings = \get_option( self::OPTION_NAME, [] );
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

		return $this->get_settings_model( $settings_name );
	}

	// 	phpcs:enable Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed

	/**
	 * Adds an initializer to the list of initializers..
	 *
	 * @param string $name The name of the initializer.
	 * @param string $class_name Fully Qualified Classname for class that extends Setting_Model to initialize.
	 *
	 * @throws Exception When the initializer already exists.
	 */
	public function add_initializer( $name, $class_name ) {
		if ( array_key_exists( $name, $this->initializers ) ) {
			throw new Exception( 'Initializer for ' . $name . ' already exists.' );
		}

		$this->initializers[ $name ] = $class_name;
	}

	/**
	 * Handles the saving of the settings.
	 *
	 * @param array $settings The settings to save.
	 *
	 * @throws InvalidArgumentException When the passed settings are not an array.
	 */
	public function save( $settings ) {
		if ( ! is_array( $settings ) ) {
			throw new InvalidArgumentException( 'Settings is not an array' );
		}

		$new_settings_value   = \array_replace_recursive( $this->settings, $settings );
		$clean_settings_value = $this->clean_settings( $new_settings_value );
		$is_saved             = \update_option( self::OPTION_NAME, $clean_settings_value, true );

		if ( $is_saved ) {
			$this->settings = $clean_settings_value;
		}
	}

	/**
	 * Clean the settings by removing possibly dirty settings that are no longer available.
	 *
	 * @param array $new_settings The complete group of settings that we want to save.
	 *
	 * @return array The cleaned group of settings that can be saved.
	 */
	protected function clean_settings( $new_settings ) {
		$settings_per_model = [];
		foreach ( array_keys( $this->initializers ) as $model_name ) {
			// This might initialize models at this point.
			$model                = $this->get_settings_model( $model_name );
			$settings_per_model[] = array_keys( $model->get_settings() );
		}

		// Merge all settings into 1 array.
		$valid_settings = array_merge( [], ...$settings_per_model );

		// Return only the valid settings with their values.
		return array_intersect_key(
			$new_settings,
			array_flip( $valid_settings )
		);
	}

	/**
	 * Gets the settings class for given settings name.
	 *
	 * @param string $settings_name The name to get the settings class for.
	 *
	 * @return Settings_Model The initialized class for given settings name.
	 */
	protected function get_settings_model( $settings_name ) {
		if ( ! array_key_exists( $settings_name, $this->models ) ) {
			$class_name        = $this->initializers[ $settings_name ];
			$initialized_model = new $class_name( $this );

			$this->initialize_settings_for_model( $initialized_model, $this->settings );

			$this->models[ $settings_name ] = $initialized_model;
		}

		return $this->models[ $settings_name ];
	}

	/**
	 * Initializes the settings for the given model. It only sets the settings known by the repository.
	 *
	 * @param Settings_Model $model    The model to set the properties for.
	 * @param array          $settings The settings to use for setting the properties.
	 */
	protected function initialize_settings_for_model( Settings_Model $model, $settings ) {
		$setting_names = array_keys( $model->get_settings() );

		foreach ( $setting_names as $setting_name ) {
			if ( ! isset( $settings[ $setting_name ] ) ) {
				continue;
			}

			$model->$setting_name = $settings[ $setting_name ];
		}
	}
}
