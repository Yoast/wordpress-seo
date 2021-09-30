<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Builders\Indexable_Author_Builder;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Builders\Indexable_Date_Archive_Builder;
use Yoast\WP\SEO\Builders\Indexable_Hierarchy_Builder;
use Yoast\WP\SEO\Builders\Indexable_Home_Page_Builder;
use Yoast\WP\SEO\Builders\Indexable_Post_Builder;
use Yoast\WP\SEO\Builders\Indexable_Post_Type_Archive_Builder;
use Yoast\WP\SEO\Builders\Indexable_System_Page_Builder;
use Yoast\WP\SEO\Builders\Indexable_Term_Builder;
use Yoast\WP\SEO\Builders\Primary_Term_Builder;
use Yoast\WP\SEO\Exceptions\Indexable\Invalid_Term_Exception;
use Yoast\WP\SEO\Exceptions\Indexable\Post_Not_Found_Exception;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Services\Indexables\Indexable_Version_Manager;
use Yoast\WP\SEO\Tests\Unit\Doubles\Builders\Indexable_Builder_Double;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Builder_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Builder
 * @covers \Yoast\WP\SEO\Builders\Indexable_Builder
 */
class Indexable_Builder_Test extends TestCase {

	/**
	 * Represents the author builder.
	 *
	 * @var Mockery\MockInterface|Indexable_Author_Builder
	 */
	protected $author_builder;

	/**
	 * Represents the post builder.
	 *
	 * @var Mockery\MockInterface|Indexable_Post_Builder
	 */
	protected $post_builder;

	/**
	 * Represents the term builder.
	 *
	 * @var Mockery\MockInterface|Indexable_Term_Builder
	 */
	protected $term_builder;

	/**
	 * Represents the homepage builder.
	 *
	 * @var Mockery\MockInterface|Indexable_Home_Page_Builder
	 */
	protected $home_page_builder;

	/**
	 * Represents the post type archive builder.
	 *
	 * @var Mockery\MockInterface|Indexable_Post_Type_Archive_Builder
	 */
	protected $post_type_archive_builder;

	/**
	 * Represents the date archive builder.
	 *
	 * @var Mockery\MockInterface|Indexable_Date_Archive_Builder
	 */
	protected $date_archive_builder;

	/**
	 * Represents the system page builder.
	 *
	 * @var Mockery\MockInterface|Indexable_System_Page_Builder
	 */
	protected $system_page_builder;

	/**
	 * Represents the hierarchy builder.
	 *
	 * @var Mockery\MockInterface|Indexable_Hierarchy_Builder
	 */
	protected $hierarchy_builder;

	/**
	 * Represents the primary term builder.
	 *
	 * @var Mockery\MockInterface|Primary_Term_Builder
	 */
	protected $primary_term_builder;

	/**
	 * Represents the indexable helper.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * Represents the indexable repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * Represents the indexable mock.
	 *
	 * @var Indexable_Mock
	 */
	protected $indexable;

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexable_Builder
	 */
	protected $instance;

	/**
	 * The version manager.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Indexable_Version_Manager
	 */
	protected $version_manager;

	/**
	 * Sets up the test.
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->author_builder            = Mockery::mock( Indexable_Author_Builder::class );
		$this->post_builder              = Mockery::mock( Indexable_Post_Builder::class );
		$this->term_builder              = Mockery::mock( Indexable_Term_Builder::class );
		$this->home_page_builder         = Mockery::mock( Indexable_Home_Page_Builder::class );
		$this->post_type_archive_builder = Mockery::mock( Indexable_Post_Type_Archive_Builder::class );
		$this->date_archive_builder      = Mockery::mock( Indexable_Date_Archive_Builder::class );
		$this->system_page_builder       = Mockery::mock( Indexable_System_Page_Builder::class );
		$this->hierarchy_builder         = Mockery::mock( Indexable_Hierarchy_Builder::class );
		$this->primary_term_builder      = Mockery::mock( Primary_Term_Builder::class );
		$this->indexable_helper          = Mockery::mock( Indexable_Helper::class );
		$this->version_manager           = Mockery::mock( Indexable_Version_Manager::class );
		$this->indexable_repository      = Mockery::mock( Indexable_Repository::class );

		$this->indexable              = Mockery::mock( Indexable_Mock::class );
		$this->indexable->author_id   = 1999;
		$this->indexable->version     = 1;
		$this->indexable->object_type = 'post';
		$this->indexable->object_id   = 1337;

		$this->instance = new Indexable_Builder(
			$this->author_builder,
			$this->post_builder,
			$this->term_builder,
			$this->home_page_builder,
			$this->post_type_archive_builder,
			$this->date_archive_builder,
			$this->system_page_builder,
			$this->hierarchy_builder,
			$this->primary_term_builder,
			$this->indexable_helper,
			$this->version_manager
		);

		$this->instance->set_indexable_repository( $this->indexable_repository );
	}

	/**
	 * Tests building an indexable for a post when having no indexable for the author yet.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build_for_id_and_type
	 * @covers ::ensure_indexable
	 */
	public function test_build_for_id_and_type_with_post_given_and_no_author_indexable_found() {
		$this->indexable
			->expects( 'save' )
			->once();

		$this->indexable
			->expects( 'as_array' )
			->once()
			->andReturn( [] );

		$this->indexable_repository
			->expects( 'query' )
			->twice()
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'create' )
			->once()
			->with( [] )
			->andReturn( $this->indexable );

