<?php

namespace Yoast\WP\SEO\Actions\Importing;

/**
 * Importing action for AIOSEO default archive settings data.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aioseo_Default_Archive_Settings_Importing_Action extends Abstract_Aioseo_Settings_Importing_Action {

	/**
	 * The plugin of the action.
	 */
	const PLUGIN = 'aioseo';

	/**
	 * The type of the action.
	 */
	const TYPE = 'default_archive_settings';

	/**
	 * The placeholder of a default archive.
	 */
	const YOAST_NAME_PLACEHOLDER = '[default_archive]';

	/**
	 * The option_name of the AIOSEO option that contains the settings.
	 */
	const SOURCE_OPTION_NAME = 'aioseo_options';

	/**
	 * The map that ties AIOSEO setting types to Yoast types.
	 *
	 * @var array
	 */
	protected $setting_types_map = [
		'date' => 'archive',
	];

	/**
	 * The map of aioseo_options to yoast settings.
	 *
	 * @var array
	 */
	protected $aioseo_options_to_yoast_map = [
		'title'           => [
			'yoast_name'       => 'title-' . self::YOAST_NAME_PLACEHOLDER . '-wpseo',
			'transform_method' => 'simple_import',
		],
		'metaDescription' => [
			'yoast_name'       => 'metadesc-' . self::YOAST_NAME_PLACEHOLDER . '-wpseo',
			'transform_method' => 'simple_import',
		],
	];

	/**
	 * The tab of the aioseo settings we're working with.
	 *
	 * @var string
	 */
	protected $settings_tab = 'archives';
}
