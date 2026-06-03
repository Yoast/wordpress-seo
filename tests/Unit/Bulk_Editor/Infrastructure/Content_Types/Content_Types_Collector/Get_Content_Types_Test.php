<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Content_Types\Content_Types_Collector;

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
	 * @param array<object>                $indexable_post_type_objects The indexable post type objects.
	 * @param array<array<string, string>> $expected                    The expected content types array.
	 *
	 * @dataProvider data_get_content_types
	 *
	 * @return void
	 */
	public function test_get_content_types( array $indexable_post_type_objects, array $expected ) {
		$this->post_type_helper
			->expects( 'get_indexable_post_type_objects' )
			->once()
			->andReturn( $indexable_post_type_objects );

		$content_types_list = $this->instance->get_content_types();

		$this->assertInstanceOf( Content_Types_List::class, $content_types_list );
		$this->assertSame( $expected, $content_types_list->to_array() );
	}

	/**
	 * Data provider for test_get_content_types.
	 *
	 * @return array<string, array<string, array<object|array<string, string>>>>
	 */
	public static function data_get_content_types() {
		return [
			'indexable post types' => [
				'indexable_post_type_objects' => [
					(object) [
						'name'  => 'post',
						'label' => 'Posts',
					],
					(object) [
						'name'  => 'page',
						'label' => 'Pages',
					],
				],
				'expected'                    => [
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
			'no indexable post types' => [
				'indexable_post_type_objects' => [],
				'expected'                    => [],
			],
		];
	}
}
