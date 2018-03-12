<?php
/**
 * @package WPSEO\Admin\Import\Plugins
 */

/**
 * Class WPSEO_Import_HeadSpace
 *
 * Class with functionality to import Yoast SEO settings from other plugins.
 */
class WPSEO_Import_HeadSpace extends WPSEO_Plugin_Importer {
	/**
	 * @var string The plugin name
	 */
	protected $plugin_name = 'HeadSpace SEO';

	/**
	 * @var string Meta key, used in like clause for detect query.
	 */
	protected $meta_key = '_headspace_%';

	/**
	 * Imports the simple meta fields.
	 *
	 * @return void
	 */
	protected function import() {
		$this->meta_key_clone( '_headspace_description', 'metadesc' );
		$this->meta_key_clone( '_headspace_page_title', 'title' );

		/**
		 * @todo [JRF => whomever] verify how headspace sets these metas ( 'noindex', 'nofollow', 'noarchive', 'noodp', 'noydir' )
		 * and if the values saved are concurrent with the ones we use (i.e. 0/1/2)
		 */
		$this->meta_key_clone( '_headspace_noindex', 'meta-robots-noindex' );
		$this->meta_key_clone( '_headspace_nofollow', 'meta-robots-nofollow' );
	}

}
