<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Configuration_Structure.
 */
class WPSEO_Configuration_Translations {

	/**
	 * Registered steps.
	 *
	 * @var array
	 */
	protected $translations = [];

	/**
	 * The locale.
	 *
	 * @var string
	 */
	protected $locale;

	/**
	 * Sets the translations based on the file.
	 *
	 * @param string $locale The locale to retrieve the translations for.
	 */
	public function __construct( $locale ) {
		$this->locale       = $locale;
		$this->translations = $this->get_translations_from_file();
	}

	/**
	 * Retrieve the translations.
	 *
	 * @return array
	 */
	public function retrieve() {
		return $this->translations;
	}

	/**
	 * Retrieves the translations from the JSON-file.
	 *
	 * @return array Array with the translations.
	 */
	protected function get_translations_from_file() {

		$file = plugin_dir_path( WPSEO_FILE ) . 'languages/yoast-components-' . $this->locale . '.json';
		if ( file_exists( $file ) ) {
			// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Retrieving a local file.
			$file = file_get_contents( $file );
			if ( is_string( $file ) && $file !== '' ) {
				return json_decode( $file, true );
			}
		}

		return [];
	}
}
