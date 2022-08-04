import PropTypes from "prop-types";
import { Form, useFormikContext } from "formik";
import { __ } from "@wordpress/i18n";
import { Title, Button } from "@yoast/ui-library";
import { useValidationErrorsNotification } from "../hooks";

/**
 * @returns {JSX.Element} The form layout component.
 */
const FormLayout = ( {
	children,
	title,
	description = null,
} ) => {
	useValidationErrorsNotification();
	const { isSubmitting } = useFormikContext();
	return (
		<div className="yst-rounded-lg yst-bg-white yst-shadow yst-h-full">
			<Form className="yst-flex yst-flex-col yst-h-full">
				<header className="yst-border-b yst-border-gray-200">
					<div className="yst-max-w-screen-sm yst-p-8">
						<Title>{ title }</Title>
						{ description && <p className="yst-text-tiny yst-mt-3">{ description }</p> }
					</div>
				</header>
				<div className="yst-flex-grow yst-p-8 yst-max-w-5xl">
					{ children }
				</div>
				<footer className="yst-rounded-b-lg yst-p-8 yst-bg-gray-50">
					<Button
						id="button-submit-settings"
						type="submit"
						isLoading={ isSubmitting }
						disabled={ isSubmitting }
					>
						{ __( "Save changes", "wordpress-seo" ) }
					</Button>
				</footer>
			</Form>
		</div>
	);
};

FormLayout.propTypes = {
	children: PropTypes.node.isRequired,
	title: PropTypes.node.isRequired,
	description: PropTypes.node,
};

export default FormLayout;
