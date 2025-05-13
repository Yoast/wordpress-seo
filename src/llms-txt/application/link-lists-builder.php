<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Llms_Txt\Application;

use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Link_List;


/**
 * The builder of the link list sections.
 */
class Link_Lists_Builder {

	/**
	 * Builds the link list sections.
	 *
	 * @return Link_List[] The link list sections.
	 */
	public function build_link_lists(): array {
		return [
			new Link_List( 'Blog posts', [] ),
		];
	}
}
