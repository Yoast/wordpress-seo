<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders\Indexable_Link_Builder;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\SEO_Links_Mock;

/**
 * Class Patch_Seo_Links_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Link_Builder
 */
final class Patch_Seo_Links_Test extends Abstract_Indexable_Link_Builder_TestCase {

	/**
	 * Data provider for test_patch_seo_links;
	 *
	 * @return array
	 */
	public static function patch_seo_links_provider() {
		$object                                  = (object) [ 'type' => 'not SEO_Links' ];
		$seo_link                                = new SEO_Links_Mock();
		$seo_link->target_indexable_id           = null;
		$seo_link_not_empty                      = new SEO_Links_Mock();
		$seo_link_not_empty->target_indexable_id = 3;

		return [
			'indexable_id is empty but object_id has value' => [
				'indexable_id'                     => null,
				'object_id'                        => 1,
				'links_times'                      => 0,
				'links'                            => null,
				'update_target_indexable_id_times' => 0,
			],
			'indexable_id has value but object_id is empty' => [
				'indexable_id'                     => 1,
				'object_id'                        => null,
				'links_times'                      => 0,
				'links'                            => null,
				'update_target_indexable_id_times' => 0,
			],
			'Both indexable_id and object_id are empty' => [
				'indexable_id'                     => null,
				'object_id'                        => null,
				'links_times'                      => 0,
				'links'                            => null,
				'update_target_indexable_id_times' => 0,
			],
			'updated_indexable is false and stays false because $links array is empty' => [
				'indexable_id'                     => 1,
				'object_id'                        => 1,
				'links_times'                      => 1,
				'links'                            => [],
				'update_target_indexable_id_times' => 0,
			],
			'link is not SEO_links object type' => [
				'indexable_id'                     => 1,
				'object_id'                        => 1,
				'links_times'                      => 1,
				'links'                            => [ $object ],
				'update_target_indexable_id_times' => 0,
			],
			'link is SEO_links object type but updated_indexable is false' => [
				'indexable_id'                     => 1,
				'object_id'                        => 1,
				'links_times'                      => 1,
				'links'                            => [ $seo_link_not_empty ],
				'update_target_indexable_id_times' => 0,
			],
			'$links array has an object that is SEO_Links and has target_indexable_id' => [
				'indexable_id'                     => 1,
				'object_id'                        => 1,
				'links_times'                      => 1,
				'links'                            => [ $seo_link ],
				'update_target_indexable_id_times' => 1,
			],
		];
	}

	/**
	 * Tests patch_seo_links
	 *
	 * @covers ::patch_seo_links
	 *
	 * @dataProvider patch_seo_links_provider
	 *
	 * @param int|null $indexable_id                     The indexable id.
	 * @param int|null $object_id                        The object id.
	 * @param int      $links_times                      The times that find_all_by_target_post_id is executed.
	 * @param array    $links                            The links.
	 * @param int      $update_target_indexable_id_times The times that update_target_indexable_id is executed.
	 *
	 * @return void
	 */
	public function test_patch_seo_links( $indexable_id, $object_id, $links_times, $links, $update_target_indexable_id_times ) {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->id        = $indexable_id;
		$indexable->object_id = $object_id;

		// Executed if indexable has an id and object_id.
		$this->seo_links_repository
			->expects( 'find_all_by_target_post_id' )
			->with( $indexable->object_id )
			->times( $links_times )
			->andReturn( $links );

		// Executed when $links has a object that is SEO_Links and has no target_indexable_id.
		$this->seo_links_repository
			->expects( 'update_target_indexable_id' )
			->times( $update_target_indexable_id_times );

		// Executed in update_incoming_links_for_related_indexables inside the patch_seo_links method when $updated_indexable is true.
		$this->seo_links_repository
			->expects( 'get_incoming_link_counts_for_indexable_ids' )
			->times( $update_target_indexable_id_times )
			->andReturn( [] );

		Functions\expect( 'wp_cache_supports' )->times( $update_target_indexable_id_times )->andReturnTrue();
		Functions\expect( 'wp_cache_flush_group' )->times( $update_target_indexable_id_times )->andReturnTrue();

		$this->instance->patch_seo_links( $indexable );
	}
}
