<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders;

use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Link_List;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Sitemap_Link_Collector;

/**
 * The builder of the intro section.
 */
class Optional_Link_List_Builder {

	/**
	 * The sitemap link collector.
	 *
	 * @var Sitemap_Link_Collector
	 */
	private $sitemap_link_collector;

	/**
	 * The constructor.
	 *
	 * @param Sitemap_Link_Collector $sitemap_link_collector The sitemap link collector.
	 */
	public function __construct(
		Sitemap_Link_Collector $sitemap_link_collector
	) {
		$this->sitemap_link_collector = $sitemap_link_collector;
	}

	/**
	 * Builds the optional link list.
	 *
	 * @return Link_List The optional link list.
	 */
	public function build_optional_link_list(): Link_List {
		$sitemap_link = $this->sitemap_link_collector->get_link();
		if ( $sitemap_link === null ) {
			return new Link_List( 'Optional', [] );
		}

		return new Link_List( 'Optional', [ $sitemap_link ] );
	}
}
