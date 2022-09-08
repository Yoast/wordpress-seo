import { useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button, Title } from "@yoast/ui-library";
import { Form, useFormikContext } from "formik";
import { includes, values } from "lodash";
import PropTypes from "prop-types";

/**
 * @returns {JSX.Element} The form layout component.
 */
const FormLayout = ( {
	children,
	title,
	description = null,
} ) => {
	const { isSubmitting, status } = useFormikContext();
	const isBlocked = useMemo( () => includes( values( status ), true ), [ status ] );

	return (
		<Form className="yst-flex yst-flex-col yst-h-full yst-min-h-[75vh]">
			<header className="yst-border-b yst-border-gray-200">
				<div className="yst-max-w-screen-sm yst-p-8">
					<Title>{ title }</Title>
					{ description && <p className="yst-text-tiny yst-mt-3">{ description }</p> }
				</div>
			</header>
			<div className="yst-flex-grow yst-p-8 yst-max-w-5xl">
				{ children }
			</div>
			<footer className="yst-sticky yst-bottom-0">
				<div className="yst-h-8 yst-bg-gradient-to-t yst-from-white" />
				<div className="yst-p-8 yst-bg-gray-50 yst-rounded-b-lg">
					<Button
						id="button-submit-settings"
						type="submit"
						isLoading={ isSubmitting }
						disabled={ isSubmitting || isBlocked }
					>
						{ __( "Save changes", "wordpress-seo" ) }
					</Button>
				</div>
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
