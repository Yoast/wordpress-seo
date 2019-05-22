<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Structured_Data_Blocks
 */

/**
 * Class WPSEO_FAQ_Block.
 */
class WPSEO_FAQ_Block implements WPSEO_WordPress_Integration {
	/**
	 * Registers the how-to block as a server-side rendered block.
	 *
	 * @return void
	 */
	public function register_hooks() {
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		register_block_type(
			'yoast/faq-block',
			array( 'render_callback' => array( $this, 'render' ) )
		);

		add_action( 'yoast/pre-schema/block-type/yoast/faq-block', array( $this, 'prepare_schema' ), 10 );
		add_filter( 'yoast/schema/block-type/yoast/faq-block', array( $this, 'render_schema_list' ), 10, 3 );
		add_filter( 'yoast/schema/block/yoast/faq-block', array( $this, 'render_schema_questions' ), 10, 3 );
	}

	/**
	 * If this fires, we know there's an FAQ block ont he page, so filter the page type.
	 */
	public function prepare_schema() {
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
	 * @param array                   $graph   Schema data for the current page.
	 * @param WP_Block_Parser_Block[] $blocks  The block data array.
	 * @param WPSEO_Schema_Context    $context A value object with context variables.
	 *
	 * @return array $data Our Schema graph.
	 */
	public function render_schema_list( $graph, $blocks, $context ) {
		$question_list = new WPSEO_Schema_FAQ_Question_List( $graph, $blocks, $context );
		$graph         = $question_list->generate();

		return $graph;
	}

	/**
	 * Change Schema output based on block.
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
	 * Renders the block.
	 *
	 * Because we can't save script tags in Gutenberg without sufficient user permissions,
	 * we render these server-side.
	 *
	 * @param array  $attributes The attributes of the block.
	 * @param string $content    The HTML content of the block.
	 *
	 * @return string The block preceded by its JSON-LD script.
	 */
	public function render( $attributes, $content ) {
		if ( ! is_array( $attributes ) || ! is_singular() ) {
			return $content;
		}

		return $content;
	}
}
