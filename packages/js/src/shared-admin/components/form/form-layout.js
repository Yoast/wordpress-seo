import { useCallback, useMemo } from "@wordpress/element";
import { Button, useToggleState } from "@yoast/ui-library";
import { Form, useFormikContext } from "formik";
import { includes, values } from "lodash";
import PropTypes from "prop-types";
import AnimateHeight from "react-animate-height";
import { UnsavedChangesModal } from "../unsaved-changes-modal";

/**
 * @typedef {Object} FormLayoutProps
 * @property {React.ReactNode} children
 * @property {boolean} [isExternalLoading]
 * @property {Function} [onUndo]
 */

/**
 *  Form Layout with save and cancel buttons
 *
 * @param {FormLayoutProps} props
 * @returns {JSX.Element}
 */
export const FormLayout = ( {
	children,
	isExternalLoading = false,
	onUndo = () => {},
} ) => {
	const { isSubmitting, status, dirty, resetForm, initialValues } = useFormikContext();
	const isStatusBlocked = useMemo( () => includes( values( status ), true ), [ status ] );

	const [ isRequestUndo, , , setRequestUndo, unsetRequestUndo ] = useToggleState( false );

	const handleUndo = useCallback( () => {
		unsetRequestUndo();
		if ( onUndo ) {
			onUndo();
		} else {
			resetForm( { values: initialValues } );
		}
	}, [ onUndo, resetForm, initialValues, unsetRequestUndo ] );

	return (
		<Form className="yst-flex yst-flex-col yst-h-full">
			<div className="yst-flex-grow yst-p-8">{ children }</div>
			<footer className="yst-sticky yst-bottom-0 yst-z-10">
				<AnimateHeight
					easing="ease-in-out"
					duration={ 300 }
					height={ dirty ? "auto" : 0 }
					animateOpacity={ true }
				>
					<div className="yst-bg-slate-50 yst-border-slate-200 yst-border-t yst-rounded-b-lg">
						<div className="yst-flex yst-align-middle yst-space-x-3 rtl:yst-space-x-reverse yst-p-8">
							<Button
								id="button-submit-settings"
								type="submit"
								isLoading={ isSubmitting }
								disabled={ isSubmitting || isExternalLoading || isStatusBlocked }
							>
								Save changes
							</Button>
							<Button
								id="button-undo-settings"
								type="button"
								variant="secondary"
								disabled={ ! dirty }
								onClick={ setRequestUndo }
							>
								Discard changes
							</Button>
							<UnsavedChangesModal
								isOpen={ isRequestUndo }
								onClose={ unsetRequestUndo }
								title={ "Discard all changes" }
								description={ "You are about to discard all unsaved changes. Are you sure?" }
								onDiscard={ handleUndo }
								dismissLabel={ "No, continue editing" }
								discardLabel={ "Yes, discard changes" }
							/>
						</div>
					</div>
				</AnimateHeight>
			</footer>
		</Form>
	);
};

FormLayout.propTypes = {
	children: PropTypes.node.isRequired,
	isExternalLoading: PropTypes.bool,
	onUndo: PropTypes.func,
};
