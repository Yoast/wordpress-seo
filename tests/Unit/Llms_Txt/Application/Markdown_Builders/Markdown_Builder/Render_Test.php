<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\Markdown_Builders\Markdown_Builder;

use Mockery;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Description;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Intro;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Link_List;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Title;

/**
 * Tests the Markdown_Builder constructor.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Markdown_Builder::render
 */
final class Render_Test extends Abstract_Markdown_Builder_Test {

	/**
	 * Tests the render method.
	 *
	 * @return void
	 */
	public function test_render() {
		// Mocks for sections.
		$built_intro       = Mockery::mock( Intro::class );
		$built_title       = Mockery::mock( Title::class );
		$built_description = Mockery::mock( Description::class );
		$built_link_list1  = Mockery::mock( Link_List::class );
		$built_link_list2  = Mockery::mock( Link_List::class );

		$this->intro_builder->expects( 'build_intro' )
			->once()
			->andReturn( $built_intro );

		$this->title_builder->expects( 'build_title' )
			->once()
			->andReturn( $built_title );

		$this->description_builder->expects( 'build_description' )
			->once()
			->andReturn( $built_description );

		$this->link_lists_builder->expects( 'build_link_lists' )
			->once()
			->andReturn( [ $built_link_list1, $built_link_list2 ] );

		$this->llms_txt_renderer->shouldReceive( 'add_section' )->once()->with( $built_intro );
		$this->llms_txt_renderer->shouldReceive( 'add_section' )->once()->with( $built_title );
		$this->llms_txt_renderer->shouldReceive( 'add_section' )->once()->with( $built_description );
		$this->llms_txt_renderer->shouldReceive( 'add_section' )->once()->with( $built_link_list1 );
		$this->llms_txt_renderer->shouldReceive( 'add_section' )->once()->with( $built_link_list2 );

		$this->llms_txt_renderer->shouldReceive( 'get_sections' )->once()->andReturn(
			[
				$built_intro,
				$built_title,
				$built_description,
				$built_link_list1,
				$built_link_list2,
			]
		);

		$built_intro->shouldReceive( 'escape_markdown' )->once()->with( $this->markdown_escaper );
		$built_title->shouldReceive( 'escape_markdown' )->once()->with( $this->markdown_escaper );
		$built_description->shouldReceive( 'escape_markdown' )->once()->with( $this->markdown_escaper );
		$built_link_list1->shouldReceive( 'escape_markdown' )->once()->with( $this->markdown_escaper );
		$built_link_list2->shouldReceive( 'escape_markdown' )->once()->with( $this->markdown_escaper );

		$this->llms_txt_renderer->shouldReceive( 'render' )->once()->andReturn( 'final markdown output' );

		$this->assertSame( 'final markdown output', $this->instance->render() );
	}
}
