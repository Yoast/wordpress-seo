<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Indexables;

use Brain\Monkey;
use Mockery;
use wpdb;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Actions\Indexables\Indexable_Action;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Indexable_Action_Test class.
 *
 * @group actions
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexables\Indexable_Action
 */
class Indexable_Action_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Indexable_Action
	 */
	protected $instance;

	/**
	 * The instance to test.
	 *
	 * @var Mockery\MockInterface|Indexable_Action
	 */
	protected $mock_instance;

	/**
	 * The indexable repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * The post type helper.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * The options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );
		$this->post_type_helper     = Mockery::mock( Post_Type_Helper::class );
		$this->options_helper       = Mockery::mock( Options_Helper::class );

		$this->instance      = new Indexable_Action( $this->indexable_repository, $this->post_type_helper, $this->options_helper );
		$this->mock_instance = Mockery::mock(
			Indexable_Action::class,
			[ $this->indexable_repository, $this->post_type_helper, $this->options_helper ]
		)
			->makePartial()
			->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Indexable_Repository::class,
			$this->getPropertyValue( $this->instance, 'indexable_repository' )
		);
		$this->assertInstanceOf(
			Post_Type_Helper::class,
			$this->getPropertyValue( $this->instance, 'post_type_helper' )
		);
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
	}

	/**
	 * Tests getting the least readable posts.
	 *
	 * @covers ::get_least_readable
	 */
	public function test_get_least_readable() {
		$indexables_to_return = [
			Mockery::mock( Indexable::class ),
			Mockery::mock( Indexable::class ),
		];

		$public_sub_types = [
			'post'        => 'post',
			'page'        => 'page',
			'category'    => 'category',
			'post_tag'    => 'post_tag',
			'post_format' => 'post_format',
		];

		$least_readability_ignore_list = [
			1,
			2,
			5,
			7,
			8,
		];

		foreach ( $indexables_to_return as $indexable ) {
			$this->indexable_repository
				->expects( 'ensure_permalink' )
				->with( $indexable )
				->andReturn( $indexable );
		}

		$this->options_helper
			->expects( 'get' )
			->with( 'least_readability_ignore_list', [] )
			->twice()
			->andReturn( $least_readability_ignore_list );

		$this->mock_instance
			->expects( 'get_public_sub_types' )
			->andReturn( $public_sub_types );

		$this->indexable_repository
			->expects( 'query' )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_raw' )
			->with( '( post_status = \'publish\' OR post_status IS NULL )' )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_in' )
			->with( 'object_type', [ 'post' ] )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_in' )
			->with( 'object_sub_type', $public_sub_types )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_not_in' )
			->with( 'id', $least_readability_ignore_list )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_not_equal' )
			->with( 'readability_score', 0 )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'order_by_asc' )
			->with( 'readability_score' )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'limit' )
			->with( 100 )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'find_many' )
			->andReturn( $indexables_to_return );

		$this->assertEquals(
			$indexables_to_return,
			$this->mock_instance->get_least_readable()
		);
	}

	/**
	 * Tests getting the posts with the lowest seo score.
	 *
	 * @covers ::get_least_seo_score
	 */
	public function test_get_least_seo_score() {
		$indexables_to_return = [
			Mockery::mock( Indexable::class ),
			Mockery::mock( Indexable::class ),
		];

		$public_sub_types = [
			'post'        => 'post',
			'page'        => 'page',
			'category'    => 'category',
			'post_tag'    => 'post_tag',
			'post_format' => 'post_format',
		];

		$least_seo_score_ignore_list = [
			1,
			2,
			5,
			7,
			8,
		];

		foreach ( $indexables_to_return as $indexable ) {
			$this->indexable_repository
				->expects( 'ensure_permalink' )
				->with( $indexable )
				->andReturn( $indexable );
		}

		$this->options_helper
			->expects( 'get' )
			->with( 'least_seo_score_ignore_list', [] )
			->twice()
			->andReturn( $least_seo_score_ignore_list );

		$this->mock_instance
			->expects( 'get_public_sub_types' )
			->andReturn( $public_sub_types );

		$this->indexable_repository
			->expects( 'query' )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_raw' )
			->with( '( post_status = \'publish\' OR post_status IS NULL )' )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_in' )
			->with( 'object_type', [ 'post' ] )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_in' )
			->with( 'object_sub_type', $public_sub_types )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_not_in' )
			->with( 'id', $least_seo_score_ignore_list )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_not_equal' )
			->with( 'primary_focus_keyword', 0 )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'order_by_asc' )
			->with( 'primary_focus_keyword_score' )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'limit' )
			->with( 100 )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'find_many' )
			->andReturn( $indexables_to_return );

		$this->assertEquals(
			$indexables_to_return,
			$this->mock_instance->get_least_seo_score()
		);
	}

	/**
	 * Tests getting the posts with the most links.
	 *
	 * @covers ::get_most_linked
	 */
	public function test_get_most_linked() {
		$indexables_to_return = [
			Mockery::mock( Indexable::class ),
			Mockery::mock( Indexable::class ),
		];

		$public_sub_types = [
			'post'        => 'post',
			'page'        => 'page',
			'category'    => 'category',
			'post_tag'    => 'post_tag',
			'post_format' => 'post_format',
		];

		$most_linked_ignore_list = [
			1,
			2,
			5,
			7,
			8,
		];

		foreach ( $indexables_to_return as $indexable ) {
			$this->indexable_repository
				->expects( 'ensure_permalink' )
				->with( $indexable )
				->andReturn( $indexable );
		}

		$this->options_helper
			->expects( 'get' )
			->with( 'most_linked_ignore_list', [] )
			->twice()
			->andReturn( $most_linked_ignore_list );

		$this->mock_instance
			->expects( 'get_public_sub_types' )
			->andReturn( $public_sub_types );

		$this->indexable_repository
			->expects( 'query' )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_gt' )
			->with( 'incoming_link_count', 0 )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_not_null' )
			->with( 'incoming_link_count' )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_raw' )
			->with( '( post_status = \'publish\' OR post_status IS NULL )' )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_in' )
			->with( 'object_sub_type', $public_sub_types )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_in' )
			->with( 'object_type', [ 'post' ] )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_not_in' )
			->with( 'id', $most_linked_ignore_list )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'order_by_desc' )
			->with( 'incoming_link_count' )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'limit' )
			->with( 100 )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'find_many' )
			->andReturn( $indexables_to_return );

		$this->assertEquals(
			$indexables_to_return,
			$this->mock_instance->get_most_linked()
		);
	}

	/**
	 * Tests getting the posts with the least links.
	 *
	 * @covers ::get_least_linked
	 */
	public function test_get_least_linked() {
		$indexable_1      = Mockery::mock( Indexable::class );
		$indexable_1->orm = Mockery::mock( ORM::class );
		$indexable_1->orm->expects( 'get' )->andReturn( 5 );

		$indexable_2      = Mockery::mock( Indexable::class );
		$indexable_2->orm = Mockery::mock( ORM::class );
		$indexable_2->orm->expects( 'get' )->andReturn( null );
		$indexable_2->orm->expects( 'set' )->with( 'incoming_link_count', 0 )->andReturns();

		$indexables_to_return = [
			$indexable_1,
			$indexable_2,
		];

		$public_sub_types = [
			'post'        => 'post',
			'page'        => 'page',
			'category'    => 'category',
			'post_tag'    => 'post_tag',
			'post_format' => 'post_format',
		];

		$least_linked_ignore_list = [
			1,
			2,
			5,
			7,
			8,
		];

		foreach ( $indexables_to_return as $indexable ) {
			$this->indexable_repository
				->expects( 'ensure_permalink' )
				->with( $indexable )
				->andReturn( $indexable );
		}

		$this->options_helper
			->expects( 'get' )
			->with( 'least_linked_ignore_list', [] )
			->twice()
			->andReturn( $least_linked_ignore_list );

		$this->mock_instance
			->expects( 'get_public_sub_types' )
			->andReturn( $public_sub_types );

		$this->indexable_repository
			->expects( 'query' )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_raw' )
			->with( '( post_status = \'publish\' OR post_status IS NULL )' )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_in' )
			->with( 'object_sub_type', $public_sub_types )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_in' )
			->with( 'object_type', [ 'post' ] )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_not_in' )
			->with( 'id', $least_linked_ignore_list )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'order_by_asc' )
			->with( 'incoming_link_count' )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'limit' )
			->with( 100 )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'find_many' )
			->andReturn( $indexables_to_return );

		$this->assertEquals(
			$indexables_to_return,
			$this->mock_instance->get_least_linked()
		);
	}

	/**
	 * Test adding an indexable to an ignore-list.
	 *
	 * @covers ::add_indexable_to_ignore_list
	 *
	 * @dataProvider test_add_indexable_to_ignore_list_provider
	 *
	 * @param array $ignore_list_state The state of the ignore-list in the database.
	 * @param int   $indexable_id      The id of the indexable to add to the ignore-list.
	 * @param array $expected_result   The expected result.
	 */
	public function test_add_indexable_to_ignore_list( $ignore_list_state, $indexable_id, $expected_result ) {
		$this->options_helper
			->expects( 'get' )
			->with( 'test_ignore_list_name', [] )
			->andReturn( $ignore_list_state );

		$this->options_helper
			->expects( 'set' )
			->with( 'test_ignore_list_name', $expected_result )
			->andReturns();

		$this->instance->add_indexable_to_ignore_list( 'test_ignore_list_name', $indexable_id );
	}

	/**
	 * Data provider for test_add_indexable_to_ignore_list function.
	 *
	 * @return array Data for test_add_indexable_to_ignore_list function.
	 */
	public function test_add_indexable_to_ignore_list_provider() {
		$in_list = [
			'ignore_list_state' => [ 1, 2, 3, 4 ],
			'indexable_id'      => 3,
			'expected_result'   => [ 1, 2, 3, 4 ],
		];

		$not_in_list = [
			'ignore_list_state' => [ 1, 2, 4 ],
			'indexable_id'      => 3,
			'expected_result'   => [ 1, 2, 4, 3 ],
		];
		return [
			'Already in list' => $in_list,
			'Not in list yet' => $not_in_list,
		];
	}

	/**
	 * Test remove an indexable from an ignore-list.
	 *
	 * @covers ::remove_indexable_from_ignore_list
	 *
	 * @dataProvider test_remove_indexable_from_ignore_list_provider
	 *
	 * @param array $ignore_list_state The state of the ignore-list in the database.
	 * @param int   $indexable_id      The id of the indexable to remove from the ignore-list.
	 * @param array $expected_result   The expected result.
	 */
	public function test_remove_indexable_from_ignore_list( $ignore_list_state, $indexable_id, $expected_result ) {
		$this->options_helper
			->expects( 'get' )
			->with( 'test_ignore_list_name', [] )
			->andReturn( $ignore_list_state );

		$this->options_helper
			->expects( 'set' )
			->with( 'test_ignore_list_name', $expected_result )
			->andReturns();

		$this->instance->remove_indexable_from_ignore_list( 'test_ignore_list_name', $indexable_id );
	}

	/**
	 * Data provider for test_add_indexable_to_ignore_list function.
	 *
	 * @return array Data for test_add_indexable_to_ignore_list function.
	 */
	public function test_remove_indexable_from_ignore_list_provider() {
		$in_list = [
			'ignore_list_state' => [ 1, 2, 3, 4 ],
			'indexable_id'      => 3,
			'expected_result'   => [ 1, 2, 4 ],
		];

		$not_in_list = [
			'ignore_list_state' => [ 1, 2, 3, 4 ],
			'indexable_id'      => 5,
			'expected_result'   => [ 1, 2, 3, 4 ],
		];
		return [
			'Already in list' => $in_list,
			'Not in list yet' => $not_in_list,
		];
	}
}
