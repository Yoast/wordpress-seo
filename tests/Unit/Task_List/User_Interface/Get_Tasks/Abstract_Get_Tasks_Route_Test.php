<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\User_Interface\Get_Tasks;

use Mockery;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Task_List\Application\Tasks_Repository;
use Yoast\WP\SEO\Task_List\User_Interface\Tasks\Get_Tasks_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Tracking\Application\Action_Tracker;

/**
 * Base class for the get tasks route tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Get_Tasks_Route_Test extends TestCase {

	/**
	 * The tasks repository.
	 *
	 * @var Mockery\MockInterface|Tasks_Repository
	 */
	protected $tasks_repository;

	/**
	 * The capability helper.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	protected $capability_helper;

	/**
	 * The action tracker.
	 *
	 * @var Mockery\MockInterface|Action_Tracker
	 */
	protected $action_tracker;

	/**
	 * Holds the instance.
	 *
	 * @var Get_Tasks_Route
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->tasks_repository  = Mockery::mock( Tasks_Repository::class );
		$this->capability_helper = Mockery::mock( Capability_Helper::class );
		$this->action_tracker    = Mockery::mock( Action_Tracker::class );

		$this->instance = new Get_Tasks_Route(
			$this->tasks_repository,
			$this->capability_helper,
			$this->action_tracker
		);
	}
}
