import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { DefaultBlockAppender } from "@wordpress/block-editor/build/components/default-block-appender/index";
import { last } from "lodash";

/**
 * Properties for the block appender.
 */
export interface BlockAppenderProps {
	placeholder: string;
	clientId?: string;
}

/**
 * BlockAppender component.
 *
 * Renders a block appender with label.
 */
export default compose(
	withSelect( ( select, ownProps: BlockAppenderProps ) => {
		const { getTemplateLock, getBlockOrder } = select( "core/block-editor" );

		const blockClientIds = getBlockOrder( ownProps.clientId );

		return {
			isVisible: true,
			showPrompt: true,
			isLocked: !! getTemplateLock( ownProps.clientId ),
			placeholder: ownProps.placeholder,
			lastBlockClientId: last( blockClientIds ),
			rootClientId: ownProps.clientId,
		};
	} ),
	withDispatch( ( dispatch, ownProps: BlockAppenderProps ) => {
		const { insertDefaultBlock, startTyping } = dispatch(
			"core/block-editor",
		);

		return {
			/**
			 * Function to call when the block appender button is clicked.
			 */
			onAppend() {
				const { clientId } = ownProps;
				insertDefaultBlock( null, clientId );
				startTyping();
			},
		};
	} ),
)( DefaultBlockAppender );

