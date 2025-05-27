import { SlotFillProvider } from "@wordpress/components";
import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { HashRouter } from "react-router-dom";
import { Formik } from "formik";
import App from "./app";
import { REDIRECT_TYPE_OPTIONS } from "./constants";
import registerStore from "./store";
import { createValidationSchema } from "./helpers/validation";
import { handleSubmit } from "./helpers";

domReady( () => {
	const root = document.getElementById( "yoast-seo-redirects" );
	if ( ! root ) {
		return;
	}
	registerStore( {
		initialState: {},
	} );


	const initialValues = {
		redirectType: REDIRECT_TYPE_OPTIONS[ 0 ]?.value || "",
		oldUrl: "",
		newUrl: "",
	};

	render(
		<Root>
			<SlotFillProvider>
				<HashRouter>
					<Formik
						initialValues={ initialValues }
						validationSchema={ createValidationSchema( {} ) }
						onSubmit={ handleSubmit }
					>
						<App />
					</Formik>
				</HashRouter>
			</SlotFillProvider>
		</Root>,
		root
	);
} );
