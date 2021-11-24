<?php

namespace Yoast\WP\SEO\Actions\Importing;

/**
 * Importing action for AIOSEO posttype defaults settings data.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aioseo_Taxonomy_Settings_Importing_Action extends Abstract_Aioseo_Settings_Chunked_Importing_Action {

	/**
	 * The plugin of the action.
	 */
	const PLUGIN = 'aioseo';

	/**
	 * The type of the action.
	 */
	const TYPE = 'taxonomy_settings';

	/**
	 * The placeholder of a posttype.
	 */
	const META_NAME_PLACEHOLDER = '[taxonomy]';

	/**
	 * The map of aioseo_options to yoast meta.
	 *
	 * @var array
	 */
	protected $aioseo_options_to_yoast_map = [
		'title'           => [
			'meta_name'      => 'title-tax-' . self::META_NAME_PLACEHOLDER,
			'transform_data' => 'simple_import',
		],
		'metaDescription' => [
			'meta_name'      => 'metadesc-tax-' . self::META_NAME_PLACEHOLDER,
			'transform_data' => 'simple_import',
		],
	];

	/**
	 * The tab of the aioseo settings we're working with.
	 *
	 * @var string
	 */
	protected $settings_tab = 'taxonomies';
}
