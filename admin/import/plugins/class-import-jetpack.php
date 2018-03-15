<?php
/**
 * File with the class to handle data from Jetpack's Advanced SEO settings.
 *
 * @package WPSEO\Admin\Import\Plugins
 */

/**
 * Class WPSEO_Import_Jetpack_SEO
 *
 * Class with functionality to import & clean Jetpack SEO post metadata.
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
	 * @var array The arrays of keys to clone into Yoast SEO.
	 */
	protected $clone_keys = array(
		array(
			'old_key' => 'advanced_seo_description',
			'new_key' => 'metadesc',
		),
	);

}
