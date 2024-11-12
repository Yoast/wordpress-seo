<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\General\Application\Content_Types;

use Yoast\WP\SEO\General\Application\Taxonomies\Taxonomies_Repository;
use Yoast\WP\SEO\General\Domain\Content_Types\Content_Type;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;

/**
 * The repository to get content types.
 */
class Content_Types_Repository {

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	protected $post_type_helper;

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
	 * @param Taxonomies_Repository $taxonomies_repository The taxonomies repository.
	 */
	public function __construct(
		Post_Type_Helper $post_type_helper,
		Taxonomies_Repository $taxonomies_repository
	) {
		$this->post_type_helper      = $post_type_helper;
		$this->taxonomies_repository = $taxonomies_repository;
	}

	/**
	 * Returns the content types object.
	 *
	 * @return array<string, string|array<string,string|array<string, string>>|null> The content types object.
	 */
	public function get_content_types(): array {
		$content_types = [];
		$post_types    = $this->post_type_helper->get_indexable_post_types();

		foreach ( $post_types as $post_type ) {
			$post_type_object      = \get_post_type_object( $post_type ); // @TODO: Refactor `Post_Type_Helper::get_indexable_post_types()` to be able to return objects. That way, we can remove this line.
			$content_type_instance = new Content_Type( $post_type_object );

			$content_type_taxonomy = $this->taxonomies_repository->get_content_type_taxonomy( $post_type_object->name );
			$content_types[]       = $content_type_instance->map_to_array( $content_type_taxonomy );
		}

		return $content_types;
	}
}
