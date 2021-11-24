<?php

namespace Yoast\WP\SEO\Actions\Importing;

/**
 * Importing action for AIOSEO custom archive settings data.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aioseo_Custom_Archive_Settings_Importing_Action extends Abstract_Aioseo_Settings_Chunked_Importing_Action {

	/**
	 * The plugin of the action.
	 */
	const PLUGIN = 'aioseo';

	/**
	 * The type of the action.
	 */
	const TYPE = 'custom_archive_settings';

	/**
	 * The placeholder of a custom archive.
	 */
	const META_NAME_PLACEHOLDER = '[custom_archive]';

	/**
	 * The map of aioseo_options to yoast meta.
	 *
	 * @var array
	 */
	protected $aioseo_options_to_yoast_map = [
		'title'           => [
			'meta_name'      => 'title-ptarchive-' . self::META_NAME_PLACEHOLDER,
			'transform_data' => 'simple_import',
		],
		'metaDescription' => [
			'meta_name'      => 'metadesc-ptarchive-' . self::META_NAME_PLACEHOLDER,
			'transform_data' => 'simple_import',
		],
	];

	/**
	 * The tab of the aioseo settings we're working with.
	 *
	 * @var string
	 */
	protected $settings_tab = 'archives';
}
