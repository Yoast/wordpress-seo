<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Time_Based_SEO_Metrics;

use Mockery;
use Yoast\WP\SEO\Dashboard\Application\Search_Rankings\Search_Ranking_Compare_Repository;
use Yoast\WP\SEO\Dashboard\Application\Search_Rankings\Top_Page_Repository;
use Yoast\WP\SEO\Dashboard\Application\Search_Rankings\Top_Query_Repository;
use Yoast\WP\SEO\Dashboard\Application\Traffic\Organic_Sessions_Compare_Repository;
use Yoast\WP\SEO\Dashboard\Application\Traffic\Organic_Sessions_Daily_Repository;
use Yoast\WP\SEO\Dashboard\User_Interface\Time_Based_SEO_Metrics\Time_Based_SEO_Metrics_Route;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Time_Based_SEO_Metrics_Route tests.
 *
 * @group time_based_SEO_metrics_route
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Time_Based_SEO_Metrics_Route_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Time_Based_SEO_Metrics_Route
	 */
	protected $instance;

	/**
	 * Holds the mock for the data provider for page based search rankings.
	 *
	 * @var Mockery\MockInterface|Top_Page_Repository
	 */
	protected $top_page_repository;

	/**
	 * Holds the mock for the data provider for query based search rankings.
	 *
	 * @var Mockery\MockInterface|Top_Query_Repository
	 */
	protected $top_query_repository;

	/**
	 * Holds the mock for the data provider for comparison organic session traffic.
	 *
	 * @var Mockery\MockInterface|Organic_Sessions_Compare_Repository
	 */
	protected $organic_sessions_compare_repository;

	/**
	 * Holds the mock for the data provider for daily organic session traffic.
	 *
	 * @var Mockery\MockInterface|Organic_Sessions_Daily_Repository
	 */
	protected $organic_sessions_daily_repository;

	/**
	 * Holds the mock for the data provider for searching ranking comparison.
	 *
	 * @var Mockery\MockInterface|Search_Ranking_Compare_Repository
	 */
	protected $search_ranking_compare_repository;

	/**
	 * Holds the mock for the capability helper.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	protected $capability_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->top_page_repository                 = Mockery::mock( Top_Page_Repository::class );
		$this->top_query_repository                = Mockery::mock( Top_Query_Repository::class );
		$this->organic_sessions_compare_repository = Mockery::mock( Organic_Sessions_Compare_Repository::class );
		$this->organic_sessions_daily_repository   = Mockery::mock( Organic_Sessions_Daily_Repository::class );
		$this->search_ranking_compare_repository   = Mockery::mock( Search_Ranking_Compare_Repository::class );
		$this->capability_helper                   = Mockery::mock( Capability_Helper::class );

		$this->instance = new Time_Based_SEO_Metrics_Route(
			$this->top_page_repository,
			$this->top_query_repository,
			$this->organic_sessions_compare_repository,
			$this->organic_sessions_daily_repository,
			$this->search_ranking_compare_repository,
			$this->capability_helper
		);
	}
}
