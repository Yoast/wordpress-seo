<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\Free\Presentations\Generators\Schema
 */

namespace Yoast\WP\Free\Presentations\Generators\Schema;

use Yoast\WP\Free\Context\Meta_Tags_Context;
use Yoast\WP\Free\Helpers\Article_Helper;
use Yoast\WP\Free\Helpers\Image_Helper;
use Yoast\WP\Free\Helpers\Schema;

/**
 * Returns schema Person data.
 *
 * @since 10.2
 */
class Author extends Person {
	/**
	 * The Schema type we use for this class.
	 *
	 * @var string[]
	 */
	protected $type = [ 'Person' ];

	/**
	 * @var Article_Helper
	 */
	private $article_helper;

	/**
	 * Author constructor.
	 *
	 * @param Article_Helper      $article_helper      The article helper.
	 * @param Image_Helper        $image_helper        The image helper.
	 * @param Schema\Image_Helper $schema_image_helper The schema image helper.
	 */
	public function __construct(
		Article_Helper $article_helper,
		Image_Helper $image_helper,
		Schema\Image_Helper $schema_image_helper
	) {
		parent::__construct( $image_helper, $schema_image_helper );
		$this->article_helper = $article_helper;
	}

	/**
	 * Determine whether we should return Person schema.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return bool
	 */
	public function is_needed( Meta_Tags_Context $context ) {
		if ( $context->indexable->object_type === 'author' ) {
			return true;
		}

		if (
			$context->indexable->object_type === 'post' &&
			$this->article_helper->is_article_post_type( $context->indexable->object_sub_type )
		) {
			// If the author is the user the site represents, no need for an extra author block.
			return (int) $context->post->post_author !== $context->site_user_id;
		}

		return false;
	}

	/**
	 * Returns Person Schema data.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return bool|array Person data on success, false on failure.
	 */
	public function generate( Meta_Tags_Context $context ) {
		$user_id = $this->determine_user_id( $context );
		if ( ! $user_id ) {
			return false;
		}

		$data = $this->build_person_data( $user_id, $context );

		// If this is an author page, the Person object is the main object, so we set it as such here.
		if ( $context->indexable->object_type === 'author' ) {
			$data['mainEntityOfPage'] = [
				'@id' => $context->canonical . $this->id_helper->webpage_hash,
			];
		}

		return $data;
	}

	/**
	 * Determines a User ID for the Person data.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return bool|int User ID or false upon return.
	 */
	protected function determine_user_id( Meta_Tags_Context $context ) {
		$user_id = (int) $context->post->post_author;
		if ( $context->indexable->object_type === 'author' ) {
			$user_id = $context->indexable->object_id;
		}

		/**
		 * Filter: 'wpseo_schema_person_user_id' - Allows filtering of user ID used for person output.
		 *
		 * @api int|bool $user_id The user ID currently determined.
		 */
		return apply_filters( 'wpseo_schema_person_user_id', $user_id );
	}

	/**
	 * An author should not have an image from options, this only applies to persons.
	 *
	 * @param array             $data      The Person schema.
	 * @param string            $schema_id The string used in the `@id` for the schema.
	 * @param Meta_Tags_Context $context   The meta tags context.
	 *
	 * @return array The Person schema.
	 */
	protected function set_image_from_options( $data, $schema_id, Meta_Tags_Context $context ) {
		return $data;
	}
}
