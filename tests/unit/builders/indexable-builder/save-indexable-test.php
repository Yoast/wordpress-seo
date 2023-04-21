<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders\Indexable_Builder;

use Brain\Monkey;
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
 * Class Save_Indexable_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Builder
 * @covers \Yoast\WP\SEO\Builders\Indexable_Builder
 */
class Save_Indexable_Test extends TestCase {

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
	 * Provider for testing save_indexable method.
	 *
	 * @return array The test data.
	 */
	public function save_indexable_provider() {
		$before = Mockery::mock( Indexable::class );
		return [
			'Should index and save' =>
			[
				'indexable_before'            => null,
				'should_index_indexables'     => true,
				'wpseo_should_save_indexable' => true,
				'save_times'                  => 1,
				'action_times'                => 0,
			],
			'Should not index and not save' =>
			[
				'indexable_before'            => null,
				'should_index_indexables'     => false,
				'wpseo_should_save_indexable' => false,
				'save_times'                  => 0,
				'action_times'                => 0,
			],
			'Should not index but wpseo_should_save_indexable filter is true, should save' =>
			[
				'indexable_before'            => null,
				'should_index_indexables'     => false,
				'wpseo_should_save_indexable' => true,
				'save_times'                  => 1,
				'action_times'                => 0,
			],
			'Should index but wpseo_should_save_indexable filter is false, should not save' => [
				'indexable_before'            => null,
				'should_index_indexables'     => true,
				'wpseo_should_save_indexable' => false,
				'save_times'                  => 0,
				'action_times'                => 0,
			],
			'Updating existing indexable' => [
				'indexable_before'            => $before,
				'should_index_indexables'     => true,
				'wpseo_should_save_indexable' => true,
				'save_times'                  => 1,
				'action_times'                => 1,
			],
			'Updating existing indexable when should_index_indexables is false' =>
			[
				'indexable_before'            => $before,
				'should_index_indexables'     => false,
				'wpseo_should_save_indexable' => true,
				'save_times'                  => 1,
				'action_times'                => 1,
			],
		];
	}

	/**
	 * Test save_indexable.
	 *
	 * @covers ::save_indexable
	 *
	 * @dataProvider save_indexable_provider
	 *
	 * @param Indexable_Mock $indexable_before The indexable to expect.
	 * @param bool           $should_index The return value of should_index_indexables method.
	 * @param bool           $wpseo_should_save The return value for wpseo_should_save_indexable.
	 * @param int            $save_times The times save method should be executed.
	 * @param int            $action_times The times wpseo_save_indexable action should be executed.
	 * @return void
	 */
	public function test_save_indexable( $indexable_before, $should_index, $wpseo_should_save, $save_times, $action_times ) {

		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->once()
			->withNoArgs()
			->andReturn( $should_index );


		Monkey\Filters\expectApplied( 'wpseo_should_save_indexable' )
			->once()
			->with( $should_index, $this->indexable )
			->andReturn( $wpseo_should_save );

		$this->indexable
			->expects( 'save' )
			->times( $save_times );

		Monkey\Actions\expectDone( 'wpseo_save_indexable' )
			->times( $action_times )
			->with( $this->indexable, $indexable_before );

		$result = $this->instance->exposed_save_indexable( $this->indexable, $indexable_before );

		$this->assertSame( $result, $this->indexable );
	}
}
