<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Posts\Post_Title_Trait;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Post_Title_Trait;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests get_normalized_title.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Post_Title_Trait::get_normalized_title
 */
final class Get_Normalized_Title_Test extends TestCase {

	use Post_Title_Trait;

	/**
	 * Tests that HTML entities in the title are decoded so they render as text.
	 *
	 * @return void
	 */
	public function test_decodes_html_entities() {
		Functions\expect( 'get_the_title' )->once()->with( 7 )->andReturn( 'Tips &amp; Tricks: &#8220;SEO&#8221;' );

		$this->assertSame( 'Tips & Tricks: “SEO”', $this->get_normalized_title( 7 ) );
	}

	/**
	 * Tests that an empty title falls back to the untitled-post convention.
	 *
	 * @return void
	 */
	public function test_falls_back_when_the_title_is_empty() {
		$this->stubTranslationFunctions();

		Functions\expect( 'get_the_title' )->once()->with( 7 )->andReturn( '' );

		$this->assertSame( '(no title)', $this->get_normalized_title( 7 ) );
	}
}
