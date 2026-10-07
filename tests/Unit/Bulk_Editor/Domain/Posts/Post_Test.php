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
			true,
			[
				'seo_title'          => false,
				'meta_description'   => true,
				'social_title'       => false,
				'social_description' => true,
			],
			'',
			'',
			'',
			'',
		);

		$this->assertSame(
			[
				'id'                          => 7,
				'title'                       => 'Hello world',
				'status'                      => 'draft',
				'edit_link'                   => 'post.php?post=7&action=edit',
				'focus_keyphrase'             => 'hello',
				'seo_title'                   => 'Hello | Site',
				'meta_description'            => 'A description.',
				'social_title'                => 'Social hello',
				'social_description'          => 'Social description.',
				'seo_title_fallback'          => '',
				'meta_description_fallback'   => '',
				'social_title_fallback'       => '',
				'social_description_fallback' => '',
				'editable'                    => true,
				'needs_improvement'           => [
					'seo_title'          => false,
					'meta_description'   => true,
					'social_title'       => false,
					'social_description' => true,
				],
			],
			$instance->to_array(),
		);
	}

	/**
	 * Tests that a locked post reports itself as not editable.
	 *
	 * @return void
	 */
	public function test_to_array_not_editable() {
		$instance = new Post( 7, 'Hello world', 'draft', '', '', '', '', '', '', false );

		$this->assertSame(
			[
				'id'                          => 7,
				'title'                       => 'Hello world',
				'status'                      => 'draft',
				'edit_link'                   => '',
				'focus_keyphrase'             => '',
				'seo_title'                   => '',
				'meta_description'            => '',
				'social_title'                => '',
				'social_description'          => '',
				'seo_title_fallback'          => '',
				'meta_description_fallback'   => '',
				'social_title_fallback'       => '',
				'social_description_fallback' => '',
				'editable'                    => false,
				'needs_improvement'           => [
					'seo_title'          => false,
					'meta_description'   => false,
					'social_title'       => false,
					'social_description' => false,
				],
			],
			$instance->to_array(),
		);
	}
}
