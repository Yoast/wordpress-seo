<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders\Indexable_Link_Builder;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\Tests\Unit\Doubles\Builders\Indexable_Link_Builder_Double;

/**
 * Class Update_Incoming_Links_For_Related_Test.
 * Tests the update_incoming_links_for_related_indexables method.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Link_Builder
 */
final class Update_Incoming_Links_For_Related_Test extends Abstract_Indexable_Link_Builder_TestCase {

	/**
	 * Sets up the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->instance = new Indexable_Link_Builder_Double(
			$this->seo_links_repository,
			$this->url_helper,
			$this->post_helper,
			$this->options_helper,
			$this->indexable_helper,
			$this->image_content_extractor
		);

		$this->instance->set_dependencies( $this->indexable_repository, $this->image_helper );
	}

	/**
	 * Data provider for test_update_incoming_links_for_related_indexables.
	 *
	 * @return array
	 */
	public static function data_provider_update_incoming_links_for_related_indexables() {
		return [
			'no related indexables'       => [
				'related_indexable_ids'                            => [],
				'expected_counts'                                  => [],
				'get_incoming_link_counts_for_indexable_ids_times' => 0,
			],
			'one related indexable'       => [
				'related_indexable_ids'                            => [ 108 ],
				'expected_counts'                                  => [
					[
						'target_indexable_id' => 108,
						'incoming'            => 1,
					],
				],
				'get_incoming_link_counts_for_indexable_ids_times' => 1,
			],
			'multiple related indexables' => [
				'related_indexable_ids'                            => [ 108, 109, 110 ],
				'expected_counts'                                  => [
					[
						'target_indexable_id' => 108,
						'incoming'            => 1,
					],
					[
						'target_indexable_id' => 109,
						'incoming'            => 2,
					],
					[
						'target_indexable_id' => 110,
						'incoming'            => 3,
					],
				],
				'get_incoming_link_counts_for_indexable_ids_times' => 1,
			],
		];
	}

	/**
	 * Tests that the incoming link count is updated for all related indexables.
	 *
	 * @covers ::update_incoming_links_for_related_indexables
	 *
	 * @dataProvider data_provider_update_incoming_links_for_related_indexables
	 *
	 * @param int[] $related_indexable_ids                            The IDs of all related indexables.
	 * @param array $expected_counts                                  The expected counts.
	 * @param int   $get_incoming_link_counts_for_indexable_ids_times The number of times the method should be called.
	 *
	 * @return void
	 */
	public function test_update_incoming_links_for_related_indexables(
		$related_indexable_ids,
		$expected_counts,
		$get_incoming_link_counts_for_indexable_ids_times
	) {

		$this->seo_links_repository
			->expects( 'get_incoming_link_counts_for_indexable_ids' )
			->with( $related_indexable_ids )
			->andReturn( $expected_counts )
			->times( $get_incoming_link_counts_for_indexable_ids_times );

		foreach ( $expected_counts as $count ) {
			$this->indexable_repository
				->expects( 'update_incoming_link_count' )
				->with( $count['target_indexable_id'], $count['incoming'] )
				->once();
		}

		Functions\expect( 'wp_cache_supports' )->times( $get_incoming_link_counts_for_indexable_ids_times )->andReturnTrue();
		Functions\expect( 'wp_cache_flush_group' )->times( $get_incoming_link_counts_for_indexable_ids_times )->andReturnTrue();

		$this->instance->exposed_update_incoming_links_for_related_indexables( $related_indexable_ids );
	}
}
