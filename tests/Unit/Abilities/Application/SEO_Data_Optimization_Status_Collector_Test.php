<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Mockery;
use Yoast\WP\SEO\Abilities\Application\SEO_Data_Optimization_Status_Collector;
use Yoast\WP\SEO\Actions\Indexing\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Conditionals\Should_Index_Indexables_Conditional;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the SEO_Data_Optimization_Status_Collector class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Application\SEO_Data_Optimization_Status_Collector
 */
final class SEO_Data_Optimization_Status_Collector_Test extends TestCase {

	/**
	 * The should index indexables conditional mock.
	 *
	 * @var Mockery\MockInterface|Should_Index_Indexables_Conditional
	 */
	private $should_index_indexables_conditional;

	/**
	 * The indexing helper mock.
	 *
	 * @var Mockery\MockInterface|Indexing_Helper
	 */
	private $indexing_helper;

	/**
	 * The post indexing action mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Post_Indexation_Action
	 */
	private $post_indexation;

	/**
	 * The term indexing action mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Term_Indexation_Action
	 */
	private $term_indexation;

	/**
	 * The post type archive indexing action mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Post_Type_Archive_Indexation_Action
	 */
	private $post_type_archive_indexation;

	/**
	 * The general indexing action mock.
	 *
	 * @var Mockery\MockInterface|Indexable_General_Indexation_Action
	 */
	private $general_indexation;

	/**
	 * The instance under test.
	 *
	 * @var SEO_Data_Optimization_Status_Collector
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->should_index_indexables_conditional = Mockery::mock( Should_Index_Indexables_Conditional::class );
		$this->indexing_helper                     = Mockery::mock( Indexing_Helper::class );
		$this->post_indexation                     = Mockery::mock( Indexable_Post_Indexation_Action::class );
		$this->term_indexation                     = Mockery::mock( Indexable_Term_Indexation_Action::class );
		$this->post_type_archive_indexation        = Mockery::mock( Indexable_Post_Type_Archive_Indexation_Action::class );
		$this->general_indexation                  = Mockery::mock( Indexable_General_Indexation_Action::class );

		$this->instance = new SEO_Data_Optimization_Status_Collector(
			$this->should_index_indexables_conditional,
			$this->indexing_helper,
			$this->post_indexation,
			$this->term_indexation,
			$this->post_type_archive_indexation,
			$this->general_indexation,
		);
	}

	/**
	 * Data provider for test_get_with_indexables_enabled.
	 *
	 * @return array<string, array<int|bool>> The unindexed counts and the expected status.
	 */
	public static function provide_unindexed_counts(): array {
		return [
			'nothing left to index'   => [ 0, true ],
			'one object left'         => [ 1, false ],
			'over the limit returned' => [ 2, false ],
		];
	}

	/**
	 * Tests that get counts the unindexed objects of the object indexing actions only, up to one, when the
	 * indexables are enabled.
	 *
	 * @covers ::__construct
	 * @covers ::get
	 * @covers ::are_indexables_built
	 *
	 * @dataProvider provide_unindexed_counts
	 *
	 * @param int  $unindexed_count The limited unindexed count.
	 * @param bool $expected        The expected optimization status.
	 *
	 * @return void
	 */
	public function test_get_with_indexables_enabled( int $unindexed_count, bool $expected ) {
		$this->should_index_indexables_conditional->expects( 'is_met' )->once()->andReturnTrue();
		$this->indexing_helper
			->expects( 'get_limited_unindexed_count' )
			->once()
			->with(
				1,
				[
					$this->post_indexation,
					$this->term_indexation,
					$this->post_type_archive_indexation,
					$this->general_indexation,
				],
			)
			->andReturn( $unindexed_count );

		$this->assertSame(
			[
				'optimization_enabled'  => true,
				'optimization_complete' => $expected,
			],
			$this->instance->get(),
		);
	}

	/**
	 * Tests that get reports the SEO data as not optimized without counting, when the indexables are disabled.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get_with_indexables_disabled() {
		$this->should_index_indexables_conditional->expects( 'is_met' )->once()->andReturnFalse();
		$this->indexing_helper->expects( 'get_limited_unindexed_count' )->never();

		$this->assertSame(
			[
				'optimization_enabled'  => false,
				'optimization_complete' => false,
			],
			$this->instance->get(),
		);
	}
}
