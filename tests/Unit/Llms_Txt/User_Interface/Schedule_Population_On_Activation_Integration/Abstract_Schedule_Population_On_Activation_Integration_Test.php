<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\Schedule_Population_On_Activation_Integration;

use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Llms_Txt\Application\File\Llms_Txt_Cron_Scheduler;
use Yoast\WP\SEO\Llms_Txt\User_Interface\Cleanup_Llms_Txt_On_Deactivation;
use Yoast\WP\SEO\Llms_Txt\User_Interface\Schedule_Population_On_Activation_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Schedule_Population_On_Activation_Integration tests.
 *
 * @group llms.txt
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Schedule_Population_On_Activation_Integration_Test extends TestCase {

	/**
	 * The cron scheduler mock.
	 *
	 * @var Llms_Txt_Cron_Scheduler|Mockery\MockInterface
	 */
	protected $cron_scheduler;

	/**
	 * The instance under test.
	 *
	 * @var Cleanup_Llms_Txt_On_Deactivation
	 */
	protected $instance;

	/**
	 * The options helper mock.
	 *
	 * @var Options_Helper|Mockery\MockInterface
	 */
	protected $options_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->options_helper = Mockery::mock( Options_Helper::class );
		$this->cron_scheduler = Mockery::mock( Llms_Txt_Cron_Scheduler::class );

		$this->instance = new Schedule_Population_On_Activation_Integration(
			$this->cron_scheduler,
			$this->options_helper
		);
	}
}
