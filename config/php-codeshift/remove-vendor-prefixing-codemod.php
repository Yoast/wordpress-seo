<?php

namespace Yoast\WP\SEO\PHP_CodeShift;

use Codeshift\AbstractCodemod;

/**
 * Class Remove_Vendor_Prefixing_Codemod.
 */
class Remove_Vendor_Prefixing_Codemod extends AbstractCodemod {

	/**
	 * Sets up the environment required to do the code modifications.
	 */
	public function init() {
		\define( 'YOAST_VENDOR_NS_PREFIX', 'YoastSEO_Vendor' );
		\define( 'YOAST_VENDOR_DEFINE_PREFIX', 'YOASTSEO_VENDOR__' );
		\define( 'YOAST_VENDOR_PREFIX_DIRECTORY', 'vendor_prefixed' );

		$visitor           = new Remove_Vendor_Prefixing_Visitor();
		$comment_visitor   = new Remove_Vendor_Prefixing_Comment_Visitor();
		$array_key_visitor = new Remove_Vendor_Prefixing_Array_Key_Visitor();
		$this->addTraversalTransform( $visitor, $comment_visitor, $array_key_visitor );
	}
}

return 'Yoast\WP\SEO\PHP_CodeShift\Remove_Vendor_Prefixing_Codemod';
