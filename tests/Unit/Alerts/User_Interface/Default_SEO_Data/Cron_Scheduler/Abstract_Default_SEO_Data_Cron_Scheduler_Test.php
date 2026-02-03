<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\User_Interface\Default_SEO_Data\Cron_Scheduler;

use Yoast\WP\SEO\Alerts\User_Interface\Default_Seo_Data\Default_SEO_Data_Cron_Scheduler;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract test class for the Default_SEO_Data_Cron_Scheduler class.
 *
 * @group Default_SEO_Data
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Default_SEO_Data_Cron_Scheduler_Test extends TestCase {

	/**
	 * The Default_SEO_Data_Cron_Scheduler instance.
	 *
	 * @var Default_SEO_Data_Cron_Scheduler
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Default_SEO_Data_Cron_Scheduler();
	}
}
