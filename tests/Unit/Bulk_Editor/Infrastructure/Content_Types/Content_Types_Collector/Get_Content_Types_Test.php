<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Content_Types\Content_Types_Collector;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\Bulk_Editor\Domain\Content_Types\Content_Types_List;

/**
 * Tests get_content_types.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Content_Types\Content_Types_Collector::get_content_types
 */
final class Get_Content_Types_Test extends Abstract_Content_Types_Collector_Test {

	/**
	 * Tests the get_content_types method.
	 *
	 * @param array<string>                $accessible_post_types The accessible post types.
	 * @param array<object|null>           $post_type_objects     The post type objects, keyed by post type.
	 * @param array<bool>                  $user_can_edit         Whether the user can edit, keyed by post type.
	 * @param array<array<string, string>> $expected              The expected content types array.
	 *
	 * @dataProvider data_get_content_types
	 *
	 * @return void
	 */
	public function test_get_content_types(
		array $accessible_post_types,
		array $post_type_objects,
		array $user_can_edit,
		array $expected
	) {
		$this->post_type_helper
			->expects( 'get_accessible_post_types' )
			->once()
			->andReturn( $accessible_post_types );

		Functions\expect( 'get_post_type_object' )
			->times( \count( $accessible_post_types ) )
			->andReturnUsing(
				static function ( $post_type ) use ( $post_type_objects ) {
					return $post_type_objects[ $post_type ];
				},
			);

		Functions\expect( 'current_user_can' )
			->times( \count( $user_can_edit ) )
			->andReturnUsing(
				static function ( $capability ) use ( $user_can_edit ) {
					return $user_can_edit[ $capability ];
				},
			);

		$content_types_list = $this->instance->get_content_types();

		$this->assertInstanceOf( Content_Types_List::class, $content_types_list );
		$this->assertSame( $expected, $content_types_list->to_array() );
	}

	/**
	 * Data provider for test_get_content_types.
	 *
	 * @return array<string, array<string, array<string|object|bool|array<string, string>>>>
	 */
	public static function data_get_content_types() {
		$post_object = (object) [
			'name'  => 'post',
			'label' => 'Posts',
			'cap'   => (object) [ 'edit_posts' => 'edit_posts' ],
		];
		$page_object = (object) [
			'name'  => 'page',
			'label' => 'Pages',
			'cap'   => (object) [ 'edit_posts' => 'edit_pages' ],
		];

		return [
			'editable post types' => [
				'accessible_post_types' => [ 'post', 'page' ],
				'post_type_objects'     => [
					'post' => $post_object,
					'page' => $page_object,
				],
				'user_can_edit'         => [
					'edit_posts' => true,
					'edit_pages' => true,
				],
				'expected'              => [
					[
						'name'  => 'post',
						'label' => 'Posts',
					],
					[
						'name'  => 'page',
						'label' => 'Pages',
					],
				],
			],
			'post type the user cannot edit is skipped' => [
				'accessible_post_types' => [ 'post', 'page' ],
				'post_type_objects'     => [
					'post' => $post_object,
					'page' => $page_object,
				],
				'user_can_edit'         => [
					'edit_posts' => true,
					'edit_pages' => false,
				],
				'expected'              => [
					[
						'name'  => 'post',
						'label' => 'Posts',
					],
				],
			],
			'unknown post type is skipped' => [
				'accessible_post_types' => [ 'post', 'unknown' ],
				'post_type_objects'     => [
					'post'    => $post_object,
					'unknown' => null,
				],
				'user_can_edit'         => [ 'edit_posts' => true ],
				'expected'              => [
					[
						'name'  => 'post',
						'label' => 'Posts',
					],
				],
			],
			'no accessible post types' => [
				'accessible_post_types' => [],
				'post_type_objects'     => [],
				'user_can_edit'         => [],
				'expected'              => [],
			],
		];
	}
}
