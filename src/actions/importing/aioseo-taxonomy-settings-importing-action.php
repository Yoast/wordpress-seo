<?php

namespace Yoast\WP\SEO\Actions\Importing;

/**
 * Importing action for AIOSEO taxonomies settings data.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aioseo_Taxonomy_Settings_Importing_Action extends Abstract_Aioseo_Settings_Importing_Action {

	/**
	 * The plugin of the action.
	 */
	const PLUGIN = 'aioseo';

	/**
	 * The type of the action.
	 */
	const TYPE = 'taxonomy_settings';

	/**
	 * The placeholder of a taxonomy.
	 */
	const YOAST_NAME_PLACEHOLDER = '[taxonomy]';

	/**
	 * The option_name of the AIOSEO option that contains the settings.
	 */
	const SOURCE_OPTION_NAME = 'aioseo_options_dynamic';

	/**
	 * The map of aioseo_options to yoast settings.
	 *
	 * @var array
	 */
	protected $aioseo_options_to_yoast_map = [
		'title'           => [
			'yoast_name'       => 'title-tax-' . self::YOAST_NAME_PLACEHOLDER,
			'transform_method' => 'simple_import',
		],
		'metaDescription' => [
			'yoast_name'       => 'metadesc-tax-' . self::YOAST_NAME_PLACEHOLDER,
			'transform_method' => 'simple_import',
		],
	];

	/**
	 * The tab of the aioseo settings we're working with.
	 *
	 * @var string
	 */
	protected $settings_tab = 'taxonomies';
}
