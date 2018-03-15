<?php
/**
 * WPSEO plugin file.
 *
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
	 * @var array The arrays of keys to clone into Yoast SEO.
	 */
	protected $clone_keys = array(
		array(
			'old_key' => '_headspace_description',
			'new_key' => 'metadesc',
		),
		array(
			'old_key' => '_headspace_page_title',
			'new_key' => 'title',
		),
		array(
			'old_key' => '_headspace_noindex',
			'new_key' => 'meta-robots-noindex',
			'convert' => array( 'on' => 1 ),
		),
		array(
			'old_key' => '_headspace_nofollow',
			'new_key' => 'meta-robots-nofollow',
			'convert' => array( 'on' => 1 ),
		),
	);
}
