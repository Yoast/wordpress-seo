import React from "react";
import PropTypes from "prop-types";

const Loader = ( { className } ) => {
	if ( className !== "" ) {
		className += " ";
	}

	className += "yoast-loader";

	return (
		<svg version="1.1" id="Y__x2B__bg" x="0px" y="0px" viewBox="0 0 500 500" className={ className }>
			<g>
				<g>
					<linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="250" y1="428.6121" x2="250" y2="77.122">
						<stop  offset="0" style={ { stopColor: "#570732" } } />
						<stop  offset="2.377558e-02" style={ { stopColor: "#5D0936" } } />
						<stop  offset="0.1559" style={ { stopColor: "#771549" } } />
						<stop  offset="0.3019" style={ { stopColor: "#8B1D58" } } />
						<stop  offset="0.4669" style={ { stopColor: "#992362" } } />
						<stop  offset="0.6671" style={ { stopColor: "#A12768" } } />
						<stop  offset="1" style={ { stopColor: "#A4286A" } } />
					</linearGradient>
					<path
						fill="url(#SVGID_1_)" d="M454.7,428.6H118.4c-40.2,0-73.2-32.9-73.2-73.2V150.3c0-40.2,32.9-73.2,73.2-73.2h263.1
						c40.2,0,73.2,32.9,73.2,73.2V428.6z"
					/>
				</g>
				<g>
					<g>
						<g>
							<g>
								<path
									fill="#A4286A" d="M357.1,102.4l-43.8,9.4L239.9,277l-47.2-147.8h-70.2l78.6,201.9c6.7,17.2,6.7,36.3,0,53.5
									c-6.7,17.2,45.1-84.1,24.7-75.7c0,0,34.9,97.6,36.4,94.5c7-14.3,13.7-30.3,20.2-48.5L387.4,72
									C387.4,72,358.4,102.4,357.1,102.4z"
								/>
							</g>
						</g>
					</g>
				</g>
				<g>
					<linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="266.5665" y1="-6.9686" x2="266.5665" y2="378.4586">
						<stop  offset="0" style={ { stopColor: "#77B227" } } />
						<stop  offset="0.4669" style={ { stopColor: "#75B027" } } />
						<stop  offset="0.635" style={ { stopColor: "#6EAB27" } } />
						<stop  offset="0.7549" style={ { stopColor: "#63A027" } } />
						<stop  offset="0.8518" style={ { stopColor: "#529228" } } />
						<stop  offset="0.9339" style={ { stopColor: "#3C7F28" } } />
						<stop  offset="1" style={ { stopColor: "#246B29" } } />
					</linearGradient>
					<path
						fill="url(#SVGID_2_)" d="M337,6.1l-98.6,273.8l-47.2-147.8H121L199.6,334c6.7,17.2,6.7,36.3,0,53.5
						c-8.8,22.5-23.4,41.8-59,46.6v59.9c69.4,0,106.9-42.6,140.3-136.1L412.1,6.1H337z"
					/>
					<path
						fill="#FFFFFF" d="M140.6,500h-6.1v-71.4l5.3-0.7c34.8-4.7,46.9-24.2,54.1-42.7c6.2-15.8,6.2-33.2,0-49l-81.9-210.3h83.7
						l43.1,134.9L332.7,0h88.3L286.7,359.9c-17.9,50-36.4,83.4-58.1,105.3C205,488.9,177,500,140.6,500z M146.7,439.2v48.3
						c29.9-1.2,53.3-11.1,73.1-31.1c20.4-20.5,38-52.6,55.3-100.9L403.2,12.3h-61.9L238.1,299l-51.3-160.8H130l75.3,193.5
						c7.3,18.7,7.3,39.2,0,57.9C197.7,409.3,184.1,432.4,146.7,439.2z"
					/>
				</g>
			</g>
		</svg>
	);
};

Loader.propTypes = {
	className: PropTypes.string,
};

export default Loader;
