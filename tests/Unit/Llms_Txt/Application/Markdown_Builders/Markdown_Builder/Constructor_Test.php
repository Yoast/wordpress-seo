<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\Markdown_Builders\Markdown_Builder;

use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Description_Builder;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Intro_Builder;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Link_Lists_Builder;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Title_Builder;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Escaper;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Llms_Txt_Renderer;

/**
 * Tests the Markdown_Builder constructor.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Markdown_Builder::__construct
 */
final class Constructor_Test extends Abstract_Markdown_Builder_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Llms_Txt_Renderer::class,
			$this->getPropertyValue( $this->instance, 'llms_txt_renderer' )
		);
		$this->assertInstanceOf(
			Intro_Builder::class,
			$this->getPropertyValue( $this->instance, 'intro_builder' )
		);
		$this->assertInstanceOf(
			Title_Builder::class,
			$this->getPropertyValue( $this->instance, 'title_builder' )
		);
		$this->assertInstanceOf(
			Description_Builder::class,
			$this->getPropertyValue( $this->instance, 'description_builder' )
		);
		$this->assertInstanceOf(
			Link_Lists_Builder::class,
			$this->getPropertyValue( $this->instance, 'link_lists_builder' )
		);
		$this->assertInstanceOf(
			Markdown_Escaper::class,
			$this->getPropertyValue( $this->instance, 'markdown_escaper' )
		);
	}
}
