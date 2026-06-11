<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Domain\Posts;

use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Post;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Post DTO.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Post
 */
final class Post_Test extends TestCase {

	/**
	 * Tests parsing the post to an array.
	 *
	 * @return void
	 */
	public function test_to_array() {
		$instance = new Post(
			7,
			'Hello world',
			'draft',
			'post.php?post=7&action=edit',
			'hello',
			'Hello | Site',
			'A description.',
			'Social hello',
			'Social description.',
		);

		$this->assertSame(
			[
				'id'                 => 7,
				'title'              => 'Hello world',
				'status'             => 'draft',
				'edit_link'          => 'post.php?post=7&action=edit',
				'focus_keyphrase'    => 'hello',
				'seo_title'          => 'Hello | Site',
				'meta_description'   => 'A description.',
				'social_title'       => 'Social hello',
				'social_description' => 'Social description.',
			],
			$instance->to_array(),
		);
	}
}
