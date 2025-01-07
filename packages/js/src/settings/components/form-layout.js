import { useCallback, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button, useToggleState } from "@yoast/ui-library";
import { Form, useFormikContext } from "formik";
import { includes, values } from "lodash";
import PropTypes from "prop-types";
import AnimateHeight from "react-animate-height";
import { useSelectSettings } from "../hooks";
import { UnsavedChangesModal } from "../../shared-admin/components";

/**
 * @returns {JSX.Element} The form layout component.
 */
const FormLayout = ( { children } ) => {
	const { isSubmitting, status, dirty, resetForm, initialValues } = useFormikContext();
	const isMediaLoading = useSelectSettings( "selectIsMediaLoading" );
	const isStatusBlocked = useMemo( () => includes( values( status ), true ), [ status ] );

	const [ isRequestUndo, , , setRequestUndo, unsetRequestUndo ] = useToggleState( false );
	const handleUndo = useCallback( () => {
		unsetRequestUndo();
		resetForm( { values: initialValues } );
	}, [ resetForm, initialValues, unsetRequestUndo ] );

	return (
		<Form className="yst-flex yst-flex-col yst-h-full">
			<div className="yst-flex-grow yst-p-8">
				{ children }
			</div>
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
								disabled={ isSubmitting || isMediaLoading || isStatusBlocked }
							>
								{ __( "Save changes", "wordpress-seo" ) }
							</Button>
							<Button
								id="button-undo-settings"
								type="button"
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
								description={ __( "You are about to discard all unsaved changes. All of your settings will be reset to the point where you last saved. Are you sure you want to do this?", "wordpress-seo" ) }
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
};

export default FormLayout;
