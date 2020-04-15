<?php

namespace Yoast\WP\SEO\Tests\Actions\Indexation;

use Mockery;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Indexable_Post_Indexation_Action_Test class
 *
 * @coversDefaultClass Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action
 */
class Indexable_Post_Indexation_Action_Test extends TestCase {

	/**
	 * The post type helper mock.
	 *
	 * @var Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * The builder mock
	 *
	 * @var Indexable_Builder
	 */
	protected $builder;

	/**
	 * The wpdb mock.
	 *
	 * @var wpdb
	 */
	protected $wpdb;

	/**
	 * The instance.
	 *
	 * @var Indexable_Post_Indexation_Action
	 */
	protected $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		global $wpdb;
		$wpdb = (object) [ 'prefix' => 'wp_' ];

		$this->post_type_helper = Mockery::mock( Post_Type_Helper::class );
		$this->builder          = Mockery::mock( Indexable_Builder::class );
		$this->wpdb             = Mockery::mock( 'wpdb' );
		$this->wpdb->posts      = 'wp_posts';

		$this->instance = new Indexable_Post_Indexation_Action(
			$this->post_type_helper,
			$this->builder,
			$this->wpdb
		);
	}

	/**
	 * Tests the get total unindexed method.
	 *
	 * @covers ::__construct
	 * @covers ::get_total_unindexed
	 * @covers ::get_query
	 */
	public function test_get_total_unindexed() {
		$expected_query = 'SELECT COUNT(ID) FROM wp_posts
            WHERE ID NOT IN (SELECT object_id FROM wp_yoast_indexable WHERE object_type = \'post\') AND post_type IN (%s)
            ';

		$this->post_type_helper->expects( 'get_public_post_types' )->once()->andReturn( [ 'public_post_type' ] );
		$this->wpdb->expects( 'prepare' )->once()->with( $expected_query, [ 'public_post_type' ] )->andReturn( 'query' );
		$this->wpdb->expects( 'get_var' )->once()->with( 'query' )->andReturn( '10' );

		$this->assertEquals( 10, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests the index method.
	 *
	 * @covers ::__construct
	 * @covers ::index
	 * @covers ::get_query
	 */
	public function test_index() {
		$expected_query = 'SELECT ID FROM wp_posts
            WHERE ID NOT IN (SELECT object_id FROM wp_yoast_indexable WHERE object_type = \'post\') AND post_type IN (%s)
            LIMIT %d';

		$this->post_type_helper->expects( 'get_public_post_types' )->once()->andReturn( [ 'public_post_type' ] );
		$this->wpdb->expects( 'prepare' )->once()->with( $expected_query, [ 'public_post_type', 25 ] )->andReturn( 'query' );
		$this->wpdb->expects( 'get_col' )->once()->with( 'query' )->andReturn( [ '1', '3', '8' ] );

		$this->builder->expects( 'build_for_id_and_type' )->once()->with( 1, 'post' );
		$this->builder->expects( 'build_for_id_and_type' )->once()->with( 3, 'post' );
		$this->builder->expects( 'build_for_id_and_type' )->once()->with( 8, 'post' );

		$this->instance->index();
	}
}
