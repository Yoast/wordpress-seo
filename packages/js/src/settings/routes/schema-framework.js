import { useMemo, useState, useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Code, ToggleField } from "@yoast/ui-library";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { useFormikContext } from "formik";
import { useSelectSettings } from "../hooks";
import {
	FormLayout,
	RouteLayout,
	SchemaApiIntegrationsSection,
	SchemaDisableConfirmationModal,
} from "../components";

/**
 * @returns {JSX.Element} The schema framework feature route.
 */
const SchemaFramework = () => {
	const seeMoreLink = useSelectSettings( "selectLink", [], "https://yoa.st/structured-data-learn-more" );
	const learnMoreFilterLink = useSelectSettings( "selectLink", [], "https://yoa.st/schema-framework-filters" );
	const schemaApiLink = useSelectSettings( "selectLink", [], "https://yoa.st/schema-api" );
	const schemaDocumentationLink = useSelectSettings( "selectLink", [], "https://yoa.st/schema-documentation" );
	const isSchemaDisabledProgrammatically = useSelectSettings( "selectSchemaIsSchemaDisabledProgrammatically", [] );

	const { values, setFieldValue } = useFormikContext();
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const { enable_schema: enabledSchemaFramework } = values.wpseo;

	const handleToggleChange = useCallback( ( newValue ) => {
		if ( newValue ) {
			// User is enabling (just apply the change)
			setFieldValue( "wpseo.enable_schema", true );
		} else {
			// User is trying to disable (show confirmation modal)
			setIsModalOpen( true );
		}
	}, [ setFieldValue ] );

	const handleModalClose = useCallback( () => {
		setIsModalOpen( false );
	}, [] );

	const handleModalConfirm = useCallback( () => {
		setFieldValue( "wpseo.enable_schema", false );
		setIsModalOpen( false );
	}, [ setFieldValue ] );

	const featureDescription = sprintf(
		/* translators: %1$s is replaced by "Yoast SEO". */
		__( "The %1$s Schema Framework automatically builds a single, connected Schema graph for your site.", "wordpress-seo" ),
		"Yoast SEO"
	);

	const toggleDescription = useMemo( () => safeCreateInterpolateElement(
		sprintf(
			/* translators: %1$s and %2$s are replaced by opening and closing <a> tags. */
			__( "Add %1$sstructured data%2$s to your pages, helping search engines and LLMs understand your content and display it in rich results.", "wordpress-seo" ),
			"<a>",
			"</a>"
		), {
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a id="structured-data-link" href={ seeMoreLink } target="_blank" rel="noopener noreferrer" />,
		}
	), [ seeMoreLink ] );

	const schemaForDevsDescription = useMemo( () => safeCreateInterpolateElement(
		sprintf(
			/* translators: %1$s and %2$s are replaced by opening and closing <a> tags for Schema API link. %3$s and %4$s are replaced by opening and closing <a> tags for Schema documentation link. */
			__( "Fine-tune how your site's data appears with our %1$sSchema API%2$s and WordPress filters. For full details and setup guidance, visit the %3$sSchema documentation%4$s.", "wordpress-seo" ),
			"<a1>",
			"</a1>",
			"<a2>",
			"</a2>"
		), {
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a1: <a href={ schemaApiLink } target="_blank" rel="noopener noreferrer" />,
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a2: <a href={ schemaDocumentationLink } target="_blank" rel="noopener noreferrer" />,
		}
	), [ schemaApiLink, schemaDocumentationLink ] );

	const disabledSchemaAlert = useMemo( () => safeCreateInterpolateElement(
		sprintf(
			/*
			 * translators: %1$s expands to `wpseo_json_ld_output`, %2$s expands to `false,
			 * %3$s and %4$s are replaced by opening and closing <a> tags
			 */
			__( "It looks like the Yoast Schema Framework is disabled. The %1$s filter has been set to %2$s or an empty array, which turns off Schema output. %3$sLearn more about the filter%4$s.", "wordpress-seo" ),
			"<code1 />",
			"<code2 />",
			"<a>",
			"</a>"
		), {
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a id="llms-filter-learn-more-link" href={ learnMoreFilterLink } />,
			code1: <Code>wpseo_json_ld_output</Code>,
			code2: <Code>false</Code>,
		}
	), [ learnMoreFilterLink ] );

	return (
		<RouteLayout
			title={ __( "Schema Framework", "wordpress-seo" ) }
			description={ featureDescription }
		>
			<FormLayout>
				<div className="yst-max-w-5xl">
					<fieldset className="yst-min-width-0 yst-space-y-8">
						{ ( isSchemaDisabledProgrammatically ) && <Alert id="disabled-schema-alert" variant="info" className="yst-max-w-xl">
							<span className="yst-block yst-font-medium yst-mb-2">{ __( "Schema output disabled", "wordpress-seo" ) }</span>
							{ disabledSchemaAlert }
						</Alert> }

						<div className="yst-relative yst-max-w-sm">
							<ToggleField
								id="input-wpseo.enable_schema"
								label={ __( "Enable Schema Framework", "wordpress-seo" ) }
								description={ toggleDescription }
								checked={ enabledSchemaFramework }
								onChange={ handleToggleChange }
							/>
						</div>
					</fieldset>
				</div>
				<hr className="yst-my-8 yst-w-3/4" />
				<SchemaApiIntegrationsSection />
				<hr className="yst-my-8 yst-w-3/4" />
				<fieldset className="yst-min-w-0">
					<div className="yst-max-w-screen-sm">
						<span className="yst-block yst-font-medium yst-text-slate-800">{ __( "Schema for devs", "wordpress-seo" ) }</span>
						<p className="yst-mt-1">{ schemaForDevsDescription }</p>
					</div>
				</fieldset>
			</FormLayout>
			<SchemaDisableConfirmationModal
				isOpen={ isModalOpen }
				onClose={ handleModalClose }
				onConfirm={ handleModalConfirm }
			/>
		</RouteLayout>
	);
};

export default SchemaFramework;
