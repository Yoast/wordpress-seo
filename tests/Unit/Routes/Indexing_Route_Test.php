<?php

namespace Yoast\WP\SEO\Tests\Unit\Routes;

use Brain\Monkey;
use Exception;
use Mockery;
use WP_Error;
use WP_REST_Response;
use Yoast\WP\SEO\Actions\Indexing\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Indexing_Complete_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexing_Complete_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexing_Prepare_Action;
use Yoast\WP\SEO\Actions\Indexing\Post_Link_Indexing_Action;
use Yoast\WP\SEO\Actions\Indexing\Term_Link_Indexing_Action;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Routes\Indexing_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexing_Route_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Routes\Indexing_Route
 *
 * @group routes
 * @group indexables
 * @group indexing
 */
final class Indexing_Route_Test extends TestCase {

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
	 * Represents the indexable indexing complete action.
	 *
	 * @var Mockery\MockInterface|Indexable_Indexing_Complete_Action
	 */
	protected $indexable_indexing_complete_action;

	/**
	 * Represents the indexation complete action.
	 *
	 * @var Mockery\MockInterface|Indexing_Complete_Action
	 */
	protected $indexing_complete_action;

	/**
	 * Represents the prepare indexing action.
	 *
	 * @var Mockery\MockInterface|Indexing_Prepare_Action
	 */
	protected $prepare_indexing_action;

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
	 * Represents the indexing helper.
	 *
	 * @var Mockery\MockInterface|Indexing_Helper
	 */
	protected $indexing_helper;

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexing_Route
	 */
	protected $instance;

