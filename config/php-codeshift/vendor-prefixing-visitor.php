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
class Vendor_Prefixing_Visitor extends NodeVisitorAbstract {
	/**
	 * @param \PhpParser\Node $node The node being visited.
	 *
	 * @return \PhpParser\Node The possibly modified node.
	 */
	public function leaveNode( Node $node ) {
		if ( ! $node instanceof Name ) {
			return $node;
		}

		$class_name = $node->toString();
		if ( strpos( $class_name, YOAST_VENDOR_NS_PREFIX ) !== 0 ) {
			return $node;
		}

		$base_name = substr( $class_name, ( strlen( YOAST_VENDOR_NS_PREFIX ) + 1 ) );

		if ( $node->isFullyQualified() ) {
			return new Name\FullyQualified( $base_name );
		}
		return new Name( $base_name );
	}
}
