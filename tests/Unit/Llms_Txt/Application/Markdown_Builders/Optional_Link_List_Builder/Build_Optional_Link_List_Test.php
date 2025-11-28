<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\Markdown_Builders\Optional_Link_List_Builder;

use Mockery;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Items\Link;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Link_List;

/**
 * Tests build_optional_link_list.
 *
 * @group llms.txt
 *
 * @covers  Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Optional_Link_List_Builder::build_optional_link_list
 */
final class Build_Optional_Link_List_Test extends Abstract_Optional_Link_List_Builder_Test {

	/**
	 * Tests the build_optional_link_list method.
	 *
	 * @return void
	 */
	public function test_build_optional_link_list_with_sitemap() {
		$built_link = Mockery::mock( Link::class );
		$links      = [ $built_link ];

		$this->sitemap_link_collector
			->expects( 'get_link' )
			->once()
			->andReturn( $built_link );

		$built_link
			->expects( 'render' )
			->once()
			->andReturn( 'rendered link' );

		$optional_link_list = $this->instance->build_optional_link_list();
		$this->assertTrue( \is_a( $optional_link_list, Link_List::class ) );
		$this->assertTrue( $optional_link_list->render() !== '' );
	}

	/**
	 * Tests the build_optional_link_list method producing no sitemap.
	 *
	 * @return void
	 */
	public function test_build_optional_link_list_with_no_sitemap() {
		$built_link = null;
		$links      = [];

		$this->sitemap_link_collector
			->expects( 'get_link' )
			->once()
			->andReturn( $built_link );

		$optional_link_list = $this->instance->build_optional_link_list();
		$this->assertTrue( \is_a( $optional_link_list, Link_List::class ) );
		$this->assertTrue( $optional_link_list->render() === '' );
	}
}
