<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Enable_Llms_Txt;

use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Task_List\Application\Tasks\Enable_Llms_Txt;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Complete FTC task tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Enable_Llms_Txt_Test extends TestCase {

	/**
	 * The options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Holds the instance.
	 *
	 * @var Enable_Llms_Txt
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubTranslationFunctions();

		$this->options_helper = Mockery::mock( Options_Helper::class );

		$this->instance = new Enable_Llms_Txt( $this->options_helper );
		$this->instance->set_enhanced_call_to_action( $this->instance->get_call_to_action() );
	}
}
