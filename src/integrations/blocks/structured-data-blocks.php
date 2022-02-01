<?php

namespace Yoast\WP\SEO\Integrations\Blocks;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
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
	 * Structured_Data_Blocks constructor.
	 *
	 * @param WPSEO_Admin_Asset_Manager $asset_manager The asset manager.
	 */
	public function __construct( WPSEO_Admin_Asset_Manager $asset_manager ) {
		$this->asset_manager = $asset_manager;
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
	 * @param array  $data    The data from the attributes.
	 * @param string $key     The key in the data to iterate over.
	 * @param string $content The content.
	 *
	 * @return string The content with images optimized.
	 */
	private function optimize_images( $data, $key, $content ) {
		// First grab all image IDs from the attributes.
		$images = [];
		foreach ( $data as $question ) {
			if ( ! isset( $question[ $key ] ) ) {
				continue;
			}
			foreach ( $question[ $key ] as $part ) {
				if ( ! \is_array( $part ) || ! isset( $part['type'] ) || $part['type'] !== 'img' ) {
					continue;
				}

				if ( ! isset( $part['key'] ) || ! isset( $part['props']['src'] ) ) {
					continue;
				}

				$images[ $part['props']['src'] ] = (int) $part['key'];
			}
		}

		// Then replace all images with optimized versions in the content.
		$content = \preg_replace_callback(
			'/<img[^>]+>/',
			function ( $matches ) use ( $images ) {
				preg_match( '/src="([^"]+)"/', $matches[0], $src_matches );
				if ( ! $src_matches || ! isset( $src_matches[1] ) || ! isset( $images[ $src_matches[1] ] ) ) {
					return $matches[0];
				}
				return \wp_get_attachment_image( $images[ $src_matches[1] ], 'full' );
			},
			$content
		);

		return $content;
	}
}
