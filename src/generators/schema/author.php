<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Generators\Schema
 */

namespace Yoast\WP\SEO\Generators\Schema;

use Yoast\WP\SEO\Config\Schema_Ids;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Schema;
use Yoast\WP\SEO\Helpers\Schema\Article_Helper;

/**
 * Returns schema Person data.
 */
class Author extends Person {
	/**
	 * The Schema type we use for this class.
	 *
	 * @var string[]
	 */
	protected $type = [ 'Person' ];

	/**
	 * The article helper.
	 *
	 * @var Article_Helper
	 */
	private $article;

	/**
	 * Author constructor.
	 *
	 * @param Article_Helper      $article      The article helper.
	 * @param Image_Helper        $image        The image helper.
	 * @param Schema\Image_Helper $schema_image The schema image helper.
	 * @param Schema\HTML_Helper  $html         The HTML helper.
	 *
	 * @codeCoverageIgnore Constructor method.
	 */
	public function __construct(
		Article_Helper $article,
		Image_Helper $image,
		Schema\Image_Helper $schema_image,
		Schema\HTML_Helper $html
	) {
		parent::__construct( $image, $schema_image, $html );
		$this->article = $article;
	}

	/**
	 * Determine whether we should return Person schema.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return bool
	 */
	public function is_needed( Meta_Tags_Context $context ) {
		if ( $context->indexable->object_type === 'user' ) {
			return true;
		}

		if (
			$context->indexable->object_type === 'post' &&
			$this->article->is_article_post_type( $context->indexable->object_sub_type )
		) {
			// If the author is the user the site represents, no need for an extra author block.
			if ( parent::is_needed( $context ) ) {
				return (int) $context->post->post_author !== $context->site_user_id;
			}

			return true;
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
		if ( $context->indexable->object_type === 'user' ) {
			$data['mainEntityOfPage'] = [
				'@id' => $context->canonical . Schema_Ids::WEBPAGE_HASH,
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
		$user_id = 0;

		if ( $context->indexable->object_type === 'post' ) {
			$user_id = (int) $context->post->post_author;
		}

		if ( $context->indexable->object_type === 'user' ) {
			$user_id = $context->indexable->object_id;
		}

		/**
		 * Filter: 'wpseo_schema_person_user_id' - Allows filtering of user ID used for person output.
		 *
		 * @api int|bool $user_id The user ID currently determined.
		 */
		$user_id = \apply_filters( 'wpseo_schema_person_user_id', $user_id );

		if ( \is_int( $user_id ) && $user_id > 0 ) {
			return $user_id;
		}

		return false;
	}

	/**
	 * An author should not have an image from options, this only applies to persons.
	 *
	 * @param array             $data      The Person schema.
	 * @param string            $schema_id The string used in the `@id` for the schema.
	 * @param Meta_Tags_Context $context   The meta tags context.
	 *
	 * @codeCoverageIgnore Wrapper method, only returns `$data` argument.
	 *
	 * @return array The Person schema.
	 */
	protected function set_image_from_options( $data, $schema_id, Meta_Tags_Context $context ) {
		return $data;
	}
}
