<?php

namespace Yoast\WP\SEO\Actions\Importing;

/**
 * Importing action for AIOSEO general settings.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aioseo_General_Settings_Importing_Action extends Abstract_Aioseo_Settings_Importing_Action {

	/**
	 * The plugin of the action.
	 */
	const PLUGIN = 'aioseo';

	/**
	 * The type of the action.
	 */
	const TYPE = 'general_settings';

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
	protected $settings_tab = 'global';

	/**
	 * Transforms the site represents setting.
	 *
	 * @param string $site_represents The site represents setting.
	 *
	 * @return string The transformed site represents setting.
	 */
	public function transform_site_represents( $site_represents ) {
		switch ( $site_represents ) {
			case 'person':
				return 'person';

			case 'organization':
			default:
				return 'company';
		}
	}

	/**
	 * Transforms the separator setting.
	 *
	 * @param string $separator The separator setting.
	 *
	 * @return string The transformed separator.
	 */
	public function transform_separator( $separator ) {
		switch ( $separator ) {
			case '&#45;':
				return 'sc-dash';

			case '&ndash;':
				return 'sc-ndash';

			case '&mdash;':
				return 'sc-mdash';

			case '&raquo;':
				return 'sc-raquo';

			case '&laquo;':
				return 'sc-laquo';

			case '&gt;':
				return 'sc-gt';

			case '&bull;':
				return 'sc-bull';

			case '&#124;':
				return 'sc-pipe';

			default:
				return 'sc-dash';
		}
	}

	/**
	 * Builds the mapping that ties AOISEO option keys with Yoast ones and their data transformation method.
	 *
	 * @return void
	 */
	protected function build_mapping() {
		$this->aioseo_options_to_yoast_map = [
			'/separator'               => [
				'yoast_name'       => 'separator',
				'transform_method' => 'transform_separator',
			],
			'/siteTitle'               => [
				'yoast_name'       => 'title-home-wpseo',
				'transform_method' => 'simple_import',
			],
			'/metaDescription'         => [
				'yoast_name'       => 'metadesc-home-wpseo',
				'transform_method' => 'simple_import',
			],
			'/schema/siteRepresents'   => [
				'yoast_name'       => 'company_or_person',
				'transform_method' => 'transform_site_represents',
			],
			'/schema/person'           => [
				'yoast_name'       => 'company_or_person_user_id',
				'transform_method' => 'simple_import',
			],
			'/schema/organizationName' => [
				'yoast_name'       => 'company_name',
				'transform_method' => 'simple_import',
			],
			'/schema/organizationLogo' => [
				'yoast_name'       => 'company_logo',
				'transform_method' => 'simple_import',
			],
			'/schema/personLogo'       => [
				'yoast_name'       => 'person_logo',
				'transform_method' => 'simple_import',
			],
		];
	}
}