	/**
	 * Sets up the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->post_indexation_action              = Mockery::mock( Indexable_Post_Indexation_Action::class );
		$this->term_indexation_action              = Mockery::mock( Indexable_Term_Indexation_Action::class );
		$this->post_type_archive_indexation_action = Mockery::mock( Indexable_Post_Type_Archive_Indexation_Action::class );
		$this->general_indexation_action           = Mockery::mock( Indexable_General_Indexation_Action::class );
		$this->indexable_indexing_complete_action  = Mockery::mock( Indexable_Indexing_Complete_Action::class );
		$this->indexing_complete_action            = Mockery::mock( Indexing_Complete_Action::class );
		$this->prepare_indexing_action             = Mockery::mock( Indexing_Prepare_Action::class );
		$this->post_link_indexing_action           = Mockery::mock( Post_Link_Indexing_Action::class );
		$this->term_link_indexing_action           = Mockery::mock( Term_Link_Indexing_Action::class );
		$this->options_helper                      = Mockery::mock( Options_Helper::class );
		$this->indexing_helper                     = Mockery::mock( Indexing_Helper::class );
		$this->post_link_indexing_action           = Mockery::mock( Post_Link_Indexing_Action::class );
		$this->term_link_indexing_action           = Mockery::mock( Term_Link_Indexing_Action::class );

		$this->instance = new Indexing_Route(
			$this->post_indexation_action,
			$this->term_indexation_action,
			$this->post_type_archive_indexation_action,
			$this->general_indexation_action,
			$this->indexable_indexing_complete_action,
			$this->indexing_complete_action,
			$this->prepare_indexing_action,
			$this->post_link_indexing_action,
			$this->term_link_indexing_action,
			$this->options_helper,
			$this->indexing_helper
		);
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Indexable_Post_Indexation_Action::class,
			$this->getPropertyValue( $this->instance, 'post_indexation_action' )
		);
		$this->assertInstanceOf(
			Indexable_Term_Indexation_Action::class,
			$this->getPropertyValue( $this->instance, 'term_indexation_action' )
		);
		$this->assertInstanceOf(
			Indexable_Post_Type_Archive_Indexation_Action::class,
			$this->getPropertyValue( $this->instance, 'post_type_archive_indexation_action' )
		);
		$this->assertInstanceOf(
			Indexable_General_Indexation_Action::class,
			$this->getPropertyValue( $this->instance, 'general_indexation_action' )
		);
		$this->assertInstanceOf(
			Indexable_Indexing_Complete_Action::class,
			$this->getPropertyValue( $this->instance, 'indexable_indexing_complete_action' )
		);
		$this->assertInstanceOf(
			Indexing_Complete_Action::class,
			$this->getPropertyValue( $this->instance, 'indexing_complete_action' )
		);
		$this->assertInstanceOf(
			Indexing_Prepare_Action::class,
			$this->getPropertyValue( $this->instance, 'prepare_indexing_action' )
		);
		$this->assertInstanceOf(
			Post_Link_Indexing_Action::class,
			$this->getPropertyValue( $this->instance, 'post_link_indexing_action' )
		);
		$this->assertInstanceOf(
			Term_Link_Indexing_Action::class,
			$this->getPropertyValue( $this->instance, 'term_link_indexing_action' )
		);
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
		$this->assertInstanceOf(
			Indexing_Helper::class,
			$this->getPropertyValue( $this->instance, 'indexing_helper' )
		);
	}

	/**
	 * Tests the registration of the routes.
	 *
	 * @covers ::register_routes
	 *
	 * @return void
	 */
	public function test_register_routes() {
		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'indexing/prepare',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'prepare' ],
					'permission_callback' => [ $this->instance, 'can_index' ],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'indexing/complete',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'complete' ],
					'permission_callback' => [ $this->instance, 'can_index' ],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'indexing/posts',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'index_posts' ],
					'permission_callback' => [ $this->instance, 'can_index' ],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'indexing/terms',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'index_terms' ],
					'permission_callback' => [ $this->instance, 'can_index' ],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'indexing/post-type-archives',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'index_post_type_archives' ],
					'permission_callback' => [ $this->instance, 'can_index' ],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'indexing/general',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'index_general' ],
					'permission_callback' => [ $this->instance, 'can_index' ],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'indexing/indexables-complete',
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
	 *
	 * @return void
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
			->with( 'yoast/v1/indexing/posts' )
			->andReturnFirstArg();

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$this->assertInstanceOf( WP_REST_Response::class, $this->instance->index_posts() );
	}

	/**
	 * Tests the indexation of the terms.
	 *
	 * @covers ::index_terms
	 * @covers ::run_indexation_action
	 *
	 * @return void
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
			->with( 'yoast/v1/indexing/terms' )
			->andReturnFirstArg();

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$this->assertInstanceOf( WP_REST_Response::class, $this->instance->index_terms() );
	}

	/**
	 * Tests the indexation of the post type archives.
	 *
	 * @covers ::index_post_type_archives
	 * @covers ::run_indexation_action
	 *
	 * @return void
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
			->with( 'yoast/v1/indexing/post-type-archives' )
			->andReturnFirstArg();

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$this->assertInstanceOf( WP_REST_Response::class, $this->instance->index_post_type_archives() );
	}

	/**
	 * Tests the indexation of the general indexables.
	 *
	 * @covers ::index_general
	 * @covers ::run_indexation_action
	 *
	 * @return void
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
			->with( 'yoast/v1/indexing/general' )
			->andReturnFirstArg();

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$this->assertInstanceOf( WP_REST_Response::class, $this->instance->index_general() );
	}

	/**
	 * Tests the indexation of the internal links for posts.
	 *
	 * @covers ::index_post_links
	 * @covers ::run_indexation_action
	 *
	 * @return void
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

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$this->assertInstanceOf( WP_REST_Response::class, $this->instance->index_post_links() );
	}

	/**
	 * Tests the indexation of the internal links for terms.
	 *
	 * @covers ::index_term_links
	 * @covers ::run_indexation_action
	 *
	 * @return void
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

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$this->assertInstanceOf( WP_REST_Response::class, $this->instance->index_term_links() );
	}

	/**
	 * Tests if the current user can edit posts.
	 *
	 * @covers ::can_index
	 *
	 * @return void
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
	 *
	 * @return void
	 */
	public function test_index_general_when_error_occurs() {
		$this->general_indexation_action->expects( 'index' )->andThrow( new Exception( 'An exception during indexing' ) );

		$this->indexing_helper->expects( 'indexing_failed' )->withNoArgs();

		Mockery::mock( WP_Error::class );

		$this->instance->index_general();
	}
}
