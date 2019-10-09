<?php
/**
 * Post Builder for the indexables.
 *
 * @package Yoast\YoastSEO\Builders
 */

namespace Yoast\WP\Free\Builders;

use Exception;
use Yoast\WP\Free\Helpers\Image_Helper;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Repositories\SEO_Meta_Repository;

/**
 * Formats the post meta to indexable format.
 */
class Indexable_Post_Builder {

	/**
	 * @var \Yoast\WP\Free\Repositories\SEO_Meta_Repository
	 */
	protected $seo_meta_repository;

	/**
	 * @var Image_Helper
	 */
	protected $image_helper;

	/**
	 * Indexable_Post_Builder constructor.
	 *
	 * @param \Yoast\WP\Free\Repositories\SEO_Meta_Repository $seo_meta_repository The SEO Meta repository.
	 * @param Image_Helper                                    $image_helper        The image helper.
	 */
	public function __construct(
		SEO_Meta_Repository $seo_meta_repository,
		Image_Helper $image_helper
	) {
		$this->seo_meta_repository = $seo_meta_repository;
		$this->image_helper        = $image_helper;
	}

	/**
	 * Formats the data.
	 *
	 * @param int                             $post_id   The post ID to use.
	 * @param \Yoast\WP\Free\Models\Indexable $indexable The indexable to format.
	 *
	 * @return \Yoast\WP\Free\Models\Indexable The extended indexable.
	 */
	public function build( $post_id, $indexable ) {
		$indexable->permalink       = \get_permalink( $post_id );
		$indexable->object_sub_type = \get_post_type( $post_id );

		$indexable->primary_focus_keyword_score = $this->get_keyword_score(
			$this->get_meta_value( $post_id, 'focuskw' ),
			(int) $this->get_meta_value( $post_id, 'linkdex' )
		);

		$indexable->readability_score = (int) $this->get_meta_value( $post_id, 'content_score' );

		$indexable->is_cornerstone    = ( $this->get_meta_value( $post_id, 'is_cornerstone' ) === '1' );
		$indexable->is_robots_noindex = $this->get_robots_noindex(
			$this->get_meta_value( $post_id, 'meta-robots-noindex' )
		);

		// Set additional meta-robots values.
		$indexable->is_robots_nofollow = ( $this->get_meta_value( $post_id, 'meta-robots-nofollow' ) === '1' );
		$noindex_advanced              = $this->get_meta_value( $post_id, 'meta-robots-adv' );
		$meta_robots                   = \explode( ',', $noindex_advanced );
		foreach ( $this->get_robots_options() as $meta_robots_option ) {
			$indexable->{ 'is_robots_' . $meta_robots_option } = \in_array( $meta_robots_option, $meta_robots, true ) ? 1 : null;
		}

		foreach ( $this->get_indexable_lookup() as $meta_key => $indexable_key ) {
			$indexable->{ $indexable_key } = $this->get_meta_value( $post_id, $meta_key );
		}

		$this->handle_social_images( $indexable );

		$indexable = $this->set_link_count( $post_id, $indexable );

		return $indexable;
	}

	/**
	 * Converts the meta robots noindex value to the indexable value.
	 *
	 * @param int $value Meta value to convert.
	 *
	 * @return bool|null True for noindex, false for index, null for default of parent/type.
	 */
	protected function get_robots_noindex( $value ) {
		$value = (int) $value;

		switch ( $value ) {
			case 1:
				return true;
			case 2:
				return false;
		}

		return null;
	}

	/**
	 * Retrieves the robot options to search for.
	 *
	 * @return array List of robots values.
	 */
	protected function get_robots_options() {
		return [ 'noimageindex', 'noarchive', 'nosnippet' ];
	}

	/**
	 * Determines the focus keyword score.
	 *
	 * @param string $keyword The focus keyword that is set.
	 * @param int    $score   The score saved on the meta data.
	 *
	 * @return null|int Score to use.
	 */
	protected function get_keyword_score( $keyword, $score ) {
		if ( empty( $keyword ) ) {
			return null;
		}

		return $score;
	}

	/**
	 * Retrieves the lookup table.
	 *
	 * @return array Lookup table for the indexable fields.
	 */
	protected function get_indexable_lookup() {
		return [
			'focuskw'               => 'primary_focus_keyword',
			'canonical'             => 'canonical',
			'title'                 => 'title',
			'metadesc'              => 'description',
			'bctitle'               => 'breadcrumb_title',
			'opengraph-title'       => 'og_title',
			'opengraph-image'       => 'og_image',
			'opengraph-image-id'    => 'og_image_id',
			'opengraph-description' => 'og_description',
			'twitter-title'         => 'twitter_title',
			'twitter-image'         => 'twitter_image',
			'twitter-description'   => 'twitter_description',
		];
	}

