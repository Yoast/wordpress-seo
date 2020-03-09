<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Presentations\Generators\Schema
 */

namespace Yoast\WP\SEO\Presentations\Generators\Schema;

use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Helpers\Schema\Language_Helper;

/**
 * Returns schema FAQ data.
 *
 * @since 11.3
 */
class FAQ extends Abstract_Schema_Piece {

	/**
	 * The HTML helper.
	 *
	 * @var HTML_Helper
	 */
	private $html;

	/**
	 * The language helper.
	 *
	 * @var Language_Helper
	 */
	private $language;

	/**
	 * Article constructor.
	 *
	 * @param HTML_Helper     $html     The HTML helper.
	 * @param Language_Helper $language The language helper.
	 *
	 * @codeCoverageIgnore Constructor.
	 */
	public function __construct(
		HTML_Helper $html,
		Language_Helper $language
	) {
		$this->html     = $html;
		$this->language = $language;
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
		$number_of_items = 0;

		foreach ( $context->blocks['yoast/faq-block'] as $block ) {
			foreach ( $block['attrs']['questions'] as $index => $question ) {
				if ( ! isset( $question['jsonAnswer'] ) || empty( $question['jsonAnswer'] ) ) {
					continue;
				}
				$ids[]   = [ '@id' => $context->canonical . '#' . esc_attr( $question['id'] ) ];
				$graph[] = $this->generate_question_block( $question, $index, $context );
				$number_of_items++;
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
		$url = $context->canonical . '#' . esc_attr( $question['id'] );

		$data = [
			'@type'          => 'Question',
			'@id'            => $url,
			'position'       => $position,
			'url'            => $url,
			'name'           => $this->html->smart_strip_tags( $question['jsonQuestion'] ),
			'answerCount'    => 1,
			'acceptedAnswer' => $this->add_accepted_answer_property( $question ),
		];

		$data = $this->language->add_piece_language( $data );

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
			'text'  => $this->html->sanitize( $question['jsonAnswer'] ),
		];

		$data = $this->language->add_piece_language( $data );

		return $data;
	}
}
