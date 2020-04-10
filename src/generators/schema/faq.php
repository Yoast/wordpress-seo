<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Generators\Schema
 */

namespace Yoast\WP\SEO\Generators\Schema;

/**
 * Returns schema FAQ data.
 */
class FAQ extends Abstract_Schema_Piece {

	/**
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @return bool
	 */
	public function is_needed() {
		if ( empty( $this->context->blocks['yoast/faq-block'] ) ) {
			return false;
		}

		if ( ! \is_array( $this->context->schema_page_type ) ) {
			$this->context->schema_page_type = [ $this->context->schema_page_type ];
		}
		$this->context->schema_page_type[] = 'FAQPage';

		return true;
	}

	/**
	 * Render a list of questions, referencing them by ID.
	 *
	 * @return array $data Our Schema graph.
	 */
	public function generate() {
		$ids             = [];
		$graph           = [];
		$number_of_items = 0;

		foreach ( $this->context->blocks['yoast/faq-block'] as $block ) {
			foreach ( $block['attrs']['questions'] as $index => $question ) {
				if ( ! isset( $question['jsonAnswer'] ) || empty( $question['jsonAnswer'] ) ) {
					continue;
				}
				$ids[]   = [ '@id' => $this->context->canonical . '#' . esc_attr( $question['id'] ) ];
				$graph[] = $this->generate_question_block( $question, $index );
				++$number_of_items;
			}
		}

		\array_unshift( $graph, [
			'@type'            => 'ItemList',
			'mainEntityOfPage' => [ '@id' => $this->context->main_schema_id ],
			'numberOfItems'    => $number_of_items,
			'itemListElement'  => $ids,
		] );

		return $graph;
	}

	/**
	 * Generate a Question piece.
	 *
	 * @param array $question The question to generate schema for.
	 * @param int   $position The position of the question.
	 *
	 * @return array Schema.org Question piece.
	 */
	protected function generate_question_block( $question, $position ) {
		$url = $this->context->canonical . '#' . esc_attr( $question['id'] );

		$data = [
			'@type'          => 'Question',
			'@id'            => $url,
			'position'       => $position,
			'url'            => $url,
			'name'           => $this->helpers->schema->html->smart_strip_tags( $question['jsonQuestion'] ),
			'answerCount'    => 1,
			'acceptedAnswer' => $this->add_accepted_answer_property( $question ),
		];

		$data = $this->helpers->schema->language->add_piece_language( $data );

		return $data;
	}

	/**
	 * Adds the Questions `acceptedAnswer` property.
	 *
	 * @param array $question The question to add the acceptedAnswer to.
	 *
	 * @return array Schema.org Question piece.
	 */
	protected function add_accepted_answer_property( $question ) {
		$data = [
			'@type' => 'Answer',
			'text'  => $this->helpers->schema->html->sanitize( $question['jsonAnswer'] ),
		];

		$data = $this->helpers->schema->language->add_piece_language( $data );

		return $data;
	}
}
