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
	 * Imports Jetpack SEO meta values.
	 *
	 * @return bool Import success status.
	 */
	protected function import() {
		return $this->meta_key_clone( 'advanced_seo_description', 'metadesc' );
	}

}
