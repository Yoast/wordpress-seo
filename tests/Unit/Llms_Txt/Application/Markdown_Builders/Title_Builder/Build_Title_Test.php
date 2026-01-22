<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\Markdown_Builders\Title_Builder;

use Mockery;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Title;

/**
 * Tests build_title.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Title_Builder::build_title
 */
final class Build_Title_Test extends Abstract_Title_Builder_Test {

	/**
	 * Tests the build_title method.
	 *
	 * @return void
	 */
	public function test_build_title() {
		$built_title = Mockery::mock( Title::class );

		$this->title_adapter
			->expects( 'get_title' )
			->once()
			->andReturn( $built_title );

		$this->assertSame( $built_title, $this->instance->build_title() );
	}
}
