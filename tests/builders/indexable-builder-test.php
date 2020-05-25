<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Builders
 */

namespace Yoast\WP\SEO\Tests\Builders;

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
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexable_Builder_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Builder
 * @covers ::<!public>
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
	 * Represents the indexable repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexable_Builder
	 */
	protected $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->author_builder            = Mockery::mock( Indexable_Author_Builder::class );
		$this->post_builder              = Mockery::mock( Indexable_Post_Builder::class );
		$this->term_builder              = Mockery::mock( Indexable_Term_Builder::class );
		$this->home_page_builder         = Mockery::mock( Indexable_Home_Page_Builder::class );
		$this->post_type_archive_builder = Mockery::mock( Indexable_Post_Type_Archive_Builder::class );
		$this->date_archive_builder      = Mockery::mock( Indexable_Date_Archive_Builder::class );
		$this->system_page_builder       = Mockery::mock( Indexable_System_Page_Builder::class );
		$this->hierarchy_builder         = Mockery::mock( Indexable_Hierarchy_Builder::class );
		$this->primary_term_builder      = Mockery::mock( Primary_Term_Builder::class );

		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );

		$this->instance = new Indexable_Builder(
			$this->author_builder,
			$this->post_builder,
			$this->term_builder,
			$this->home_page_builder,
			$this->post_type_archive_builder,
			$this->date_archive_builder,
			$this->system_page_builder,
			$this->hierarchy_builder,
			$this->primary_term_builder
		);

		$this->instance->set_indexable_repository( $this->indexable_repository );
	}

	/**
	 * Test building an indexable for a post when having no indexable for the author yet.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build_for_id_and_type
	 * @covers ::ensure_indexable
	 * @covers ::save_indexable
	 */
	public function test_build_for_id_and_type_with_post_given_and_no_author_indexable_found() {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->author_id = 1999;

		$indexable
			->expects( 'save' )
			->once();

		$this->post_builder
			->expects( 'build' )
			->once()
			->with( 1337, $indexable )
			->andReturn( $indexable );

		$this->primary_term_builder
			->expects( 'build' )
			->once()
			->with( 1337 );

		Monkey\Actions\expectDone( 'wpseo_save_indexable' )
			->once()
			->with( $indexable, $indexable );

		$this->hierarchy_builder
			->expects( 'build' )
			->once()
			->with( $indexable );

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
			->expects( 'query' )
			->once()
			->andReturn( $this->indexable_repository );

		$this->indexable_repository
			->expects( 'create' )
			->once()
			->andReturn( $author_indexable );

		$this->author_builder
			->expects( 'build' )
			->once()
			->with( 1999, $author_indexable )
			->andReturn( $author_indexable );

		Monkey\Actions\expectDone( 'wpseo_save_indexable' )
			->once()
			->with( $author_indexable, $author_indexable );

		$this->assertSame( $indexable, $this->instance->build_for_id_and_type( 1337, 'post', $indexable ) );
	}

	/**
	 * Test building an indexable for a post when already having an indexable for the author.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build_for_id_and_type
	 * @covers ::ensure_indexable
	 * @covers ::save_indexable
	 */
	public function test_build_for_id_and_type_with_post_given_and_author_indexable_found() {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->author_id = 1999;

		$indexable
			->expects( 'save' )
			->once();

		$this->post_builder
			->expects( 'build' )
			->once()
			->with( 1337, $indexable )
			->andReturn( $indexable );

		$this->primary_term_builder
			->expects( 'build' )
			->once()
			->with( 1337 );

		Monkey\Actions\expectDone( 'wpseo_save_indexable' )
			->once()
			->with( $indexable, $indexable );

		$this->hierarchy_builder
			->expects( 'build' )
			->once()
			->with( $indexable );

		$author_indexable = Mockery::mock( Indexable_Mock::class );
		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 1999, 'user', false )
			->andReturn( $author_indexable );

		$this->assertSame( $indexable, $this->instance->build_for_id_and_type( 1337, 'post', $indexable ) );
	}

	/**
	 * Test building an indexable for a post with having the post builder return false.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build_for_id_and_type
	 * @covers ::ensure_indexable
	 */
	public function test_build_for_id_and_type_with_post_given_and_no_indexable_build() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$this->post_builder
			->expects( 'build' )
			->once()
			->with( 1337, $indexable )
			->andReturnFalse();

		$this->primary_term_builder
			->expects( 'build' )
			->never();

		$fake_indexable              = Mockery::mock( Indexable_Mock::class );
		$fake_indexable->post_status = 'unindexed';
		$fake_indexable
			->expects( 'save' )
			->once();

		$this->indexable_repository
			->expects( 'query' )
			->once()
			->andReturn( $this->indexable_repository );

		$this->indexable_repository
			->expects( 'create' )
			->once()
			->with(
				[
					'object_id'   => 1337,
					'object_type' => 'post',
					'post_status' => 'unindexed',
				]
			)
			->andReturn( $fake_indexable );

		$this->assertEquals( $fake_indexable, $this->instance->build_for_id_and_type( 1337, 'post', $indexable ) );
	}

	/**
	 * Test building an indexable for an author.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build_for_id_and_type
	 * @covers ::ensure_indexable
	 * @covers ::save_indexable
	 */
	public function test_build_for_id_and_type_with_user_given() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$indexable
			->expects( 'save' )
			->once();

		Monkey\Actions\expectDone( 'wpseo_save_indexable' )
			->once()
			->with( $indexable, $indexable );

		$this->author_builder
			->expects( 'build' )
			->once()
			->with( 1337, $indexable )
			->andReturn( $indexable );

		$this->assertSame( $indexable, $this->instance->build_for_id_and_type( 1337, 'user', $indexable ) );
	}

	/**
	 * Test building an indexable for a term.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build_for_id_and_type
	 * @covers ::ensure_indexable
	 * @covers ::save_indexable
	 */
	public function test_build_for_id_and_type_with_term_given() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$indexable
			->expects( 'save' )
			->once();

		Monkey\Actions\expectDone( 'wpseo_save_indexable' )
			->once()
			->with( $indexable, $indexable );

		$this->term_builder
			->expects( 'build' )
			->once()
			->with( 1337, $indexable )
			->andReturn( $indexable );

		$this->hierarchy_builder
			->expects( 'build' )
			->once()
			->with( $indexable );

		$this->assertSame( $indexable, $this->instance->build_for_id_and_type( 1337, 'term', $indexable ) );
	}

	/**
	 * Test building an indexable for an unknown type.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build_for_id_and_type
	 * @covers ::ensure_indexable
	 */
	public function test_build_for_id_and_type_with_unknown_type_given() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$this->assertSame( $indexable, $this->instance->build_for_id_and_type( 1337, 'bicycle', $indexable ) );
	}

	/**
	 * Test building an indexable for the homepage.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build_for_home_page
	 * @covers ::ensure_indexable
	 * @covers ::save_indexable
	 */
	public function test_build_for_homepage() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$this->home_page_builder
			->expects( 'build' )
			->once()
			->with( $indexable )
			->andReturn( $indexable );

		$indexable
			->expects( 'save' )
			->once();

		Monkey\Actions\expectDone( 'wpseo_save_indexable' )
			->once()
			->with( $indexable, $indexable );

		$this->assertSame( $indexable, $this->instance->build_for_home_page( $indexable ) );
	}

	/**
	 * Test building an indexable for the date archive.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build_for_date_archive
	 * @covers ::ensure_indexable
	 * @covers ::save_indexable
	 */
	public function test_build_for_date_archive() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$this->date_archive_builder
			->expects( 'build' )
			->once()
			->with( $indexable )
			->andReturn( $indexable );

		$indexable
			->expects( 'save' )
			->once();

		$this->assertSame( $indexable, $this->instance->build_for_date_archive( $indexable ) );
	}

	/**
	 * Test building an indexable for the post type archive.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build_for_post_type_archive
	 * @covers ::ensure_indexable
	 * @covers ::save_indexable
	 */
	public function test_build_for_post_type_archive() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$this->post_type_archive_builder
			->expects( 'build' )
			->once()
			->with( 'post', $indexable )
			->andReturn( $indexable );

		$indexable
			->expects( 'save' )
			->once();

		Monkey\Actions\expectDone( 'wpseo_save_indexable' )
			->once()
			->with( $indexable, $indexable );

		$this->assertSame( $indexable, $this->instance->build_for_post_type_archive( 'post', $indexable ) );
	}

	/**
	 * Test building an indexable for a system page.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build_for_system_page
	 * @covers ::ensure_indexable
	 * @covers ::save_indexable
	 */
	public function test_build_for_system_page() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$this->system_page_builder
			->expects( 'build' )
			->once()
			->with( 'sub-type', $indexable )
			->andReturn( $indexable );

		$indexable
			->expects( 'save' )
			->once();

		Monkey\Actions\expectDone( 'wpseo_save_indexable' )
			->once()
			->with( $indexable, $indexable );

		$this->assertSame( $indexable, $this->instance->build_for_system_page( 'sub-type', $indexable ) );
	}

	/**
	 * Tests that build returns false when a build returns false.
	 *
	 * @covers ::build_for_id_and_type
	 */
	public function test_build_for_id_and_type_returns_fake_indexable() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$this->term_builder->expects( 'build' )
			->once()
			->with( 1, $indexable )
			->andReturn( false );

		$fake_indexable              = Mockery::mock( Indexable_Mock::class );
		$fake_indexable->post_status = 'unindexed';
		$fake_indexable
			->expects( 'save' )
			->once();

		$this->indexable_repository
			->expects( 'query' )
			->once()
			->andReturn( $this->indexable_repository );

		$this->indexable_repository
			->expects( 'create' )
			->once()
			->with(
				[
					'object_id'   => 1,
					'object_type' => 'term',
					'post_status' => 'unindexed',
				]
			)
			->andReturn( $fake_indexable );

		$this->assertEquals( $fake_indexable, $this->instance->build_for_id_and_type( 1, 'term', $indexable ) );
	}
}
