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
	 * The option_name of the AIOSEO option that contains the settings.
	 */
	const SOURCE_OPTION_NAME = 'aioseo_options';

	/**
	 * The map of aioseo_options to yoast settings.
	 *
	 * @var array
	 */
	protected $aioseo_options_to_yoast_map = [];

	/**
	 * The tab of the aioseo settings we're working with.
	 *
	 * @var string
	 */
	protected $settings_tab = 'archives';

	/**
	 * Builds the mapping that ties AOISEO option keys with Yoast ones and their data transformation method.
	 *
	 * @return void
	 */
	protected function build_mapping() {
		$this->aioseo_options_to_yoast_map = [
			'/author/title'           => [
				'yoast_name'       => 'title-author-wpseo',
				'transform_method' => 'simple_import',
			],
			'/author/metaDescription' => [
				'yoast_name'       => 'metadesc-author-wpseo',
				'transform_method' => 'simple_import',
			],
			'/date/title'             => [
				'yoast_name'       => 'title-archive-wpseo',
				'transform_method' => 'simple_import',
			],
			'/date/metaDescription'   => [
				'yoast_name'       => 'metadesc-archive-wpseo',
				'transform_method' => 'simple_import',
			],
			'/search/title'           => [
				'yoast_name'       => 'title-search-wpseo',
				'transform_method' => 'simple_import',
			],
			'/author/advanced/robotsMeta/noindex' => [
				'yoast_name'       => 'noindex-author-wpseo',
				'transform_method' => 'import_author_noindex',
			],
			// '/date/advanced/robotsMeta/noindex'    => [
			// 	'yoast_name'       => 'noindex-archive-wpseo',
			// 	'transform_method' => 'import_archive_noindex',
			// ],
		];
	}
	

	/**
	 * Imports the author archives noindex, taking into consideration whether they defer to global defaults.
	 *
	 * @param bool $default Whether author archives defer to global defaults.
	 *
	 * @return bool The transformed separator.
	 */
	public function import_author_noindex( $noindex ) {
		$aioseo_settings = \json_decode( \get_option( 'aioseo_options', [] ), true );

		if ( empty( $aioseo_settings ) || ! isset( $aioseo_settings['searchAppearance']['archives']['author']['advanced']['robotsMeta']['default'] ) ) {
			return false;
		}

		$defers_to_defaults = $aioseo_settings['searchAppearance']['archives']['author']['advanced']['robotsMeta']['default'];

		if ( $defers_to_defaults ) {
			return $this->get_global_noindex( $aioseo_settings );
		}

		return isset( $aioseo_settings['searchAppearance']['archives']['author']['advanced']['robotsMeta']['noindex'] ) ? $aioseo_settings['searchAppearance']['archives']['author']['advanced']['robotsMeta']['noindex'] : false;
	}
}
