<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Importing;

use Yoast\WP\SEO\Actions\Importing\Abstract_Aioseo_Settings_Importing_Action;
use Yoast\WP\SEO\Helpers\Options_Helper;

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

	public function __construct( Options_Helper $options ) {
		return parent::__construct( $options );
	}

	/**
	 * Retrieves the yoast_name placeholder.
	 *
	 * @return string The yoast_name placeholder.
	 *
	 * @throws Exception If the YOAST_NAME_PLACEHOLDER constant is not set in the child class.
	 */
	public function get_placeholder() {
		return parent::get_placeholder();
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
	 * Transform AIOSEO setting types (date, etc.) to yoast setting types (archive, etc.).
	 *
	 * @param string $setting_type The setting type to be transformed.
	 *
	 * @return string The yoast setting type.
	 */
	public function transform_setting_type( $setting_type ) {
		return parent::transform_setting_type( $setting_type );
	}
}