	/**
	 * Updates the link count from existing data.
	 *
	 * @param int                             $post_id   The post ID to use.
	 * @param \Yoast\WP\Free\Models\Indexable $indexable The indexable to extend.
	 *
	 * @return \Yoast\WP\Free\Models\Indexable The extended indexable.
	 */
	protected function set_link_count( $post_id, $indexable ) {
		try {
			$seo_meta = $this->seo_meta_repository->find_by_post_id( $post_id );

			if ( $seo_meta ) {
				$indexable->link_count          = $seo_meta->internal_link_count;
				$indexable->incoming_link_count = $seo_meta->incoming_link_count;
			}
		// @codingStandardsIgnoreLine Generic.CodeAnalysis.EmptyStatement.DetectedCATCH -- There is nothing to do.
		} catch ( Exception $exception ) {
			// Do nothing...
		}

		return $indexable;
	}

	/**
	 * Retrieves the current value for the meta field.
	 *
	 * @param int    $post_id  The post ID to use.
	 * @param string $meta_key Meta key to fetch.
	 *
	 * @return mixed The value of the indexable entry to use.
	 */
	protected function get_meta_value( $post_id, $meta_key ) {
		$value = \WPSEO_Meta::get_value( $meta_key, $post_id );
		if ( \is_string( $value ) && $value === '' ) {
			return null;
		}

		return $value;
	}

	/**
	 * Handles the social images.
	 *
	 * @param Indexable $indexable The indexable to handle.
	 */
	protected function handle_social_images( Indexable $indexable ) {
		// When both image sources are set already.
		if ( $indexable->og_image_source && $indexable->twitter_image_source ) {
			return;
		}

		// When source is empty and the image or image id is set.
		if ( $indexable->og_image || $indexable->og_image_id ) {
			$indexable->og_image_source = 'set-by-user';
		}

		if ( $indexable->twitter_image || $indexable->twitter_image_id ) {
			$indexable->twitter_image_source = 'set-by-user';
		}

		// When image sources are set already.
		if ( $indexable->og_image_source && $indexable->twitter_image_source ) {
			return;
		}

		$alternative_image = $this->find_alternative_image( $indexable );
		if ( ! empty( $alternative_image ) ) {
			$this->set_alternative_image( $alternative_image, $indexable );
		}
	}

	/**
	 * Finds an alternative image for the social image.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return array|bool False when not found, array with data when found.
	 */
	protected function find_alternative_image( Indexable $indexable ) {
		if (
			$indexable->object_sub_type === 'attachment' &&
			$this->image_helper->is_attachment_valid_image( $indexable->object_id )
		) {
			return [
				'image_id' => $indexable->object_id,
				'source'   => 'attachment-image',
			];
		}

		$featured_image_id = $this->image_helper->get_featured_image_id( $indexable->object_id );
		if ( $featured_image_id ) {
			return [
				'image_id' => $featured_image_id,
				'source'   => 'featured-image',
			];
		}

		$image_url = $this->image_helper->get_gallery_image( $indexable->object_id );
		if ( $image_url ) {
			return [
				'image'  => $image_url,
				'source' => 'gallery-image',
			];
		}

		$content_image = $this->image_helper->get_post_content_image( $indexable->object_id );
		if ( $content_image ) {
			return [
				'image'  => $image_url,
				'source' => 'first-content-image',
			];
		}

		return false;
	}

	/**
	 * Sets the alternative on an indexable.
	 *
	 * @param array     $alternative_image The alternative image to set.
	 * @param Indexable $indexable         The indexable to set image for.
	 */
	protected function set_alternative_image( array $alternative_image, Indexable $indexable ) {
		if ( ! empty( $alternative_image['image_id'] ) ) {
			if ( ! $indexable->og_image_source && ! $indexable->og_image_id ) {
				$indexable->og_image_id     = $alternative_image['image_id'];
				$indexable->og_image_source = $alternative_image['source'];
			}

			if ( ! $indexable->twitter_image && ! $indexable->twitter_image_id ) {
				$indexable->twitter_image_id     = $alternative_image['image_id'];
				$indexable->twitter_image_source = $alternative_image['source'];
			}
		}

		if ( ! empty( $alternative_image['image'] ) ) {
			if ( ! $indexable->og_image_source && ! $indexable->og_image_id ) {
				$indexable->og_image        = $alternative_image['image'];
				$indexable->og_image_source = $alternative_image['source'];
			}

			if ( ! $indexable->twitter_image && ! $indexable->twitter_image_id ) {
				$indexable->twitter_image        = $alternative_image['image_id'];
				$indexable->twitter_image_source = $alternative_image['source'];
			}
		}
	}
}
