<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\Markdown_Builders\Description_Builder;

use Mockery;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Description;

/**
 * Tests build_description.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Description_Builder::build_description
 */
final class Build_Description_Test extends Abstract_Description_Builder_Test {

	/**
	 * Tests the build_description method.
	 *
	 * @return void
	 */
	public function test_build_description() {
		$built_description = Mockery::mock( Description::class );

		$this->description_adapter
			->expects( 'get_description' )
			->once()
			->andReturn( $built_description );

		$this->assertSame( $built_description, $this->instance->build_description() );
	}
}
