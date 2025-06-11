import { useCallback, useMemo } from "@wordpress/element";
import { Button, useToggleState } from "@yoast/ui-library";
import { Form, useFormikContext } from "formik";
import { includes, noop, values } from "lodash";
import PropTypes from "prop-types";
import AnimateHeight from "react-animate-height";
import { __ } from "@wordpress/i18n";
import { UnsavedChangesModal } from "../unsaved-changes-modal";

/**
 *  Form Layout with save and cancel buttons
 *
 * @param {JSX.node} children The fields.
 * @param {boolean} [isExternalLoading=false] Whether external is loading.
 * @param {Function} [onUndo=noop] Callback function to undo the discarding of changes.
 *
 * @returns {JSX.Element}
 */
export const FormLayout = ( {
	children,
	isExternalLoading = false,
	onUndo = noop,
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
								id="yst-button-submit-settings"
								type="submit"
								isLoading={ isSubmitting }
								disabled={ isSubmitting || isExternalLoading || isStatusBlocked }
							>
								{ __( "Save changes", "wordpress-seo" ) }
							</Button>
							<Button
								id="yst-button-undo-settings"
								variant="secondary"
								disabled={ ! dirty }
								onClick={ setRequestUndo }
							>
								{ __( "Discard changes", "wordpress-seo" ) }
							</Button>
							<UnsavedChangesModal
								isOpen={ isRequestUndo }
								onClose={ unsetRequestUndo }
								title={ __( "Discard all changes", "wordpress-seo" ) }
								description={ __( "You are about to discard all unsaved changes. Are you sure?", "wordpress-seo" ) }
								onDiscard={ handleUndo }
								dismissLabel={ __( "No, continue editing", "wordpress-seo" ) }
								discardLabel={ __( "Yes, discard changes", "wordpress-seo" ) }
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
