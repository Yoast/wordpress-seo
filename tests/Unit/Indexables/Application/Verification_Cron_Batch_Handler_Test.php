<?php

namespace Yoast\WP\SEO\Tests\Unit\Indexables\Application;

use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Indexables\Application\Verification_Cron_Batch_Handler;
use Yoast\WP\SEO\Indexables\Domain\Batch_Size;
use Yoast\WP\SEO\Indexables\Domain\Last_Batch_Count;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * The Verification_Cron_Batch_Handler_Test class.
 *
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Indexables\Application\Verification_Cron_Batch_Handler
 */
class Verification_Cron_Batch_Handler_Test extends TestCase {

	/**
	 * The instance.
	 *
	 * @var Verification_Cron_Batch_Handler
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

		$this->instance = new Verification_Cron_Batch_Handler( $this->options_helper );
	}

	/**
	 * Tests the get function.
	 *
	 * @covers ::get_current_post_indexables_batch
	 * @covers ::__construct
	 * @return void
	 */
	public function test_get_current_post_indexables_batch() {
		$this->options_helper->expects()->get( 'cron_verify_post_indexables_last_batch', 0 )->andReturn( 0 );
		$this->instance->get_current_post_indexables_batch();
	}

	/**
	 * Tests the set function.
	 *
	 * @covers ::set_current_post_indexables_batch
	 *
	 * @return void
	 */
	public function test_set_current_post_indexables_batch() {
		$this->options_helper->expects()->set( 'cron_verify_post_indexables_last_batch', 15 );
		$this->instance->set_current_post_indexables_batch( new Last_Batch_Count( 10 ), new Batch_Size( 5 ) );
	}

	/**
	 * Tests the get function.
	 *
	 * @covers ::get_current_non_timestamped_indexables_batch
	 * @return void
	 */
	public function test_get_current_non_timestamped_indexables_batch() {
		$this->options_helper->expects()
			->get( 'cron_verify_non_timestamped_indexables_last_batch', 0 )
			->andReturn( 0 );
		$this->instance->get_current_non_timestamped_indexables_batch();
	}

	/**
	 * Tests the set function.
	 *
	 * @covers ::set_current_non_timestamped_indexables_batch
	 *
	 * @return void
	 */
	public function test_set_current_non_timestamped_indexables_batch() {
		$this->options_helper->expects()->set( 'cron_verify_non_timestamped_indexables_last_batch', 15 );
		$this->instance->set_current_non_timestamped_indexables_batch( new Last_Batch_Count( 10 ), new Batch_Size( 5 ) );
	}
}
