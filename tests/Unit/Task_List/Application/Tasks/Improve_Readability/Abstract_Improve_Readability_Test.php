<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Readability;

use Mockery;
use Yoast\WP\SEO\Editors\Application\Analysis_Features\Enabled_Analysis_Features_Repository;
use Yoast\WP\SEO\Editors\Domain\Analysis_Features\Analysis_Features_List;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Readability;
use Yoast\WP\SEO\Task_List\Infrastructure\Indexables\Recent_Content_Indexable_Collector;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Improve Readability task tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Improve_Readability_Test extends TestCase {

	/**
	 * The recent content indexable collector mock.
	 *
	 * @var Mockery\MockInterface|Recent_Content_Indexable_Collector
	 */
	protected $recent_content_indexable_collector;

	/**
	 * The indexable helper mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * The enabled analysis features repository mock.
	 *
	 * @var Mockery\MockInterface|Enabled_Analysis_Features_Repository
	 */
	protected $enabled_analysis_features_repository;

	/**
	 * Holds the instance.
	 *
	 * @var Improve_Readability
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubTranslationFunctions();

		$this->recent_content_indexable_collector   = Mockery::mock( Recent_Content_Indexable_Collector::class );
		$this->indexable_helper                     = Mockery::mock( Indexable_Helper::class );
		$this->enabled_analysis_features_repository = Mockery::mock( Enabled_Analysis_Features_Repository::class );

		$this->indexable_helper
			->shouldReceive( 'should_index_indexables' )
			->andReturn( true )
			->byDefault();

		$features_list = Mockery::mock( Analysis_Features_List::class );
		$features_list
			->shouldReceive( 'to_array' )
			->andReturn( [ 'readabilityAnalysis' => true ] )
			->byDefault();

		$this->enabled_analysis_features_repository
			->shouldReceive( 'get_enabled_features' )
			->andReturn( $features_list )
			->byDefault();

		$this->instance = new Improve_Readability(
			$this->recent_content_indexable_collector,
			$this->indexable_helper,
			$this->enabled_analysis_features_repository
		);
	}
}
