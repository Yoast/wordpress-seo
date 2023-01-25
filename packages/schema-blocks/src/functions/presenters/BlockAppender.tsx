import { createElement } from "@wordpress/element";
import { Inserter } from "@wordpress/block-editor";

/**
 * Properties for the BlockAppender.
 */
export interface BlockAppenderProps {
	clientId: string;
	label: string;
}

/**
 * Block Appender for adding a new block to an innerblocks block.
 *
 * @param clientId The id of the parent block in which a block should be added when using the appender.
 * @param label A string
 *
 * @constructor
 */
export default function BlockAppender( { clientId, label }: BlockAppenderProps ): React.ReactElement {
	return (
		<div
			data-root-client-id={ clientId }
			className="wp-block block-editor-default-block-appender"
		>
			<p className="block-editor-default-block-appender__content yoast-schema-block-appender__content">
				{ label }
			</p>
			<Inserter
				rootClientId={ clientId }
				position="bottom right"
			/>
		</div>
	);
}
