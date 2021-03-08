<?php


namespace Yoast\WP\SEO\Models;

use Exception;

/**
 * Class Settings_Model.
 */
abstract class Settings_Model {

	/**
	 * List of settings stored as key-value pairs, where the name is the key and value is the value.
	 *
	 * @var array<string, mixed>
	 */
	protected $values = [];

	/**
	 * Get value of setting.
	 *
	 * @param string $name Name of the setting which value to return.
	 *
	 * @return mixed The value for the setting.
	 *
	 * @throws Exception When the setting does not exist.
	 */
	public function __get( $name ) {
		if ( ! $this->is_existing_setting( $name ) ) {
			throw new Exception( "Setting $name does not exist." );
		}

		if ( ! array_key_exists( $name, $this->values ) ) {
			$settings = $this->get_settings();

			// Store the default value for the setting.
			$this->values[ $name ] = $settings[ $name ]['default'];
		}

		return $this->values[ $name ];
	}

	/**
	 * Set setting with name to value.
	 *
	 * @param string $name  Name of the setting whose value will be set.
	 * @param mixed  $value The new value for the setting.
	 *
	 * @return void
	 *
	 * @throws Exception When the setting does not exist.
	 */
	public function __set( $name, $value ) {
		if ( ! $this->is_existing_setting( $name ) ) {
			throw new Exception( "Setting $name does not exist." );
		}

		$this->values[ $name ] = $value;
	}

	/**
	 * Check if given setting exists.
	 *
	 * @param string $name Name of setting that might exist.
	 *
	 * @return bool Whether the setting exists.
	 */
	protected function is_existing_setting( $name ) {
		$settings = $this->get_settings();

		return array_key_exists( $name, $settings );
	}

	/**
	 * Get the definitions for the settings.
	 *
	 * @return array<string, array> Description of the settings with the setting name as key.
	 */
	abstract public function get_settings();
}
