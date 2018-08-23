<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Structured_Data_Blocks
 */

/**
 * Class WPSEO_How_To_Block
 */
class WPSEO_How_To_Block implements WPSEO_WordPress_Integration {
	/**
	 * Registers the how-to block as a server-side rendered block.
	 *
	 * @return void
	 */
	public function register_hooks() {
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		register_block_type( 'yoast/how-to-block', array(
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
	 * @return string The block preceded by its JSON LD script.
	 */
	public function render( $attributes, $content ) {
		if ( ! is_array( $attributes ) ) {
			return $content;
		}

		$json_ld = $this->get_json_ld( $attributes );

		return '<script type="application/ld+json">' . wp_json_encode( $json_ld ) . '</script>' . $content;
	}

	/**
	 * Returns the JSON LD for a how-to block in array form.
	 *
	 * @param array $attributes The attributes of the how-to block.
	 *
	 * @return array The JSON LD representation of the how-to block in array form.
	 */
	protected function get_json_ld( array $attributes ) {
		$json_ld = array(
			'@context' => 'http://schema.org',
			'@type'    => 'HowTo',
		);

		if ( ! empty( $attributes['jsonTitle'] ) ) {
			$json_ld['name'] = $attributes['jsonTitle'];
		}

		if ( ! empty( $attributes['hasDuration'] ) && $attributes['hasDuration'] === true ) {
			$hours   = empty( $attributes['hours'] ) ? 0 : $attributes['hours'];
			$minutes = empty( $attributes['minutes'] ) ? 0 : $attributes['minutes'];

			if ( $hours !== 0 || $minutes !== 0 ) {
				$json_ld['totalTime'] = 'PT' . $hours . 'H' . $minutes . 'M';
			}
		}

		if ( ! empty( $attributes['jsonDescription'] ) ) {
			$json_ld['description'] = $attributes['jsonDescription'];
		}

		if ( ! empty( $attributes['steps'] ) && is_array( $attributes['steps'] ) ) {
			$json_ld['step'] = array();
			$steps = array_filter( $attributes['steps'], 'is_array' );
			foreach ( $steps as $index => $step ) {
				$json_ld['step'][] = $this->get_step_json_ld( $step, $index );
			}
		}

		return $json_ld;
	}

	/**
	 * Returns the JSON LD for a step in a how-to block in array form.
	 *
	 * @param array $step  The attributes of a step in the how-to block.
	 * @param int   $index The index of the step in the how-to block.
	 *
	 * @return array The JSON LD representation of the step in a how-to block in array form.
	 */
	protected function get_step_json_ld( array $step, $index ) {
		$step_json_ld = array(
			'@type'    => 'HowToStep',
			'position' => $index + 1,
		);

		if ( ! empty( $step['jsonContents'] ) ) {
			$step_json_ld['text'] = $step['jsonContents'];
		}

		if ( ! empty( $step['jsonImageSrc'] ) ) {
			$step_json_ld['associatedMedia'] = array(
				'@type'      => 'ImageObject',
				'contentUrl' => $step['jsonImageSrc'],
			);
		}

		return $step_json_ld;
	}
}
