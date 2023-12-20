<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders\Indexable_Link_Builder;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\SEO_Links_Mock;

/**
 * Class Delete_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Link_Builder
 */
final class Delete_Test extends Abstract_Indexable_Link_Builder_TestCase {

	/**
	 * Tests the delete method.
	 *
	 * @covers ::delete
	 *
	 * @return void
	 */
	public function test_delete() {
		$indexable     = Mockery::mock( Indexable_Mock::class );
		$indexable->id = 5;

		$this->seo_links_repository
			->expects( 'find_all_by_indexable_id' )
			->with( $indexable->id )
			->once()
			->andReturn( [] );

		$this->seo_links_repository
			->expects( 'delete_all_by_indexable_id' )
			->with( $indexable->id )
			->once();

		$this->instance->delete( $indexable );
	}

	/**
	 * Tests the delete method and update_incoming_links_for_related_indexables.
	 *
	 * @covers ::update_incoming_links_for_related_indexables
	 * @covers ::delete
	 *
	 * @return void
	 */
	public function test_delete_and_update_incoming_links_for_related_indexables() {
		$indexable                     = Mockery::mock( Indexable_Mock::class );
		$indexable->id                 = 5;
		$seo_link                      = new SEO_Links_Mock();
		$seo_link->target_indexable_id = 3;

		$this->seo_links_repository
			->expects( 'find_all_by_indexable_id' )
			->with( $indexable->id )
			->once()
			->andReturn( [ $seo_link ] );

		$this->seo_links_repository
			->expects( 'delete_all_by_indexable_id' )
			->with( $indexable->id )
			->once();

		$this->seo_links_repository
			->expects( 'get_incoming_link_counts_for_indexable_ids' )
			->with( [ 3 ] )
			->once()
			->andReturn(
				[
					[
						'target_indexable_id' => 3,
						'incoming'            => 7,
					],
				]
			);

		$this->indexable_repository
			->expects( 'update_incoming_link_count' )
			->with( 3, 7 )
			->once();

		Functions\expect( 'wp_cache_supports' )->once()->andReturnTrue();
		Functions\expect( 'wp_cache_flush_group' )->once()->andReturnTrue();

		$this->instance->delete( $indexable );
	}
}
