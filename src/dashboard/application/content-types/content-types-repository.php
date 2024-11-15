<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Dashboard\Application\Content_Types;

use Yoast\WP\SEO\Dashboard\Application\Taxonomies\Taxonomies_Repository;
use Yoast\WP\SEO\Dashboard\Domain\Content_Types\Content_Types_List;
use Yoast\WP\SEO\Dashboard\Infrastructure\Content_Types\Content_Types_Collector;

/**
 * The repository to get content types.
 */
class Content_Types_Repository {

	/**
	 * The post type helper.
	 *
	 * @var Content_Types_Collector
	 */
	protected $content_types_collector;

	/**
	 * The content types list.
	 *
	 * @var Content_Types_List
	 */
	protected $content_types_list;

	/**
	 * The taxonomies repository.
	 *
	 * @var Taxonomies_Repository
	 */
	private $taxonomies_repository;

	/**
	 * The constructor.
	 *
	 * @param Content_Types_Collector $content_types_collector The post type helper.
	 * @param Content_Types_List      $content_types_list      The content types list.
	 * @param Taxonomies_Repository   $taxonomies_repository   The taxonomies repository.
	 */
	public function __construct(
		Content_Types_Collector $content_types_collector,
		Content_Types_List $content_types_list,
		Taxonomies_Repository $taxonomies_repository
	) {
		$this->content_types_collector = $content_types_collector;
		$this->content_types_list      = $content_types_list;
		$this->taxonomies_repository   = $taxonomies_repository;
	}

	/**
	 * Returns the content types array.
	 *
	 * @return array<array<string,array<string, array<string, array<string, string|null>>>>> The content types array.
	 */
	public function get_content_types(): array {
		$content_types = $this->content_types_collector->get_content_types();

		foreach ( $content_types as $content_type ) {
			$content_type_taxonomy = $this->taxonomies_repository->get_content_type_taxonomy( $content_type->get_name() );
			$content_type->set_taxonomy( $content_type_taxonomy );

			$this->content_types_list->add( $content_type );
		}

		return $this->content_types_list->to_array();
	}
}
