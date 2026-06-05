<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Application\Content_Types\Content_Types_Repository;

use Yoast\WP\SEO\Bulk_Editor\Domain\Content_Types\Content_Type;
use Yoast\WP\SEO\Bulk_Editor\Domain\Content_Types\Content_Types_List;

/**
 * Tests get_content_types.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Application\Content_Types\Content_Types_Repository::get_content_types
 */
final class Get_Content_Types_Test extends Abstract_Content_Types_Repository_Test {

	/**
	 * Tests the get_content_types method.
	 *
	 * @return void
	 */
	public function test_get_content_types() {
		$content_types_list = new Content_Types_List();
		$content_types_list->add( new Content_Type( 'post', 'Posts' ) );

		$this->content_types_collector
			->expects( 'get_content_types' )
			->once()
			->andReturn( $content_types_list );

		$this->assertSame(
			[
				[
					'name'  => 'post',
					'label' => 'Posts',
				],
			],
			$this->instance->get_content_types(),
		);
	}
}
