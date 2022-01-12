<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Importing;

use Yoast\WP\SEO\Actions\Importing\Abstract_Aioseo_Settings_Importing_Action;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Services\Importing\Aioseo_Replacevar_Handler;
use Yoast\WP\SEO\Services\Importing\Aioseo_Robots_Provider_Service;
use Yoast\WP\SEO\Services\Importing\Aioseo_Robots_Transformer_Service;

/**
 * Class Abstract_Aioseo_Settings_Importing_Action_Double
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Aioseo_Settings_Importing_Action_Double extends Abstract_Aioseo_Settings_Importing_Action {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options;

	/**
	 * The replacevar handler.
	 *
	 * @var Aioseo_Replacevar_Handler
	 */
	protected $replacevar_handler;

	/**
	 * The robots provider service.
	 *
	 * @var Aioseo_Robots_Provider_Service
	 */
	protected $robots_provider;

	/**
	 * The robots transformer service.
	 *
	 * @var Aioseo_Robots_Transformer_Service
	 */
	protected $robots_transformer;

	public function __construct(
		Options_Helper $options,
		Aioseo_Replacevar_Handler $replacevar_handler,
		Aioseo_Robots_Provider_Service $robots_provider,
		Aioseo_Robots_Transformer_Service $robots_transformer
	) {
		return parent::__construct( $options, $replacevar_handler, $robots_provider, $robots_transformer );
	}

	/**
	 * Retrieves the source option_name.
	 *
	 * @return string The source option_name.
	 *
	 * @throws Exception If the SOURCE_OPTION_NAME constant is not set in the child class.
	 */
	public function get_source_option_name() {
		return parent::get_source_option_name();
	}

	/**
	 * Imports the noindex setting, taking into consideration whether they defer to global defaults.
	 *
	 * @param bool  $noindex The noindex of the type, without taking into consideration whether the type defers to global defaults.
	 * @param array $mapping The mapping of the setting we're working with.
	 *
	 * @return bool The noindex setting.
	 */
	public function transform_robot_setting( $noindex, $mapping ) {
		return parent::transform_robot_setting( $noindex, $mapping );
	}
}
