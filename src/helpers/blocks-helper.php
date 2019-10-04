<?php
/**
 * A helper object for blocks.
 *
 * @package Yoast\WP\Free\Helpers
 */

namespace Yoast\WP\Free\Helpers;

use WP_Block_Parser_Block;

class Blocks_Helper {

	/**
	 * @param $post_id
	 *
	 * @return array
	 */
	public function get_all_blocks_from_post( $post_id ) {
		if ( ! \function_exists( 'parse_blocks' ) ) {
			return [];
		}

		$post = \get_post( $post_id );
		return $this->get_all_blocks_from_content( $post->post_content );
	}

	/**
	 * @param $content
	 *
	 * @return array
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
	 * @param WP_Block_Parser_Block[] $blocks
	 * @param $collection
	 */
	private function collect_blocks( $blocks, $collection ) {
		foreach ( $blocks as $block ) {
			if ( ! isset( $collection[ $block['blockName'] ] ) || ! \is_array( $collection[ $block['blockName'] ] ) ) {
				$collection[ $block['blockName'] ] = array();
			}
			$collection[ $block['blockName'] ][] = $block;

			if ( $block->innerBlocks ) {
				$collection = $this->collect_blocks( $blocks, $collection );
			}
		}

		return $collection;
	}
}
