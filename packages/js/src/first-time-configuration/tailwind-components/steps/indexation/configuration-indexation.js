import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { Transition } from "@headlessui/react";

import Indexation from "./indexation";
import Alert from "../../base/alert";

/**
 * A wrapped Indexation for the first-time configuration.
 *
 * @param {Object}   props                       The props object.
 * @param {function} props.indexingStateCallback The function to call back on state updates.
 * @param {string}   props.indexingState         The state of the indexation.
 * @param {Boolean}  props.isStepperFinished     Whether the stepper has been completed.
 *
 * @returns {WPElement} A wrapped Indexation for the first-time configuration.
 */
export function ConfigurationIndexation( { indexingStateCallback, indexingState, isStepperFinished } ) {
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

ConfigurationIndexation.propTypes = {
	indexingStateCallback: PropTypes.func.isRequired,
	indexingState: PropTypes.string.isRequired,
	isStepperFinished: PropTypes.bool,
};

ConfigurationIndexation.defaultProps = {
	isStepperFinished: false,
};
