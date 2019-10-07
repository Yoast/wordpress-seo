<?php

namespace Yoast\WP\Free\Generators;

use Yoast\WP\Free\Helpers\Current_Page_Helper;
use Yoast\WP\Free\Helpers\Image_Helper;
use Yoast\WP\Free\Helpers\Open_Graph\Image_Helper as Open_Graph_Image_Helper;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Values\Open_Graph\Images;

class OG_Image_Generator {

	/**
	 * @var Open_Graph_Image_Helper
	 */
	protected $open_graph_image_helper;

	/**
	 * @var Image_Helper
	 */
	protected $image_helper;

	/**
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Images constructor.
	 *
	 * @param Open_Graph_Image_Helper $open_graph_image_helper Image helper for OpenGraph.
	 * @param Image_Helper            $image_helper            The image helper.
	 * @param Options_Helper          $options_helper          The options helper.
	 */
	public function __construct(
		Open_Graph_Image_Helper $open_graph_image_helper,
		Image_Helper $image_helper,
		Options_Helper $options_helper
	) {
		$this->open_graph_image_helper = $open_graph_image_helper;
		$this->image_helper            = $image_helper;
		$this->options_helper          = $options_helper;
	}

	/**
	 * Retrieves the images for an indexable.
	 *
	 * @param Indexable $indexable The indexable to get the images for.
	 *
	 * @return array The images.
	 */
	public function generate( Indexable $indexable ) {
		if ( $this->options_helper->get( 'opengraph' ) !== true ) {
			return [];
		}

		$image_container = new Images(
			$this->open_graph_image_helper,
			$this->image_helper
		);

		/**
		 * Filter: wpseo_add_opengraph_images - Allow developers to add images to the OpenGraph tags.
		 *
		 * @api Yoast\WP\Free\Values\Open_Graph\Images The current object.
		 */
		do_action( 'wpseo_add_opengraph_images', $image_container );

		$this->add_from_indexable( $indexable, $image_container );

		switch ( $indexable->object_type ) {
			case 'post':
				if ( $indexable->object_sub_type === 'attachment' ) {
					if ( \wp_attachment_is_image( $indexable->object_id ) ) {
						$image_container->add_image_by_id( $indexable->object_id );
					}

					break;
				}

				$featured_image_id = $this->image_helper->get_featured_image_id( $indexable->object_id );
				if ( $featured_image_id ) {
					$image_container->add_image_by_id( $featured_image_id );

					break;
				}

				$content_image = $this->image_helper->get_post_content_image( $indexable->object_id );

				$image_container->add_image_by_url( $content_image );

				break;
		}

		/**
		 * Filter: wpseo_add_opengraph_additional_images - Allows to add additional images to the OpenGraph tags.
		 *
		 * @api Yoast\WP\Free\Values\Open_Graph\Images The current object.
		 */
		do_action( 'wpseo_add_opengraph_additional_images', $image_container );

		$this->add_from_default( $image_container );

		return $image_container->get_images();
	}

	/**
	 * Adds an image based on the given indexable.
	 *
	 * @param Indexable $indexable       The indexable.
	 * @param Images    $image_container The image container.
	 */
	protected function add_from_indexable( Indexable $indexable, Images $image_container ) {
		if ( $indexable->og_image_id ) {
			$image_container->add_image_by_id( $indexable->og_image_id );

			return;
		}

		if ( $indexable->og_image ) {
			$image_container->add_image_by_url( $indexable->og_image );
		}
	}


	/**
	 * Retrieves the default OpenGraph image.
	 *
	 * @param Images $image_container The image container.
	 *
	 * @return mixed|string|void|null
	 */
	protected function add_from_default( Images $image_container ) {
		if ( $image_container->has_images() ) {
			return;
		}

		$default_image_id  = $this->options_helper->get( 'og_default_image_id', '' );
		if ( $default_image_id ) {
			$image_container->add_image_by_id( $default_image_id );

			return;
		}

		$default_image_url = $this->options_helper->get( 'og_default_image', '' );
		if ( $default_image_url ) {
			$image_container->add_image_by_url( $default_image_url );
		}

	}
}
