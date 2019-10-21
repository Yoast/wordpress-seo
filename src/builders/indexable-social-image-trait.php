<?php
/**
 * Trait for determine the social image to use in the indexable.
 *
 * @package Yoast\YoastSEO\Builders
 */

namespace Yoast\WP\Free\Builders;

use Yoast\WP\Free\Models\Indexable;

/**
 * Represents the trait used in builders for handling social images.
 */
trait Indexable_Social_Image_Trait {

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

				$this->set_og_image_meta_data( $indexable );
			}

			if ( ! $indexable->twitter_image && ! $indexable->twitter_image_id ) {
				$indexable->twitter_image        = $this->twitter_image->get_by_id( $alternative_image['image_id'] );
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
				$indexable->twitter_image        = $alternative_image['image'];
				$indexable->twitter_image_source = $alternative_image['source'];
			}
		}
	}

	/**
	 * Sets the OG image meta data for an og image
	 *
	 * @param Indexable $indexable The indexable.
	 */
	protected function set_og_image_meta_data( Indexable $indexable ) {
		if ( ! $indexable->og_image_id ) {
			return;
		}

		$image = $this->open_graph_image->get_image_url_by_id( $indexable->og_image_id );

		if ( ! empty( $image ) ) {
			$indexable->og_image      = $image['url'];
			$indexable->og_image_meta = wp_json_encode( $image );
		}
	}

	/**
	 * Handles the social images.
	 *
	 * @param Indexable $indexable The indexable to handle.
	 */
	protected function handle_social_images( Indexable $indexable ) {
		// When the image or image id is set.
		if ( $indexable->og_image || $indexable->og_image_id ) {
			$indexable->og_image_source = 'set-by-user';

			$this->set_og_image_meta_data( $indexable );
		}

		if ( $indexable->twitter_image || $indexable->twitter_image_id ) {
			$indexable->twitter_image_source = 'set-by-user';
		}

		if ( $indexable->twitter_image_id ) {
			$indexable->twitter_image = $this->twitter_image->get_by_id( $indexable->twitter_image_id );
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
	 * Resets the social images.
	 *
	 * @param Indexable $indexable The indexable to set images for.
	 */
	protected function reset_social_images( Indexable $indexable ) {
		$indexable->og_image        = null;
		$indexable->og_image_id     = null;
		$indexable->og_image_source = null;
		$indexable->og_image_meta   = null;

		$indexable->twitter_image        = null;
		$indexable->twitter_image_id     = null;
		$indexable->twitter_image_source = null;
	}
}
