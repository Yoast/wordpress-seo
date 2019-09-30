<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\Free\Helpers\Schema
 */

namespace Yoast\WP\Free\Helpers\Schema;

use WP_Block_Parser_Block;

/**
 * Returns a question object for each question in an FAQ block.
 *
 * @since 11.1
 *
 * @property array                   $data     The Schema array.
 * @property WP_Block_Parser_Block[] $blocks   The block we're taking the questions out of.
 * @property Context_Helper          context   A value object with context variables.
 * @property ID_Helper               id_helper A value object with context variables.
 * @property array                   ids
 * @property int                     count
 */
class FAQ_Question_List_Helper {

	/**
	 * The Schema array.
	 *
	 * @var array
	 */
	private $data = array();

	/**
	 * All the blocks of this block-type.
	 *
	 * @var WP_Block_Parser_Block[]
	 */
	private $blocks;

	/**
	 * Number of questions on the page.
	 *
	 * @var int
	 */
	private $count;

	/**
	 * IDs of the questions on the page.
	 *
	 * @var array
	 */
	private $ids;

	/**
	 * @var ID_Helper
	 */
	private $id_helper;

	/**
	 * FAQ_Question_List_Helper constructor.
	 *
	 * @param Context_Helper $context A value object with context variables.
	 * @param ID_Helper      $id_helper
	 */
	public function __construct(
		Context_Helper $context,
		ID_Helper $id_helper
	) {
		$this->context   = $context;
		$this->id_helper = $id_helper;
		$this->count     = 1;
	}

	/**
	 * Find an image based on its URL and generate a Schema object for it.
	 *
	 * @param $blocks
	 *
	 * @return array The Schema with a question list added.
	 */
	public function generate( $blocks ) {
		$this->blocks = $blocks;
		$this->prepare_blocks();

		$this->data[] = array(
			'@type'            => 'ItemList',
			'mainEntityOfPage' => array( '@id' => $this->get_schema_id() ),
			'numberOfItems'    => $this->count,
			'itemListElement'  => $this->ids,
		);

		return $this->data;
	}

	/**
	 * Determine whether we're part of an article or a webpage.
	 *
	 * @return string A reference URL.
	 */
	private function get_schema_id() {
		if ( $this->context->site_represents !== false && Article_Post_Type_Helper::is_article_post_type() ) {
			return $this->context->canonical . $this->id_helper->article_hash;
		}

		return $this->context->canonical . $this->id_helper->webpage_hash;
	}

	/**
	 * Loop through the blocks of our type.
	 */
	private function prepare_blocks() {
		foreach ( $this->blocks as $block ) {
			$this->prepare_questions( $block );
		}
	}

	/**
	 * Prepare our data.
	 *
	 * @param WP_Block_Parser_Block $block The block to prepare the questions for.
	 */
	private function prepare_questions( $block ) {
		foreach ( $block['attrs']['questions'] as $question ) {
			if ( ! isset( $question['jsonAnswer'] ) || empty( $question['jsonAnswer'] ) ) {
				continue;
			}
			$this->count ++;
			$this->ids[] = array( '@id' => $this->context->canonical . '#' . $question['id'] );
		}
	}
}
