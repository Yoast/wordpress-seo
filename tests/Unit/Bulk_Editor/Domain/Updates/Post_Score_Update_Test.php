<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Domain\Updates;

use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Post_Score_Update;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Test class for the Post_Score_Update value object.
 *
 * @group Bulk_Editor
 *
 * @coversDefaultClass \Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Post_Score_Update
 */
final class Post_Score_Update_Test extends TestCase {

	/**
	 * Tests the getters return the constructor values.
	 *
	 * @covers ::__construct
	 * @covers ::get_post_id
	 * @covers ::get_seo_title_score
	 * @covers ::get_meta_description_score
	 *
	 * @return void
	 */
	public function test_getters() {
		$instance = new Post_Score_Update( 123, 63, 85 );

		$this->assertSame( 123, $instance->get_post_id() );
		$this->assertSame( 63, $instance->get_seo_title_score() );
		$this->assertSame( 85, $instance->get_meta_description_score() );
	}

	/**
	 * Tests has_seo_title_score distinguishes null from a zero score.
	 *
	 * @covers ::has_seo_title_score
	 *
	 * @return void
	 */
	public function test_has_seo_title_score() {
		$this->assertTrue( ( new Post_Score_Update( 1, 0, null ) )->has_seo_title_score() );
		$this->assertFalse( ( new Post_Score_Update( 1, null, 85 ) )->has_seo_title_score() );
	}

	/**
	 * Tests has_meta_description_score distinguishes null from a zero score.
	 *
	 * @covers ::has_meta_description_score
	 *
	 * @return void
	 */
	public function test_has_meta_description_score() {
		$this->assertTrue( ( new Post_Score_Update( 1, null, 0 ) )->has_meta_description_score() );
		$this->assertFalse( ( new Post_Score_Update( 1, 63, null ) )->has_meta_description_score() );
	}
}
