<?php

namespace Yoast\WP\SEO\Integrations\Blocks;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class to load assets required for structured data blocks.
 */
class Structured_Data_Blocks implements Integration_Interface {

	use No_Conditionals;

	/**
	 * An instance of the WPSEO_Admin_Asset_Manager class.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * An instance of the image helper class.
	 *
	 * @var Image_Helper
	 */
	protected $image_helper;

	/**
	 * The image caches per post.
	 *
	 * @var array
	 */
	protected $caches = [];

	/**
	 * The used cache keys per post.
	 *
	 * @var array
	 */
	protected $used_caches = [];

	/**
	 * Whether or not we've registered our shutdown function.
	 *
	 * @var bool
	 */
	protected $registered_shutdown_function = false;

	/**
	 * Structured_Data_Blocks constructor.
	 *
	 * @param WPSEO_Admin_Asset_Manager $asset_manager The asset manager.
	 * @param Image_Helper              $image_helper  The image helper.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager,
		Image_Helper $image_helper
	) {
		$this->asset_manager = $asset_manager;
		$this->image_helper  = $image_helper;
	}

	/**
	 * Registers hooks for Structured Data Blocks with WordPress.
	 */
	public function register_hooks() {
		\add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_block_editor_assets' ] );
		$this->register_blocks();
	}

	/**
	 * Registers the blocks.
	 *
	 * @return void
	 */
	public function register_blocks() {
		\register_block_type(
			'yoast/faq-block',
			[
				'render_callback' => [ $this, 'optimize_faq_images' ],
				'attributes'      => [
					'className' => [
						'default' => '',
						'type'    => 'string',
					],
					'questions' => [
						'type' => 'array',
					],
					'additionalListCssClasses' => [
						'type' => 'string',
					],
				],
			]
		);
		\register_block_type(
			'yoast/how-to-block',
			[
				'render_callback' => [ $this, 'optimize_how_to_images' ],
				'attributes'      => [
					'hasDuration' => [
						'type' => 'boolean',
					],
					'days' => [
						'type' => 'string',
					],
					'hours' => [
						'type' => 'string',
					],
					'minutes' => [
						'type' => 'string',
					],
					'description' => [
						'type'     => 'array',
						'source'   => 'children',
						'selector' => '.schema-how-to-description',
					],
					'jsonDescription' => [
						'type' => 'string',
					],
					'steps' => [
						'type' => 'array',
					],
					'additionalListCssClasses' => [
						'type' => 'string',
					],
					'unorderedList' => [
						'type' => 'boolean',
					],
					'durationText' => [
						'type' => 'string',
					],
					'defaultDurationText' => [
						'type' => 'string',
					],
				],
			]
		);
	}

	/**
	 * Enqueue Gutenberg block assets for backend editor.
	 */
	public function enqueue_block_editor_assets() {
		/**
		 * Filter: 'wpseo_enable_structured_data_blocks' - Allows disabling Yoast's schema blocks entirely.
		 *
		 * @api bool If false, our structured data blocks won't show.
		 */
		if ( ! \apply_filters( 'wpseo_enable_structured_data_blocks', true ) ) {
			return;
		}

		$this->asset_manager->enqueue_script( 'structured-data-blocks' );
		$this->asset_manager->enqueue_style( 'structured-data-blocks' );
	}

	/**
	 * Optimizes images in the FAQ blocks.
	 *
	 * @param array  $attributes The attributes.
	 * @param string $content    The content.
	 *
	 * @return string The content with images optimized.
	 */
	public function optimize_faq_images( $attributes, $content ) {
		if ( ! isset( $attributes['questions'] ) ) {
			return $content;
		}

		return $this->optimize_images( $attributes['questions'], 'answer', $content );
	}

	/**
	 * Optimizes images in the How-To blocks.
	 *
	 * @param array  $attributes The attributes.
	 * @param string $content    The content.
	 *
	 * @return string The content with images optimized.
	 */
	public function optimize_how_to_images( $attributes, $content ) {
		if ( ! isset( $attributes['steps'] ) ) {
			return $content;
		}

		return $this->optimize_images( $attributes['steps'], 'text', $content );
	}

