<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\General\Domain\Content_Types;

use WP_Post_Type;

/**
 * This class describes a Content Type.
 */
class Content_Type {

	/**
	 * The content type.
	 *
	 * @var WP_Post_Type
	 */
	private $content_type;

	/**
	 * The constructor.
	 *
	 * @param WP_Post_Type $content_type The content type.
	 */
	public function __construct( WP_Post_Type $content_type ) {
		$this->content_type = $content_type;
	}

	/**
	 * Maps all content type information to the expected key value representation.
	 *
	 * @param array<string,string|array<string, string>> $content_type_taxonomy The filtering taxonomy of the content type.
	 *
	 * @return array<string, string|array<string,string|array<string, string>>|null> The expected key value representation.
	 */
	public function map_to_array( array $content_type_taxonomy ): array {
		return [
			'name'     => $this->content_type->name,
			'label'    => $this->content_type->label,
			'taxonomy' => ( \count( $content_type_taxonomy ) === 0 ) ? null : $content_type_taxonomy,
		];
	}
}
