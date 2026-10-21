<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure;

use Mockery;
use Yoast\WP\SEO\Abilities\Infrastructure\Term_SEO_Meta_Writer;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Term_SEO_Meta_Writer class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Term_SEO_Meta_Writer
 */
final class Term_SEO_Meta_Writer_Test extends TestCase {

	/**
	 * The instance under test, with the WPSEO_Taxonomy_Meta wrappers mocked.
	 *
	 * @var Mockery\MockInterface|Term_SEO_Meta_Writer
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = Mockery::mock( Term_SEO_Meta_Writer::class )
			->makePartial()
			->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Tests that the touched columns are encoded and merged onto the full stored meta,
	 * leaving every other stored key as it was.
	 *
	 * @covers ::write_columns
	 * @covers ::to_meta_value
	 *
	 * @return void
	 */
	public function test_write_columns_merges_onto_stored_meta() {
		$indexable = $this->make_indexable();

		$indexable->title                  = 'New title';
		$indexable->description            = null;
		$indexable->canonical              = 'https://example.com/canonical/';
		$indexable->open_graph_title       = 'OG title';
		$indexable->open_graph_description = 'OG description';
		$indexable->twitter_title          = 'X title';
		$indexable->twitter_description    = 'X description';
		$indexable->is_cornerstone         = true;

		$stored = [
			'wpseo_title'   => 'Old title',
			'wpseo_desc'    => 'Old description',
			'wpseo_focuskw' => 'news',
			'wpseo_linkdex' => '78',
			'wpseo_noindex' => 'noindex',
		];

		$this->instance->expects( 'get_stored_meta' )->once()->with( 7, 'category' )->andReturn( $stored );
		$this->instance->expects( 'save_meta' )->once()->with(
			7,
			'category',
			[
				'wpseo_title'                 => 'New title',
				'wpseo_desc'                  => '',
				'wpseo_focuskw'               => 'news',
				'wpseo_linkdex'               => '78',
				'wpseo_noindex'               => 'noindex',
				'wpseo_canonical'             => 'https://example.com/canonical/',
				'wpseo_opengraph-title'       => 'OG title',
				'wpseo_opengraph-description' => 'OG description',
				'wpseo_twitter-title'         => 'X title',
				'wpseo_twitter-description'   => 'X description',
				'wpseo_is_cornerstone'        => '1',
			],
		);

		$this->assertTrue(
			$this->instance->write_columns(
				$indexable,
				[
					'title',
					'description',
					'canonical',
					'open_graph_title',
					'open_graph_description',
					'twitter_title',
					'twitter_description',
					'is_cornerstone',
				],
			),
		);
	}

	/**
	 * Tests the encodings of the flag columns.
	 *
	 * @covers ::write_columns
	 * @covers ::to_meta_value
	 *
	 * @dataProvider provide_flag_encodings
	 *
	 * @param string    $column        The indexable column.
	 * @param bool|null $value         The column value.
	 * @param string    $term_meta_key The expected term meta key.
	 * @param string    $expected      The expected term meta value.
	 *
	 * @return void
	 */
	public function test_write_columns_flag_encodings( string $column, $value, string $term_meta_key, string $expected ) {
		$indexable            = $this->make_indexable();
		$indexable->{$column} = $value;

		$this->instance->expects( 'get_stored_meta' )->once()->andReturn( [] );
		$this->instance->expects( 'save_meta' )->once()->with( 7, 'category', [ $term_meta_key => $expected ] );

		$this->assertTrue( $this->instance->write_columns( $indexable, [ $column ] ) );
	}

	/**
	 * Data provider for test_write_columns_flag_encodings.
	 *
	 * @return array<string, array<string, string|bool|null>> The cases.
	 */
	public static function provide_flag_encodings(): array {
		return [
			'noindex set'          => [
				'column'        => 'is_robots_noindex',
				'value'         => true,
				'term_meta_key' => 'wpseo_noindex',
				'expected'      => 'noindex',
			],
			'noindex forced index' => [
				'column'        => 'is_robots_noindex',
				'value'         => false,
				'term_meta_key' => 'wpseo_noindex',
				'expected'      => 'index',
			],
			'noindex default'      => [
				'column'        => 'is_robots_noindex',
				'value'         => null,
				'term_meta_key' => 'wpseo_noindex',
				'expected'      => 'default',
			],
			'not cornerstone'      => [
				'column'        => 'is_cornerstone',
				'value'         => false,
				'term_meta_key' => 'wpseo_is_cornerstone',
				'expected'      => '0',
			],
		];
	}

	/**
	 * Tests that a column without a term meta key is not written.
	 *
	 * @covers ::write_columns
	 *
	 * @return void
	 */
	public function test_write_columns_skips_unmapped_columns() {
		$indexable                     = $this->make_indexable();
		$indexable->is_robots_nofollow = true;

		$this->instance->expects( 'get_stored_meta' )->once()->andReturn( [ 'wpseo_title' => 'Title' ] );
		$this->instance->expects( 'save_meta' )->once()->with( 7, 'category', [ 'wpseo_title' => 'Title' ] );

		$this->assertTrue( $this->instance->write_columns( $indexable, [ 'is_robots_nofollow' ] ) );
	}

	/**
	 * Tests that nothing is saved when the stored meta of the term cannot be read.
	 *
	 * @covers ::write_columns
	 *
	 * @return void
	 */
	public function test_write_columns_unknown_term() {
		$this->instance->expects( 'get_stored_meta' )->once()->with( 7, 'category' )->andReturnFalse();
		$this->instance->expects( 'save_meta' )->never();

		$this->assertFalse( $this->instance->write_columns( $this->make_indexable(), [ 'title' ] ) );
	}

	/**
	 * Builds a term indexable mock.
	 *
	 * @return Mockery\MockInterface|Indexable_Mock The indexable mock.
	 */
	private function make_indexable() {
		$indexable                  = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id       = 7;
		$indexable->object_sub_type = 'category';

		return $indexable;
	}

	/**
	 * Tests that a canonical is valid only when the term meta sanitization keeps it.
	 *
	 * @covers ::is_valid_canonical
	 *
	 * @dataProvider provide_canonical_sanitizations
	 *
	 * @param string $sanitized The sanitized canonical.
	 * @param bool   $expected  Whether the canonical is valid.
	 *
	 * @return void
	 */
	public function test_is_valid_canonical( string $sanitized, bool $expected ) {
		$this->instance->expects( 'sanitize_url' )->once()->with( 'a canonical' )->andReturn( $sanitized );

		$this->assertSame( $expected, $this->instance->is_valid_canonical( 'a canonical' ) );
	}

	/**
	 * Data provider for the canonical sanitization outcomes.
	 *
	 * @return array<string, array<string|bool>> The sanitized canonical and whether it is valid.
	 */
	public static function provide_canonical_sanitizations(): array {
		return [
			'kept'    => [ 'https://example.com/page/', true ],
			'dropped' => [ '', false ],
		];
	}
}
