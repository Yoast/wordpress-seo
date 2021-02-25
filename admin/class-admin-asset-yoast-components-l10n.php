<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Localizes JavaScript files.
 */
final class WPSEO_Admin_Asset_Yoast_Components_L10n {

	/**
	 * Represents the asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * WPSEO_Admin_Asset_Yoast_Components_L10n constructor.
	 */
	public function __construct() {
		$this->asset_manager = new WPSEO_Admin_Asset_Manager();
	}

	/**
	 * Localizes the given script with the JavaScript translations.
	 *
	 * @param string $script_handle The script handle to localize for.
	 *
	 * @return void
	 */
	public function localize_script( $script_handle ) {
		$translations = [
			'yoast-components' => $this->get_translations( 'yoast-components' ),
			'wordpress-seo'    => $this->get_translations( 'wordpress-seojs' ),
		];
		$this->asset_manager->localize_script( $script_handle, 'wpseoYoastJSL10n', $translations );
	}

	/**
	 * Returns translations necessary for JS files.
	 *
	 * @param string $component The component to retrieve the translations for.
	 * @return object The translations in a Jed format for JS files.
	 */
	protected function get_translations( $component ) {
		$locale = \get_user_locale();

		$file = WPSEO_PATH . 'languages/' . $component . '-' . $locale . '.json';
		if ( file_exists( $file ) ) {
			// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Retrieving a local file.
			$file = file_get_contents( $file );
			if ( is_string( $file ) && $file !== '' ) {
				return json_decode( $file, true );
			}
		}

		return null;
	}
}
