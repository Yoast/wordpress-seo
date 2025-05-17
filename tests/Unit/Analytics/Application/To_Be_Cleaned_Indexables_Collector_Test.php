<?php

namespace Yoast\WP\SEO\Tests\Unit\Analytics\Application;

use Mockery;
use Yoast\WP\SEO\Analytics\Application\To_Be_Cleaned_Indexables_Collector;
use Yoast\WP\SEO\Repositories\Indexable_Cleanup_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class To_Be_Cleaned_Indexables_Collector_Test.
 *
 * @group analytics
 *
 * @coversDefaultClass \Yoast\WP\SEO\Analytics\Application\To_Be_Cleaned_Indexables_Collector
 */
final class To_Be_Cleaned_Indexables_Collector_Test extends TestCase {

	/**
	 * The sut.
	 *
	 * @var To_Be_Cleaned_Indexables_Collector
	 */
	private $sut;

	/**
	 * Gets the data for the collector.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_collector_get(): void {
		$indexable_cleanup_repository_mock = Mockery::mock( Indexable_Cleanup_Repository::class );
		$indexable_cleanup_repository_mock->expects( 'count_indexables_with_object_type_and_object_sub_type' )
				->once()
					->andReturn( 0 );
		$indexable_cleanup_repository_mock->shouldReceive( 'count_indexables_with_post_status' )
				->once()
					->andReturn( 0 );
		$indexable_cleanup_repository_mock->shouldReceive( 'count_indexables_for_non_publicly_viewable_post' )
				->once()
					->andReturn( 0 );
		$indexable_cleanup_repository_mock->shouldReceive( 'count_indexables_for_non_publicly_viewable_taxonomies' )
				->once()
					->andReturn( 0 );
		$indexable_cleanup_repository_mock->shouldReceive( 'count_indexables_for_non_publicly_post_type_archive_pages' )
				->once()
					->andReturn( 0 );
		$indexable_cleanup_repository_mock->shouldReceive( 'count_indexables_for_authors_archive_disabled' )
				->once()
					->andReturn( 0 );
		$indexable_cleanup_repository_mock->shouldReceive( 'count_indexables_for_authors_without_archive' )
				->once()
					->andReturn( 0 );
		$indexable_cleanup_repository_mock->shouldReceive( 'count_indexables_for_orphaned_users' )
			->andReturn( 0 );
		$indexable_cleanup_repository_mock->shouldReceive( 'count_indexables_for_object_type_and_source_table' )
				->times( 2 )
					->andReturn( 0 );
		$indexable_cleanup_repository_mock->shouldReceive( 'count_orphaned_from_table' )
				->times( 3 )
					->andReturn( 0 );
		$this->sut = new To_Be_Cleaned_Indexables_Collector( $indexable_cleanup_repository_mock );

		$this->assertSame(
			[
				'to_be_cleaned_indexables' => [
					[
						'cleanup_name' => 'indexables_with_post_object_type_and_shop_order_object_sub_type',
						'count'        => 0,
					],
					[
						'cleanup_name' => 'indexables_with_auto-draft_post_status',
						'count'        => 0,
					],
					[
						'cleanup_name' => 'indexables_for_non_publicly_viewable_post',
						'count'        => 0,
					],
					[
						'cleanup_name' => 'indexables_for_non_publicly_viewable_taxonomies',
						'count'        => 0,
					],
					[
						'cleanup_name' => 'indexables_for_non_publicly_viewable_post_type_archive_pages',
						'count'        => 0,
					],
					[
						'cleanup_name' => 'indexables_for_authors_archive_disabled',
						'count'        => 0,
					],
					[
						'cleanup_name' => 'indexables_for_authors_without_archive',
						'count'        => 0,
					],

					[
						'cleanup_name' => 'indexables_for_object_type_and_source_table_users',
						'count'        => 0,
					],
					[
						'cleanup_name' => 'indexables_for_object_type_and_source_table_posts',
						'count'        => 0,
					],
					[
						'cleanup_name' => 'indexables_for_object_type_and_source_table_terms',
						'count'        => 0,
					],

					[
						'cleanup_name' => 'orphaned_from_table_indexable_hierarchy',
						'count'        => 0,
					],
					[
						'cleanup_name' => 'orphaned_from_table_indexable_id',
						'count'        => 0,
					],
					[
						'cleanup_name' => 'orphaned_from_table_target_indexable_id',
						'count'        => 0,
					],
				],
			],
			$this->sut->get()
		);
	}
}
