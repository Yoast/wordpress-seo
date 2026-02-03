<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\File\Llms_Txt_Cron_Scheduler;

use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Llms_Txt\Application\File\Llms_Txt_Cron_Scheduler;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Llms Txt Scheduler tests.
 *
 * @group llms.txt
 */
abstract class Abstract_Llms_Txt_Cron_Scheduler_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Llms_Txt_Cron_Scheduler
	 */
	protected $instance;

	/**
	 * Holds the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->options_helper = Mockery::mock( Options_Helper::class );

		$this->instance = new Llms_Txt_Cron_Scheduler( $this->options_helper );
	}
}
