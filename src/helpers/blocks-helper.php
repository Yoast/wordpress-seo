<?php
/**
 * A helper object for blocks.
 *
 * @package Yoast\WP\Free\Helpers
 */

namespace Yoast\WP\Free\Helpers;

use WP_Block_Parser_Block;

/**
 * Class Blocks_Helper
 */
class Blocks_Helper {

	/**
	 * Returns all blocks in a given post.
	 *
	 * @param int $post_id The post id.
	 *
	 * @return array The blocks in a block-type => WP_Block_Parser_Block[] format.
	 */
	public function get_all_blocks_from_post( $post_id ) {
		if ( ! \function_exists( 'parse_blocks' ) ) {
			return [];
		}

		$post = \get_post( $post_id );
		return $this->get_all_blocks_from_content( $post->post_content );
	}

	/**
	 * Returns all blocks in a given content.
	 *
	 * @param string $content The content.
	 *
	 * @return array The blocks in a block-type => WP_Block_Parser_Block[] format.
	 */
	public function get_all_blocks_from_content( $content ) {
		if ( ! \function_exists( 'parse_blocks' ) ) {
			return [];
		}

		$collection = [];
		$blocks     = \parse_blocks( $content );
		return $this->collect_blocks( $blocks, $collection );
	}

	/**
	 * Collects an array of blocks into an organised collection.
	 *
	 * @param WP_Block_Parser_Block[] $blocks     The blocks.
	 * @param array                   $collection The collection.
	 *
	 * @return array The blocks in a block-type => WP_Block_Parser_Block[] format.
	 */
	private function collect_blocks( $blocks, $collection ) {
		foreach ( $blocks as $block ) {
			if ( ! isset( $collection[ $block['blockName'] ] ) || ! \is_array( $collection[ $block['blockName'] ] ) ) {
				$collection[ $block['blockName'] ] = [];
			}
			$collection[ $block['blockName'] ][] = $block;

			if ( $block['innerBlocks'] ) {
				$collection = $this->collect_blocks( $blocks, $collection );
			}
		}

		return $collection;
	}
}
