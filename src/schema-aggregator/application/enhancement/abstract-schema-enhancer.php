<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement;

/**
 * The abstract schema enhancer.
 */
abstract class Abstract_Schema_Enhancer {

	/**
	 * Trims content to a maximum length, attempting to break at word boundaries.
	 *
	 * @param int    $max_length Maximum length of content.
	 * @param string $content    The content to trim.
	 *
	 * @return string The trimmed content.
	 */
	protected function trim_content_to_max_length( int $max_length, string $content ): string {
		if ( $max_length > 0 && \strlen( $content ) > $max_length ) {
			$content    = \substr( $content, 0, $max_length );
			$last_space = \strrpos( $content, ' ' );
			if ( $last_space !== false && $last_space > ( $max_length * 0.9 ) ) {
				$content = \substr( $content, 0, $last_space );
			}
			$content .= '...';
		}

		return $content;
	}
}
