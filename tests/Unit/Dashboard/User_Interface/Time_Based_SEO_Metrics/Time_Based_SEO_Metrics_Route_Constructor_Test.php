<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Time_Based_SEO_Metrics;

use Yoast\WP\SEO\Dashboard\Application\Search_Rankings\Search_Ranking_Compare_Repository;
use Yoast\WP\SEO\Dashboard\Application\Search_Rankings\Top_Page_Repository;
use Yoast\WP\SEO\Dashboard\Application\Search_Rankings\Top_Query_Repository;
use Yoast\WP\SEO\Dashboard\Application\Traffic\Organic_Sessions_Compare_Repository;
use Yoast\WP\SEO\Dashboard\Application\Traffic\Organic_Sessions_Daily_Repository;

/**
 * Test class for the constructor.
 *
 * @group time_based_SEO_metrics_route
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Time_Based_SEO_Metrics\Time_Based_SEO_Metrics_Route::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Time_Based_SEO_Metrics_Route_Constructor_Test extends Abstract_Time_Based_SEO_Metrics_Route_Test {

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Top_Page_Repository::class,
			$this->getPropertyValue( $this->instance, 'top_page_repository' )
		);

		$this->assertInstanceOf(
			Top_Query_Repository::class,
			$this->getPropertyValue( $this->instance, 'top_query_repository' )
		);

		$this->assertInstanceOf(
			Organic_Sessions_Compare_Repository::class,
			$this->getPropertyValue( $this->instance, 'organic_sessions_compare_repository' )
		);

		$this->assertInstanceOf(
			Organic_Sessions_Daily_Repository::class,
			$this->getPropertyValue( $this->instance, 'organic_sessions_daily_repository' )
		);

		$this->assertInstanceOf(
			Search_Ranking_Compare_Repository::class,
			$this->getPropertyValue( $this->instance, 'search_ranking_compare_repository' )
		);
	}
}
