<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Global_Setting_Targets;

use Mockery;
use Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Global_Setting_Target_Exception;
use Yoast\WP\SEO\Abilities\Domain\Global_Setting_Target_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Author_Archives_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Date_Archives_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Global_Setting_Target_Repository;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Homepage_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Not_Found_Page_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Post_Type_Archive_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Post_Type_Archive_Target_Factory;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Search_Page_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Taxonomy_Archive_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Taxonomy_Archive_Target_Factory;
use Yoast\WP\SEO\Helpers\Author_Archive_Helper;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Global_Setting_Target_Repository class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Global_Setting_Target_Repository
 */
final class Global_Setting_Target_Repository_Test extends TestCase {

	/**
	 * The names of the targets, in the order of the settings page.
	 *
	 * @var array<string>
	 */
	private const TARGET_NAMES = [ 'homepage', 'post_type_archive', 'taxonomy_archive', 'author_archives', 'date_archives', 'search_page', 'not_found_page' ];

	/**
	 * The homepage target.
	 *
	 * @var Homepage_Target
	 */
	private $homepage;

	/**
	 * The current page helper mock.
	 *
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * The factory of the content type archive targets mock.
	 *
	 * @var Mockery\MockInterface|Post_Type_Archive_Target_Factory
	 */
	private $post_type_archive_factory;

	/**
	 * The factory of the taxonomy archive targets mock.
	 *
	 * @var Mockery\MockInterface|Taxonomy_Archive_Target_Factory
	 */
	private $taxonomy_archive_factory;

	/**
	 * The instance under test.
	 *
	 * @var Global_Setting_Target_Repository
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->current_page_helper       = Mockery::mock( Current_Page_Helper::class );
		$this->homepage                  = new Homepage_Target( $this->current_page_helper );
		$this->post_type_archive_factory = Mockery::mock( Post_Type_Archive_Target_Factory::class );
		$this->taxonomy_archive_factory  = Mockery::mock( Taxonomy_Archive_Target_Factory::class );

		$this->instance = new Global_Setting_Target_Repository(
			$this->homepage,
			new Author_Archives_Target( Mockery::mock( Author_Archive_Helper::class ) ),
			new Date_Archives_Target( Mockery::mock( Options_Helper::class ) ),
			new Search_Page_Target(),
			new Not_Found_Page_Target(),
			$this->post_type_archive_factory,
			$this->taxonomy_archive_factory,
		);
	}

	/**
	 * Returns the names of targets.
	 *
	 * @param array<Global_Setting_Target_Interface> $targets The targets.
	 *
	 * @return array<string> The names.
	 */
	private function get_target_names( array $targets ): array {
		return \array_map(
			static function ( $target ) {
				return $target->get_name();
			},
			$targets,
		);
	}

	/**
	 * Creates an available target mock of a given class.
	 *
	 * @param string $class_name The class of the target.
	 * @param string $name       The name of the target.
	 *
	 * @return Mockery\MockInterface The target mock.
	 */
	private function mock_available_target( string $class_name, string $name ) {
		$target = Mockery::mock( $class_name );
		$target->allows( 'get_name' )->andReturn( $name );
		$target->expects( 'ensure_available' )->once();

		return $target;
	}

	/**
	 * Tests that get_names returns the names of all targets in the order of the settings page.
	 *
	 * @covers ::__construct
	 * @covers ::get_names
	 *
	 * @return void
	 */
	public function test_get_names() {
		$this->assertSame( self::TARGET_NAMES, $this->instance->get_names() );
	}

	/**
	 * Tests that get_all returns all available targets in the order of the settings page.
	 *
	 * @covers ::get_all
	 * @covers ::create_all
	 * @covers ::filter_available
	 *
	 * @return void
	 */
	public function test_get_all() {
		$archive  = $this->mock_available_target( Post_Type_Archive_Target::class, 'post_type_archive' );
		$taxonomy = $this->mock_available_target( Taxonomy_Archive_Target::class, 'taxonomy_archive' );

		$this->current_page_helper->expects( 'get_front_page_id' )->once()->andReturn( 0 );
		$this->post_type_archive_factory->expects( 'create_all' )->once()->andReturn( [ $archive ] );
		$this->taxonomy_archive_factory->expects( 'create_all' )->once()->andReturn( [ $taxonomy ] );

		$targets = $this->instance->get_all();

		$this->assertSame( self::TARGET_NAMES, $this->get_target_names( $targets ) );
		$this->assertSame( $this->homepage, $targets[0] );
		$this->assertSame( $taxonomy, $targets[2] );
	}

	/**
	 * Tests that get_all leaves out the targets whose global settings cannot be changed, like a static homepage or
	 * the WooCommerce Shop page.
	 *
	 * @covers ::get_all
	 * @covers ::filter_available
	 *
	 * @return void
	 */
	public function test_get_all_without_unavailable_targets() {
		$this->stubTranslationFunctions();

		$shop_archive = Mockery::mock( Post_Type_Archive_Target::class );
		$shop_archive->expects( 'ensure_available' )
			->once()
			->andThrow( new Unavailable_Global_Setting_Target_Exception( 'yoast_seo_woocommerce_shop_page', 'Shop page.' ) );

		$this->current_page_helper->expects( 'get_front_page_id' )->once()->andReturn( 42 );
		$this->post_type_archive_factory->expects( 'create_all' )->once()->andReturn( [ $shop_archive ] );
		$this->taxonomy_archive_factory->expects( 'create_all' )->once()->andReturn( [] );

		$this->assertSame(
			[ 'author_archives', 'date_archives', 'search_page', 'not_found_page' ],
			$this->get_target_names( $this->instance->get_all() ),
		);
	}

	/**
	 * Tests that get returns a single target by its name, ignoring the post type and the taxonomy.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get_single_target() {
		$this->post_type_archive_factory->expects( 'create' )->never();

		$this->assertSame( $this->homepage, $this->instance->get( 'homepage', 'page', 'category' ) );
	}

	/**
	 * Tests that get creates the archives that exist once per content type or taxonomy with their own identifier.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get_per_type_targets() {
		$archive  = Mockery::mock( Post_Type_Archive_Target::class );
		$taxonomy = Mockery::mock( Taxonomy_Archive_Target::class );

		$this->post_type_archive_factory->expects( 'create' )->once()->with( 'portfolio' )->andReturn( $archive );
		$this->taxonomy_archive_factory->expects( 'create' )->once()->with( 'genre' )->andReturn( $taxonomy );

		$this->assertSame( $archive, $this->instance->get( 'post_type_archive', 'portfolio', 'genre' ) );
		$this->assertSame( $taxonomy, $this->instance->get( 'taxonomy_archive', 'portfolio', 'genre' ) );
	}

	/**
	 * Tests that get throws for an unknown target.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get_unknown_target() {
		$this->stubTranslationFunctions();

		$this->expectException( Unavailable_Global_Setting_Target_Exception::class );

		$this->instance->get( 'unknown', '', '' );
	}
}
