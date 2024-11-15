<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Dashboard\Application\Content_Types;

use Yoast\WP\SEO\Dashboard\Application\Taxonomies\Taxonomies_Repository;
use Yoast\WP\SEO\Dashboard\Domain\Content_Types\Content_Type;
use Yoast\WP\SEO\Dashboard\Domain\Content_Types\Content_Types_List;
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
	 * @param Post_Type_Helper      $post_type_helper      The post type helper.
	 * @param Content_Types_List    $content_types_list    The content types list.
	 * @param Taxonomies_Repository $taxonomies_repository The taxonomies repository.
	 */
	public function __construct(
		Post_Type_Helper $post_type_helper,
		Content_Types_List $content_types_list,
		Taxonomies_Repository $taxonomies_repository
	) {
		$this->post_type_helper      = $post_type_helper;
		$this->content_types_list    = $content_types_list;
		$this->taxonomies_repository = $taxonomies_repository;
	}

	/**
	 * Returns the content types array.
	 *
	 * @return array<array<string,array<string, array<string, array<string, string|null>>>>> The content types array.
	 */
	public function get_content_types(): array {
		$post_types = $this->post_type_helper->get_indexable_post_types();

		foreach ( $post_types as $post_type ) {
			$post_type_object      = \get_post_type_object( $post_type ); // @TODO: Refactor `Post_Type_Helper::get_indexable_post_types()` to be able to return objects. That way, we can remove this line.
			$content_type_taxonomy = $this->taxonomies_repository->get_content_type_taxonomy( $post_type_object->name );

			$content_type = new Content_Type( $post_type_object->name, $post_type_object->label, $content_type_taxonomy );
			$this->content_types_list->add( $content_type );
		}

		return $this->content_types_list->to_array();
	}
}
