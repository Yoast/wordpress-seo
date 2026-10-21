<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Global_Setting_Targets;

use Mockery;
use Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Global_Setting_Target_Exception;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Author_Archives_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Date_Archives_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Global_Setting_Target_Repository;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Homepage_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Not_Found_Page_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Post_Type_Archive_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Post_Type_Archive_Target_Factory;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Search_Page_Target;
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
	 * The homepage target.
	 *
	 * @var Homepage_Target
	 */
	private $homepage;

	/**
	 * The factory of the content type archive targets mock.
	 *
	 * @var Mockery\MockInterface|Post_Type_Archive_Target_Factory
	 */
	private $post_type_archive_factory;

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

		$options_helper = Mockery::mock( Options_Helper::class );

		$this->homepage                  = new Homepage_Target();
		$this->post_type_archive_factory = Mockery::mock( Post_Type_Archive_Target_Factory::class );

		$this->instance = new Global_Setting_Target_Repository(
			$this->homepage,
			new Author_Archives_Target( $options_helper ),
			new Date_Archives_Target( $options_helper ),
			new Search_Page_Target(),
			new Not_Found_Page_Target(),
			$this->post_type_archive_factory,
		);
	}

	/**
	 * Tests that get_names returns the names of the single targets, followed by the content type archive.
	 *
	 * @covers ::__construct
	 * @covers ::get_names
	 *
	 * @return void
	 */
	public function test_get_names() {
		$this->assertSame(
			[ 'homepage', 'author_archives', 'date_archives', 'search_page', 'not_found_page', 'post_type_archive' ],
			$this->instance->get_names(),
		);
	}

	/**
	 * Tests that get_all returns the single targets, followed by the content type archives with global settings.
	 *
	 * @covers ::get_all
	 *
	 * @return void
	 */
	public function test_get_all() {
		$archive = Mockery::mock( Post_Type_Archive_Target::class );

		$this->post_type_archive_factory->expects( 'create_all' )->once()->andReturn( [ $archive ] );

		$targets = $this->instance->get_all();

		$this->assertCount( 6, $targets );
		$this->assertSame( $this->homepage, $targets[0] );
		$this->assertSame( $archive, $targets[5] );
	}

	/**
	 * Tests that get returns a single target by its name, ignoring the post type.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get_single_target() {
		$this->post_type_archive_factory->expects( 'create' )->never();

		$this->assertSame( $this->homepage, $this->instance->get( 'homepage', 'page' ) );
	}

	/**
	 * Tests that get creates the target of a content type archive for the post type.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get_post_type_archive() {
		$archive = Mockery::mock( Post_Type_Archive_Target::class );

		$this->post_type_archive_factory->expects( 'create' )->once()->with( 'portfolio' )->andReturn( $archive );

		$this->assertSame( $archive, $this->instance->get( 'post_type_archive', 'portfolio' ) );
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

		$this->instance->get( 'unknown', '' );
	}
}
