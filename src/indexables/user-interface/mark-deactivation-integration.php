<?php

namespace Yoast\WP\SEO\Indexables\User_Interface;

use Yoast\WP\SEO\Conditionals\Traits\Admin_Conditional_Trait;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class Mark_Deactivation_Integration.
 *
 * @package Yoast\WP\SEO\Indexables\User_Interface
 */
class Mark_Deactivation_Integration implements Integration_Interface {

	use Admin_Conditional_Trait;

	public const PLUGIN_DEACTIVATED_AT_OPTION = 'plugin_deactivated_at';

	/**
	 * The options helper.
	 *
	 * @var Options_Helper $options_helper
	 */
	protected $options_helper;

	/**
	 * The constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Registers a deactivation action.
	 */
	public function register_hooks() {
		\add_action( 'wpseo_deactivate', [ $this, 'register_deactivation' ] );
	}

	/**
	 * Sets a timestamp for the moment the plugin was deactivated.
	 *
	 * @return void
	 */
	public function register_deactivation(): void {
		$this->options_helper->set( self::PLUGIN_DEACTIVATED_AT_OPTION, \time() );
	}
}
