<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement;

use Exception;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Enhancement\Schema_Enhancement_Interface;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Enhancement\Article_Config;

/**
 * The Article schema pieces enhancer.
 */
class Article_Schema_Enhancer extends Abstract_Schema_Enhancer implements Schema_Enhancement_Interface {

	/**
	 * The config.
	 *
	 * @var Article_Config
	 */
	private $config;

	/**
	 * Sets the Article_Config instance.
	 *
	 * @required
	 *
	 * @param Article_Config $config The Article_Config instance.
	 *
	 * @return void
	 */
	public function set_article_config( Article_Config $config ) {
		$this->config = $config;
	}

	/**
	 * Enhances specific Article schema pieces.
	 *
	 * @param Schema_Piece $schema_piece The schema piece to enhance.
	 * @param Indexable    $indexable    The indexable object that is the source of the schema piece.
	 *
	 * @return Schema_Piece The enhanced schema piece.
	 */
	public function enhance( Schema_Piece $schema_piece, Indexable $indexable ): Schema_Piece {
		$schema_data = $schema_piece->get_data();
		if ( ! isset( $schema_data['@type'] ) ) {
			return $schema_piece;
		}
		if (
			\in_array(
				$schema_data['@type'],
				[
					'Article',
					'NewsArticle',
					'BlogPosting',
				],
				true
			) ) {
			$schema_data = $this->enhance_schema_piece( $schema_data, $indexable );
		}

		if (
				\is_array( $schema_data['@type'] ) && \in_array( 'Article', $schema_data['@type'], true ) ) {
			$schema_data = $this->enhance_schema_piece( $schema_data, $indexable );
		}

		return new Schema_Piece( $schema_data, $schema_piece->get_type() );
	}

	/**
	 * Enhance a single schema piece
	 *
	 * @param array<string> $schema_data The schema data to enhance.
	 * @param Indexable     $indexable   The indexable object that is the source of the schema piece.
	 *
	 * @return array<string> The enhanced schema data.
	 */
	private function enhance_schema_piece( array $schema_data, Indexable $indexable ): array {
		try {
			$has_excerpt = false;

			if ( $this->config->is_enhancement_enabled( 'use_excerpt' ) ) {
				$excerpt     = $this->get_excerpt( $indexable->object_id );
				$has_excerpt = ! empty( $excerpt );

				if ( $has_excerpt && ! isset( $schema_data['description'] ) ) {
					$schema_data['description'] = $excerpt;
				}
			}

			if ( $this->config->is_enhancement_enabled( 'article_body' ) && ! isset( $schema_data['articleBody'] ) ) {
				if ( $this->config->should_include_article_body( $has_excerpt ) ) {
					$article_body = $this->get_article_body( $indexable->object_id );
					if ( ! empty( $article_body ) ) {
						$schema_data['articleBody'] = $article_body;
					}
				}
			}

			if ( $this->config->is_enhancement_enabled( 'keywords' ) && ! isset( $schema_data['keywords'] ) ) {
				$keywords = $this->get_article_keywords( $indexable->object_id );
				if ( ! empty( $keywords ) ) {
					$schema_data['keywords'] = \implode( ', ', $keywords );
				}
			}

			return $schema_data;
		} catch ( Exception $e ) {
			return $schema_data;
		}
	}

	/**
	 * Get article keywords
	 *
	 * Extracts post tags and optionally categories as keywords.
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return array<string> Array of keyword strings.
	 */
	private function get_article_keywords( int $post_id ): array {
		try {
			$keywords = [];

			$tags = \get_the_tags( $post_id );
			if ( \is_array( $tags ) && ! empty( $tags ) ) {
				foreach ( $tags as $tag ) {
					if ( isset( $tag->name ) ) {
						$keywords[] = $tag->name;
					}
				}
			}

			if ( $this->config->get_config_value( 'categories_as_keywords', false ) ) {
				$categories = \get_the_category( $post_id );
				if ( \is_array( $categories ) && ! empty( $categories ) ) {
					foreach ( $categories as $category ) {
						if ( isset( $category->name ) && $category->name !== 'Uncategorized' ) {
							$keywords[] = $category->name;
						}
					}
				}
			}

			return \array_unique( $keywords );
		} catch ( Exception $e ) {
			return [];
		}
	}

	/**
	 * Get article excerpt for description field
	 *
	 * Retrieves post excerpt with robust validation (no empty/whitespace-only).
	 * Falls back to auto-generated excerpt from content unless prefer_manual is enabled.
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return string|null Excerpt or null if unavailable/invalid.
	 */
	private function get_excerpt( int $post_id ): ?string {
		try {
			$excerpt = \get_post_field( 'post_excerpt', $post_id );
			if ( \is_wp_error( $excerpt ) ) {
				$excerpt = '';
			}

			if ( empty( $excerpt ) || \trim( $excerpt ) === '' ) {
				if ( $this->config->get_config_value( 'excerpt_prefer_manual', false ) ) {
					return null;
				}

				$content = \get_post_field( 'post_content', $post_id );

				if ( \is_wp_error( $content ) || empty( $content ) ) {
					return null;
				}
				$excerpt = \wp_trim_excerpt( $content, $post_id );

				if ( empty( $excerpt ) || \trim( $excerpt ) === '' ) {
					return null;
				}
			}
			$excerpt = \wp_strip_all_tags( $excerpt );

			// Apply max length if configured.
			$max_length = $this->config->get_config_value( 'excerpt_max_length', 0 );
			$excerpt    = $this->trim_content_to_max_length( $max_length, $excerpt );

			$excerpt = \trim( $excerpt );

			return ( $excerpt !== '' ) ? $excerpt : null;
		} catch ( Exception $e ) {
			return null;
		}
	}

	/**
	 * Get article body (full post content)
	 *
	 * Extracts full post content with optional HTML and shortcode stripping.
	 * Respects max_length configuration if set.
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return string|null Article body or null if unavailable.
	 */
	private function get_article_body( int $post_id ): ?string {
		try {
			$content = \get_post_field( 'post_content', $post_id );

			if ( \is_wp_error( $content ) || empty( $content ) ) {
				return null;
			}

			if ( $this->config->get_config_value( 'strip_shortcodes_from_body', true ) ) {
				$content = \strip_shortcodes( $content );
			}

			if ( $this->config->get_config_value( 'strip_html_from_body', true ) ) {
				$content = \wp_strip_all_tags( $content );
			}

			$max_length = $this->config->get_config_value( 'article_body_max_length', Article_Config::DEFAULT_MAX_ARTICLE_BODY_LENGTH );

			return $this->trim_content_to_max_length( $max_length, $content );
		} catch ( Exception $e ) {
			return null;
		}
	}
}
