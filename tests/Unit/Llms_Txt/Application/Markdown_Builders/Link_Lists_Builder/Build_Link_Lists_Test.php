<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\Markdown_Builders\Link_Lists_Builder;

/**
 * Tests Build_Link_Lists_Test.
 *
 * @group llms.txt
 *
 * @covers  Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Link_Lists_Builder::Build_Link_Lists_Test
 */
final class Build_Link_Lists_Test extends Abstract_Link_Lists_Builder_Test {

	/**
	 * Tests the build_link_lists method.
	 *
	 * @return void
	 */
	public function test_build_link_lists() {
		$content_types = [
			'posts',
			'pages',
		];

		$terms = [
			'categories',
			'tags',
		];

		$this->content_types_collector
			->expects( 'get_content_types_lists' )
			->once()
			->andReturn( $content_types );

		$this->terms_collector
			->expects( 'get_terms_lists' )
			->once()
			->andReturn( $terms );

		$this->assertSame( \array_merge( $content_types, $terms ), $this->instance->build_link_lists() );
	}
}
