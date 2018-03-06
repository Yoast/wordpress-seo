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
		WPSEO_Meta::replace_meta( '_su_description', WPSEO_Meta::$meta_prefix . 'metadesc', false );
		WPSEO_Meta::replace_meta( '_su_meta_robots_nofollow', WPSEO_Meta::$meta_prefix . 'meta-robots-nofollow', false );
		WPSEO_Meta::replace_meta( '_su_meta_robots_noindex', WPSEO_Meta::$meta_prefix . 'meta-robots-nofollow', false );
		WPSEO_Meta::replace_meta( '_su_og_title', WPSEO_Meta::$meta_prefix . 'opengraph-title', false );
		WPSEO_Meta::replace_meta( '_su_og_description', WPSEO_Meta::$meta_prefix . 'opengraph-description', false );
		WPSEO_Meta::replace_meta( '_su_og_image', WPSEO_Meta::$meta_prefix . 'opengraph-image', false );
		WPSEO_Meta::replace_meta( '_su_title', WPSEO_Meta::$meta_prefix . 'title', false );
	}

}
