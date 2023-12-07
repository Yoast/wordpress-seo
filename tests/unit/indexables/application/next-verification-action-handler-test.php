<?php

namespace Yoast\WP\SEO\Tests\Unit\Indexables\Application;

use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Indexables\Application\Next_Verification_Action_Handler;
use Yoast\WP\SEO\Indexables\Domain\Current_Verification_Action;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * The Next_Verification_Action_Handler_Test class.
 *
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Indexables\Application\Next_Verification_Action_Handler
 */
class Next_Verification_Action_Handler_Test extends TestCase {

	/**
	 * The instance.
	 *
	 * @var Next_Verification_Action_Handler
	 */
	private $instance;

	/**
	 * The options helper.
	 *
	 * @var \Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The setup function.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->options_helper = Mockery::mock( Options_Helper::class );

		$this->instance = new Next_Verification_Action_Handler( $this->options_helper );
	}

	/**
	 * Tests the get function.
	 *
	 * @covers ::get_current_verification_action
	 * @covers ::__construct
	 * @return void
	 */
	public function test_get_current_verification_action() {
		$this->options_helper->expects()->get( 'cron_verify_current_action', 'term' )->andReturn( 'term' );
		$this->instance->get_current_verification_action();
	}

	/**
	 * Tests the set function.
	 *
	 * @covers ::set_current_verification_Action
	 * @return void
	 */
	public function test_set_current_verification_action() {
		$this->options_helper->expects()->set( 'cron_verify_current_action', 'value' );
		$this->instance->set_current_verification_action( new Current_Verification_Action( 'value' ) );
	}
}
