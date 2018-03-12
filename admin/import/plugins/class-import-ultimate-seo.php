<?php
/**
 * @package WPSEO\Admin\Import\Plugins
 */

/**
 * Class with functionality to import Yoast SEO settings from Ultimate SEO.
 */
class WPSEO_Import_Ultimate_SEO extends WPSEO_Plugin_Importer {
	/**
	 * @var string The plugin name
	 */
	protected $plugin_name = 'Ultimate SEO';

	/**
	 * @var string Meta key, used in like clause for detect query.
	 */
	protected $meta_key = '_su_%';

	/**
	 * Imports the Ultimate SEO  meta values.
	 *
	 * @returns void
	 */
	protected function import() {
		$this->meta_key_clone( '_su_description', 'metadesc' );
		$this->meta_key_clone( '_su_meta_robots_nofollow', 'meta-robots-nofollow' );
		$this->meta_key_clone( '_su_meta_robots_noindex', 'meta-robots-noindex' );
		$this->meta_key_clone( '_su_og_title', 'opengraph-title' );
		$this->meta_key_clone( '_su_og_description', 'opengraph-description' );
		$this->meta_key_clone( '_su_og_image', 'opengraph-image' );
		$this->meta_key_clone( '_su_title', 'title' );
	}

}
