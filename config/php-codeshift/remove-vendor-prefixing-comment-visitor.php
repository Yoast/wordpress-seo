<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\PHP_CodeShift
 */

namespace Yoast\WP\SEO\PHP_CodeShift;

use PhpParser\Comment\Doc;
use PhpParser\Node;
use PhpParser\NodeVisitorAbstract;

/**
 * Class Vendor_Prefixing_Visitor
 */
class Remove_Vendor_Prefixing_Comment_Visitor extends NodeVisitorAbstract {

	/**
	 * Removes vendor prefixes from comments.
	 *
	 * @param \PhpParser\Node $node The node being visited.
	 *
	 * @return \PhpParser\Node The possibly modified node.
	 */
	public function leaveNode( Node $node ) {
		$comment = $node->getDocComment();

		if ( $comment && \strpos( $comment->getText(), \YOAST_VENDOR_NS_PREFIX ) !== false ) {
			$updated_text    = \str_replace( \YOAST_VENDOR_NS_PREFIX . '\\', '', $comment->getText() );
			$updated_comment = new Doc( $updated_text, $comment->getLine(), $comment->getFilePos(), $comment->getTokenPos() );
			$node->setDocComment( $updated_comment );
		}

		return $node;
	}
}
