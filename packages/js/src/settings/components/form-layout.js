import { ExclamationIcon } from "@heroicons/react/outline";
import { useCallback, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button, Modal, Title, useSvgAria, useToggleState } from "@yoast/ui-library";
import { Form, useFormikContext } from "formik";
import { includes, values } from "lodash";
import PropTypes from "prop-types";
import AnimateHeight from "react-animate-height";
import { useSelectSettings } from "../store";

/**
 * @returns {JSX.Element} The form layout component.
 */
const FormLayout = ( {
	children,
	title,
	description = null,
} ) => {
	const { isSubmitting, status, dirty, resetForm, initialValues } = useFormikContext();
	const isMediaLoading = useSelectSettings( "selectIsMediaLoading" );
	const isStatusBlocked = useMemo( () => includes( values( status ), true ), [ status ] );
	const svgAriaProps = useSvgAria();

	const [ isRequestUndo, , , setRequestUndo, unsetRequestUndo ] = useToggleState( false );
	const handleUndo = useCallback( () => {
		unsetRequestUndo();
		resetForm( { values: initialValues } );
	}, [ resetForm, initialValues, unsetRequestUndo ] );

	return (
		<Form className="yst-flex yst-flex-col yst-h-full yst-min-h-[75vh]">
			<header className="yst-p-8 yst-border-b yst-border-slate-200">
				<div className="yst-max-w-screen-sm">
					<Title>{ title }</Title>
					{ description && <p className="yst-text-tiny yst-mt-3">{ description }</p> }
				</div>
			</header>
			<div className="yst-flex-grow yst-p-8 yst-max-w-5xl">
				{ children }
			</div>
			<footer className="yst-sticky yst-bottom-0">
				<AnimateHeight
					easing="ease-in-out"
					duration={ 300 }
					height={ dirty ? "auto" : 0 }
					animateOpacity={ true }
				>
					<div className="yst-bg-slate-50 yst-border-slate-200 yst-border-t yst-rounded-b-lg">
						<div className="yst-flex yst-align-middle yst-space-x-3 yst-p-8">
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
							<Modal onClose={ unsetRequestUndo } isOpen={ isRequestUndo }>
								<div className="sm:yst-flex sm:yst-items-start">
									<div
										className="yst-mx-auto yst-flex-shrink-0 yst-flex yst-items-center yst-justify-center yst-h-12 yst-w-12 yst-rounded-full yst-bg-red-100 sm:yst-mx-0 sm:yst-h-10 sm:yst-w-10"
									>
										<ExclamationIcon className="yst-h-6 yst-w-6 yst-text-red-600" { ...svgAriaProps } />
									</div>
									<div className="yst-mt-3 yst-text-center sm:yst-mt-0 sm:yst-ml-4 sm:yst-text-left">
										<Modal.Title as="h3" className="yst-text-lg yst-leading-6 yst-font-medium yst-text-slate-900">
											{ __( "Discard all changes", "wordpress-seo" ) }
										</Modal.Title>
										<Modal.Description className="yst-text-sm yst-text-slate-500">
											{ __( "You are about to discard all unsaved changes. All of your settings will be reset to the point where you last saved. Are you sure you want to do this?", "wordpress-seo" ) }
										</Modal.Description>
									</div>
								</div>
								<div className="yst-flex yst-flex-col sm:yst-flex-row-reverse yst-gap-3 yst-mt-6">
									<Button type="button" variant="error" onClick={ handleUndo } className="yst-block yst-text-center">
										{ __( "Yes, discard changes", "wordpress-seo" ) }
									</Button>
									<Button type="button" variant="secondary" onClick={ unsetRequestUndo } className="yst-block yst-text-center">
										{ __( "No, continue editing", "wordpress-seo" ) }
									</Button>
								</div>
							</Modal>
						</div>
					</div>
				</AnimateHeight>
			</footer>
		</Form>
	);
};

FormLayout.propTypes = {
	children: PropTypes.node.isRequired,
	title: PropTypes.node.isRequired,
	description: PropTypes.node,
};

export default FormLayout;
