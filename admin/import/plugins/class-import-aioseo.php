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
	 * Import All In One SEO meta values.
	 *
	 * @return void
	 */
	protected function import() {
		$this->meta_key_clone( '_aioseop_description', 'metadesc' );
		$this->meta_key_clone( '_aioseop_title', 'title' );
		$this->meta_key_clone( '_aioseop_noindex', 'meta-robots-noindex', array( 'on' => 1 ) );
		$this->meta_key_clone( '_aioseop_nofollow', 'meta-robots-nofollow', array( 'on' => 1 ) );
	}
}