		$this->post_builder
			->expects( 'build' )
			->once()
			->with( 1337, $this->indexable )
			->andReturn( $this->indexable );

		$this->primary_term_builder
			->expects( 'build' )
			->once()
			->with( 1337 );
		$this->hierarchy_builder
			->expects( 'build' )
			->once()
			->with( $this->indexable )
			->andReturn( $this->indexable );

		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->twice()
			->withNoArgs()
			->andReturnTrue();

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 1999, 'user', false )
			->andReturnFalse();

		$author_indexable = Mockery::mock( Indexable_Mock::class );
		$author_indexable
			->expects( 'save' )
			->once();

		$this->indexable_repository
			->expects( 'create' )
			->with(
				[
					'object_type' => 'user',
					'object_id'   => 1999,
				]
			)
			->once()
			->andReturn( $author_indexable );

		$result = $this->instance->build_for_id_and_type( 1337, 'post', $this->indexable );

		$this->assertSame( $this->indexable, $result );
	}

	/**
	 * Tests building an indexable for a post when having no indexable for the author yet.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build_for_id_and_type
	 * @covers ::ensure_indexable
	 */
	public function test_build_for_id_and_type_with_post_given_and_old_author_indexable_found() {
		$this->indexable
			->expects( 'as_array' )
			->once()
			->andReturn( [] );

		$author_indexable              = Mockery::mock( Indexable_Mock::class );
		$author_indexable->object_type = 'user';
		$author_indexable->object_id   = 1999;
		$author_indexable->version     = 0;
		$author_indexable
			->expects( 'as_array' )
			->once()
			->andReturn( [] );

		$this->indexable_repository
			->expects( 'query' )
			->twice()
			->withNoArgs()
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'create' )
			->twice()
			->andReturn( $this->indexable, $author_indexable );

		$this->post_builder
			->expects( 'build' )
			->with( 1337, $this->indexable )
			->once()
			->andReturn( $this->indexable );
		$this->primary_term_builder
			->expects( 'build' )
			->once()
			->with( 1337 );
		$this->hierarchy_builder
			->expects( 'build' )
			->once()
			->with( $this->indexable )
			->andReturn( $this->indexable );

		// Prevent the indexable builder from actually saving in this test.
		// The test is complex enough in its current state.
		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->twice()
			->withNoArgs()
			->andReturnFalse();

		$this->version_manager
			->expects( 'indexable_needs_upgrade' )
			->once()
			->with( $author_indexable )
			->andReturnTrue();

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 1999, 'user', false )
			->andReturn( $author_indexable );

		$this->author_builder
			->expects( 'build' )
			->once()
			->with( 1999, $author_indexable )
			->andReturn( $author_indexable );

		$result = $this->instance->build_for_id_and_type( 1337, 'post', $this->indexable );

		$this->assertSame( $this->indexable, $result );
	}

	/**
	 * Tests building an indexable for a post when already having an indexable for the author.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build_for_id_and_type
	 * @covers ::ensure_indexable
	 */
	public function test_build_for_id_and_type_with_post_given_and_author_indexable_found() {
		$this->indexable_repository
			->expects( 'query' )
			->twice()
			->andReturnSelf();

		$this->indexable
			->expects( 'as_array' )
			->once()
			->andReturn( [] );

		$this->post_builder
			->expects( 'build' )
			->once()
			->with( 1337, $this->indexable )
			->andReturn( $this->indexable );

		$this->primary_term_builder
			->expects( 'build' )
			->once()
			->with( 1337 );

		$this->hierarchy_builder
			->expects( 'build' )
			->once()
			->with( $this->indexable );

		$author_indexable = Mockery::mock( Indexable_Mock::class );

		$author_indexable
			->expects( 'as_array' )
			->once()
			->andReturn( [] );

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 1999, 'user', false )
			->andReturn( $author_indexable );

		$this->indexable_repository
			->expects( 'create' )
			->twice()
			->with( [] )
			->andReturn( $this->indexable, $author_indexable );

		$this->version_manager
			->expects( 'indexable_needs_upgrade' )
			->once()
			->withAnyArgs()
			->andReturnTrue();

		// Prevent the indexable builder from actually saving in this test.
		// The test is complex enough in its current state.
		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->twice()
			->withNoArgs()
			->andReturnFalse();

		$this->assertSame( $this->indexable, $this->instance->build_for_id_and_type( 1337, 'post', $this->indexable ) );
	}

	/**
	 * Tests building an indexable for a post when the post builder throws an exception.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build_for_id_and_type
	 * @covers ::ensure_indexable
	 */
	public function test_build_for_id_and_type_with_post_given_and_no_indexable_build() {
		$this->indexable
			->expects( 'as_array' )
			->once()
			->andReturn( [] );

		$this->indexable_repository
			->expects( 'query' )
			->times( 2 )
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'create' )
			->once()
			->with( [] )
			->andReturn( $this->indexable );

		// Force an exception during the build process.
		$this->post_builder
			->expects( 'build' )
			->once()
			->with( 1337, $this->indexable )
			->andThrows( Post_Not_Found_Exception::class );

		// Verify the code after exception is not run.
		$this->primary_term_builder
			->expects( 'build' )
			->never();

		// Verify that the exception is caught and a placeholder indexable is created.
		$fake_indexable              = Mockery::mock( Indexable_Mock::class );
		$fake_indexable->post_status = 'unindexed';
		$this->indexable_repository
			->expects( 'create' )
			->once()
			->with(
				[
					'object_id'   => 1337,
					'object_type' => 'post',
					'post_status' => 'unindexed',
					'version'     => 0,
				]
			)
			->andReturn( $fake_indexable );

		$this->version_manager
			->expects( 'set_latest' )
			->once()
			->with( $fake_indexable )
			->andReturnUsing(
				static function ( $indexable ) {
					$indexable->version = 2;
					return $indexable;
				}
			);

		// Actually saving is outside the scope of this test.
		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		$result = $this->instance->build_for_id_and_type( 1337, 'post', $this->indexable );

		$this->assertEquals( $fake_indexable, $result );
	}

	/**
	 * Tests building an indexable for an author.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build_for_id_and_type
	 * @covers ::ensure_indexable
	 */
	public function test_build_for_id_and_type_with_user_given() {
		$this->indexable->object_type = 'user';
		$this->indexable
			->expects( 'as_array' )
			->once()
			->andReturn( [] );

		$this->indexable_repository
			->expects( 'query' )
			->once()
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'create' )
			->once()
			->with( [] )
			->andReturn( $this->indexable );

		$this->author_builder
			->expects( 'build' )
			->once()
			->with( 1337, $this->indexable )
			->andReturnUsing(
				static function( $id, Indexable $indexable ) {
					$indexable->version = 2;
					return $indexable;
				}
			);

		// Actual saving is outside test scope.
		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		$this->assertSame( $this->indexable, $this->instance->build_for_id_and_type( 1337, 'user', $this->indexable ) );
		$this->assertEquals( 2, $this->indexable->version );
	}

	/**
	 * Tests building an indexable for a term.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build_for_id_and_type
	 * @covers ::ensure_indexable
	 */
	public function test_build_for_id_and_type_with_term_given() {
		$this->indexable->object_type = 'term';
		$this->indexable
			->expects( 'as_array' )
			->once()
			->andReturn( [] );

		$this->indexable_repository
			->expects( 'query' )
			->once()
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'create' )
			->once()
			->with( [] )
			->andReturn( $this->indexable );

		$this->term_builder
			->expects( 'build' )
			->once()
			->with( 1337, $this->indexable )
			->andReturn( $this->indexable );

		$this->hierarchy_builder
			->expects( 'build' )
			->once()
			->with( $this->indexable );

		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		$this->assertSame( $this->indexable, $this->instance->build_for_id_and_type( 1337, 'term', $this->indexable ) );
	}

	/**
	 * Tests building an indexable for an unknown type.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build_for_id_and_type
	 * @covers ::ensure_indexable
	 */
	public function test_build_for_id_and_type_with_unknown_type_given() {
		$this->indexable->object_type = 'this type should not be processed';
		$this->indexable
			->expects( 'as_array' )
			->once()
			->andReturn( [] );

		$this->indexable_repository
			->expects( 'query' )
			->once()
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'create' )
			->once()
			->with( [] )
			->andReturn( $this->indexable );

		// Actual saving is outside test scope.
		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		$this->assertSame(
			$this->indexable,
			$this->instance->build_for_id_and_type(
				1337,
				'this type should not be processed',
				$this->indexable
			)
		);
	}

	/**
	 * Tests building an indexable for the homepage.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build_for_home_page
	 * @covers ::ensure_indexable
	 */
	public function test_build_for_homepage() {
		$this->indexable->object_type = 'home-page';
		$this->home_page_builder
			->expects( 'build' )
			->once()
			->with( $this->indexable )
			->andReturn( $this->indexable );

		$this->indexable
			->expects( 'as_array' )
			->once()
			->andReturn( [] );

		$this->indexable_repository
			->expects( 'query' )
			->once()
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'create' )
			->once()
			->with( [] )
			->andReturn( $this->indexable );

		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		$this->assertSame( $this->indexable, $this->instance->build_for_home_page( $this->indexable ) );
	}

	/**
	 * Tests building an indexable for the date archive.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build_for_date_archive
	 * @covers ::ensure_indexable
	 */
	public function test_build_for_date_archive() {
		$this->date_archive_builder
			->expects( 'build' )
			->once()
			->with( $this->indexable )
			->andReturn( $this->indexable );

		$this->indexable->object_type = 'date-archive';
		$this->indexable
			->expects( 'as_array' )
			->once()
			->andReturn( [] );

		$this->indexable_repository
			->expects( 'query' )
			->once()
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'create' )
			->once()
			->with( [] )
			->andReturn( $this->indexable );

		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		$this->assertSame( $this->indexable, $this->instance->build_for_date_archive( $this->indexable ) );
	}

	/**
	 * Tests building an indexable for the post type archive.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build_for_post_type_archive
	 * @covers ::ensure_indexable
	 */
	public function test_build_for_post_type_archive() {
		$this->post_type_archive_builder
			->expects( 'build' )
			->once()
			->with( 'post', $this->indexable )
			->andReturn( $this->indexable );

		$this->indexable->object_type     = 'post-type-archive';
		$this->indexable->object_sub_type = 'post';
		$this->indexable
			->expects( 'as_array' )
			->once()
			->andReturn( [] );

		$this->indexable_repository
			->expects( 'query' )
			->once()
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'create' )
			->once()
			->with( [] )
			->andReturn( $this->indexable );

		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		$this->assertSame( $this->indexable, $this->instance->build_for_post_type_archive( 'post-type-archive', $this->indexable ) );
	}

	/**
	 * Tests building an indexable for a system page.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build_for_system_page
	 * @covers ::ensure_indexable
	 */
	public function test_build_for_system_page() {
		$this->indexable->object_type     = 'system_page';
		$this->indexable->object_sub_type = '404';
		$this->indexable
			->expects( 'as_array' )
			->once()
			->andReturn( [] );

		$this->indexable_repository
			->expects( 'query' )
			->once()
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'create' )
			->once()
			->with( [] )
			->andReturn( $this->indexable );

		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		$this->assertSame( $this->indexable, $this->instance->build_for_system_page( '404', $this->indexable ) );
	}

	/**
	 * Tests that build returns false when a build returns an exception.
	 *
	 * @covers ::build_for_id_and_type
	 */
	public function test_build_for_id_and_type_returns_fake_indexable() {
		$this->indexable->object_type = 'term';

		$this->indexable_repository
			->expects( 'query' )
			->twice()
			->andReturnSelf();

		$this->indexable
			->expects( 'as_array' )
			->once()
			->andReturn( [] );

		$this->indexable_repository
			->expects( 'create' )
			->once()
			->with( [] )
			->andReturn( $this->indexable );

		$this->term_builder->expects( 'build' )
			->once()
			->with( 1337, $this->indexable )
			->andThrows( Invalid_Term_Exception::class );

		$fake_indexable              = Mockery::mock( Indexable_Mock::class );
		$fake_indexable->object_type = 'term';
		$fake_indexable->object_id   = 1337;
		$fake_indexable->object_type = 'term';
		$fake_indexable->post_status = 'unindexed';
		$fake_indexable->version     = 0;

		$this->indexable_repository
			->expects( 'create' )
			->once()
			->with(
				[
					'object_id'   => 1337,
					'object_type' => 'term',
					'post_status' => 'unindexed',
					'version'     => 0,
				]
			)->andReturn( $fake_indexable );

		$this->version_manager
			->expects( 'set_latest' )
			->once()
			->with( $fake_indexable )
			->andReturn( $fake_indexable );

		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		$result = $this->instance->build_for_id_and_type( 1337, 'term', $this->indexable );

		$this->assertEquals( $fake_indexable, $result );
	}

	/**
	 * Tests saving a new indexable.
	 *
	 * @covers ::__construct
	 * @covers ::save_indexable
	 */
	public function test_saving_a_new_indexable_no_update_notification() {
		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->once()
			->withNoArgs()
			->andReturnTrue();

		$this->indexable
			->expects( 'save' )
			->once();

		Monkey\Filters\expectApplied( 'wpseo_should_save_indexable' )
			->once()
			->with( true, $this->indexable )
			->andReturn( true );

		Monkey\Actions\expectDone( 'wpseo_save_indexable' )
			->never()
			->withAnyArgs();

		// Creates an instance of the Indexable_Builder_Double class.
		// This is a subclass of the Indexable_Builder we intend to test, with exposed protected methods.
		$instance = new Indexable_Builder_Double(
			$this->author_builder,
			$this->post_builder,
			$this->term_builder,
			$this->home_page_builder,
			$this->post_type_archive_builder,
			$this->date_archive_builder,
			$this->system_page_builder,
			$this->hierarchy_builder,
			$this->primary_term_builder,
			$this->indexable_helper,
			$this->version_manager
		);

		$result = $instance->exposed_save_indexable( $this->indexable, null );

		$this->assertSame( $result, $this->indexable );
	}

	/**
	 * Tests updating an existing indexable.
	 *
	 * @covers ::__construct
	 * @covers ::save_indexable
	 */
	public function test_saving_an_existing_indexable_with_update_notification() {
		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->once()
			->withNoArgs()
			->andReturnTrue();

		$this->indexable
			->expects( 'save' )
			->once();

		Monkey\Filters\expectApplied( 'wpseo_should_save_indexable' )
			->once()
			->with( true, $this->indexable )
			->andReturn( true );

		Monkey\Actions\expectDone( 'wpseo_save_indexable' )
			->once()
			->withAnyArgs();

		// Creates an instance of the Indexable_Builder_Double class.
		// This is a subclass of the Indexable_Builder we intend to test, with exposed protected methods.
		$instance = new Indexable_Builder_Double(
			$this->author_builder,
			$this->post_builder,
			$this->term_builder,
			$this->home_page_builder,
			$this->post_type_archive_builder,
			$this->date_archive_builder,
			$this->system_page_builder,
			$this->hierarchy_builder,
			$this->primary_term_builder,
			$this->indexable_helper,
			$this->version_manager
		);

		$before = Mockery::mock( Indexable::class );

		$result = $instance->exposed_save_indexable( $this->indexable, $before );

		$this->assertSame( $result, $this->indexable );
	}

	/**
	 * Tests building an indexable but not saving it.
	 *
	 * @covers ::__construct
	 * @covers ::save_indexable
	 */
	public function test_not_saving_an_indexable() {
		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->once()
			->withNoArgs()
			->andReturnTrue();

		$this->indexable
			->expects( 'save' )
			->never();

		Monkey\Filters\expectApplied( 'wpseo_should_save_indexable' )
			->once()
			->with( true, $this->indexable )
			->andReturn( false );

		Monkey\Actions\expectDone( 'wpseo_save_indexable' )
			->never()
			->with( $this->indexable, $this->indexable );

		// Creates an instance of the Indexable_Builder_Double class.
		// This is a subclass of the Indexable_Builder we intend to test, with exposed protected methods.
		$instance = new Indexable_Builder_Double(
			$this->author_builder,
			$this->post_builder,
			$this->term_builder,
			$this->home_page_builder,
			$this->post_type_archive_builder,
			$this->date_archive_builder,
			$this->system_page_builder,
			$this->hierarchy_builder,
			$this->primary_term_builder,
			$this->indexable_helper,
			$this->version_manager
		);

		$result = $instance->exposed_save_indexable( $this->indexable, null );

		$this->assertSame( $this->indexable, $result );
	}
}
