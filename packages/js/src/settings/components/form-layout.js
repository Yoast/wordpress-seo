import { useCallback, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button, Title } from "@yoast/ui-library";
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

	const handleUndo = useCallback( () => {
		resetForm( { values: initialValues } );
	}, [ resetForm, initialValues ] );

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
								onClick={ handleUndo }
							>
								{ __( "Discard changes", "wordpress-seo" ) }
							</Button>
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
