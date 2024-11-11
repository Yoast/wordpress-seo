<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\General\Domain\Content_Types;

/**
 * This class describes a map of a content type.
 */
class Content_Type_Map {

	/**
	 * Maps all content type information to the expected key value representation.
	 *
	 * @param Content_Type         $content_type          The content type to map.
	 * @param array<string,string> $content_type_taxonomy The filtering taxonomy of the content type.
	 *
	 * @return array<string,string> The expected key value representation.
	 */
	public function map_to_array( Content_Type $content_type, array $content_type_taxonomy ): array {
		$content_type_array = [];

		$content_type_array['name']     = $content_type->get_name();
		$content_type_array['label']    = $content_type->get_label();
		$content_type_array['taxonomy'] = ( \count( $content_type_taxonomy ) === 0 ) ? null : $content_type_taxonomy;

		return $content_type_array;
	}
}
