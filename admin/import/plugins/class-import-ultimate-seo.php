<?php
/**
 * File with the class to handle data from Ultimate SEO.
 *
 * @package WPSEO\Admin\Import\Plugins
 */

/**
 * Class with functionality to import & clean Ultimate SEO post metadata.
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
	 * @var array The arrays of keys to clone into Yoast SEO.
	 */
	protected $clone_keys  = array(
		array(
			'old_key' => '_su_description',
			'new_key' => 'metadesc',
		),
		array(
			'old_key' => '_su_title',
			'new_key' => 'title',
		),
		array(
			'old_key' => '_su_og_title',
			'new_key' => 'opengraph-title',
		),
		array(
			'old_key' => '_su_og_description',
			'new_key' => 'opengraph-description',
		),
		array(
			'old_key' => '_su_og_image',
			'new_key' => 'opengraph-image',
		),
		array(
			'old_key' => '_su_meta_robots_noindex',
			'new_key' => 'meta-robots-noindex',
			'convert' => array( 'on' => 1 ),
		),
		array(
			'old_key' => '_su_meta_robots_nofollow',
			'new_key' => 'meta-robots-nofollow',
			'convert' => array( 'on' => 1 ),
		),
	);

}
