<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Adds a checkbox to the focus keyword section.
 */
class WPSEO_Cornerstone_Metabox_Field {

	/**
	 * Returns a label with a checkbox in it. Make it possible to mark the page as cornerstone content.
	 *
	 * @param WP_POST $post The post object.
	 *
	 * @return string The HTML to show.
	 */
	public function get_html( $post ) {
		$checked = checked( $this->get_meta_value( $post->ID ), '1', false );

		$return  = '';
		$return .= sprintf(
			'<input id="%1$s" class="wpseo-cornerstone-checkbox" type="checkbox" value="1" name="%1$s" ' . $checked . ' />',
			WPSEO_Cornerstone::META_NAME
		);
		$return .= '<label for="' . WPSEO_Cornerstone::META_NAME . '">';

		/* translators: 1: link open tag; 2: link close tag. */
		$return .= sprintf(
			__( 'This article is %1$scornerstone content%2$s', 'wordpress-seo' ),
			'<a href="https://yoa.st/">',
			'</a>'
		);
		$return .= '</label>';

		return $return;
	}

	/**
	 * Gets the meta value from the database.
	 *
	 * @param int $post_id The post id to get the meta value for.
	 *
	 * @return null|string The meta value from the database.
	 */
	protected function get_meta_value( $post_id ) {
		return get_post_meta( $post_id, WPSEO_Cornerstone::META_NAME, true );
	}


}