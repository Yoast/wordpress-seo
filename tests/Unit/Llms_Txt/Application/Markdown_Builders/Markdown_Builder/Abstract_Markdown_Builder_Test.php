<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\Markdown_Builders\Markdown_Builder;

use Mockery;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Description_Builder;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Intro_Builder;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Link_Lists_Builder;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Markdown_Builder;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Optional_Link_List_Builder;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Title_Builder;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Escaper;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Llms_Txt_Renderer;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Markdown Builder tests.
 *
 * @group llms.txt
 */
abstract class Abstract_Markdown_Builder_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Markdown_Builder
	 */
	protected $instance;

	/**
	 * Holds the markdown escaper mock.
	 *
	 * @var Mockery\MockInterface|Markdown_Escaper
	 */
	protected $markdown_escaper;

	/**
	 * Holds the llms txt renderer mock.
	 *
	 * @var Mockery\MockInterface|Llms_Txt_Renderer
	 */
	protected $llms_txt_renderer;

	/**
	 * Holds the intro builder mock.
	 *
	 * @var Mockery\MockInterface|Intro_Builder
	 */
	protected $intro_builder;

	/**
	 * Holds the title builder mock.
	 *
	 * @var Mockery\MockInterface|Title_Builder
	 */
	protected $title_builder;

	/**
	 * Holds the description builder mock.
	 *
	 * @var Mockery\MockInterface|Description_Builder
	 */
	protected $description_builder;

	/**
	 * Holds the link lists builder mock.
	 *
	 * @var Mockery\MockInterface|Link_Lists_Builder
	 */
	protected $link_lists_builder;

	/**
	 * Holds the optional link list builder mock.
	 *
	 * @var Mockery\MockInterface|Optional_Link_List_Builder
	 */
	protected $optional_link_list_builder;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->llms_txt_renderer          = Mockery::mock( Llms_Txt_Renderer::class );
		$this->intro_builder              = Mockery::mock( Intro_Builder::class );
		$this->title_builder              = Mockery::mock( Title_Builder::class );
		$this->description_builder        = Mockery::mock( Description_Builder::class );
		$this->link_lists_builder         = Mockery::mock( Link_Lists_Builder::class );
		$this->markdown_escaper           = Mockery::mock( Markdown_Escaper::class );
		$this->optional_link_list_builder = Mockery::mock( Optional_Link_List_Builder::class );

		$this->instance = new Markdown_Builder(
			$this->llms_txt_renderer,
			$this->intro_builder,
			$this->title_builder,
			$this->description_builder,
			$this->link_lists_builder,
			$this->markdown_escaper,
			$this->optional_link_list_builder
		);
	}
}
