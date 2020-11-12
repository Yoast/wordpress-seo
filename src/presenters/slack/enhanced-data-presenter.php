<?php

namespace Yoast\WP\SEO\Presenters\Slack;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;

/**
 * Presenter class for the Slack enhanced data.
 */
class Enhanced_Data_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Presents the enhanced data for Slack
	 *
	 * @return string The Twitter tags for Slack.
	 */
	public function present() {
		$enhanced_data = $this->get();
		$twitter_tags  = '';
		$i             = 1;
		foreach ( $enhanced_data as $label => $value ) {
			$twitter_tags .= sprintf( "\t" . '<meta name="twitter:label%1$d" content="%2$s">' . "\n", $i, $label );
			$twitter_tags .= sprintf( "\t" . '<meta name="twitter:data%1$d" content="%2$s">' . "\n", $i, $value );
			$i++;
		}
		return \trim( $twitter_tags );
	}

	/**
	 * Gets the enhanced data array.
	 *
	 * @return array The enhanced data array
	 */
	public function get() {
		$data         = [];
		$post_content = $this->presentation->source->post_content;
		$author_id    = $this->presentation->source->post_author;

		if ( $author_id ) {
			$data[ __( 'Written by', 'wordpress-seo' ) ] = \get_the_author_meta( 'display_name', $author_id );
		}

		if ( ! empty( $post_content ) ) {
			$data[ __( 'Est. reading time', 'wordpress-seo' ) ] = $this->get_reading_time( $post_content );
		}

		/**
		 * Filter: 'wpseo_enhanced_slack_data' - Allows filtering of the enhanced data for sharing on Slack.
		 *
		 * @api array $data The enhanced Slack sharing data.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return \apply_filters( 'wpseo_enhanced_slack_data', $data, $this->presentation );
	}

	/**
	 * Calculate the estimated reading time.
	 *
	 * @param string $post_content The post content.
	 *
	 * @return string Human-readable est. reading time.
	 */
	private function get_reading_time( $post_content ) {
		// 250 is the estimated words per minute, https://en.wikipedia.org/wiki/Speed_reading.
		$words_per_minute = 250;

		$word    = \str_word_count( \wp_strip_all_tags( $post_content ) );
		$minutes = \round( $word / $words_per_minute );
		/* translators: %s: Time duration in minute or minutes. */
		return \sprintf( \_n( '%s minute', '%s minutes', $minutes, 'default' ), $minutes );
	}
}
