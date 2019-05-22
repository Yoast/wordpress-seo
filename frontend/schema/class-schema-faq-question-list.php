<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Returns a question object for each question in an FAQ block.
 *
 * @since 11.1
 *
 * @property array                   $data   The Schema array.
 * @property WP_Block_Parser_Block[] $blocks The block we're taking the questions out of.
 * @property WPSEO_Schema_Context    context A value object with context variables.
 * @property array                   ids
 * @property int                     count
 */
class WPSEO_Schema_FAQ_Question_List {
	/**
	 * The Schema array.
	 *
	 * @var array
	 */
	private $data;
	/**
	 * All the blocks of this block-type.
	 *
	 * @var WP_Block_Parser_Block
	 */
	private $blocks;
	/**
	 * Number of questions on the page.
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
	 * WPSEO_Schema_Breadcrumb constructor.
	 *
	 * @param array                   $data    Our schema graph.
	 * @param WP_Block_Parser_Block[] $blocks  An array of the FAQ blocks on this page.
	 * @param WPSEO_Schema_Context    $context A value object with context variables.
	 */
	public function __construct( $data, $blocks, $context ) {
		$this->data    = $data;
		$this->blocks  = $blocks;
		$this->context = $context;
		$this->count   = 1;
	}

	/**
	 * Find an image based on its URL and generate a Schema object for it.
	 *
	 * @return array The Schema with a question list added.
	 */
	public function generate() {
		$this->prepare_questions();

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
		if ( WPSEO_Schema_Article::is_article_post_type() ) {
			return $this->context->canonical . WPSEO_Schema_IDs::ARTICLE_HASH;
		}

		return $this->context->canonical . WPSEO_Schema_IDs::WEBPAGE_HASH;
	}

	/**
	 * Prepare our data.
	 */
	private function prepare_questions() {
		foreach ( $this->blocks as $block ) {
			foreach ( $block['attrs']['questions'] as $question ) {
				$this->count ++;
				$this->ids[] = array( '@id' => $this->context->canonical . '#' . $question['id'] );
			}
		}
	}
}
