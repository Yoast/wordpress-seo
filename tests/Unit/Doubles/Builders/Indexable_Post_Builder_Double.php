<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Builders;

use WP_Error;
use Yoast\WP\SEO\Builders\Indexable_Post_Builder;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Class Indexable_Post_Builder_Double.
 */
final class Indexable_Post_Builder_Double extends Indexable_Post_Builder {

	/**
	 * Determines the value of is_public.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return bool|null Whether or not the post type is public. Null if no override is set.
	 */
	public function is_public( $indexable ) {
		return parent::is_public( $indexable );
	}

	/**
	 * Determines the value of is_public for attachments.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return bool|null False when it has no parent. Null when it has a parent.
	 */
	public function is_public_attachment( $indexable ) {
		return parent::is_public_attachment( $indexable );
	}

	/**
	 * Determines the value of has_public_posts.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return bool|null Whether the attachment has a public parent, can be true, false and null. Null when it is not an attachment.
	 */
	public function has_public_posts( $indexable ) {
		return parent::has_public_posts( $indexable );
	}

	/**
	 * Gets the number of pages for a post.
	 *
	 * @param object $post The post object.
	 *
	 * @return int|null The number of pages or null if the post isn't paginated.
	 */
	public function get_number_of_pages_for_post( $post ) {
		return parent::get_number_of_pages_for_post( $post );
	}

	/**
	 * Converts the meta robots noindex value to the indexable value.
	 *
	 * @param int $value Meta value to convert.
	 *
	 * @return bool|null True for noindex, false for index, null for default of parent/type.
	 */
	public function get_robots_noindex( $value ) {
		return parent::get_robots_noindex( $value );
	}

	/**
	 * Retrieves the permalink for a post with the given post type and ID.
	 *
	 * @param string $post_type The post type.
	 * @param int    $post_id   The post ID.
	 *
	 * @return false|string|WP_Error The permalink.
	 */
	public function get_permalink( $post_type, $post_id ) {
		return parent::get_permalink( $post_type, $post_id );
	}

	/**
	 * Determines the focus keyword score.
	 *
	 * @param string $keyword The focus keyword that is set.
	 * @param int    $score   The score saved on the meta data.
	 *
	 * @return int|null Score to use.
	 */
	public function get_keyword_score( $keyword, $score ) {
		return parent::get_keyword_score( $keyword, $score );
	}

	/**
	 * Finds an alternative image for the social image.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return array|bool False when not found, array with data when found.
	 */
	public function find_alternative_image( Indexable $indexable ) {
		return parent::find_alternative_image( $indexable );
	}
}
