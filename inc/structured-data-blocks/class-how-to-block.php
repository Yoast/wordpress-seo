<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Structured_Data_Blocks
 */

class WPSEO_How_To_Block {
	/**
	 * Registers the how-to block as a server-side rendered block.
	 *
	 * @return void
	 */
	public static function register() {
		if ( function_exists( 'register_block_type' ) ) {
			register_block_type( 'yoast/how-to-block', array(
				'render_callback' => 'WPSEO_How_To_Block::render',
			) );
		}
	}

	/**
	 * Renders the block.
	 *
	 * Because we can't save script tags in Gutenberg without sufficient user permissions we render these server-side.
	 *
	 * @param array  $attributes The attributes of the block.
	 * @param string $content    The HTML content of the block.
	 *
	 * @return string
	 */
	public static function render( $attributes, $content ) {
		$json_ld = array(
			"@context" => "http://schema.org",
			"@type" => "HowTo",
		);

		if ( ! empty( $attributes['jsonTitle'] ) ) {
			$json_ld['name'] = $attributes['jsonTitle'];
		}

		if( ! empty( $attributes['hasDuration'] ) && $attributes['hasDuration'] === true ) {
			$hours   = empty( $attributes['hours'] ) ? 0 : $attributes['hours'];
			$minutes = empty( $attributes['minutes'] ) ? 0 : $attributes['minutes'];

			$json_ld['totalTime'] = 'PT' . $hours . 'H' . $minutes . 'M';
		}

		if ( ! empty( $attributes['jsonDescription'] ) ) {
			$json_ld['description'] = $attributes['jsonDescription'];
		}

		if ( ! empty( $attributes['steps'] && is_array( $attributes['steps' ] ) ) ) {
			$json_ld['step'] = array();
			foreach( $attributes['steps'] as $index => $step ) {
				$step_json_ld = array(
					"@type" => "HowToStep",
					"position" => $index + 1,
					"text" => $step['jsonContents'],
				);

				if ( ! empty( $step['jsonImageSrc'] ) ) {
					$step_json_ld['associatedMedia'] = array(
						"@type" => "ImageObject",
						"contentUrl" => $step['jsonImageSrc'],
					);
				}

				$json_ld['step'][] = $step_json_ld;
			}
		}

		return '<script type="application/ld+json">' .  json_encode( $json_ld ) . '</script>' . $content;
	}
}
