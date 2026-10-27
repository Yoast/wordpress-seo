<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_SEO_Field_Map;
use Yoast\WP\SEO\Helpers\Author_Archive_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Surfaces\Values\Meta_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Author_SEO_Field_Map class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Author_SEO_Field_Map
 */
final class Author_SEO_Field_Map_Test extends TestCase {

	/**
	 * The meta surface.
	 *
	 * @var Mockery\MockInterface|Meta_Surface
	 */
	private $meta_surface;

	/**
	 * The user helper.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	private $user_helper;

	/**
	 * The author archive helper.
	 *
	 * @var Mockery\MockInterface|Author_Archive_Helper
	 */
	private $author_archive_helper;

	/**
	 * The instance under test.
	 *
	 * @var Author_SEO_Field_Map
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->meta_surface          = Mockery::mock( Meta_Surface::class );
		$this->user_helper           = Mockery::mock( User_Helper::class );
		$this->author_archive_helper = Mockery::mock( Author_Archive_Helper::class );

		$this->user_helper->allows( 'get_the_author_meta' )->with( 'display_name', 7 )->andReturn( 'Jane' );

		$this->instance = new Author_SEO_Field_Map( $this->meta_surface, $this->user_helper, $this->author_archive_helper );
	}

	/**
	 * Tests that to_seo_array maps a user indexable to the full output shape,
	 * including the rendered front-end companions.
	 *
	 * @covers ::__construct
	 * @covers ::to_seo_array
	 * @covers ::build_seo_array
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Abstract_SEO_Field_Map::rendered
	 *
	 * @return void
	 */
	public function test_to_seo_array() {
		$indexable = $this->make_indexable();

		$this->meta_surface->expects( 'for_indexable' )->once()->with( $indexable, 'Author_Archive' )->andReturn(
			new Meta_Double(
				[
					'title'            => 'Rendered SEO title',
					'meta_description' => '',
				],
			),
		);

		$this->assertSame(
			[
				'user_id'                   => 7,
				'user_name'                 => 'Jane',
				'permalink'                 => 'https://example.com/author/jane/',
				'seo_title'                 => 'My SEO title',
				'seo_title_rendered'        => 'Rendered SEO title',
				'meta_description'          => null,
				// An empty presented value is normalised to null.
				'meta_description_rendered' => null,
				'noindex'                   => true,
			],
			$this->instance->to_seo_array( $indexable ),
		);
	}

	/**
	 * Tests that the user name is null when the user has no display name.
	 *
	 * @covers ::to_seo_array
	 * @covers ::build_seo_array
	 *
	 * @return void
	 */
	public function test_to_seo_array_without_user_name() {
		$indexable            = $this->make_indexable();
		$indexable->object_id = 8;

		$this->user_helper->expects( 'get_the_author_meta' )->once()->with( 'display_name', 8 )->andReturn( '' );
		$this->meta_surface->expects( 'for_indexable' )->once()->andReturnFalse();

		$result = $this->instance->to_seo_array( $indexable );

		$this->assertNull( $result['user_name'] );
		$this->assertNull( $result['seo_title_rendered'] );
	}

	/**
	 * Tests that to_unbuilt_seo_array returns the stored values without rendered companions or permalink,
	 * plus a warning naming why they have no effect.
	 *
	 * @covers ::to_unbuilt_seo_array
	 * @covers ::build_seo_array
	 *
	 * @dataProvider provide_unbuilt_warnings
	 *
	 * @param bool   $are_disabled Whether author archives are disabled.
	 * @param string $warning      The expected start of the warning.
	 *
	 * @return void
	 */
	public function test_to_unbuilt_seo_array( bool $are_disabled, string $warning ) {
		$this->meta_surface->expects( 'for_indexable' )->never();
		$this->author_archive_helper->expects( 'are_disabled' )->once()->andReturn( $are_disabled );

		$result = $this->instance->to_unbuilt_seo_array( $this->make_indexable() );

		$this->assertSame( 'My SEO title', $result['seo_title'] );
		$this->assertTrue( $result['noindex'] );
		$this->assertNull( $result['permalink'] );
		$this->assertNull( $result['seo_title_rendered'] );
		$this->assertNull( $result['meta_description_rendered'] );
		$this->assertStringStartsWith( $warning, $result['warning'] );
	}

	/**
	 * Data provider for test_to_unbuilt_seo_array.
	 *
	 * @return array<string, array<string, bool|string>> The cases.
	 */
	public static function provide_unbuilt_warnings(): array {
		return [
			'author archives disabled' => [
				'are_disabled' => true,
				'warning'      => 'Author archives are disabled',
			],
			'author archive excluded'  => [
				'are_disabled' => false,
				'warning'      => 'These settings are saved, but have no effect while this author archive is excluded',
			],
		];
	}

	/**
	 * Tests that the author field map writes the author fields and reports the touched columns.
	 *
	 * @covers ::get_string_fields
	 * @covers ::get_boolean_fields
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Abstract_SEO_Field_Map::apply_to_indexable
	 *
	 * @return void
	 */
	public function test_apply_to_indexable() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		Monkey\Functions\when( 'rest_sanitize_boolean' )->alias( 'boolval' );

		$changed = $this->instance->apply_to_indexable(
			[
				'seo_title'        => 'New title',
				'meta_description' => '',
				'noindex'          => false,
			],
			$indexable,
		);

		$this->assertSame( 'New title', $indexable->title );
		$this->assertNull( $indexable->description );
		$this->assertFalse( $indexable->is_robots_noindex );
		$this->assertSame( [ 'title', 'description', 'is_robots_noindex' ], $changed );
	}

	/**
	 * Tests that a boolean string like 'false', which passes the input validation when the ability is executed
	 * directly instead of over REST, is converted like WordPress does instead of being cast to true.
	 *
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Abstract_SEO_Field_Map::apply_to_indexable
	 *
	 * @return void
	 */
	public function test_apply_to_indexable_sanitizes_boolean_strings() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		Monkey\Functions\expect( 'rest_sanitize_boolean' )->once()->with( 'false' )->andReturnFalse();

		$this->instance->apply_to_indexable( [ 'noindex' => 'false' ], $indexable );

		$this->assertFalse( $indexable->is_robots_noindex );
	}

	/**
	 * Tests that fields authors have no storage for are not applied.
	 *
	 * @covers ::get_string_fields
	 * @covers ::get_boolean_fields
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Abstract_SEO_Field_Map::apply_to_indexable
	 *
	 * @return void
	 */
	public function test_apply_to_indexable_ignores_unsupported_fields() {
		$indexable = Mockery::mock( Indexable_Mock::class );

		$changed = $this->instance->apply_to_indexable(
			[
				'canonical'        => 'https://example.com/',
				'is_cornerstone'   => true,
				'open_graph_title' => 'OG title',
				'twitter_title'    => 'X title',
				'nofollow'         => true,
			],
			$indexable,
		);

		$this->assertSame( [], $changed );
	}

	/**
	 * Builds a user indexable mock populated with representative SEO data.
	 *
	 * @return Mockery\MockInterface|Indexable_Mock The indexable mock.
	 */
	private function make_indexable() {
		$indexable                    = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id         = 7;
		$indexable->object_type       = 'user';
		$indexable->permalink         = 'https://example.com/author/jane/';
		$indexable->title             = 'My SEO title';
		$indexable->description       = null;
		$indexable->is_robots_noindex = true;

		return $indexable;
	}
}
