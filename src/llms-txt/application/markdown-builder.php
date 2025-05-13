<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Llms_Txt\Application;

use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Markdown_Bucket;

/**
 * The builder of the markdown file.
 */
class Markdown_Builder {

	/**
	 * The markdown bucket.
	 *
	 * @var Markdown_Bucket
	 */
	protected $markdown_bucket;

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
	 * The constructor.
	 *
	 * @param Markdown_Bucket     $markdown_bucket     The markdown bucket.
	 * @param Intro_Builder       $intro_builder       The intro builder.
	 * @param Title_Builder       $title_builder       The title builder.
	 * @param Description_Builder $description_builder The description builder.
	 * @param Link_Lists_Builder  $link_lists_builder  The link lists builder.
	 */
	public function __construct(
		Markdown_Bucket $markdown_bucket,
		Intro_Builder $intro_builder,
		Title_Builder $title_builder,
		Description_Builder $description_builder,
		Link_Lists_Builder $link_lists_builder
	) {
		$this->markdown_bucket     = $markdown_bucket;
		$this->intro_builder       = $intro_builder;
		$this->title_builder       = $title_builder;
		$this->description_builder = $description_builder;
		$this->link_lists_builder  = $link_lists_builder;
	}

	/**
	 * Renders the markdown.
	 *
	 * @return string The rendered markdown.
	 */
	public function render(): string {
		$this->markdown_bucket->add_section( $this->intro_builder->build_intro() );
		$this->markdown_bucket->add_section( $this->title_builder->build_title() );
		$this->markdown_bucket->add_section( $this->description_builder->build_description() );

		foreach ( $this->link_lists_builder->build_link_lists() as $link_list ) {
			$this->markdown_bucket->add_section( $link_list );
		}

		return $this->markdown_bucket->render();
	}
}
