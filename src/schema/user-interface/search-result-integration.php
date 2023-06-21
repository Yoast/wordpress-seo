<?php

namespace Yoast\WP\SEO\Schema\User_Interface;

use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Schema\Application\Generate_Search_Result_Schema_Piece;
use Yoast\WP\SEO\Schema\Application\Generate_Search_Result_Schema_Piece_Handler;

/**
 * Integrates the search action graph piece into the schema graph.
 */
class Search_Result_Integration implements Integration_Interface {

	/**
	 * The current page helper.
	 *
	 * @var Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * The Generate_Search_Result_Schema handler.
	 *
	 * @var Generate_Search_Result_Schema_Piece_Handler
	 */
	private $handler;

	/**
	 * {@inheritDoc}
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class ];
	}

	/**
	 * Search_Result_Integration constructor.
	 *
	 * @param Current_Page_Helper                         $current_page_helper The current page helper class.
	 * @param Generate_Search_Result_Schema_Piece_Handler $handler The generate command handler.
	 */
	public function __construct( Current_Page_Helper $current_page_helper, Generate_Search_Result_Schema_Piece_Handler $handler ) {
		$this->current_page_helper = $current_page_helper;
		$this->handler             = $handler;
	}

	/**
	 * {@inheritDoc}
	 */
	public function register_hooks() {
		\add_filter( 'wpseo_schema_graph_pieces', [ $this, 'add_search_result_schema_piece' ], 10, 2 );
	}

	/**
	 * Integrates a new Schema piece into the graph if we are on a search page.
	 *
	 * @param array $graph The current schema graph.
	 * @param array $context The schema context.
	 *
	 * @return mixed Returns the schema graph
	 */
	public function add_search_result_schema_piece( $graph, $context ) {
		if ( $this->current_page_helper->is_search_result() ) {
			$graph[] = $this->handler->handle( new Generate_Search_Result_Schema_Piece( \get_search_query() ) );
		}

		return $graph;
	}
}

