<?php
/**
 * @package WPSEO\Admin\Tracking
 */

/**
 * Interface that represents a tracking collection.
 */
interface WPSEO_Tracking_Collection {

	/**
	 * Extends the collection data.
	 *
	 * @param array $data The data to extend.
	 *
	 * @return array The extended data.
	 */
	public function extend( array $data );

}
