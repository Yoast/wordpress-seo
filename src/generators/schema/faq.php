<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\Free\Presentations\Generators\Schema
 */

namespace Yoast\WP\Free\Presentations\Generators\Schema;

use Yoast\WP\Free\Context\Meta_Tags_Context;
use Yoast\WP\Free\Helpers\Article_Helper;

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
	 * Article constructor.
	 *
	 * @param Article_Helper $article_helper
	 */
	public function __construct( Article_Helper $article_helper ) {
		$this->article_helper = $article_helper;
	}

	/**
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @return bool
	 */
	public function is_needed( Meta_Tags_Context $context ) {
		$needed = empty( $context->blocks[ 'yoast/faq-block' ] );

		if ( $needed ) {
			if ( ! \is_array( $context->schema_page_type ) ) {
				$context->schema_page_type = [ $context->schema_page_type ];
			}
			$context->schema_page_type[] = 'FAQPage';
		}

		return $needed;
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
		foreach ( $context->blocks[ 'yoast/faq-block' ][ 'attrs' ][ 'questions' ] as $index => $question ) {
			if ( ! isset( $question['jsonAnswer'] ) || empty( $question['jsonAnswer'] ) ) {
				continue;
			}
			$ids[]   = [ '@id' => $context->canonical . '#' . $question['id'] ];
			$graph[] = $this->generate_question_block( $question, $index, $context );
		}

		\array_unshift(
			$graph,
			[
				'@type'            => 'ItemList',
				'mainEntityOfPage' => [ '@id' => $context->main_schema_id ],
				'numberOfItems'    => count( $context->blocks[ 'yoast/faq-block' ][ 'attrs' ][ 'questions' ] ),
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
			'name'           => strip_tags( $question['jsonQuestion'] ),
			'answerCount'    => 1,
			'acceptedAnswer' => [
				'@type' => 'Answer',
				'text'  => strip_tags( $question['jsonAnswer'], '<h1><h2><h3><h4><h5><h6><br><ol><ul><li><a><p><b><strong><i><em>' ),
			],
		];
	}
}
