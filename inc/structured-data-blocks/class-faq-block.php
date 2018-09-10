<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Structured_Data_Blocks
 */

/**
 * Class WPSEO_FAQ_Block
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

		register_block_type( 'yoast/faq-block', array(
			'render_callback' => array( $this, 'render' ),
		) );
	}

	/**
	 * Renders the block.
	 *
	 * Because we can't save script tags in Gutenberg without sufficient user permissions we render these server-side.
	 *
	 * @param array  $attributes The attributes of the block.
	 * @param string $content    The HTML content of the block.
	 *
	 * @return string The block preceded by it's JSON LD script.
	 */
	public function render( $attributes, $content ) {
		if ( ! is_array( $attributes ) ) {
			return $content;
		}

		$json_ld = $this->get_json_ld( $attributes );

		return '<script type="application/ld+json">' . wp_json_encode( $json_ld ) . '</script>' . $content;
	}

	/**
	 * Returns the JSON LD for a FAQ block in array form.
	 *
	 * @param array $attributes The attributes of the FAQ block.
	 *
	 * @return array The JSON LD representation of the FAQ block in array form.
	 */
	protected function get_json_ld( array $attributes ) {
		$json_ld = array(
			'@context' => 'http://schema.org',
			'@graph'   => array( $this->get_faq_json_ld() ),
		);

		if ( ! is_array( $attributes['questions'] ) ) {
			return $json_ld;
		}

		$questions = array_filter( $attributes['questions'], 'is_array' );
		foreach ( $questions as $question ) {
			$json_ld['@graph'][] = $this->get_question_json_ld( $question );
		}

		return $json_ld;
	}

	/**
	 * Returns the JSON LD for a FAQPage in a faq block in array form.
	 *
	 * @return array The JSON LD representation of the FAQPage in a faq block in array form.
	 */
	protected function get_faq_json_ld() {
		$json_ld = array(
			'@type' => 'FAQPage',
		);

		$post_title = get_the_title();
		if ( ! empty( $post_title ) ) {
			$json_ld['name'] = $post_title;
		}

		return $json_ld;
	}

	/**
	 * Returns the JSON LD for a question in a faq block in array form.
	 *
	 * @param array $question The attributes of a question in the faq block.
	 *
	 * @return array The JSON LD representation of the question in a faq block in array form.
	 */
	protected function get_question_json_ld( array $question ) {
		$json_ld = array(
			'@type' => 'Question',
		);

		if ( ! empty( $question['jsonQuestion'] ) ) {
			$json_ld['name'] = $question['jsonQuestion'];
		}

		if ( ! empty( $question['jsonAnswer'] ) ) {
			$json_ld['answerCount'] = 1;
			$json_ld['acceptedAnswer'] = array(
				'@type' => 'Answer',
				'text'  => $question['jsonAnswer'],
			);

			if ( ! empty( $question['jsonImageSrc'] ) ) {
				$json_ld['acceptedAnswer']['associatedMedia'] = array(
					'@type'      => 'ImageObject',
					'contentUrl' => $question['jsonImageSrc'],
				);
			}
		}

		return $json_ld;
	}
}
