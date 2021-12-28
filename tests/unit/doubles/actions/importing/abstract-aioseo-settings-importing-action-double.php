<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Importing;

use Yoast\WP\SEO\Actions\Importing\Abstract_Aioseo_Settings_Importing_Action;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Services\Importing\Aioseo_Replacevar_Handler;

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

	public function __construct(
		Options_Helper $options,
		Aioseo_Replacevar_Handler $replacevar_handler
	) {
		return parent::__construct( $options, $replacevar_handler );
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
	 * Retrieves the noindex setting set globally in AIOSEO.
	 *
	 * @return bool Whether global robot settings give a noindex or not.
	 */
	public function get_global_noindex() {
		return parent::get_global_noindex();
	}

	/**
	 * Imports the noindex setting, taking into consideration whether they defer to global defaults.
	 *
	 * @param bool  $noindex The noindex of the type, without taking into consideration whether the type defers to global defaults.
	 * @param array $mapping The mapping of the setting we're working with.
	 *
	 * @return bool The noindex setting.
	 */
	public function import_noindex( $noindex, $mapping ) {
		return parent::import_noindex( $noindex, $mapping );
	}
}
