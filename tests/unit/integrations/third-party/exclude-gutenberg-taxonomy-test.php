<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Third_Party;

use Yoast\WP\SEO\Integrations\Third_Party\Exclude_Gutenberg_Taxonomy;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Exclude_Gutenberg_Taxonomy_Test.
 *
 * @group integrations
 * @group third-party
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Third_Party\Exclude_Gutenberg_Taxonomy
 */
class Exclude_Gutenberg_Taxonomy_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Exclude_Gutenberg_Taxonomy
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new Exclude_Gutenberg_Taxonomy();
	}

	/**
	 * Tests that the correct taxonomies are excluded.
	 *
	 * @covers ::exclude_taxonomies
	 */
	public function test_exclude_gutenberg_taxonomy() {
		$excluded_taxonomies = [];

		$expected = [ 'wp_pattern_category' ];
		$actual   = $this->instance->exclude_taxonomies( $excluded_taxonomies );

		self::assertEquals( $expected, $actual );
	}
}
