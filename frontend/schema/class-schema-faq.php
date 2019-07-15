<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Returns schema FAQ data.
 *
 * @since 11.3
 */
class WPSEO_Schema_FAQ implements WPSEO_Graph_Piece {

	/**
	 * Determine whether this graph piece is needed or not.
	 *
	 * @var bool
	 */
	private $is_needed = false;

	/**
	 * The FAQ blocks on the current page.
	 *
	 * @var array
	 */
	private $blocks;

	/**
	 * A value object with context variables.
	 *
	 * @var WPSEO_Schema_Context
	 */
	private $context;

	/**
	 * WPSEO_Schema_FAQ constructor.
	 *
	 * @param WPSEO_Schema_Context $context A value object with context variables.
	 */
	public function __construct( WPSEO_Schema_Context $context ) {
		$this->context = $context;

		add_action( 'wpseo_pre_schema_block_type_yoast/faq-block', array( $this, 'prepare_schema' ), 10, 1 );
		add_filter( 'wpseo_schema_block_yoast/faq-block', array( $this, 'render_schema_questions' ), 10, 3 );
	}

	/**
	 * If this fires, we know there's an FAQ block ont he page, so filter the page type.
	 *
	 * @param array $blocks The blocks of this type on the current page.
	 */
	public function prepare_schema( $blocks ) {
		$this->blocks    = $blocks;
		$this->is_needed = true;
		add_filter( 'wpseo_schema_webpage_type', array( $this, 'change_schema_page_type' ) );
	}

	/**
	 * Change the page type to an array if it isn't one, include FAQPage.
	 *
	 * @param array|string $page_type The page type.
	 *
	 * @return array $page_type The page type that's now an array.
	 */
	public function change_schema_page_type( $page_type ) {
		if ( ! is_array( $page_type ) ) {
			$page_type = array( $page_type );
		}
		$page_type[] = 'FAQPage';

		return $page_type;
	}

	/**
	 * Render a list of questions, referencing them by ID.
	 *
	 * @return array $data Our Schema graph.
	 */
	public function generate() {
		$question_list = new WPSEO_Schema_FAQ_Question_List( $this->blocks, $this->context );
		$graph         = $question_list->generate();

		return $graph;
	}

	/**
	 * Add the Questions in our FAQ blocks as separate pieces to the graph.
	 *
	 * @param array                 $graph   Schema data for the current page.
	 * @param WP_Block_Parser_Block $block   The block data array.
	 * @param WPSEO_Schema_Context  $context A value object with context variables.
	 *
	 * @return array $data Our Schema graph.
	 */
	public function render_schema_questions( $graph, $block, $context ) {
		$questions = new WPSEO_Schema_FAQ_Questions( $graph, $block, $context );
		$graph     = $questions->generate();

		return $graph;
	}

	/**
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @return bool
	 */
	public function is_needed() {
		return $this->is_needed;
	}
}
