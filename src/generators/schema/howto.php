<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\Free\Presentations\Generators\Schema
 */

namespace Yoast\WP\Free\Presentations\Generators\Schema;

use Yoast\WP\Free\Context\Meta_Tags_Context;
use Yoast\WP\Free\Helpers\Schema\Image_Helper;

/**
 * Returns schema FAQ data.
 *
 * @since 11.5
 */
class HowTo extends Abstract_Schema_Piece {

	/**
	 * Holds the allowed HTML tags for the jsonText.
	 *
	 * @var string
	 */
	private $allowed_json_text_tags = '<h1><h2><h3><h4><h5><h6><br><ol><ul><li><a><p><b><strong><i><em>';

	/**
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return bool
	 */
	public function is_needed( Meta_Tags_Context $context ) {
		return ! empty( $context->blocks[ 'yoast/how-to-block' ] );
	}

	/**
	 * Renders a list of questions, referencing them by ID.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return array $data Our Schema graph.
	 */
	public function generate( Meta_Tags_Context $context ) {
		$graph = [];

		foreach ( $context->blocks[ 'yoast/how-to-block' ] as $index => $block ) {
			$data = [
				'@type'            => 'HowTo',
				'@id'              => $context->canonical . '#howto-' . $index,
				'name'             => $context->title,
				'mainEntityOfPage' => array( '@id' => $context->main_schema_id ),
				'description'      => '',
			];

			$json_description = \strip_tags( $block['attrs']['jsonDescription'], '<h1><h2><h3><h4><h5><h6><br><ol><ul><li><a><p><b><strong><i><em>' );

			if ( isset( $json_description ) ) {
				$data['description'] = $json_description;
			}

			$this->add_duration( $data, $block['attrs'] );
			$this->add_steps( $data, $block['attrs']['steps'], $context );

			$graph[] = $data;
		}

		return $graph;
	}

	/**
	 * Adds the duration of the task to the Schema.
	 *
	 * @param array $data       Our How-To schema data.
	 * @param array $attributes The block data attributes.
	 */
	private function add_duration( &$data, $attributes ) {
		if ( ! empty( $attributes['hasDuration'] ) && $attributes['hasDuration'] ) {
			$days    = empty( $attributes['days'] ) ? 0 : $attributes['days'];
			$hours   = empty( $attributes['hours'] ) ? 0 : $attributes['hours'];
			$minutes = empty( $attributes['minutes'] ) ? 0 : $attributes['minutes'];

			if ( ( $days + $hours + $minutes ) > 0 ) {
				$data['totalTime'] = 'P' . $days . 'DT' . $hours . 'H' . $minutes . 'M';
			}
		}
	}

	/**
	 * Adds the steps to our How-To output.
	 *
	 * @param array             $data    Our How-To schema data.
	 * @param array             $steps   Our How-To block's steps.
	 * @param Meta_Tags_Context $context The meta tags context.
	 */
	private function add_steps( &$data, $steps, Meta_Tags_Context $context ) {
		foreach ( $steps as $step ) {
			$schema_id   = $context->canonical . '#' . $step['id'];
			$schema_step = array(
				'@type' => 'HowToStep',
				'url'   => $schema_id,
			);

			$json_text = \strip_tags( $step['jsonText'], $this->allowed_json_text_tags );
			$json_name = \strip_tags( $step['jsonName'] );

			if ( empty( $json_name ) ) {
				if ( empty( $step['text'] ) ) {
					continue;
				}

				$schema_step['text'] = '';

				$this->add_step_image( $schema_step, $step, $context );

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

				$this->add_step_description( $schema_step, $step );
				$this->add_step_image( $schema_step, $step, $context );
			}

			$data['step'][] = $schema_step;
		}
	}

	/**
	 * Checks if we have a step description, if we do, add it.
	 *
	 * @param array $schema_step Our Schema output for the Step.
	 * @param array $step        The step block data.
	 */
	private function add_step_description( &$schema_step, $step ) {
		$json_text = \strip_tags( $step['jsonText'], $this->allowed_json_text_tags );

		if ( empty( $json_text ) ) {
			return;
		}

		$schema_step['itemListElement'] = array();

		$schema_step['itemListElement'][] = array(
			'@type' => 'HowToDirection',
			'text'  => $json_text,
		);
	}

	/**
	 * Checks if we have a step image, if we do, add it.
	 *
	 * @param array             $schema_step Our Schema output for the Step.
	 * @param array             $step        The step block data.
	 * @param Meta_Tags_Context $context     The meta tags context.
	 */
	private function add_step_image( &$schema_step, $step, Meta_Tags_Context $context ) {
		foreach ( $step['text'] as $line ) {
			if ( \is_array( $line ) && isset( $line['type'] ) && $line['type'] === 'img' ) {
				$schema_step['image'] = $this->get_image_schema( $line['props']['src'], $context );
			}
		}
	}

	/**
	 * Generates the image schema from the attachment $url.
	 *
	 * @param string            $url     Attachment url.
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return array Image schema.
	 *
	 * @codeCoverageIgnore
	 */
	protected function get_image_schema( $url, Meta_Tags_Context $context ) {
		$schema_id = $context->canonical . '#schema-image-' . \md5( $url );

		return Image_Helper::generate_from_url( $schema_id, $url );
	}
}
