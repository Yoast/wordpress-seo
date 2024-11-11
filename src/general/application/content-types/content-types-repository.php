<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\General\Application\Content_Types;

use Yoast\WP\SEO\General\Application\Taxonomies\Taxonomies_Repository;
use Yoast\WP\SEO\General\Domain\Content_Types\Content_Type;
use Yoast\WP\SEO\General\Domain\Content_Types\Content_Type_Map;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;

/**
 * The repository to get all content types.
 */
class Content_Types_Repository {

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * The map of content types.
	 *
	 * @var Content_Type_Map
	 */
	private $content_type_map;

	/**
	 * The taxonomies repository.
	 *
	 * @var Taxonomies_Repository
	 */
	private $taxonomies_repository;

	/**
	 * The constructor.
	 *
	 * @param Post_Type_Helper      $post_type_helper      The post type helper.
	 * @param Content_Type_Map      $content_type_map      The map of content types.
	 * @param Taxonomies_Repository $taxonomies_repository The taxonomies repository.
	 */
	public function __construct(
		Post_Type_Helper $post_type_helper,
		Content_Type_Map $content_type_map,
		Taxonomies_Repository $taxonomies_repository
	) {
		$this->post_type_helper      = $post_type_helper;
		$this->content_type_map      = $content_type_map;
		$this->taxonomies_repository = $taxonomies_repository;
	}

	/**
	 * Returns the content types object.
	 *
	 * @return array<string, string> The content types object.
	 */
	public function get_content_types(): array {
		$content_types = [];
		$post_types    = $this->post_type_helper->get_indexable_post_types();

		foreach ( $post_types as $post_type ) {
			$post_type_object      = \get_post_type_object( $post_type ); // @TODO: Refactor `Post_Type_Helper::get_indexable_post_types()` to be able to return objects.
			$content_type_instance = new Content_Type( $post_type_object->name, $post_type_object->label );

			$content_type_taxonomy = $this->taxonomies_repository->get_content_type_taxonomy( $content_type_instance );
			$content_types[]       = $this->content_type_map->map_to_array( $content_type_instance, $content_type_taxonomy );
		}

		return $content_types;
	}
}
