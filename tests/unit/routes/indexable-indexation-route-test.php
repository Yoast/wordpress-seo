<?php

namespace Yoast\WP\SEO\Tests\Unit\Routes;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Indexing_Complete_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Prepare_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexing_Complete_Action;
use Yoast\WP\SEO\Actions\Indexation\Post_Link_Indexing_Action;
use Yoast\WP\SEO\Actions\Indexation\Term_Link_Indexing_Action;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration;
use Yoast\WP\SEO\Routes\Indexing_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Indexation_Route_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Routes\Indexing_Route
 *
 * @group routes
 * @group indexables
 * @group indexing
 */
class Indexable_Indexation_Route_Test extends TestCase {

	/**
	 * Represents the post indexation action.
	 *
	 * @var Mockery\MockInterface|Indexable_Post_Indexation_Action
	 */
	protected $post_indexation_action;

	/**
	 * Represents the term indexation action.
	 *
	 * @var Mockery\MockInterface|Indexable_Term_Indexation_Action
	 */
	protected $term_indexation_action;

	/**
	 * Represents the post type archive indexation action.
	 *
	 * @var Mockery\MockInterface|Indexable_Post_Type_Archive_Indexation_Action
	 */
	protected $post_type_archive_indexation_action;

	/**
	 * Represents the general indexation action.
	 *
	 * @var Mockery\MockInterface|Indexable_General_Indexation_Action
	 */
	protected $general_indexation_action;

	/**
	 * Represents the indexable indexation complete action.
	 *
	 * @var Mockery\MockInterface|Indexable_Indexing_Complete_Action
	 */
	protected $indexable_indexing_complete_action;

	/**
	 * Represents the indexation complete action.
	 *
	 * @var Mockery\MockInterface|Indexable_Indexing_Complete_Action
	 */
	protected $indexing_complete_action;

	/**
	 * Represents the prepare indexation action.
	 *
	 * @var Mockery\MockInterface|Indexable_Prepare_Indexation_Action
	 */
	protected $prepare_indexation_action;

	/**
	 * Represents the prepare indexation action.
	 *
	 * @var Mockery\MockInterface|Post_Link_Indexing_Action
	 */
	protected $post_link_indexing_action;

	/**
	 * Represents the prepare indexation action.
	 *
	 * @var Mockery\MockInterface|Term_Link_Indexing_Action
	 */
	protected $term_link_indexing_action;

	/**
	 * Represents the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexing_Route
	 */
	protected $instance;

	/**
	 * Sets up the tests.
	 */
	public function setUp() {
		parent::setUp();

		$this->post_indexation_action              = Mockery::mock( Indexable_Post_Indexation_Action::class );
		$this->term_indexation_action              = Mockery::mock( Indexable_Term_Indexation_Action::class );
		$this->post_type_archive_indexation_action = Mockery::mock( Indexable_Post_Type_Archive_Indexation_Action::class );
		$this->general_indexation_action           = Mockery::mock( Indexable_General_Indexation_Action::class );
		$this->indexable_indexing_complete_action  = Mockery::mock( Indexable_Indexing_Complete_Action::class );
		$this->indexing_complete_action            = Mockery::mock( Indexing_Complete_Action::class );
		$this->prepare_indexation_action           = Mockery::mock( Indexable_Prepare_Indexation_Action::class );
		$this->post_link_indexing_action           = Mockery::mock( Post_Link_Indexing_Action::class );
		$this->term_link_indexing_action           = Mockery::mock( Term_Link_Indexing_Action::class );
		$this->options_helper                      = Mockery::mock( Options_Helper::class );

		$this->instance = new Indexing_Route(
			$this->post_indexation_action,
			$this->term_indexation_action,
			$this->post_type_archive_indexation_action,
			$this->general_indexation_action,
			$this->indexable_indexing_complete_action,
			$this->indexing_complete_action,
			$this->prepare_indexation_action,
			$this->post_link_indexing_action,
			$this->term_link_indexing_action,
			$this->options_helper
		);
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertAttributeInstanceOf( Indexable_Post_Indexation_Action::class, 'post_indexation_action', $this->instance );
		$this->assertAttributeInstanceOf( Indexable_Term_Indexation_Action::class, 'term_indexation_action', $this->instance );
		$this->assertAttributeInstanceOf( Indexable_Post_Type_Archive_Indexation_Action::class, 'post_type_archive_indexation_action', $this->instance );
		$this->assertAttributeInstanceOf( Indexable_General_Indexation_Action::class, 'general_indexation_action', $this->instance );
		$this->assertAttributeInstanceOf( Indexable_Indexing_Complete_Action::class, 'indexable_indexing_complete_action', $this->instance );
		$this->assertAttributeInstanceOf( Indexing_Complete_Action::class, 'indexing_complete_action', $this->instance );
		$this->assertAttributeInstanceOf( Indexable_Prepare_Indexation_Action::class, 'prepare_indexation_action', $this->instance );
		$this->assertAttributeInstanceOf( Post_Link_Indexing_Action::class, 'post_link_indexing_action', $this->instance );
		$this->assertAttributeInstanceOf( Term_Link_Indexing_Action::class, 'term_link_indexing_action', $this->instance );
		$this->assertAttributeInstanceOf( Options_Helper::class, 'options_helper', $this->instance );
	}

