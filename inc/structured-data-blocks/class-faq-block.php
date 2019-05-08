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

		$json_ld = $this->get_json_ld( $attributes );

		$schema = array(
			'@context' => 'https://schema.org',
			'@graph'   => array( $json_ld ),
		);

		return WPSEO_Utils::schema_tag( $schema ) . $content;
	}

	/**
	 * Returns the JSON-LD for a FAQ block in array form.
	 *
	 * @param array $attributes The attributes of the FAQ block.
	 *
	 * @return array The JSON-LD representation of the FAQ block in array form.
	 */
	protected function get_json_ld( array $attributes ) {
		$hash = WPSEO_Schema_IDs::WEBPAGE_HASH;
		if ( WPSEO_Schema_Article::is_article_post_type() ) {
			$hash = WPSEO_Schema_IDs::ARTICLE_HASH;
		}

		$json_ld = array(
			'@type'            => 'FAQPage',
			'mainEntityOfPage' => array( '@id' => WPSEO_Frontend::get_instance()->canonical( false ) . $hash ),
		);

		$post_title = get_the_title();
		if ( ! empty( $post_title ) ) {
			$json_ld['name'] = $post_title;
		}

		if ( ! array_key_exists( 'questions', $attributes ) || ! is_array( $attributes['questions'] ) ) {
			return $json_ld;
		}

		$main_entity = array();

		$questions = array_filter( $attributes['questions'], 'is_array' );
		foreach ( $questions as $question ) {
			$main_entity[] = $this->get_question_json_ld( $question );
		}

		$json_ld['mainEntity'] = $main_entity;

		return $json_ld;
	}

	/**
	 * Returns the JSON-LD for a question in a FAQ block in array form.
	 *
	 * @param array $question The attributes of a question in the FAQ block.
	 *
	 * @return array The JSON-LD representation of the question in a FAQ block in array form.
	 */
	protected function get_question_json_ld( array $question ) {
		$json_ld = array(
			'@type' => 'Question',
		);

		if ( ! empty( $question['jsonQuestion'] ) ) {
			$json_ld['name'] = $question['jsonQuestion'];
		}

		if ( ! empty( $question['jsonAnswer'] ) ) {
			$json_ld['answerCount']    = 1;
			$json_ld['acceptedAnswer'] = array(
				'@type' => 'Answer',
				'text'  => $question['jsonAnswer'],
			);

			if ( ! empty( $question['jsonImageSrc'] ) ) {
				$json_ld['acceptedAnswer']['image'] = array(
					'@type'      => 'ImageObject',
					'contentUrl' => $question['jsonImageSrc'],
				);
			}
		}

		return $json_ld;
	}
}
