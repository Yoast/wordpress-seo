<?php
/**
 * @package WPSEO\Admin\Import\Plugins
 */

/**
 * Class with functionality to import Yoast SEO settings from All In One SEO.
 */
class WPSEO_Import_AIOSEO extends WPSEO_Plugin_Importer {
	/**
	 * @var string The plugin name
	 */
	protected $plugin_name = 'All In One SEO Pack';

	/**
	 * @var string Meta key, used in like clause for detect query.
	 */
	protected $meta_key = '_aioseop_%';

	/**
	 * Removes the All in one SEO pack data from the database.
	 *
	 * @return void
	 */
	protected function cleanup_helper() {
		$this->wpdb->query( "DELETE FROM {$this->wpdb->postmeta} WHERE meta_key LIKE '_aioseop_%'" );
	}

	/**
	 * Import All In One SEO meta values.
	 *
	 * @return void
	 */
	protected function import_helper() {
		WPSEO_Meta::replace_meta( '_aioseop_description', WPSEO_Meta::$meta_prefix . 'metadesc', false );
		WPSEO_Meta::replace_meta( '_aioseop_keywords', WPSEO_Meta::$meta_prefix . 'metakeywords', false );
		WPSEO_Meta::replace_meta( '_aioseop_title', WPSEO_Meta::$meta_prefix . 'title', false );
	}
}
