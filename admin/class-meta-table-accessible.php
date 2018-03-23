<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the state of the table being accessible.
 */
class WPSEO_Meta_Table_Accessible extends WPSEO_Accessible_Table {
	/**
	 * The storage class used to check the accessible table.
	 *
	 * @var string
	 */
	public static $storage_class = 'WPSEO_Meta_Storage';

	/**
	 * The transient used to store the accessible state.
	 *
	 * @var string
	 */
	public static $transient_name = 'wpseo_meta_table_inaccessible';
}
