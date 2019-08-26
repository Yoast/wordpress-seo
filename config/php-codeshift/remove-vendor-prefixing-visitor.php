<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\PHP_CodeShift
 */

namespace Yoast\WP\Free\PHP_CodeShift;

use PhpParser\Node;
use PhpParser\Node\Name;
use PhpParser\NodeVisitorAbstract;

/**
 * Class Vendor_Prefixing_Visitor
 */
class Remove_Vendor_Prefixing_Visitor extends NodeVisitorAbstract {
	/**
	 * @param \PhpParser\Node $node The node being visited.
	 *
	 * @return \PhpParser\Node The possibly modified node.
	 */
	public function leaveNode( Node $node ) {
		if ( ! $node instanceof Name ) {
			return $node;
		}

		if ( $node->getFirst() !== YOAST_VENDOR_NS_PREFIX ) {
			return $node;
		}

		return $node->slice( 1 );
	}
}
