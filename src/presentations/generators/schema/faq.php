<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\Free\Presentations\Generators\Schema
 */

namespace Yoast\WP\Free\Presentations\Generators\Schema;

use Yoast\WP\Free\Helpers\Current_Page_Helper;
use Yoast\WP\Free\Helpers\Schema\Context_Helper;
use Yoast\WP\Free\Helpers\Schema\FAQ_Question_List_Helper;
use Yoast\WP\Free\Helpers\Schema\FAQ_Questions_Helper;
use Yoast\WP\Free\Helpers\Schema\ID_Helper;

/**
 * Returns schema FAQ data.
 *
 * @since 11.3
 */
class FAQ extends Abstract_Schema_Piece {

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
	 * FAQ constructor.
	 *
	 * @param Context_Helper      $context A value object with context variables.
	 * @param ID_Helper           $id_helper
	 * @param Current_Page_Helper $current_page_helper
	 */
	public function __construct(
		Context_Helper $context,
		ID_Helper $id_helper,
		Current_Page_Helper $current_page_helper
	) {
		parent::__construct( $context, $id_helper, $current_page_helper );

		\add_action( 'wpseo_pre_schema_block_type_yoast/faq-block', array( $this, 'prepare_schema' ), 10, 1 );
		\add_filter( 'wpseo_schema_block_yoast/faq-block', array( $this, 'render_schema_questions' ), 10, 2 );
	}

	/**
	 * If this fires, we know there's an FAQ block ont he page, so filter the page type.
	 *
	 * @param array $blocks The blocks of this type on the current page.
	 */
	public function prepare_schema( $blocks ) {
		$this->blocks    = $blocks;
		$this->is_needed = true;
		\add_filter( 'wpseo_schema_webpage_type', array( $this, 'change_schema_page_type' ) );
	}

	/**
	 * Change the page type to an array if it isn't one, include FAQPage.
	 *
	 * @param array|string $page_type The page type.
	 *
	 * @return array $page_type The page type that's now an array.
	 */
	public function change_schema_page_type( $page_type ) {
		if ( ! \is_array( $page_type ) ) {
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
		$question_list = new FAQ_Question_List_Helper( $this->context, $this->id_helper);
		$graph         = $question_list->generate( $this->blocks );

		return $graph;
	}

	/**
	 * Add the Questions in our FAQ blocks as separate pieces to the graph.
	 *
	 * @param array                 $graph   Schema data for the current page.
	 * @param \WP_Block_Parser_Block $block   The block data array.
	 *
	 * @return array $data Our Schema graph.
	 */
	public function render_schema_questions( $graph, $block ) {
		$questions = new FAQ_Questions_Helper( $this->context );
		$graph     = $questions->generate( $graph, $block );

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
