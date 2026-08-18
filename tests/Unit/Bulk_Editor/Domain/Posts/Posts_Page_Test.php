<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Domain\Posts;

use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Post;
use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_List;
use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_Page;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Posts_Page value object.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_Page
 */
final class Posts_Page_Test extends TestCase {

	/**
	 * Tests parsing the page to an array, including the derived total pages.
	 *
	 * @return void
	 */
	public function test_to_array() {
		$posts_list = new Posts_List();
		$posts_list->add( new Post( 7, 'Hello world', 'draft', 'edit', 'hello', 'SEO', 'Meta', 'OG', 'OG desc', true ) );

		$instance = new Posts_Page( $posts_list, 45, 2, 20 );

		$this->assertSame(
			[
				'posts'       => [
					[
						'id'                 => 7,
						'title'              => 'Hello world',
						'status'             => 'draft',
						'edit_link'          => 'edit',
						'focus_keyphrase'    => 'hello',
						'seo_title'          => 'SEO',
						'meta_description'   => 'Meta',
						'social_title'       => 'OG',
						'social_description' => 'OG desc',
						'editable'           => true,
						'images'             => [],
					],
				],
				'total'       => 45,
				'total_pages' => 3,
				'page'        => 2,
				'per_page'    => 20,
			],
			$instance->to_array(),
		);
	}

	/**
	 * Tests that an empty page reports zero total pages.
	 *
	 * @return void
	 */
	public function test_get_total_pages_when_empty() {
		$instance = new Posts_Page( new Posts_List(), 0, 1, 20 );

		$this->assertSame( 0, $instance->get_total_pages() );
	}
}
