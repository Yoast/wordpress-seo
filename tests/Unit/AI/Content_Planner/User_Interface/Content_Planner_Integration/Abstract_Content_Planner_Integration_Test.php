<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded

namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\User_Interface\Content_Planner_Integration;

use Mockery;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\AI\Content_Planner\Application\Content_Planner_Endpoints_Repository;
use Yoast\WP\SEO\AI\Content_Planner\User_Interface\Content_Planner_Integration;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Content_Planner_Integration tests.
 *
 * @group ai-content-planner
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Content_Planner_Integration_Test extends TestCase {

	/**
	 * Holds the asset manager mock.
	 *
	 * @var Mockery\MockInterface|WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Holds the endpoints repository mock.
	 *
	 * @var Mockery\MockInterface|Content_Planner_Endpoints_Repository
	 */
	protected $endpoints_repository;

	/**
	 * Holds the indexable repository mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * Holds the user helper mock.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	protected $user_helper;

	/**
	 * Holds the instance under test.
	 *
	 * @var Content_Planner_Integration
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->asset_manager        = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->endpoints_repository = Mockery::mock( Content_Planner_Endpoints_Repository::class );
		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );
		$this->user_helper          = Mockery::mock( User_Helper::class );

		$this->instance = new Content_Planner_Integration(
			$this->asset_manager,
			$this->endpoints_repository,
			$this->indexable_repository,
			$this->user_helper,
		);
	}
}
