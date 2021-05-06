<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Generators\Schema\HowTo;

/**
 * Returns schema FAQ data.
 *
 * @since      11.5
 * @deprecated 14.0
 */
class WPSEO_Schema_HowTo extends WPSEO_Deprecated_Graph_Piece {

	/**
	 * The HowTo blocks count on the current page.
	 *
	 * @var int
	 */
	private $counter = 0;

	/**
	 * WPSEO_Schema_FAQ constructor.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @param null $context The context. No longer used but present for BC.
	 */
	public function __construct( $context = null ) {
		parent::__construct( HowTo::class );
	}

	/**
	 * Renders the How-To block into our graph.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @param array $graph Our Schema data.
	 * @param array $block The How-To block content.
	 *
	 * @return mixed
	 */
	public function render( $graph, $block ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\HowTo::add_how_to' );

		++$this->counter;
		$this->add_how_to( $graph, $block, $this->counter );

		return $graph;
	}

	/**
	 * Generates the HowTo schema for a block.
	 *
	 * @param array $graph Our Schema data.
	 * @param array $block The How-To block content.
	 * @param int   $index The index of the current block.
	 */
	protected function add_how_to( &$graph, $block, $index ) {
		$data = [
			'@type'            => 'HowTo',
			'@id'              => $this->stable->context->canonical . '#howto-' . ( $index + 1 ),
			'name'             => $this->helpers->schema->html->smart_strip_tags( $this->helpers->post->get_post_title_with_fallback( $this->stable->context->id ) ),
			'mainEntityOfPage' => [ '@id' => $this->stable->context->main_schema_id ],
			'description'      => '',
		];

		if ( isset( $block['attrs']['jsonDescription'] ) ) {
			$data['description'] = $this->helpers->schema->html->sanitize( $block['attrs']['jsonDescription'] );
		}

		$this->add_duration( $data, $block['attrs'] );
		$this->add_steps( $data, $block['attrs']['steps'] );

		$data = $this->helpers->schema->language->add_piece_language( $data );

		$graph[] = $data;
	}

	/**
	 * Adds the steps to our How-To output.
	 *
	 * @param array $data  Our How-To schema data.
	 * @param array $steps Our How-To block's steps.
	 */
	private function add_steps( &$data, $steps ) {
		foreach ( $steps as $step ) {
			$schema_id   = $this->stable->context->canonical . '#' . esc_attr( $step['id'] );
			$schema_step = [
				'@type' => 'HowToStep',
				'url'   => $schema_id,
			];

			if ( isset( $step['jsonText'] ) ) {
				$json_text = $this->helpers->schema->html->sanitize( $step['jsonText'] );
			}

			if ( isset( $step['jsonName'] ) ) {
				$json_name = $this->helpers->schema->html->smart_strip_tags( $step['jsonName'] );
			}

			if ( empty( $json_name ) ) {
				if ( empty( $step['text'] ) ) {
					continue;
				}

				$schema_step['text'] = '';

				$this->add_step_image( $schema_step, $step );

				// If there is no text and no image, don't output the step.
				if ( empty( $json_text ) && empty( $schema_step['image'] ) ) {
					continue;
				}

				if ( ! empty( $json_text ) ) {
					$schema_step['text'] = $json_text;
				}
			}

			elseif ( empty( $json_text ) ) {
				$schema_step['text'] = $json_name;
			}
			else {
				$schema_step['name'] = $json_name;

				$schema_step['itemListElement'] = [
					[
						'@type' => 'HowToDirection',
						'text'  => $json_text,
					],
				];

				$this->add_step_description( $schema_step, $json_text );
				$this->add_step_image( $schema_step, $step );
			}

			$data['step'][] = $schema_step;
		}
	}

	/**
	 * Adds the duration of the task to the Schema.
	 *
	 * @param array $data       Our How-To schema data.
	 * @param array $attributes The block data attributes.
	 */
	private function add_duration( &$data, $attributes ) {
		if ( empty( $attributes['hasDuration'] ) ) {
			return;
		}

		$days    = empty( $attributes['days'] ) ? 0 : $attributes['days'];
		$hours   = empty( $attributes['hours'] ) ? 0 : $attributes['hours'];
		$minutes = empty( $attributes['minutes'] ) ? 0 : $attributes['minutes'];

		if ( ( $days + $hours + $minutes ) > 0 ) {
			$data['totalTime'] = esc_attr( 'P' . $days . 'DT' . $hours . 'H' . $minutes . 'M' );
		}
	}

	/**
	 * Determines whether we're part of an article or a webpage.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @return string A reference URL.
	 */
	protected function get_main_schema_id() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return $this->stable->context->main_schema_id;
	}

	/**
	 * Checks if we have a step description, if we do, add it.
	 *
	 * @param array  $schema_step Our Schema output for the Step.
	 * @param string $json_text   The step text.
	 */
	private function add_step_description( &$schema_step, $json_text ) {
		$schema_step['itemListElement'] = [
			[
				'@type' => 'HowToDirection',
				'text'  => $json_text,
			],
		];
	}

	/**
	 * Checks if we have a step image, if we do, add it.
	 *
	 * @param array $schema_step Our Schema output for the Step.
	 * @param array $step        The step block data.
	 */
	private function add_step_image( &$schema_step, $step ) {
		foreach ( $step['text'] as $line ) {
			if ( is_array( $line ) && isset( $line['type'] ) && $line['type'] === 'img' ) {
				$schema_step['image'] = $this->get_image_schema( esc_url( $line['props']['src'] ) );
			}
		}
	}

	/**
	 * Generates the image schema from the attachment $url.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @param string $url Attachment url.
	 *
	 * @return array Image schema.
	 */
	protected function get_image_schema( $url ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\HowTo::get_image_schema' );

		$schema_id = $this->stable->context->canonical . '#schema-image-' . md5( $url );

		return $this->helpers->schema->image->generate_from_url( $schema_id, $url );
	}
}
