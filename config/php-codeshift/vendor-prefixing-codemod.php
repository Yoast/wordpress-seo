<?php

namespace Yoast\WP\Free\PHP_CodeShift;

use Codeshift\AbstractCodemod;

class Vendor_Prefixing_Codemod extends AbstractCodemod {
	public function init() {
		define( 'YoastSEO_Vendor\RUCKUSING_BASE', __DIR__ . '/../../fake-ruckusing' );

		define( 'YOAST_VENDOR_NS_PREFIX', 'YoastSEO_Vendor' );
		define( 'YOAST_VENDOR_DEFINE_PREFIX', 'YOASTSEO_VENDOR__' );
		define( 'YOAST_VENDOR_PREFIX_DIRECTORY', 'vendor_prefixed' );

		$visitor = new Vendor_Prefixing_Visitor();
		$this->addTraversalTransform( $visitor );
	}
}

return 'Yoast\WP\Free\PHP_CodeShift\Vendor_Prefixing_Codemod';
