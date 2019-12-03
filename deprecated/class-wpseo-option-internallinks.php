<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals\Options
 */

// Mark this file as deprecated.
_deprecated_file( __FILE__, 'WPSEO 7.0' );

/**
 * Option: wpseo_internallinks.
 *
 * @deprecated 7.0
 */
class WPSEO_Option_InternalLinks {

	/**
	 * Option name.
	 *
	 * @var string
	 * @deprecated 7.0
	 */
	public $option_name = '';

	/**
	 * Catch all other calls to this deprecated class.
	 *
	 * @param string $method The method to 'call'.
	 * @param array  $args   Possibly given arguments.
	 */
	public function __call( $method, array $args = [] ) {
		_deprecated_function( $method, 'WPSEO 7.0' );
	}

	/**
	 * Get the singleton instance of this class.
	 *
	 * @deprecated 7.0
	 *
	 * @return void
	 */
	public static function get_instance() {
		_deprecated_function( __METHOD__, 'WPSEO 7.0' );
	}

	/**
	 * Translate strings used in the option defaults.
	 *
	 * @deprecated 7.0
	 *
	 * @return void
	 */
	public function translate_defaults() {
		_deprecated_function( __METHOD__, 'WPSEO 7.0' );
	}

	/**
	 * Add dynamically created default options based on available post types and taxonomies.
	 *
	 * @deprecated 7.0
	 *
	 * @return void
	 */
	public function enrich_defaults() {
		_deprecated_function( __METHOD__, 'WPSEO 7.0' );
	}

	/**
	 * With the changes to v1.5, the defaults for some of the textual breadcrumb settings are added
	 * dynamically, but empty strings are allowed.
	 * This caused issues for people who left the fields empty on purpose relying on the defaults.
	 * This little routine fixes that.
	 * Needs to be run on 'init' hook at prio 3 to make sure the defaults are translated.
	 *
	 * @deprecated 7.0
	 *
	 * @return void
	 */
	public function bring_back_defaults() {
		_deprecated_function( __METHOD__, 'WPSEO 7.0' );
	}

	/**
	 * Validate the option.
	 *
	 * @deprecated 7.0
	 *
	 * @return void
	 */
	protected function validate_option() {
		_deprecated_function( __METHOD__, 'WPSEO 7.0' );
	}

	/**
	 * Retrieve a list of the allowed post types as breadcrumb parent for a taxonomy.
	 * Helper method for validation.
	 *
	 * {@internal Don't make static as new types may still be registered.}}
	 *
	 * @deprecated 7.0
	 *
	 * @return void
	 */
	protected function get_allowed_post_types() {
		_deprecated_function( __METHOD__, 'WPSEO 7.0' );
	}

	/**
	 * Clean a given option value.
	 *
	 * @deprecated 7.0
	 *
	 * @return void
	 */
	protected function clean_option() {
		_deprecated_function( __METHOD__, 'WPSEO 7.0' );
	}
}
