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
	 * The option_name of the AIOSEO option that contains the settings.
	 */
	const SOURCE_OPTION_NAME = 'aioseo_options_dynamic';

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
	protected $settings_tab = 'taxonomies';

	/**
	 * Additional mapping between AiOSEO replace vars and Yoast replace vars.
	 *
	 * @var array
	 *
	 * @see https://yoast.com/help/list-available-snippet-variables-yoast-seo/
	 */
	protected $replace_vars_edited_map = [
		'#taxonomy_title' => '%%term_title%%',
	];

	/**
	 * Builds the mapping that ties AOISEO option keys with Yoast ones and their data transformation method.
	 *
	 * @return void
	 */
	protected function build_mapping() {
		$taxonomy_objects = \get_taxonomies( [ 'public' => true ], 'object' );

		foreach ( $taxonomy_objects as $tax ) {
			// Use all the public taxonomies.
			$this->aioseo_options_to_yoast_map[ '/' . $tax->name . '/title' ]           = [
				'yoast_name'       => 'title-tax-' . $tax->name,
				'transform_method' => 'simple_import',
			];
			$this->aioseo_options_to_yoast_map[ '/' . $tax->name . '/metaDescription' ] = [
				'yoast_name'       => 'metadesc-tax-' . $tax->name,
				'transform_method' => 'simple_import',
			];
		}
	}
}
