<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\General\Application\Taxonomy_Filters;

use Yoast\WP\SEO\General\Domain\Taxonomy_Filters\Taxonomy_Filter_Interface;

/**
 * The repository to get all content types.
 *
 * @makePublic
 */
class Taxonomy_Filters_Repository {

	/**
	 * The taxonomy filter repository.
	 *
	 * @var Taxonomy_Filter_Interface[]
	 */
	private $taxonomy_filters;

	/**
	 * The constructor.
	 *
	 * @param Taxonomy_Filter_Interface ...$taxonomy_filters All taxonomies.
	 */
	public function __construct(
		Taxonomy_Filter_Interface ...$taxonomy_filters
	) {
		$this->taxonomy_filters = $taxonomy_filters;
	}

	/**
	 * Returns the object of the filtering taxonomy of a content type.
	 *
	 * @return Taxonomy_Filter_Interface[] The filtering taxonomy of the content type.
	 */
	public function get_taxonomy_filters(): array {
		return $this->taxonomy_filters;
	}
}
