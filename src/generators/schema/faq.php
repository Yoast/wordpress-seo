<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\Free\Presentations\Generators\Schema
 */

namespace Yoast\WP\Free\Presentations\Generators\Schema;

use Yoast\WP\Free\Context\Meta_Tags_Context;
use Yoast\WP\Free\Helpers\Article_Helper;
use Yoast\WP\Free\Helpers\Schema\HTML_Helper;

/**
 * Returns schema FAQ data.
 *
 * @since 11.3
 */
class FAQ extends Abstract_Schema_Piece {

	/**
	 * @var Article_Helper
	 */
	private $article_helper;

	/**
	 * @var HTML_Helper
	 */
	private $html_helper;

	/**
	 * Article constructor.
	 *
	 * @param Article_Helper $article_helper The article helper.
	 * @param HTML_Helper    $html_helper    The HTML helper.
	 */
	public function __construct(
		Article_Helper $article_helper,
		HTML_Helper $html_helper
	) {
		$this->article_helper = $article_helper;
		$this->html_helper    = $html_helper;
	}

	/**
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return bool
	 */
	public function is_needed( Meta_Tags_Context $context ) {
		if ( empty( $context->blocks['yoast/faq-block'] ) ) {
			return false;
		}

		if ( ! \is_array( $context->schema_page_type ) ) {
			$context->schema_page_type = [ $context->schema_page_type ];
		}
		$context->schema_page_type[] = 'FAQPage';

		return true;
	}

	/**
	 * Render a list of questions, referencing them by ID.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return array $data Our Schema graph.
	 */
	public function generate( Meta_Tags_Context $context ) {
		$ids   = [];
		$graph = [];
		$number_of_blocks = count( $context->blocks['yoast/faq-block'] );
		$number_of_items = 0;

		for ( $block_number = 0; $block_number < $number_of_blocks; $block_number++ ) {
			foreach ( $context->blocks['yoast/faq-block'][ $block_number ]['attrs']['questions'] as $index => $question ) {
				if ( ! isset( $question['jsonAnswer'] ) || empty( $question['jsonAnswer'] ) ) {
					continue;
				}
				$ids[]   = [ '@id' => $context->canonical . '#' . $question['id'] ];
				$graph[] = $this->generate_question_block( $question, $index, $context );
				$number_of_items = count( $context->blocks['yoast/faq-block'][ $block_number ]['attrs']['questions'] );
			}
		}

		\array_unshift(
			$graph,
			[
				'@type'            => 'ItemList',
				'mainEntityOfPage' => [ '@id' => $context->main_schema_id ],
				'numberOfItems'    => $number_of_items,
				'itemListElement'  => $ids,
			]
		);

		return $graph;
	}

	/**
	 * Generate a Question piece.
	 *
	 * @param array             $question The question to generate schema for.
	 * @param int               $position The position of the question.
	 * @param Meta_Tags_Context $context  The meta tags context.
	 *
	 * @return array Schema.org Question piece.
	 */
	protected function generate_question_block( $question, $position, Meta_Tags_Context $context ) {
		return [
			'@type'          => 'Question',
			'@id'            => $context->canonical . '#' . $question['id'],
			'position'       => $position,
			'url'            => $context->canonical . '#' . $question['id'],
			'name'           => \strip_tags( $question['jsonQuestion'] ),
			'answerCount'    => 1,
			'acceptedAnswer' => [
				'@type' => 'Answer',
				'text'  => $this->html_helper->sanitize( $question['jsonAnswer'] ),
			],
		];
	}
}
