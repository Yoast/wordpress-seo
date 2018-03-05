<?php
/**
 * @package WPSEO\Admin\Import\Plugins
 */

/**
 * Class WPSEO_Import_Jetpack_SEO
 *
 * Class with functionality to import Yoast SEO settings from Jetpack Advanced SEO.
 */
class WPSEO_Import_Jetpack_SEO extends WPSEO_Plugin_Importer {
	/**
	 * @var string The plugin name
	 */
	protected $plugin_name = 'Jetpack';

	/**
	 * @var string Meta key, used in like clause for detect query.
	 */
	protected $meta_key = 'advanced_seo_description';

	/**
	 * Removes the Jetpack SEO data from the database.
	 *
	 * @return void
	 */
	protected function cleanup_helper() {
		$this->wpdb->query( "DELETE FROM {$this->wpdb->postmeta} WHERE meta_key = 'advanced_seo_description'" );
	}

	/**
	 * Imports Jetpack SEO meta values.
	 *
	 * @return void
	 */
	protected function import_helper() {
		WPSEO_Meta::replace_meta( 'advanced_seo_description', WPSEO_Meta::$meta_prefix . 'metadesc', false );
	}

}
