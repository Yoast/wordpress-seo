import PropTypes from "prop-types";
import { Button } from "@yoast/components";

/**
 * The WorkoutCard component
 *
 * @param {Object} props The props object.
 *
 * @returns {WPElement} The WorkoutCard component
 */
export default function WorkoutCard( {
	title,
	subtitle,
	usps,
	image,
	steps,
	finishedSteps,
	upsell,
	workout,
	badges,
	priority,
} ) {
	return <div className="card card-small">
		<h2>{ title }{ badges }</h2>
		<h3>{ subtitle }</h3>
		<ul>
			{
				usps.map( ( usp, index ) => <li key={ `${ title }-${ index }` }>{ usp }</li> )
			}
		</ul>
		<img src={ image } alt="" />
		<Button variant="primary">{ "Start workout" }</Button>
	</div>;
}

WorkoutCard.propTypes = {
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string.isRequired,
	usps: PropTypes.arrayOf( PropTypes.string ).isRequired,
	image: PropTypes.string,
	steps: PropTypes.arrayOf( PropTypes.string ).isRequired,
	finishedSteps: PropTypes.arrayOf( PropTypes.string ).isRequired,
	upsell: PropTypes.element,
	workout: PropTypes.element,
	badges: PropTypes.arrayOf( PropTypes.element ),
	priority: PropTypes.number,
};

WorkoutCard.defaultProps = {
	image: "https://www.fillmurray.com/150/150",
	upsell: () => {},
	workout: () => {},
	badges: [],
	priority: 50,
};
