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
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Services\Indexables\Indexable_Version_Manager;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Build_For_Id_And_Type_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Builder
 * @covers \Yoast\WP\SEO\Builders\Indexable_Builder
 */
class Build_For_Id_And_Type_Test extends TestCase {

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
	 * Represents the new indexable mock.
	 *
	 * @var Indexable_Mock
	 */
	protected $new_indexable;

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

		$this->indexable                  = Mockery::mock( Indexable_Mock::class );
		$this->indexable->author_id       = 1999;
		$this->indexable->version         = 1;
		$this->indexable->object_type     = 'post';
		$this->indexable->object_id       = 1337;

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
			$this->version_manager,
			$this->link_builder
		);

		$this->instance->set_indexable_repository( $this->indexable_repository );
	}

	/**
	 * Tests building an indexable for the post type archive.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build_for_id_and_type
	 * @covers ::build
	 * @covers ::ensure_indexable
     * @covers ::maybe_build_author_indexable
	 */
	public function test_build_for_id_and_type_with_post() {

        $defaults = [
            'object_type' => 'post',
			'object_id'   => 1337,
        ];

		$this->expect_build( $defaults );

		$this->assertSame( $this->indexable, $this->instance->build_for_id_and_type( 1337, 'post' ) );
	}

	/**
	 * Expectation for build method.
	 *
	 * @param array $defaults The defaults to expect.
	 */
	public function expect_build( $defaults ) {
		$this->expect_ensure_indexable( $defaults, $this->indexable );

		$this->post_builder
			->expects( 'build' )
			->once()
			->with( $this->indexable->object_id , $this->indexable )
			->andReturn( $this->indexable );

		$this->primary_term_builder
			->expects( 'build' )
			->once()
			->with( $this->indexable->object_id );

		$this->hierarchy_builder
			->expects( 'build' )
			->once()
			->with( $this->indexable )
			->andReturn( $this->indexable );

        $this->expect_maybe_build_author_indexable();

		// Saving is outside the scope of this test.
		$this->expect_save_indexable_skip();
	}

	/**
	 * Expectation in save_indexable when indexable is not saved.
	 * Used for skipping save_indexable method when outside test scope.
	 */
	public function expect_save_indexable_skip() {
		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->once()
			->withNoArgs()
			->andReturnFalse();
	}

	/**
	 * Expectations for ensure_indexable method.
	 *
	 * @param array          $defaults  The defaults to expect.
	 * @param Indexable_Mock $return_indexable The indexable to expect.
	 */
	public function expect_ensure_indexable( $defaults, $return_indexable ) {

		$this->indexable_repository
			->expects( 'query' )
			->once()
			->andReturnSelf();

		$this->indexable_repository
			->expects( 'create' )
			->once()
			->with( $defaults )
			->andReturn( $return_indexable );
	}

    /**
	 * Expectation for maybe_build_author_indexable method.
	 */
	public function expect_maybe_build_author_indexable() {

        $author_indexable = Mockery::mock( Indexable_Mock::class );

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( $this->indexable->author_id, 'user', false )
			->andReturn( $author_indexable );

        $this->version_manager
			->expects( 'indexable_needs_upgrade' )
			->once()
			->with( $author_indexable )
			->andReturnFalse();

	}
}
