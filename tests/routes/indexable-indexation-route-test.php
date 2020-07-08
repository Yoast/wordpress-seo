<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Routes
 */

namespace Yoast\WP\SEO\Tests\Routes;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Complete_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Routes\Indexable_Indexation_Route;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexable_Indexation_Route_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Routes\Indexable_Indexation_Route
 *
 * @group routes
 * @group indexables
 * @group indexation
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
	 * Represents the indexation complete action.
	 * 
	 * @var Mockery\MockInterface|Indexable_Complete_Indexation_Action
	 */
	protected $complete_indexation_action;

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexable_Indexation_Route
	 */
	protected $instance;

	/**
	 * Represents the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->post_indexation_action              = Mockery::mock( Indexable_Post_Indexation_Action::class );
		$this->term_indexation_action              = Mockery::mock( Indexable_Term_Indexation_Action::class );
		$this->post_type_archive_indexation_action = Mockery::mock( Indexable_Post_Type_Archive_Indexation_Action::class );
		$this->general_indexation_action           = Mockery::mock( Indexable_General_Indexation_Action::class );
		$this->complete_indexation_action          = Mockery::mock( Indexable_Complete_Indexation_Action::class );
		$this->options_helper                      = Mockery::mock( Options_Helper::class );

		$this->instance = new Indexable_Indexation_Route(
			$this->post_indexation_action,
			$this->term_indexation_action,
			$this->post_type_archive_indexation_action,
			$this->general_indexation_action,
			$this->complete_indexation_action,
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
		$this->assertAttributeInstanceOf( Indexable_Complete_Indexation_Action::class, 'complete_indexation_action', $this->instance );
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
}
