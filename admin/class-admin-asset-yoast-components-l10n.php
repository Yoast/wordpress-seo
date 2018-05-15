<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Localizes yoast-components.
 */
final class WPSEO_Admin_Asset_Yoast_Components_l10n {
	/**
	 * Localizes the given script with the yoast-components translations.
	 *
	 * @param string $script_handle The script handle to localize for.
	 *
	 * @return void
	 */
	public function localize_script( $script_handle ) {
		wp_localize_script( $script_handle, 'wpseoYoastComponentsL10n', $this->get_translations() );
	}

	/**
	 * Returns translations necessary for yoast-components.
	 *
	 * @return object The translations in a Jed format for yoast-components.
	 */
	protected function get_translations() {
		$locale = WPSEO_Utils::get_user_locale();

		$file = plugin_dir_path( WPSEO_FILE ) . 'languages/yoast-components-' . $locale . '.json';
		if ( file_exists( $file ) ) {
			$file = file_get_contents( $file );
			if ( is_string( $file ) && $file !== '' ) {
				return json_decode( $file, true );
			}
		}

		return null;
	}
}