	/**
	 * Optimizes images in structured data blocks.
	 *
	 * @param array  $elements The list of elements from the block attributes.
	 * @param string $key      The key in the data to iterate over.
	 * @param string $content  The content.
	 *
	 * @return string The content with images optimized.
	 */
	private function optimize_images( $elements, $key, $content ) {
		global $post;
		if ( ! $post ) {
			return $content;
		}

		$this->add_images_from_attributes_to_used_cache( $post->ID, $elements, $key );

		// Then replace all images with optimized versions in the content.
		$content = \preg_replace_callback(
			'/<img[^>]+>/',
			function ( $matches ) {
				\preg_match( '/src="([^"]+)"/', $matches[0], $src_matches );
				if ( ! $src_matches || ! isset( $src_matches[1] ) ) {
					return $matches[0];
				}
				$attachment_id = $this->attachment_src_to_id( $src_matches[1] );
				if ( $attachment_id === 0 ) {
					return $matches[0];
				}
				$image_size  = 'full';
				$image_style = [ 'style' => 'max-width: 100%; height: auto;' ];
				\preg_match( '/style="[^"]*width:\s*(\d+)px[^"]*"/', $matches[0], $style_matches );
				if ( $style_matches && isset( $style_matches[1] ) ) {
					$width     = (int) $style_matches[1];
					$meta_data = \wp_get_attachment_metadata( $attachment_id );
					if ( isset( $meta_data['height'] ) && isset( $meta_data['width'] ) && $meta_data['height'] > 0 && $meta_data['width'] > 0 ) {
						$aspect_ratio = ( $meta_data['height'] / $meta_data['width'] );
						$height       = ( $width * $aspect_ratio );
						$image_size   = [ $width, $height ];
					}
					$image_style = '';
				}

				/**
				 * Filter: 'wpseo_structured_data_blocks_image_size' - Allows adjusting the image size in structured data blocks.
				 *
				 * @since 18.2
				 *
				 * @param string|int[] $image_size     The image size. Accepts any registered image size name, or an array of width and height values in pixels (in that order).
				 * @param int          $attachment_id  The id of the attachment.
				 * @param string       $attachment_src The attachment src.
				 */
				$image_size = \apply_filters(
					'wpseo_structured_data_blocks_image_size',
					$image_size,
					$attachment_id,
					$src_matches[1]
				);
				$image_html = \wp_get_attachment_image(
					$attachment_id,
					$image_size,
					false,
					$image_style
				);

				if ( empty( $image_html ) ) {
					return $matches[0];
				}

				return $image_html;
			},
			$content
		);

		if ( ! $this->registered_shutdown_function ) {
			\register_shutdown_function( [ $this, 'maybe_save_used_caches' ] );
			$this->registered_shutdown_function = true;
		}

		return $content;
	}

	/**
	 * If the caches of structured data block images have been changed, saves them.
	 *
	 * @return void
	 */
	public function maybe_save_used_caches() {
		foreach ( $this->used_caches as $post_id => $used_cache ) {
			if ( isset( $this->caches[ $post_id ] ) && $used_cache === $this->caches[ $post_id ] ) {
				continue;
			}
			\update_post_meta( $post_id, 'yoast-structured-data-blocks-images-cache', $used_cache );
		}
	}

	/**
	 * Converts an attachment src to an attachment ID.
	 *
	 * @param string $src The attachment src.
	 *
	 * @return int The attachment ID. 0 if none was found.
	 */
	private function attachment_src_to_id( $src ) {
		global $post;

		if ( isset( $this->used_caches[ $post->ID ][ $src ] ) ) {
			return $this->used_caches[ $post->ID ][ $src ];
		}

		$cache = $this->get_cache_for_post( $post->ID );
		if ( isset( $cache[ $src ] ) ) {
			$this->used_caches[ $post->ID ][ $src ] = $cache[ $src ];
			return $cache[ $src ];
		}

		$this->used_caches[ $post->ID ][ $src ] = $this->image_helper->get_attachment_by_url( $src );
		return $this->used_caches[ $post->ID ][ $src ];
	}

	/**
	 * Returns the cache from postmeta for a given post.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return array The images cache.
	 */
	private function get_cache_for_post( $post_id ) {
		if ( isset( $this->caches[ $post_id ] ) ) {
			return $this->caches[ $post_id ];
		}

		$cache = \get_post_meta( $post_id, 'yoast-structured-data-blocks-images-cache', true );
		if ( ! $cache ) {
			$cache = [];
		}

		$this->caches[ $post_id ] = $cache;
		return $cache;
	}

	/**
	 * Adds any images that have their ID in the block attributes to the cache.
	 *
	 * @param int    $post_id  The post ID.
	 * @param array  $elements The elements.
	 * @param string $key      The key in the elements we should loop over.
	 *
	 * @return void
	 */
	private function add_images_from_attributes_to_used_cache( $post_id, $elements, $key ) {
		// First grab all image IDs from the attributes.
		$images = [];
		foreach ( $elements as $element ) {
			if ( ! isset( $element[ $key ] ) ) {
				continue;
			}
			foreach ( $element[ $key ] as $part ) {
				if ( ! \is_array( $part ) || ! isset( $part['type'] ) || $part['type'] !== 'img' ) {
					continue;
				}

				if ( ! isset( $part['key'] ) || ! isset( $part['props']['src'] ) ) {
					continue;
				}

				$images[ $part['props']['src'] ] = (int) $part['key'];
			}
		}

		if ( isset( $this->used_caches[ $post_id ] ) ) {
			$this->used_caches[ $post_id ] = \array_merge( $this->used_caches[ $post_id ], $images );
		}
		else {
			$this->used_caches[ $post_id ] = $images;
		}
	}
}
