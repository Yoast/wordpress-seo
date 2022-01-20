<?php

namespace Yoast\WP\SEO\Actions\Importing;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Utils_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Services\Importing\Aioseo_Replacevar_Handler;
use Yoast\WP\SEO\Services\Importing\Aioseo_Robots_Provider_Service;
use Yoast\WP\SEO\Services\Importing\Aioseo_Robots_Transformer_Service;
/**
 * Importing action for AIOSEO custom archive settings data.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aioseo_Custom_Archive_Settings_Importing_Action extends Abstract_Aioseo_Settings_Importing_Action {

	/**
	 * The plugin of the action.
	 */
	const PLUGIN = 'aioseo';

	/**
	 * The type of the action.
	 */
	const TYPE = 'custom_archive_settings';

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
	protected $settings_tab = 'archives';

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	protected $post_type;

	/**
	 * Abstract_Importing_Action constructor.
	 *
	 * @param Options_Helper                    $options            The options helper.
	 * @param Utils_Helper                      $utils              The utils helper.
	 * @param Post_Type_Helper                  $post_type          The post type helper.
	 * @param Aioseo_Replacevar_Handler         $replacevar_handler The replacevar handler.
	 * @param Aioseo_Robots_Provider_Service    $robots_provider    The robots provider service.
	 * @param Aioseo_Robots_Transformer_Service $robots_transformer The robots transfomer service.
	 */
	public function __construct(
		Options_Helper $options,
		Utils_Helper $utils,
		Post_Type_Helper $post_type,
		Aioseo_Replacevar_Handler $replacevar_handler,
		Aioseo_Robots_Provider_Service $robots_provider,
		Aioseo_Robots_Transformer_Service $robots_transformer
	) {
		parent::__construct( $options, $utils, $replacevar_handler, $robots_provider, $robots_transformer );

		$this->post_type = $post_type;
	}

	/**
	 * Builds the mapping that ties AOISEO option keys with Yoast ones and their data transformation method.
	 *
	 * @return void
	 */
	protected function build_mapping() {
		$post_type_objects = \get_post_types( [ 'public' => true ], 'objects' );

		foreach ( $post_type_objects as $pt ) {
			// Use all the custom post types that have archives.
			if ( ! $pt->_builtin && $this->post_type->has_archive( $pt ) ) {
				$this->aioseo_options_to_yoast_map[ '/' . $pt->name . '/title' ]                       = [
					'yoast_name'       => 'title-ptarchive-' . $pt->name,
					'transform_method' => 'simple_import',
				];
				$this->aioseo_options_to_yoast_map[ '/' . $pt->name . '/metaDescription' ]             = [
					'yoast_name'       => 'metadesc-ptarchive-' . $pt->name,
					'transform_method' => 'simple_import',
				];
				$this->aioseo_options_to_yoast_map[ '/' . $pt->name . '/advanced/robotsMeta/noindex' ] = [
					'yoast_name'       => 'noindex-ptarchive-' . $pt->name,
					'transform_method' => 'import_noindex',
					'type'             => 'archives',
					'subtype'          => $pt->name,
					'option_name'      => 'aioseo_options_dynamic',
				];
			}
		}
	}
}
