<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders\Indexable_Builder;

use Mockery;
use Yoast\WP\SEO\Builders\Indexable_Author_Builder;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Builders\Indexable_Date_Archive_Builder;
use Yoast\WP\SEO\Builders\Indexable_Hierarchy_Builder;
use Yoast\WP\SEO\Builders\Indexable_Home_Page_Builder;
use Yoast\WP\SEO\Builders\Indexable_Link_Builder;
use Yoast\WP\SEO\Builders\Indexable_Post_Builder;
use Yoast\WP\SEO\Builders\Indexable_Post_Type_Archive_Builder;
use Yoast\WP\SEO\Builders\Indexable_System_Page_Builder;
use Yoast\WP\SEO\Builders\Indexable_Term_Builder;
use Yoast\WP\SEO\Builders\Primary_Term_Builder;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Services\Indexables\Indexable_Version_Manager;
use Yoast\WP\SEO\Tests\Unit\Doubles\Builders\Indexable_Builder_Double;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;


/**
 * Class Maybe_Build_Author_Indexable_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Builder
 * @covers \Yoast\WP\SEO\Builders\Indexable_Builder
 */
class Maybe_Build_Author_Indexable_Test extends TestCase {

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
	 * The link builder
	 *
	 * @var Mockery\MockInterface|Indexable_Link_Builder
	 */
	private $link_builder;

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

		$this->author_builder            = Mockery::mock( Indexable_Author_Builder::class );
		$this->post_builder              = Mockery::mock( Indexable_Post_Builder::class );
		$this->term_builder              = Mockery::mock( Indexable_Term_Builder::class );
		$this->home_page_builder         = Mockery::mock( Indexable_Home_Page_Builder::class );
		$this->post_type_archive_builder = Mockery::mock( Indexable_Post_Type_Archive_Builder::class );
		$this->date_archive_builder      = Mockery::mock( Indexable_Date_Archive_Builder::class );
		$this->system_page_builder       = Mockery::mock( Indexable_System_Page_Builder::class );
		$this->hierarchy_builder         = Mockery::mock( Indexable_Hierarchy_Builder::class );
		$this->primary_term_builder      = Mockery::mock( Primary_Term_Builder::class );
		$this->link_builder              = Mockery::mock( Indexable_Link_Builder::class );
		$this->indexable_helper          = Mockery::mock( Indexable_Helper::class );
		$this->version_manager           = Mockery::mock( Indexable_Version_Manager::class );
		$this->indexable_repository      = Mockery::mock( Indexable_Repository::class );

		$this->indexable              = Mockery::mock( Indexable_Mock::class );
		$this->indexable->author_id   = 1999;
		$this->indexable->version     = 1;
		$this->indexable->object_type = 'post';
		$this->indexable->object_id   = 1337;

		$this->instance = new Indexable_Builder_Double(
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
			$this->version_manager,
			$this->link_builder
		);

		$this->instance->set_indexable_repository( $this->indexable_repository );
	}

	/**
	 * Test maybe_build_author_indexable.
	 *
	 * @covers ::maybe_build_author_indexable
	 * @covers ::build
	 * @covers ::ensure_indexable
	 * @covers ::save_indexable
	 *
	 * @return void
	 */
	public function test_build_new_author_indexable() {
		$author_id                     = 2011;
		$author_indexable              = Mockery::mock( Indexable_Mock::class );
		$author_indexable->object_type = 'user';
		$author_indexable->object_id   = $author_id;


		$author_defaults = [
			'object_type' => 'user',
			'object_id'   => $author_id,
		];

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( $author_id, 'user', false )
			->andReturn( false );

		// The rest of expectation are from build method.
		$this->expect_ensure_indexable( $author_indexable, $author_defaults );

		$this->author_builder
			->expects( 'build' )
			->once()
			->with( $author_indexable->object_id, $author_indexable )
			->andReturn( $author_indexable );

		$this->expect_save_indexable();

		$this->instance->exposed_maybe_build_author_indexable( $author_id );
	}

	/**
	 * Test maybe_build_author_indexable.
	 *
	 * @covers ::maybe_build_author_indexable
	 * @covers ::build
	 * @covers ::ensure_indexable
	 * @covers ::save_indexable
	 * @covers ::deep_copy_indexable
	 *
	 * @return void
	 */
	public function test_update_author_indexable() {
		$author_id                     = 2012;
		$author_indexable              = Mockery::mock( Indexable_Mock::class );
		$author_indexable->object_type = 'user';
		$author_indexable->object_id   = $author_id;


		$author_defaults = [
			'object_type' => 'user',
			'object_id'   => $author_id,
		];

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( $author_id, 'user', false )
			->andReturn( $author_indexable );

		$this->version_manager
			->expects( 'indexable_needs_upgrade' )
			->once()
			->with( $author_indexable )
			->andReturnTrue();

		// The rest of expectation are from build method.
		$this->expect_deep_copy_indexable( $author_indexable );

		$this->author_builder
			->expects( 'build' )
			->once()
			->with( $author_indexable->object_id, $author_indexable )
			->andReturn( $author_indexable );

		$this->expect_save_indexable();

		$this->instance->exposed_maybe_build_author_indexable( $author_id );
	}

	/**
	 * Test maybe_build_author_indexable without changing author indexable.
	 *
	 * @covers ::maybe_build_author_indexable
	 *
	 * @return void
	 */
	public function test_does_not_build_author_indexable() {
		$author_indexable    = Mockery::mock( Indexable::class );
		$author_id           = 2010;
		$needs_upgrade_times = 1;
		$needs_upgrade       = false;

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( $author_id, 'user', false )
			->andReturn( $author_indexable );

		$this->version_manager
			->expects( 'indexable_needs_upgrade' )
			->times( $needs_upgrade_times )
			->with( $author_indexable )
			->andReturn( $needs_upgrade );

		$this->assertEquals( $author_indexable, $this->instance->exposed_maybe_build_author_indexable( $author_id ) );
	}

	/**
	 * Expect save_indexable execution inside build method.
	 * Skipping saving indexable, outside of testing scope.
	 *
	 * @return void
	 */
	public function expect_save_indexable() {

		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->once()
			->withNoArgs()
			->andReturnFalse();
	}

	/**
	 * Expect deep_copy_indexable execution inside build method.
	 *
	 * @param Indexable_Mock $author_indexable The author indexable.
	 */
	public function expect_deep_copy_indexable( $author_indexable ) {

		$author_indexable->expects( 'as_array' )
			->once()
			->andReturn( [] );

		$this->indexable_repository
			->expects( 'create' )
			->once()
			->andReturn( $author_indexable );

		$this->indexable_repository
			->expects( 'query' )
			->once()
			->andReturnSelf();
	}

	/**
	 * Expect ensure_indexable execution inside build method.
	 *
	 * @param Indexable_Mock $author_indexable The author indexable.
	 * @param array          $author_defaults  The author defaults.
	 */
	public function expect_ensure_indexable( $author_indexable, $author_defaults ) {

		$this->indexable_repository
			->expects( 'query' )
			->once()
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'create' )
			->once()
			->with( $author_defaults )
			->andReturn( $author_indexable );
	}
}
