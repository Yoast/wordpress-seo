<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Localizes JavaScript files.
 *
 * @codeCoverageIgnore
 * @deprecated 18.0
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
	 *
	 * @codeCoverageIgnore
	 * @deprecated 18.0
	 */
	public function __construct() {
		_deprecated_constructor( __CLASS__, '18.0' );
		$this->asset_manager = new WPSEO_Admin_Asset_Manager();
	}

	/**
	 * Localizes the given script with the JavaScript translations.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 18.0
	 *
	 * @param string $script_handle The script handle to localize for.
	 *
	 * @return void
	 */
	public function localize_script( $script_handle ) {
		_deprecated_function( __FUNCTION__, '18.0' );
		$translations = [
			'yoast-components'    => $this->get_translations( 'yoast-components' ),
			'wordpress-seo'       => $this->get_translations( 'wordpress-seojs' ),
			'yoast-schema-blocks' => $this->get_translations( 'yoast-schema-blocks' ),
		];
		$this->asset_manager->localize_script( $script_handle, 'wpseoYoastJSL10n', $translations );
	}

	/**
	 * Returns translations necessary for JS files.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 18.0
	 *
	 * @param string $component The component to retrieve the translations for.
	 * @return object|null The translations in a Jed format for JS files.
	 */
	protected function get_translations( $component ) {
		_deprecated_function( __FUNCTION__, '18.0' );
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
