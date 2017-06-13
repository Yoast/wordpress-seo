<?php
/**
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the internal link lookup. This class tries get the postid for a given internal link.
 */
class WPSEO_Link_Internal_Lookup {

	/**
	 * Gets a post id for the given link for the given type. If type is outbound it returns 0 as post id.
	 *
	 * @param string $link The link to populate.
	 * @param string $type The type for the link: outbound or internal.
	 *
	 * @return int The post id belongs to given link if link is internal.
	 */
	public function lookup( $link, $type ) {
		if ( $type === WPSEO_Link_Type_Classifier::TYPE_EXTERNAL ) {
			return 0;
		}

		return url_to_postid( $link );
	}
}
