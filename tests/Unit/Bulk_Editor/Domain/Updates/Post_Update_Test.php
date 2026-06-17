<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Domain\Updates;

use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Post_Update;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Test class for the Post_Update value object.
 *
 * @group Bulk_Editor
 *
 * @coversDefaultClass \Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Post_Update
 */
final class Post_Update_Test extends TestCase {

	/**
	 * Tests the getters return the constructor values.
	 *
	 * @covers ::__construct
	 * @covers ::get_post_id
	 * @covers ::get_title
	 * @covers ::get_description
	 * @covers ::get_focus_keyphrase
	 *
	 * @return void
	 */
	public function test_getters() {
		$instance = new Post_Update( 123, 'The title', 'The description', 'The keyphrase' );

		$this->assertSame( 123, $instance->get_post_id() );
		$this->assertSame( 'The title', $instance->get_title() );
		$this->assertSame( 'The description', $instance->get_description() );
		$this->assertSame( 'The keyphrase', $instance->get_focus_keyphrase() );
	}

	/**
	 * Tests has_title distinguishes null from an empty string.
	 *
	 * @covers ::has_title
	 *
	 * @return void
	 */
	public function test_has_title() {
		$this->assertTrue( ( new Post_Update( 1, 'The title', null, null ) )->has_title() );
		$this->assertTrue( ( new Post_Update( 1, '', null, null ) )->has_title() );
		$this->assertFalse( ( new Post_Update( 1, null, 'The description', null ) )->has_title() );
	}

	/**
	 * Tests has_description distinguishes null from an empty string.
	 *
	 * @covers ::has_description
	 *
	 * @return void
	 */
	public function test_has_description() {
		$this->assertTrue( ( new Post_Update( 1, null, 'The description', null ) )->has_description() );
		$this->assertTrue( ( new Post_Update( 1, null, '', null ) )->has_description() );
		$this->assertFalse( ( new Post_Update( 1, 'The title', null, null ) )->has_description() );
	}

	/**
	 * Tests has_focus_keyphrase distinguishes null from an empty string.
	 *
	 * @covers ::has_focus_keyphrase
	 *
	 * @return void
	 */
	public function test_has_focus_keyphrase() {
		$this->assertTrue( ( new Post_Update( 1, null, null, 'The keyphrase' ) )->has_focus_keyphrase() );
		$this->assertTrue( ( new Post_Update( 1, null, null, '' ) )->has_focus_keyphrase() );
		$this->assertFalse( ( new Post_Update( 1, 'The title', null, null ) )->has_focus_keyphrase() );
	}
}
