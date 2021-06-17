<?php

namespace Yoast\WP\SEO\Routes;

use Yoast\WP\SEO\Actions\Indexables\Indexable_Head_Action;
use Yoast\WP\SEO\Conditionals\Headless_Rest_Endpoints_Enabled_Conditional;
use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;

/**
 * Yoast_Head_REST_Field class.
 *
 * Registers the yoast head REST field.
 * Not technically a route but behaves the same so is included here.
 */
class Yoast_Head_REST_Field implements Route_Interface {

	/**
	 * The name of the yoast head field.
	 *
	 * @var string
	 */
	const YOAST_HEAD_ATTRIBUTE_NAME = 'yoast_head';

	/**
	 * The name of the yoast head field.
	 *
	 * @var string
	 */
	const YOAST_JSON_HEAD_ATTRIBUTE_NAME = 'yoast_json_head';

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * The taxonomy helper.
	 *
	 * @var Taxonomy_Helper
	 */
	protected $taxonomy_helper;

	/**
	 * The post helper.
	 *
	 * @var Post_Helper
	 */
	protected $post_helper;

	/**
	 * The head action.
	 *
	 * @var Indexable_Head_Action
	 */
	protected $head_action;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Headless_Rest_Endpoints_Enabled_Conditional::class ];
	}

	/**
	 * Yoast_Head_REST_Field constructor.
	 *
	 * @param Post_Type_Helper      $post_type_helper The post type helper.
	 * @param Taxonomy_Helper       $taxonomy_helper  The taxonomy helper.
	 * @param Post_Helper           $post_helper      The post helper.
	 * @param Indexable_Head_Action $head_action      The head action.
	 */
	public function __construct(
		Post_Type_Helper $post_type_helper,
		Taxonomy_Helper $taxonomy_helper,
		Post_Helper $post_helper,
		Indexable_Head_Action $head_action
	) {
		$this->post_type_helper = $post_type_helper;
		$this->taxonomy_helper  = $taxonomy_helper;
		$this->post_helper      = $post_helper;
		$this->head_action      = $head_action;
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		$public_post_types = $this->post_type_helper->get_public_post_types();

		foreach ( $public_post_types as $post_type ) {
			$this->register_rest_fields( $post_type, 'for_post' );
		}

		$public_taxonomies = $this->taxonomy_helper->get_public_taxonomies();

		foreach ( $public_taxonomies as $taxonomy ) {
			if ( $taxonomy === 'post_tag' ) {
				$taxonomy = 'tag';
			}
			$this->register_rest_fields( $taxonomy, 'for_term' );
		}

		$this->register_rest_fields( 'user', 'for_author' );
		$this->register_rest_fields( 'type', 'for_post_type_archive' );
	}

	/**
	 * Returns the head for a post.
	 *
	 * @param array $params The rest request params.
	 *
	 * @return string|null The head.
	 */
	public function for_post( $params, $field_name ) {
		if ( ! isset( $params['id'] ) ) {
			return null;
		}

		if ( ! $this->post_helper->is_post_indexable( $params['id'] ) ) {
			return null;
		}
		$obj = $this->head_action->for_post( $params['id'] );

		return $this->render_object( $obj, $field_name );
	}

	/**
	 * Returns the head for a term.
	 *
	 * @param array $params The rest request params.
	 *
	 * @return string|null The head.
	 */
	public function for_term( $params, $field_name ) {
		$obj = $this->head_action->for_term( $params['id'] );

		return $this->render_object( $obj, $field_name );
	}

	/**
	 * Returns the head for an author.
	 *
	 * @param array $params The rest request params.
	 *
	 * @return string|null The head.
	 */
	public function for_author( $params, $field_name ) {
		$obj = $this->head_action->for_author( $params['id'] );

		return $this->render_object( $obj, $field_name );
	}

	/**
	 * Returns the head for a post type archive.
	 *
	 * @param array $params The rest request params.
	 *
	 * @return string|null The head.
	 */
	public function for_post_type_archive( $params, $field_name ) {
		if ( $params['slug'] === 'post' ) {
			$obj = $this->head_action->for_posts_page();
		}
		elseif ( ! $this->post_type_helper->has_archive( $params['slug'] ) ) {
			return null;
		}
		else {
			$obj = $this->head_action->for_post_type_archive( $params['slug'] );
		}

		return $this->render_object( $obj, $field_name );
	}

	protected function register_rest_fields( $object_type, $callback ) {
		// allow output in page head meta tags
		\register_rest_field( $object_type, self::YOAST_HEAD_ATTRIBUTE_NAME, [ 'get_callback' => [ $this, $callback ] ] );
		// output in a page head json object
		\register_rest_field( $object_type, self::YOAST_JSON_HEAD_ATTRIBUTE_NAME, [ 'get_callback' => [ $this, $callback ] ] );
	}

	protected function render_object( $obj, $attribute_name ) {
		if ( $obj->status === 404 ) {
			return null;
		}

		// Choose the correct output format based on the head attribute we are rendering.
		switch ( $attribute_name ) {
			case self::YOAST_JSON_HEAD_ATTRIBUTE_NAME :
				return $obj->json_head;
			default:
				return $obj->head;
		}
	}
}
