<?php

namespace Yoast\WP\SEO\Actions\Importing;

/**
 * Importing action for AIOSEO posttype defaults settings data.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aioseo_Posttype_Defaults_Settings_Importing_Action extends Abstract_Aioseo_Settings_Importing_Action {

	/**
	 * The plugin of the action.
	 */
	const PLUGIN = 'aioseo';

	/**
	 * The type of the action.
	 */
	const TYPE = 'posttype_default_settings';

	/**
	 * The placeholder of a posttype.
	 */
	const YOAST_NAME_PLACEHOLDER = '[posttype]';

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
		'title'                  => [
			'yoast_name'       => 'title-' . self::YOAST_NAME_PLACEHOLDER,
			'transform_method' => 'simple_import',
		],
		'metaDescription'        => [
			'yoast_name'       => 'metadesc-' . self::YOAST_NAME_PLACEHOLDER,
			'transform_method' => 'simple_import',
		],
		'redirectAttachmentUrls' => [
			'yoast_name'       => 'disable-attachment',
			'transform_method' => 'import_redirect_attachment',
		],
	];

	/**
	 * The tab of the aioseo settings we're working with.
	 *
	 * @var string
	 */
	protected $settings_tab = 'postTypes';

	/**
	 * Transforms the redirect_attachment meta data.
	 *
	 * @param string $meta_data The meta data to be imported.
	 *
	 * @return string The transformed meta data.
	 */
	public function import_redirect_attachment( $meta_data ) {
		switch ( $meta_data ) {
			case 'disabled':
				return false;

			case 'attachment':
			case 'attachment_parent':
				return true;
		}
	}
}
