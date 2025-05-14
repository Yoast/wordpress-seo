<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services;

use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Items\Link;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Link_List;

/**
 * The collector of terms.
 */
class Terms_Collector {

	/**
	 * The taxonomy helper.
	 *
	 * @var Taxonomy_Helper
	 */
	private $taxonomy_helper;

	/**
	 * The constructor.
	 *
	 * @param Taxonomy_Helper $taxonomy_helper The taxonomy helper.
	 */
	public function __construct( Taxonomy_Helper $taxonomy_helper ) {
		$this->taxonomy_helper = $taxonomy_helper;
	}

	/**
	 * Returns the content types in a link list.
	 *
	 * @return Link_List[] The content types in a link list.
	 */
	public function get_terms_lists(): array {
		$taxonomies = $this->taxonomy_helper->get_indexable_taxonomies();
		$link_list  = [];

		foreach ( $taxonomies as $taxonomy ) {
			if ( $this->taxonomy_helper->is_indexable( $taxonomy ) === false ) {
				continue;
			}

			$terms = \get_categories(
				[
					'taxonomy' => $taxonomy,
					'number'   => 5,
					'orderby'  => 'count',
					'order'    => 'DESC',
				]
			);

			$term_links = [];
			foreach ( $terms as $term ) {
				$term_link    = new Link( $term->name, \get_term_link( $term, $taxonomy ) );
				$term_links[] = $term_link;
			}

			if ( ! empty( $term_links ) ) {
				$link_list[] = new Link_List( $taxonomy, $term_links );
			}
		}

		return $link_list;
	}
}
