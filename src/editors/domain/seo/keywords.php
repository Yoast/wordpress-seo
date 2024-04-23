<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Editors\Domain\Seo;

/**
 * This class describes the keyword SEO data.
 */
class Keywords implements Seo_Plugin_Data_Interface {

	/**
	 * The keyword and the associated posts that use it.
	 *
	 * @var array<string> $keyword_usage_count
	 */
	private $keyword_usage_count;

	/**
	 * The post types for the given post IDs.
	 *
	 * @var array<string> $keyword_usage_per_type
	 */
	private $keyword_usage_per_type;

	/**
	 * The constructor.
	 *
	 * @param array<string> $keyword_usage_count    The keyword and the associated posts that use it.
	 * @param array<string> $keyword_usage_per_type The post types for the given post IDs.
	 */
	public function __construct( array $keyword_usage_count, array $keyword_usage_per_type ) {
		$this->keyword_usage_count    = $keyword_usage_count;
		$this->keyword_usage_per_type = $keyword_usage_per_type;
	}

	/**
	 * Returns the data as an array format.
	 *
	 * @return array<string>
	 */
	public function to_array(): array {
		return [
			'keyword_usage'          => $this->keyword_usage_count,
			'keyword_usage_per_type' => $this->keyword_usage_per_type,
		];
	}

	/**
	 * Returns the data as an array format meant for legacy use.
	 *
	 * @return array<string>
	 */
	public function to_legacy_array(): array {
		return [
			'keyword_usage'            => $this->keyword_usage_count,
			'keyword_usage_post_types' => $this->keyword_usage_per_type,
		];
	}
}
