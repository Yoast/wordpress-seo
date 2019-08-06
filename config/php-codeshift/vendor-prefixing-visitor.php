<?php

namespace Yoast\WP\Free\PHP_CodeShift;

use PhpParser\Node;
use PhpParser\Node\Name;
use PhpParser\NodeVisitorAbstract;

class Vendor_Prefixing_Visitor extends NodeVisitorAbstract {
	public function leaveNode( Node $node ) {
		if ( ! $node instanceof Name ) {
			return $node;
		}

		$class_name = $node->toString();
		if ( strpos( $class_name, YOAST_VENDOR_NS_PREFIX ) !== 0 ) {
			return $node;
		}

		$base_name = substr( $class_name, strlen( YOAST_VENDOR_NS_PREFIX ) + 1 );

		if ( $node->isFullyQualified() ) {
			return new Name\FullyQualified( $base_name );
		}
		return new Name( $base_name );
	}
}
