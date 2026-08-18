<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface;

use Mockery;
use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Bulk_Updater;
use Yoast\WP\SEO\Bulk_Editor\User_Interface\Search_Bulk_Update_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use YoastSEO_Vendor\Psr\Log\LoggerInterface;

/**
 * Base class for the search bulk update route tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Search_Bulk_Update_Route_Test extends TestCase {

	/**
	 * The bulk updater.
	 *
	 * @var Mockery\MockInterface|Bulk_Updater
	 */
	protected $bulk_updater;

	/**
	 * The logger.
	 *
	 * @var Mockery\MockInterface|LoggerInterface
	 */
	protected $logger;

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

		$this->bulk_updater = Mockery::mock( Bulk_Updater::class );
		$this->logger       = Mockery::mock( LoggerInterface::class )->shouldIgnoreMissing();

		$this->instance = new Search_Bulk_Update_Route( $this->bulk_updater );
		$this->instance->setLogger( $this->logger );
	}
}
