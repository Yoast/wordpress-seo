<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\User_Interface\Default_SEO_Data\Cron_Callback;

use Mockery;
use Yoast\WP\SEO\Alerts\User_Interface\Default_SEO_Data\Default_SEO_Data_Cron_Callback_Integration;
use Yoast\WP\SEO\Alerts\User_Interface\Default_Seo_Data\Default_SEO_Data_Cron_Scheduler;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract test class for the Default_SEO_Data_Cron_Callback_Integration class.
 *
 * @group Default_SEO_Data
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Default_SEO_Data_Cron_Callback_Integration_Test extends TestCase {

	/**
	 * The Default_SEO_Data_Cron_Callback_Integration instance.
	 *
	 * @var Default_SEO_Data_Cron_Callback_Integration
	 */
	protected $instance;

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * The scheduler mock.
	 *
	 * @var Mockery\MockInterface|Default_SEO_Data_Cron_Scheduler
	 */
	protected $scheduler;

	/**
	 * The indexable repository mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->options_helper       = Mockery::mock( Options_Helper::class );
		$this->scheduler            = Mockery::mock( Default_SEO_Data_Cron_Scheduler::class );
		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );

		$this->instance = new Default_SEO_Data_Cron_Callback_Integration(
			$this->options_helper,
			$this->scheduler,
			$this->indexable_repository
		);
	}
}
