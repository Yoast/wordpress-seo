<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Premium_Admin_Assets
 */
class WPSEO_Premium_Admin_Assets extends WPSEO_Admin_Asset_Manager {

	/**
	 *  Prefix for naming the assets.
	 */
	const PREFIX = 'wp-seo-premium';

	/**
	 * Child constructor for WPSEO_Premium_Admin_Assets.
	 */
	public function __construct() {
		parent::__construct( new WPSEO_Admin_Asset_SEO_Location( WPSEO_PREMIUM_FILE ), self::PREFIX );
	}

	protected function scripts_to_be_registered() {

		$select2_language = 'en';
		$user_locale      = WPSEO_Utils::get_user_locale();
		$language         = WPSEO_Utils::get_language( $user_locale );

		// Todo: find out it the lines below is also applicable to premium.
		if ( file_exists( WPSEO_PATH . "js/dist/select2/i18n/{$user_locale}.js" ) ) {
			$select2_language = $user_locale; // Chinese and some others use full locale.
		}
		elseif ( file_exists( WPSEO_PATH . "js/dist/select2/i18n/{$language}.js" ) ) {
			$select2_language = $language;
		}

		$flat_version = $this->flatten_version( WPSEO_VERSION );

		$backport_wp_dependencies = array( self::PREFIX . 'react-dependencies' );

		// If Gutenberg is present we can borrow their globals for our own.
		if ( function_exists( 'gutenberg_register_scripts_and_styles' ) ) {
			$backport_wp_dependencies[] = 'wp-element';
			$backport_wp_dependencies[] = 'wp-data';

			/*
			 * The version of TinyMCE that Gutenberg uses is incompatible with
			 * the one core uses. So we need to make sure that the core version
			 * is used in the classic editor.
			 *
			 * $_GET is used here because as far as I am aware you cannot use
			 * filter_input to check for the existence of a query variable.
			 */
			if ( wp_script_is( 'tinymce-latest', 'registered' ) && isset( $_GET['classic-editor'] ) ) {
				wp_deregister_script( 'tinymce-latest' );
				wp_register_script( 'tinymce-latest', includes_url( 'js/tinymce/' ) . 'wp-tinymce.php', array( 'jquery' ), false, true );
			}
		}

		return array(
			// example:
//			array(
//				'name' => 'react-dependencies',
//				// Load webpack-commons for bundle support.
//				'src'  => 'commons-' . $flat_version,
//				'deps' => array(
//					self::PREFIX . 'babel-polyfill',
//				),
//			),
			//todo: add files to this manager.
		);
	}

	/**
	 * Returns the styles that need to be registered.
	 *
	 * @todo Data format is not self-documenting. Needs explanation inline. R.
	 *
	 * @return array styles that need to be registered.
	 */
	protected function styles_to_be_registered() {
		$flat_version = $this->flatten_version( WPSEO_VERSION );

		return array(
			//todo: add files to this manager.
		);
	}

}
