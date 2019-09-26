<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\PHP_CodeShift
 */

namespace Yoast\WP\Free\PHP_CodeShift;

use Codeshift\AbstractCodemod;

/**
 * Class Vendor_Prefixing_Codemod
 */
class Remove_Vendor_Prefixing_Codemod extends AbstractCodemod {
	/**
	 * Sets up the environment required to do the code modifications.
	 */
	public function init() {
		define( 'YoastSEO_Vendor\RUCKUSING_BASE', __DIR__ . '/../../fake-ruckusing' );

		define( 'YOAST_VENDOR_NS_PREFIX', 'YoastSEO_Vendor' );
		define( 'YOAST_VENDOR_DEFINE_PREFIX', 'YOASTSEO_VENDOR__' );
		define( 'YOAST_VENDOR_PREFIX_DIRECTORY', 'vendor_prefixed' );

		$visitor = new Remove_Vendor_Prefixing_Visitor();
		$comment_visitor = new Remove_Vendor_Prefixing_Comment_Visitor();
		$array_key_visitor = new Remove_Vendor_Prefixing_Array_Key_Visitor();
		$this->addTraversalTransform( $visitor, $comment_visitor, $array_key_visitor );
	}
}

return 'Yoast\WP\Free\PHP_CodeShift\Remove_Vendor_Prefixing_Codemod';
