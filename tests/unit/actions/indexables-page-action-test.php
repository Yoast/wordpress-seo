<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions;

use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Actions\Indexables_Page_Action;
use Yoast\WP\SEO\Helpers\Indexables_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Indexables_Page_Action_Test class.
 *
 * @group actions
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexables_Page_Action
 */
class Indexables_Page_Action_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Indexables_Page_Action
	 */
	protected $instance;

	/**
	 * The instance to test.
	 *
	 * @var Mockery\MockInterface|Indexables_Page_Action
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
	 * The options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $indexables_page_helper;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_repository   = Mockery::mock( Indexable_Repository::class );
		$this->post_type_helper       = Mockery::mock( Post_Type_Helper::class );
		$this->options_helper         = Mockery::mock( Options_Helper::class );
		$this->indexables_page_helper = Mockery::mock( Indexables_Page_Helper::class );

		$this->instance      = new Indexables_Page_Action( $this->indexable_repository, $this->post_type_helper, $this->options_helper, $this->indexables_page_helper );
		$this->mock_instance = Mockery::mock(
			Indexables_Page_Action::class,
			[ $this->indexable_repository, $this->post_type_helper, $this->options_helper, $this->indexables_page_helper ]
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
	 * Tests getting the neccessary information to set up the indexables page.
	 *
	 * @covers ::get_setup_info
	 *
	 * @dataProvider get_setup_info_provider
	 *
	 * @param array  $features                   Whether each feature is enabled or not.
	 * @param int    $query_times                The times the queries will be run.
	 * @param array  $query_results              The results of each count query.
	 * @param array  $count_times                The times the count queries will be run.
	 * @param int    $percentage_query_times     The times the percentage queries will be run.
	 * @param int    $no_keyphrase_query_times   The times the query to get the indexables without key-phrases will be run.
	 * @param string $set_indexables_state_param The parameter to be passed to the set_indexables_state method.
	 * @param array  $expected_result            The expected result.
	 */
	public function test_get_setup_info( $features, $query_times, $query_results, $count_times, $percentage_query_times, $no_keyphrase_query_times, $set_indexables_state_param, $expected_result ) {
		$sub_types = [
			'post'        => 'post',
			'page'        => 'page',
			'category'    => 'category',
			'post_tag'    => 'post_tag',
			'post_format' => 'post_format',
		];

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'keyword_analysis_active', true )
			->andReturn( $features['keyword_analysis_active'] );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'content_analysis_active', true )
			->andReturn( $features['content_analysis_active'] );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'enable_text_link_counter', true )
			->andReturn( $features['enable_text_link_counter'] );

		$this->post_type_helper
			->expects( 'is_indexable' )
			->times( 5 * $query_times )
			->andReturn( true );

		$this->indexable_repository
			->expects( 'query' )
			->times( $query_times )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_raw' )
			->times( $query_times )
			->with( '( post_status = \'publish\' OR post_status IS NULL )' )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_in' )
			->times( $query_times )
			->with( 'object_type', [ 'post' ] )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_raw' )
			->times( $query_times )
			->with( '(( object_sub_type = \'post\' AND ( is_robots_noindex = FALSE OR is_robots_noindex IS NULL ) ) OR( object_sub_type = \'page\' AND ( is_robots_noindex = FALSE OR is_robots_noindex IS NULL ) ) OR( object_sub_type = \'category\' AND ( is_robots_noindex = FALSE OR is_robots_noindex IS NULL ) ) OR( object_sub_type = \'post_tag\' AND ( is_robots_noindex = FALSE OR is_robots_noindex IS NULL ) ) OR( object_sub_type = \'post_format\' AND ( is_robots_noindex = FALSE OR is_robots_noindex IS NULL ) ))' )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_not_equal' )
			->times( $percentage_query_times )
			->with( 'primary_focus_keyword', 0 )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_not_equal' )
			->times( $percentage_query_times )
			->with( 'readability_score', 0 )
			->andReturnSelf();

		$this->mock_instance
			->expects( 'get_sub_types' )
			->times( $query_times )
			->andReturn( $sub_types );

		$this->indexable_repository
			->expects( 'count' )
			->times( $count_times )
			->andReturn( ...$query_results );

		$this->indexable_repository
			->expects( 'where_null' )
			->times( $no_keyphrase_query_times )
			->with( 'primary_focus_keyword' )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'order_by_desc' )
			->times( $no_keyphrase_query_times )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'find_many' )
			->times( $no_keyphrase_query_times )
			->andReturn( [] );

		$this->mock_instance
			->expects( 'set_indexables_state' )
			->once()
			->with( $set_indexables_state_param );

		$this->assertEquals(
			$expected_result,
			$this->mock_instance->get_setup_info( 20, 0.5 )
		);
	}

	/**
	 * Data provider for test_get_setup_info function.
	 *
	 * @return array Data for test_get_setup_info function.
	 */
	public function get_setup_info_provider() {
		$seo_score_enabled_no_posts = [
			'ignore_list_state'          => [
				'keyword_analysis_active'  => false,
				'content_analysis_active'  => true,
				'enable_text_link_counter' => true,
			],
			'query_times'                => 1,
			'query_results'              => [ 0, 'irrelevant', 'irrelevant' ],
			'count_times'                => 1,
			'percentage_query_times'     => 0,
			'no_keyphrase_query_times'   => 0,
			'set_indexables_state_param' => 'no-content',
			'expected_result'            => [
				'enabledFeatures'       => [
					'isSeoScoreEnabled'    => false,
					'isReadabilityEnabled' => true,
					'isLinkCountEnabled'   => true,
				],
				'enoughContent'         => false,
				'enoughAnalysedContent' => false,
			],
		];

		$not_enough_posts = [
			'ignore_list_state'          => [
				'keyword_analysis_active'  => true,
				'content_analysis_active'  => true,
				'enable_text_link_counter' => true,
			],
			'query_times'                => 4,
			'query_results'              => [ 7, 7, 7 ],
			'count_times'                => 3,
			'percentage_query_times'     => 1,
			'no_keyphrase_query_times'   => 1,
			'set_indexables_state_param' => 'not-enough-content',
			'expected_result'            => [
				'enabledFeatures'       => [
					'isSeoScoreEnabled'    => true,
					'isReadabilityEnabled' => true,
					'isLinkCountEnabled'   => true,
				],
				'enoughContent'         => false,
				'enoughAnalysedContent' => true,
				'postsWithoutKeyphrase' => [],
			],
		];

		$not_enough_analyzed_posts = [
			'ignore_list_state'          => [
				'keyword_analysis_active'  => true,
				'content_analysis_active'  => true,
				'enable_text_link_counter' => true,
			],
			'query_times'                => 4,
			'query_results'              => [ 25, 12, 12 ],
			'count_times'                => 3,
			'percentage_query_times'     => 1,
			'no_keyphrase_query_times'   => 1,
			'set_indexables_state_param' => 'not-enough-analysed-content',
			'expected_result'            => [
				'enabledFeatures'       => [
					'isSeoScoreEnabled'    => true,
					'isReadabilityEnabled' => true,
					'isLinkCountEnabled'   => true,
				],
				'enoughContent'         => true,
				'enoughAnalysedContent' => false,
				'postsWithoutKeyphrase' => [],
			],
		];

		$all_threshold_passed = [
			'ignore_list_state'          => [
				'keyword_analysis_active'  => true,
				'content_analysis_active'  => true,
				'enable_text_link_counter' => true,
			],
			'query_times'                => 4,
			'query_results'              => [ 25, 13, 12 ],
			'count_times'                => 3,
			'percentage_query_times'     => 1,
			'no_keyphrase_query_times'   => 1,
			'set_indexables_state_param' => 'lists-shown',
			'expected_result'            => [
				'enabledFeatures'       => [
					'isSeoScoreEnabled'    => true,
					'isReadabilityEnabled' => true,
					'isLinkCountEnabled'   => true,
				],
				'enoughContent'         => true,
				'enoughAnalysedContent' => true,
				'postsWithoutKeyphrase' => [],
			],
		];
		return [
			'SEO score enabled but no posts' => $seo_score_enabled_no_posts,
			'Not enough posts'               => $not_enough_posts,
			'Not enough analyzed posts'      => $not_enough_analyzed_posts,
			'All thresholds passed'          => $all_threshold_passed,
		];
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

		$sub_types = [
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
			->once()
			->andReturn( $least_readability_ignore_list );

		$this->mock_instance
			->expects( 'get_sub_types' )
			->andReturn( $sub_types );

		$this->post_type_helper
			->expects( 'is_indexable' )
			->times( 5 )
			->andReturn( true );

		$this->indexable_repository
			->expects( 'query' )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'select_many' )
			->with( 'id', 'object_id', 'object_sub_type', 'permalink', 'breadcrumb_title', 'readability_score' )
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
			->expects( 'where_raw' )
			->with( '(( object_sub_type = \'post\' AND ( is_robots_noindex = FALSE OR is_robots_noindex IS NULL ) ) OR( object_sub_type = \'page\' AND ( is_robots_noindex = FALSE OR is_robots_noindex IS NULL ) ) OR( object_sub_type = \'category\' AND ( is_robots_noindex = FALSE OR is_robots_noindex IS NULL ) ) OR( object_sub_type = \'post_tag\' AND ( is_robots_noindex = FALSE OR is_robots_noindex IS NULL ) ) OR( object_sub_type = \'post_format\' AND ( is_robots_noindex = FALSE OR is_robots_noindex IS NULL ) ))' )
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
			->with( 20 )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'find_many' )
			->andReturn( $indexables_to_return );

		$this->assertEquals(
			$indexables_to_return,
			$this->mock_instance->get_least_readable( 20 )
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

		$sub_types = [
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
			->once()
			->andReturn( $least_seo_score_ignore_list );

		$this->mock_instance
			->expects( 'get_sub_types' )
			->andReturn( $sub_types );

		$this->post_type_helper
			->expects( 'is_indexable' )
			->times( 5 )
			->andReturn( true );

		$this->indexable_repository
			->expects( 'query' )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'select_many' )
			->with( 'id', 'object_id', 'object_sub_type', 'permalink', 'breadcrumb_title', 'primary_focus_keyword', 'primary_focus_keyword_score' )
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
			->expects( 'where_raw' )
			->with( '(( object_sub_type = \'post\' AND ( is_robots_noindex = FALSE OR is_robots_noindex IS NULL ) ) OR( object_sub_type = \'page\' AND ( is_robots_noindex = FALSE OR is_robots_noindex IS NULL ) ) OR( object_sub_type = \'category\' AND ( is_robots_noindex = FALSE OR is_robots_noindex IS NULL ) ) OR( object_sub_type = \'post_tag\' AND ( is_robots_noindex = FALSE OR is_robots_noindex IS NULL ) ) OR( object_sub_type = \'post_format\' AND ( is_robots_noindex = FALSE OR is_robots_noindex IS NULL ) ))' )
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
			->with( 20 )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'find_many' )
			->andReturn( $indexables_to_return );

		$this->assertEquals(
			$indexables_to_return,
			$this->mock_instance->get_least_seo_score( 20 )
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

		$sub_types = [
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
			->once()
			->andReturn( $most_linked_ignore_list );

		$this->mock_instance
			->expects( 'get_sub_types' )
			->andReturn( $sub_types );

		$this->post_type_helper
			->expects( 'is_indexable' )
			->times( 5 )
			->andReturn( true );

		$this->indexable_repository
			->expects( 'query' )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'select_many' )
			->with( 'id', 'object_id', 'object_sub_type', 'permalink', 'breadcrumb_title', 'incoming_link_count', 'is_cornerstone' )
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
			->expects( 'where_raw' )
			->with( '(( object_sub_type = \'post\' AND ( is_robots_noindex = FALSE OR is_robots_noindex IS NULL ) ) OR( object_sub_type = \'page\' AND ( is_robots_noindex = FALSE OR is_robots_noindex IS NULL ) ) OR( object_sub_type = \'category\' AND ( is_robots_noindex = FALSE OR is_robots_noindex IS NULL ) ) OR( object_sub_type = \'post_tag\' AND ( is_robots_noindex = FALSE OR is_robots_noindex IS NULL ) ) OR( object_sub_type = \'post_format\' AND ( is_robots_noindex = FALSE OR is_robots_noindex IS NULL ) ))' )
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
			->with( 20 )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'find_many' )
			->andReturn( $indexables_to_return );

		$this->assertEquals(
			$indexables_to_return,
			$this->mock_instance->get_most_linked( 20 )
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

		$sub_types = [
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
			->once()
			->andReturn( $least_linked_ignore_list );

		$this->mock_instance
			->expects( 'get_sub_types' )
			->andReturn( $sub_types );

		$this->post_type_helper
			->expects( 'is_indexable' )
			->times( 5 )
			->andReturn( true );

		$this->indexable_repository
			->expects( 'query' )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'select_many' )
			->with( 'id', 'object_id', 'object_sub_type', 'permalink', 'breadcrumb_title', 'incoming_link_count' )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_raw' )
			->with( '( post_status = \'publish\' OR post_status IS NULL )' )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'where_raw' )
			->with( '(( object_sub_type = \'post\' AND ( is_robots_noindex = FALSE OR is_robots_noindex IS NULL ) ) OR( object_sub_type = \'page\' AND ( is_robots_noindex = FALSE OR is_robots_noindex IS NULL ) ) OR( object_sub_type = \'category\' AND ( is_robots_noindex = FALSE OR is_robots_noindex IS NULL ) ) OR( object_sub_type = \'post_tag\' AND ( is_robots_noindex = FALSE OR is_robots_noindex IS NULL ) ) OR( object_sub_type = \'post_format\' AND ( is_robots_noindex = FALSE OR is_robots_noindex IS NULL ) ))' )
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
			->with( 20 )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'find_many' )
			->andReturn( $indexables_to_return );

		$this->assertEquals(
			$indexables_to_return,
			$this->mock_instance->get_least_linked( 20 )
		);
	}

	/**
	 * Test adding an indexable to an ignore-list.
	 *
	 * @covers ::update_ignored_indexables
	 *
	 * @dataProvider update_ignored_indexables_provider
	 *
	 * @param array $ignored_indexable_ids The id of the indexable to add to the ignore-list.
	 */
	public function test_update_ignored_indexables( $ignored_indexable_ids ) {
		$this->options_helper
			->expects( 'set' )
			->with( 'test_ignore_list_name', $ignored_indexable_ids )
			->andReturns();

		$this->indexables_page_helper
			->expects( 'is_valid_ignore_list_name' )
			->with( 'test_ignore_list_name' )
			->andReturns( true );

		$this->instance->update_ignored_indexables( 'test_ignore_list_name', $ignored_indexable_ids );
	}

	/**
	 * Data provider for test_update_ignored_indexables function.
	 *
	 * @return array Data for test_update_ignored_indexables function.
	 */
	public function update_ignored_indexables_provider() {
		$not_empty_list = [
			'ignored_indexable_ids' => [ 1, 2, 3, 4 ],
		];

		$empty_list = [
			'ignored_indexable_ids' => [],
		];
		return [
			'Not empty list' => $not_empty_list,
			'Empty'          => $empty_list,
		];
	}

	/**
	 * Test remove an indexable from an ignore-list.
	 *
	 * @covers ::remove_indexable_from_ignore_list
	 *
	 * @dataProvider remove_indexable_from_ignore_list_provider
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

		$this->indexables_page_helper
			->expects( 'is_valid_ignore_list_name' )
			->with( 'test_ignore_list_name' )
			->andReturns( true );

		$this->instance->remove_indexable_from_ignore_list( 'test_ignore_list_name', $indexable_id );
	}

	/**
	 * Data provider for test_add_indexable_to_ignore_list function.
	 *
	 * @return array Data for test_add_indexable_to_ignore_list function.
	 */
	public function remove_indexable_from_ignore_list_provider() {
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