	/**
	 * Tests the registration of the routes.
	 *
	 * @covers ::register_routes
	 */
	public function test_register_routes() {
		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'indexation/prepare',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'prepare' ],
					'permission_callback' => [ $this->instance, 'can_index' ],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'indexation/complete',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'complete' ],
					'permission_callback' => [ $this->instance, 'can_index' ],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'indexation/posts',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'index_posts' ],
					'permission_callback' => [ $this->instance, 'can_index' ],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'indexation/terms',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'index_terms' ],
					'permission_callback' => [ $this->instance, 'can_index' ],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'indexation/post-type-archives',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'index_post_type_archives' ],
					'permission_callback' => [ $this->instance, 'can_index' ],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'indexation/general',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'index_general' ],
					'permission_callback' => [ $this->instance, 'can_index' ],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'indexation/indexables-complete',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'indexables_complete' ],
					'permission_callback' => [ $this->instance, 'can_index' ],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'link-indexing/posts',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'index_post_links' ],
					'permission_callback' => [ $this->instance, 'can_index' ],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'link-indexing/terms',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'index_term_links' ],
					'permission_callback' => [ $this->instance, 'can_index' ],
				]
			);

		$this->instance->register_routes();
	}

	/**
	 * Tests the indexation of the posts.
	 *
	 * @covers ::index_posts
	 * @covers ::run_indexation_action
	 */
	public function test_index_posts() {
		$this->post_indexation_action
			->expects( 'get_limit' )
			->once()
			->andReturn( 25 );
		$this->post_indexation_action
			->expects( 'index' )
			->once()
			->andReturn( \array_fill( 0, 25, true ) );

		Monkey\Functions\expect( 'rest_url' )
			->with( 'yoast/v1/indexation/posts' )
			->andReturnFirstArg();

		Mockery::mock( 'overload:WP_REST_Response' );

		$this->assertInstanceOf( 'WP_Rest_Response', $this->instance->index_posts() );
	}

	/**
	 * Tests the indexation of the terms.
	 *
	 * @covers ::index_terms
	 * @covers ::run_indexation_action
	 */
	public function test_index_terms() {
		$this->term_indexation_action
			->expects( 'get_limit' )
			->once()
			->andReturn( 25 );
		$this->term_indexation_action
			->expects( 'index' )
			->once()
			->andReturn( \array_fill( 0, 25, true ) );

		Monkey\Functions\expect( 'rest_url' )
			->with( 'yoast/v1/indexation/terms' )
			->andReturnFirstArg();

		Mockery::mock( 'overload:WP_REST_Response' );

		$this->assertInstanceOf( 'WP_Rest_Response', $this->instance->index_terms() );
	}

	/**
	 * Tests the indexation of the post type archives.
	 *
	 * @covers ::index_post_type_archives
	 * @covers ::run_indexation_action
	 */
	public function test_index_post_type_archives() {
		$this->post_type_archive_indexation_action
			->expects( 'get_limit' )
			->once()
			->andReturn( 25 );
		$this->post_type_archive_indexation_action
			->expects( 'index' )
			->once()
			->andReturn( \array_fill( 0, 25, true ) );

		Monkey\Functions\expect( 'rest_url' )
			->with( 'yoast/v1/indexation/post-type-archives' )
			->andReturnFirstArg();

		Mockery::mock( 'overload:WP_REST_Response' );

		$this->assertInstanceOf( 'WP_Rest_Response', $this->instance->index_post_type_archives() );
	}

	/**
	 * Tests the indexation of the general indexables.
	 *
	 * @covers ::index_general
	 * @covers ::run_indexation_action
	 */
	public function test_index_general() {
		$this->general_indexation_action
			->expects( 'get_limit' )
			->once()
			->andReturn( 25 );

		$this->general_indexation_action
			->expects( 'index' )
			->once()
			->andReturn( \array_fill( 0, 25, true ) );

		Monkey\Functions\expect( 'rest_url' )
			->with( 'yoast/v1/indexation/general' )
			->andReturnFirstArg();

		Mockery::mock( 'overload:WP_REST_Response' );

		$this->assertInstanceOf( 'WP_Rest_Response', $this->instance->index_general() );
	}

	/**
	 * Tests the indexation of the internal links for posts.
	 *
	 * @covers ::index_post_links
	 * @covers ::run_indexation_action
	 */
	public function test_index_post_links() {
		$this->post_link_indexing_action
			->expects( 'get_limit' )
			->once()
			->andReturn( 25 );

		$this->post_link_indexing_action
			->expects( 'index' )
			->once()
			->andReturn( \array_fill( 0, 25, true ) );

		Monkey\Functions\expect( 'rest_url' )
			->with( 'yoast/v1/link-indexing/posts' )
			->andReturnFirstArg();

		Mockery::mock( 'overload:WP_REST_Response' );

		$this->assertInstanceOf( 'WP_Rest_Response', $this->instance->index_post_links() );
	}

	/**
	 * Tests the indexation of the internal links for terms.
	 *
	 * @covers ::index_term_links
	 * @covers ::run_indexation_action
	 */
	public function test_index_term_links() {
		$this->term_link_indexing_action
			->expects( 'get_limit' )
			->once()
			->andReturn( 25 );

		$this->term_link_indexing_action
			->expects( 'index' )
			->once()
			->andReturn( \array_fill( 0, 25, true ) );

		Monkey\Functions\expect( 'rest_url' )
			->with( 'yoast/v1/link-indexing/terms' )
			->andReturnFirstArg();

		Mockery::mock( 'overload:WP_REST_Response' );

		$this->assertInstanceOf( 'WP_Rest_Response', $this->instance->index_term_links() );
	}

	/**
	 * Tests if the current user can edit posts.
	 *
	 * @covers ::can_index
	 */
	public function test_can_index() {
		Monkey\Functions\expect( 'current_user_can' )
			->with( 'edit_posts' )
			->andReturn( true );

		$this->assertTrue( $this->instance->can_index() );
	}

	/**
	 * Tests the index_general method when an error occurs.
	 *
	 * @covers ::index_general
	 * @covers ::run_indexation_action
	 */
	public function test_index_general_when_error_occurs() {
		$this->general_indexation_action->expects( 'index' )->andThrow( new \Exception( 'An exception during indexing' ) );

		$this->options_helper->expects( 'set' )->with( 'indexing_reason', Indexing_Notification_Integration::REASON_INDEXING_FAILED );

		Mockery::mock( '\WP_Error' );

		$this->instance->index_general();
	}
}
