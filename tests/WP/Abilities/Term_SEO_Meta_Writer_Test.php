<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Abilities;

use WPSEO_Taxonomy_Meta;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Abilities\Infrastructure\Term_SEO_Meta_Writer;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration tests for the Term_SEO_Meta_Writer class against the real taxonomy meta storage.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Term_SEO_Meta_Writer
 */
final class Term_SEO_Meta_Writer_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Term_SEO_Meta_Writer
	 */
	private $instance;

	/**
	 * The ID of the term under test.
	 *
	 * @var int
	 */
	private $term_id;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new Term_SEO_Meta_Writer();
		$this->term_id  = self::factory()->category->create( [ 'name' => 'News' ] );

		WPSEO_Taxonomy_Meta::set_values(
			$this->term_id,
			'category',
			[
				'wpseo_title'          => 'Stored title',
				'wpseo_desc'           => 'Stored description',
				'wpseo_canonical'      => 'https://example.com/stored-canonical/',
				'wpseo_focuskw'        => 'news',
				'wpseo_linkdex'        => '78',
				'wpseo_content_score'  => '45',
				'wpseo_noindex'        => 'noindex',
				'wpseo_twitter-title'  => 'Stored X title',
				'wpseo_is_cornerstone' => '1',
			],
		);
	}

	/**
	 * Tests that a patch of one field leaves every other stored field intact, as the
	 * taxonomy meta validation otherwise resets the keys it is not given.
	 *
	 * @covers ::write_columns
	 * @covers ::get_stored_meta
	 * @covers ::save_meta
	 *
	 * @return void
	 */
	public function test_write_columns_patches_one_field_and_keeps_the_rest() {
		$indexable        = $this->make_indexable();
		$indexable->title = 'New title';

		$this->assertTrue( $this->instance->write_columns( $indexable, [ 'title' ] ) );

		$meta = WPSEO_Taxonomy_Meta::get_term_meta( $this->term_id, 'category' );

		$this->assertSame( 'New title', $meta['wpseo_title'] );
		$this->assertSame( 'Stored description', $meta['wpseo_desc'] );
		$this->assertSame( 'https://example.com/stored-canonical/', $meta['wpseo_canonical'] );
		$this->assertSame( 'news', $meta['wpseo_focuskw'] );
		$this->assertSame( '78', $meta['wpseo_linkdex'] );
		$this->assertSame( '45', $meta['wpseo_content_score'] );
		$this->assertSame( 'noindex', $meta['wpseo_noindex'] );
		$this->assertSame( 'Stored X title', $meta['wpseo_twitter-title'] );
		$this->assertSame( '1', $meta['wpseo_is_cornerstone'] );
	}

	/**
	 * Tests that clearing fields and resetting the flags store the defaults.
	 *
	 * @covers ::write_columns
	 * @covers ::to_meta_value
	 *
	 * @return void
	 */
	public function test_write_columns_clears_and_resets() {
		$indexable                    = $this->make_indexable();
		$indexable->canonical         = null;
		$indexable->twitter_title     = null;
		$indexable->is_robots_noindex = null;
		$indexable->is_cornerstone    = false;

		$this->assertTrue(
			$this->instance->write_columns( $indexable, [ 'canonical', 'twitter_title', 'is_robots_noindex', 'is_cornerstone' ] ),
		);

		$meta = WPSEO_Taxonomy_Meta::get_term_meta( $this->term_id, 'category' );

		$this->assertSame( '', $meta['wpseo_canonical'] );
		$this->assertSame( '', $meta['wpseo_twitter-title'] );
		$this->assertSame( 'default', $meta['wpseo_noindex'] );
		$this->assertSame( '0', $meta['wpseo_is_cornerstone'] );
		$this->assertSame( 'Stored title', $meta['wpseo_title'] );
	}

	/**
	 * Tests that nothing is written for a term that does not exist.
	 *
	 * @covers ::write_columns
	 * @covers ::get_stored_meta
	 *
	 * @return void
	 */
	public function test_write_columns_unknown_term() {
		$indexable            = $this->make_indexable();
		$indexable->object_id = 999_999;
		$indexable->title     = 'New title';

		$this->assertFalse( $this->instance->write_columns( $indexable, [ 'title' ] ) );
	}

	/**
	 * Builds an unsaved term indexable for the term under test.
	 *
	 * @return Indexable The indexable.
	 */
	private function make_indexable(): Indexable {
		$indexable                  = new Indexable();
		$indexable->orm             = ORM::for_table( 'wp_yoast_indexable' );
		$indexable->object_id       = $this->term_id;
		$indexable->object_type     = 'term';
		$indexable->object_sub_type = 'category';

		return $indexable;
	}
}
