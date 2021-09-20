import { useState } from "@wordpress/element";
import PropTypes from "prop-types";
import Navigation from "./navigation";
import Step1 from "./step-1";
import Step2 from "./step-2";
import Step3 from "./step-3";
import Step4 from "./step-4";
import Step5 from "./step-5";

const stepComponents = {
	1: Step1,
	2: Step2,
	3: Step3,
	4: Step4,
	5: Step5,
};

/**
 * @returns {JSX.Element} The Wizard component.
 */
export default function Wizard( { navigateWhenDone, options } ) {
	const [ step, setStep ] = useState( 1 );
	const StepComponent = stepComponents[ step ];

	return <div className="lg:yst-flex yst-items-center yst-w-full md:yst-ml-32">
		<StepComponent
			navigation={
				<Navigation
					step={ step }
					setStep={ setStep }
					maxSteps={ Object.keys( stepComponents ).length }
					navigateWhenDone={ navigateWhenDone }
				/>
			}
			options={ options }
		/>
	</div>;
}

Wizard.propTypes = {
	navigateWhenDone: PropTypes.func,
	options: PropTypes.object,
};

Wizard.defaultProps = {
	navigateWhenDone: () => {},
	options: {},
};
