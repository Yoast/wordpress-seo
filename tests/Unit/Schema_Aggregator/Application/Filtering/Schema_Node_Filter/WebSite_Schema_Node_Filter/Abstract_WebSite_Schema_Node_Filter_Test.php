<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Filtering\Schema_Node_Filter\WebSite_Schema_Node_Filter;

use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Filter\WebSite_Schema_Node_Filter;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\WordPress_Current_Site_URL_Provider;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for WebSite_Schema_Node_Filter tests.
 */
final class Abstract_WebSite_Schema_Node_Filter_Test extends TestCase {

	/**
	 * The WordPress_Current_Site_URL_Provider mock.
	 *
	 * @var Mockery\MockInterface|WordPress_Current_Site_URL_Provider
	 */
	protected $current_site_url_provider;

	/**
	 * The instance of WebSite_Schema_Node_Filter being tested.
	 *
	 * @var WebSite_Schema_Node_Filter
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->current_site_url_provider = Mockery::mock( WordPress_Current_Site_URL_Provider::class );

		$this->instance = new WebSite_Schema_Node_Filter();
	}
}
