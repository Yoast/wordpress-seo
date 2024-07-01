<?php

namespace Yoast\WP\SEO\Tests\WP\Admin\Watchers;

use Mockery;
use WP_Post;
use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Builders\Indexable_Hierarchy_Builder;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Permalink_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Hierarchy_Repository;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\WP\Doubles\Admin\Watchers\Indexable_Ancestor_Watcher_Double;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Class Indexable_Ancestor_Watcher_Test.
 *
 * @group indexables
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Indexable_Ancestor_Watcher
 */
final class Indexable_Ancestor_Watcher_Test extends TestCase {

	/**
	 * Represents the indexable repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * Represents the Indexable Hierarchy Builder.
	 *
	 * @var Mockery\MockInterface|Indexable_Hierarchy_Builder
	 */
	private $indexable_hierarchy_builder;

	/**
	 * Represents the hierarchy repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Hierarchy_Repository
	 */
	private $indexable_hierarchy_repository;

	/**
	 * Represents the Indexable_Helper.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper
	 */
	private $indexable_helper;

	/**
	 * Represents the Permalink_Helper.
	 *
	 * @var Mockery\MockInterface|Permalink_Helper
	 */
	private $permalink_helper;

	/**
	 * Represents the Post_Helper instance.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	private $post_type_helper;

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexable_Ancestor_Watcher_Double
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->indexable_repository           = Mockery::mock( Indexable_Repository::class );
		$this->indexable_hierarchy_builder    = Mockery::mock( Indexable_Hierarchy_Builder::class );
		$this->indexable_hierarchy_repository = Mockery::mock( Indexable_Hierarchy_Repository::class );
		$this->indexable_helper               = Mockery::mock( Indexable_Helper::class );
		$this->permalink_helper               = Mockery::mock( Permalink_Helper::class );
		$this->post_type_helper               = Mockery::mock( Post_Type_Helper::class );

		$this->instance = new Indexable_Ancestor_Watcher_Double(
			$this->indexable_repository,
			$this->indexable_hierarchy_builder,
			$this->indexable_hierarchy_repository,
			$this->indexable_helper,
			$this->permalink_helper,
			$this->post_type_helper
		);
	}

	/**
	 * Tests the get_object_ids_for_term method.
	 *
	 * @covers ::get_object_ids_for_term
	 *
	 * @return void
	 */
	public function test_get_object_ids_for_term() {
		$post1 = $this->factory()->post->create_and_get();
		$post2 = $this->factory()->post->create_and_get();

		$term_id = self::factory()->category->create(
			[
				'name'     => 'test_term',
				'taxonomy' => 'category',
			]
		);

		\wp_set_object_terms( $post1->ID, $term_id, 'category' );
		\wp_set_object_terms( $post2->ID, $term_id, 'category' );

		$child_indexable1 = $this->get_indexables_for( $post1 );
		$child_indexable2 = $this->get_indexables_for( $post2 );

		$child_indexables = [ $child_indexable1[0], $child_indexable2[0] ];

		$this->assertSame( [ (string) $post1->ID, (string) $post2->ID ], $this->instance->get_object_ids_for_term( $term_id, $child_indexables ) );
	}

	/**
	 * Gets all indexable records for a post.
	 *
	 * @param WP_Post $post The post to get indexables for.
	 *
	 * @return Indexable[] The indexbales for hte post.
	 */
	protected function get_indexables_for( WP_Post $post ) {
		$orm = Model::of_type( 'Indexable' );

		return $orm
			->where( 'object_id', $post->ID )
			->where( 'object_type', 'post' )
			->where( 'object_sub_type', $post->post_type )
			->find_many();
	}
}
