<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Configuration;

use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Task_List\Application\Configuration\Task_List_Configuration;
use Yoast\WP\SEO\Task_List\Application\Endpoints\Endpoints_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the task list configuration tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Task_List_Configuration_Test extends TestCase {

	/**
	 * The options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * The endpoints repository.
	 *
	 * @var Mockery\MockInterface|Endpoints_Repository
	 */
	protected $endpoints_repository;

	/**
	 * Holds the instance.
	 *
	 * @var Task_List_Configuration
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->options_helper       = Mockery::mock( Options_Helper::class );
		$this->endpoints_repository = Mockery::mock( Endpoints_Repository::class );

		$this->instance = new Task_List_Configuration(
			$this->options_helper,
			$this->endpoints_repository
		);
	}
}
