<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Posts;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\Tests\Unit\Doubles\Bulk_Editor\Post_Title_Trait_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the post title trait.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Post_Title_Trait::get_normalized_title
 */
final class Post_Title_Trait_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Post_Title_Trait_Double
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Post_Title_Trait_Double();
	}

	/**
	 * Tests that a plain title is returned unchanged.
	 *
	 * @return void
	 */
	public function test_get_normalized_title_returns_a_plain_title() {
		Functions\expect( 'get_the_title' )->once()->with( 7 )->andReturn( 'Hello world' );

		$this->assertSame( 'Hello world', $this->instance->get_normalized_title( 7 ) );
	}

	/**
	 * Tests that HTML entities in the title are decoded so they render as text.
	 *
	 * @return void
	 */
	public function test_get_normalized_title_decodes_html_entities() {
		Functions\expect( 'get_the_title' )->once()->with( 7 )->andReturn( 'Tips &amp; Tricks: &#8220;SEO&#8221;' );

		$this->assertSame( 'Tips & Tricks: “SEO”', $this->instance->get_normalized_title( 7 ) );
	}

	/**
	 * Tests that an empty title falls back to the untitled-post convention.
	 *
	 * @return void
	 */
	public function test_get_normalized_title_falls_back_when_empty() {
		Functions\expect( 'get_the_title' )->once()->with( 7 )->andReturn( '' );
		Functions\expect( '__' )->once()->with( '(no title)', 'wordpress-seo' )->andReturn( '(no title)' );

		$this->assertSame( '(no title)', $this->instance->get_normalized_title( 7 ) );
	}
}
