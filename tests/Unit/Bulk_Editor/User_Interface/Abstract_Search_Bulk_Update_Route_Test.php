<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface;

use Mockery;
use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Search\Search_Bulk_Updater;
use Yoast\WP\SEO\Bulk_Editor\User_Interface\Search_Bulk_Update_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the search bulk update route tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Search_Bulk_Update_Route_Test extends TestCase {

	/**
	 * The search bulk updater.
	 *
	 * @var Mockery\MockInterface|Search_Bulk_Updater
	 */
	protected $bulk_updater;

	/**
	 * Holds the instance.
	 *
	 * @var Search_Bulk_Update_Route
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->bulk_updater = Mockery::mock( Search_Bulk_Updater::class );

		$this->instance = new Search_Bulk_Update_Route( $this->bulk_updater );
	}
}
