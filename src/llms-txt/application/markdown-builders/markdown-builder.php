<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders;

use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Escaper;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Llms_Txt_Renderer;

/**
 * The builder of the markdown file.
 */
class Markdown_Builder {

	/**
	 * The renderer of the LLMs.txt file.
	 *
	 * @var Llms_Txt_Renderer
	 */
	protected $llms_txt_renderer;

	/**
	 * The intro builder.
	 *
	 * @var Intro_Builder
	 */
	protected $intro_builder;

	/**
	 * The title builder.
	 *
	 * @var Title_Builder
	 */
	protected $title_builder;

	/**
	 * The description builder.
	 *
	 * @var Description_Builder
	 */
	protected $description_builder;

	/**
	 * The link lists builder.
	 *
	 * @var Link_Lists_Builder
	 */
	protected $link_lists_builder;

	/**
	 * The markdown escaper.
	 *
	 * @var Markdown_Escaper
	 */
	protected $markdown_escaper;

	/**
	 * The optional link list builder.
	 *
	 * @var Optional_Link_List_Builder
	 */
	protected $optional_link_list_builder;

	/**
	 * The constructor.
	 *
	 * @param Llms_Txt_Renderer          $llms_txt_renderer          The renderer of the LLMs.txt file.
	 * @param Intro_Builder              $intro_builder              The intro builder.
	 * @param Title_Builder              $title_builder              The title builder.
	 * @param Description_Builder        $description_builder        The description builder.
	 * @param Link_Lists_Builder         $link_lists_builder         The link lists builder.
	 * @param Markdown_Escaper           $markdown_escaper           The markdown escaper.
	 * @param Optional_Link_List_Builder $optional_link_list_builder The optional link list builder.
	 */
	public function __construct(
		Llms_Txt_Renderer $llms_txt_renderer,
		Intro_Builder $intro_builder,
		Title_Builder $title_builder,
		Description_Builder $description_builder,
		Link_Lists_Builder $link_lists_builder,
		Markdown_Escaper $markdown_escaper,
		Optional_Link_List_Builder $optional_link_list_builder
	) {
		$this->llms_txt_renderer          = $llms_txt_renderer;
		$this->intro_builder              = $intro_builder;
		$this->title_builder              = $title_builder;
		$this->description_builder        = $description_builder;
		$this->link_lists_builder         = $link_lists_builder;
		$this->markdown_escaper           = $markdown_escaper;
		$this->optional_link_list_builder = $optional_link_list_builder;
	}

	/**
	 * Renders the markdown.
	 *
	 * @return string The rendered markdown.
	 */
	public function render(): string {
		$this->llms_txt_renderer->add_section( $this->title_builder->build_title() );
		$this->llms_txt_renderer->add_section( $this->description_builder->build_description() );
		$this->llms_txt_renderer->add_section( $this->intro_builder->build_intro() );

		foreach ( $this->link_lists_builder->build_link_lists() as $link_list ) {
			$this->llms_txt_renderer->add_section( $link_list );
		}

		$this->llms_txt_renderer->add_section( $this->optional_link_list_builder->build_optional_link_list() );

		foreach ( $this->llms_txt_renderer->get_sections() as $section ) {
			$section->escape_markdown( $this->markdown_escaper );
		}

		$content = $this->llms_txt_renderer->render();

		/**
		 * Filter: 'wpseo_llmstxt_content' - Allows appending extra markdown content to the LLMs.txt file.
		 *
		 * Mirrors the behaviour of the `wpseo_sitemap_{$type}_content` filter used in the XML sitemaps:
		 * the returned string is appended to the rendered llms.txt content as-is. Callers are responsible
		 * for valid, escaped markdown. A common use case is adding extra `## Heading` link list sections
		 * in bulk from code instead of through the admin UI, for example:
		 *
		 *     add_filter( 'wpseo_llmstxt_content', static function ( $content ) {
		 *         return $content . "\n## My pages\n- [Page 1](https://example.com/1)\n";
		 *     } );
		 *
		 * @param string $content The rendered LLMs.txt content so far.
		 */
		$content = (string) \apply_filters( 'wpseo_llmstxt_content', $content );

		return $content;
	}
}
