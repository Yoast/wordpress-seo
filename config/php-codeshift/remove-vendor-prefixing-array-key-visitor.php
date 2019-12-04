<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\PHP_CodeShift
 */

namespace Yoast\WP\Free\PHP_CodeShift;

use PhpParser\Node;
use PhpParser\Node\Expr\ArrayItem;
use PhpParser\Node\Scalar\String_;
use PhpParser\NodeVisitorAbstract;

/**
 * Class Vendor_Prefixing_Visitor
 */
class Remove_Vendor_Prefixing_Array_Key_Visitor extends NodeVisitorAbstract {

	/**
	 * @param \PhpParser\Node $node The node being visited.
	 *
	 * @return \PhpParser\Node The possibly modified node.
	 */
	public function leaveNode( Node $node ) {
		if ( ! $node instanceof ArrayItem ) {
			return $node;
		}

		if ( $node->key instanceof String_ && \strpos( $node->key->value, \YOAST_VENDOR_NS_PREFIX ) !== false ) {
			$node->key->value = \str_replace( \YOAST_VENDOR_NS_PREFIX . '\\', '', $node->key->value );
		}

		return $node;
	}
}
