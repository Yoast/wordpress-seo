<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Schema_Aggregator_Announcement;

use Mockery;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Aggregator_Announcement;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Schema_Aggregator_Announcement tests.
 *
 * @group schema-aggregator
 * @group introductions
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Schema_Aggregator_Announcement_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Schema_Aggregator_Announcement
	 */
	protected $instance;

	/**
	 * Holds the current page helper mock.
	 *
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	protected $current_page_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->current_page_helper = Mockery::mock( Current_Page_Helper::class );

		$this->instance = new Schema_Aggregator_Announcement(
			$this->current_page_helper,
		);
	}
}
