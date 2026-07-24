<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Domain\Posts;

use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_Query;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Posts_Query value object.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_Query
 */
final class Posts_Query_Test extends TestCase {

	/**
	 * Tests the getters.
	 *
	 * @return void
	 */
	public function test_getters() {
		$instance = new Posts_Query( 'page', 2, 20, 'seo', [ 'publish', 'draft' ], null, [ 'seo_title' ] );

		$this->assertSame( 'page', $instance->get_content_type() );
		$this->assertSame( 2, $instance->get_page() );
		$this->assertSame( 20, $instance->get_per_page() );
		$this->assertSame( 'seo', $instance->get_search() );
		$this->assertSame( [ 'publish', 'draft' ], $instance->get_statuses() );
		$this->assertSame( [ 'seo_title' ], $instance->get_needs_improvement() );
	}

	/**
	 * Tests that the needs-improvement filter defaults to none.
	 *
	 * @return void
	 */
	public function test_needs_improvement_defaults_to_empty() {
		$this->assertSame( [], ( new Posts_Query( 'page', 1, 20, '', [] ) )->get_needs_improvement() );
	}

	/**
	 * Tests that scoring defaults to enabled and is carried through when set.
	 *
	 * @return void
	 */
	public function test_are_scores_enabled() {
		$this->assertTrue( ( new Posts_Query( 'page', 1, 20, '', [] ) )->are_scores_enabled() );
		$this->assertFalse( ( new Posts_Query( 'page', 1, 20, '', [], null, [ 'seo_title' ], false ) )->are_scores_enabled() );
	}

	/**
	 * Tests that has_search reflects whether a search term is set.
	 *
	 * @return void
	 */
	public function test_has_search() {
		$this->assertTrue( ( new Posts_Query( 'page', 1, 20, 'seo', [] ) )->has_search() );
		$this->assertFalse( ( new Posts_Query( 'page', 1, 20, '', [] ) )->has_search() );
	}

	/**
	 * Tests that the offset follows the requested page.
	 *
	 * @return void
	 */
	public function test_get_offset() {
		$this->assertSame( 0, ( new Posts_Query( 'page', 1, 20, '', [] ) )->get_offset() );
		$this->assertSame( 40, ( new Posts_Query( 'page', 3, 20, '', [] ) )->get_offset() );
	}

	/**
	 * Tests that the author defaults to null when none is passed.
	 *
	 * @return void
	 */
	public function test_get_author_id_defaults_to_null() {
		$this->assertNull( ( new Posts_Query( 'page', 1, 20, '', [] ) )->get_author_id() );
	}

	/**
	 * Tests that the author is carried through when set.
	 *
	 * @return void
	 */
	public function test_get_author_id() {
		$this->assertSame( 5, ( new Posts_Query( 'page', 1, 20, '', [], 5 ) )->get_author_id() );
	}

	/**
	 * Tests that has_author_filter reflects whether an author is set.
	 *
	 * @return void
	 */
	public function test_has_author_filter() {
		$this->assertTrue( ( new Posts_Query( 'page', 1, 20, '', [], 5 ) )->has_author_filter() );
		$this->assertFalse( ( new Posts_Query( 'page', 1, 20, '', [] ) )->has_author_filter() );
	}
}
