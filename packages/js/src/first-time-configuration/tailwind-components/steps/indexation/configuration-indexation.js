import { Transition } from "@headlessui/react";
import { __ } from "@wordpress/i18n";
import Alert from "../../base/alert";
import Indexation from "./indexation";

/**
 * A wrapped Indexation for the first-time configuration.
 *
 * @param {Object} props Component props.
 * @param {Function} props.indexingStateCallback The function to call back on state updates.
 * @param {string} props.indexingState The state of the indexation.
 * @param {boolean} [props.isStepperFinished=false] Whether the stepper has been completed.
 *
 * @returns {JSX.Element} A wrapped Indexation for the first-time configuration.
 */
export function ConfigurationIndexation( { indexingStateCallback, indexingState, isStepperFinished = false } ) {
	return <Indexation
		preIndexingActions={ window.yoast.indexing.preIndexingActions }
		indexingActions={ window.yoast.indexing.indexingActions }
		indexingStateCallback={ indexingStateCallback }
	>
		<Transition
			unmount={ false }
			show={ [ "completed", "already_done" ].includes( indexingState ) }
			enter="yst-transition-opacity yst-duration-1000"
			enterFrom="yst-opacity-0"
			enterTo="yst-opacity-100"
		>
			<Alert type="success">
				{ indexingState === "already_done" && ! isStepperFinished
					? __( "We've already successfully analyzed your site. You can move on to the next step.", "wordpress-seo" )
					: __( "We've successfully analyzed your site & optimized your SEO data!", "wordpress-seo" )
				}
			</Alert>
		</Transition>
	</Indexation>;
}
