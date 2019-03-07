import React from "react";
import ReactDOM from "react-dom";
import ScreenReaderText from "./a11y/ScreenReaderText";
import ScreenReaderShortcut from "./a11y/ScreenReaderShortcut";

class App extends React.Component {
	/**
	 * Renders a screen reader text example.
	 *
	 * @returns {ReactElement} The rendered element.
	 */
	render() {
		return (
			<div>
				Below this line is a hidden link to another segment of this page. Tab to view it:
				<ScreenReaderShortcut anchor="linklist">Jump to the list of links</ScreenReaderShortcut>
				<div style={ { padding: "30px" } }>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut pulvinar mi, ut rhoncus magna.
					Etiam eget massa sed urna vulputate vulputate non sed mi.
					Etiam sagittis vehicula augue, vitae tincidunt nisi faucibus et. Curabitur id massa arcu.
					In sit amet ex nec mauris sollicitudin laoreet.
					Integer fermentum nibh nisi, et pharetra augue fermentum elementum.
					Aliquam imperdiet lectus eu ante tempor, eu rutrum ex euismod.
					Nam neque purus, aliquet faucibus dui in, blandit volutpat velit.
				</div>
				<div style={ { padding: "30px" } }>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut pulvinar mi, ut rhoncus magna.
					Etiam eget massa sed urna vulputate vulputate non sed mi.
					Etiam sagittis vehicula augue, vitae tincidunt nisi faucibus et. Curabitur id massa arcu.
					In sit amet ex nec mauris sollicitudin laoreet.
					Integer fermentum nibh nisi, et pharetra augue fermentum elementum.
					Aliquam imperdiet lectus eu ante tempor, eu rutrum ex euismod.
					Nam neque purus, aliquet faucibus dui in, blandit volutpat velit.
				</div>
				<div style={ { padding: "30px" } }>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut pulvinar mi, ut rhoncus magna.
					Etiam eget massa sed urna vulputate vulputate non sed mi.
					Etiam sagittis vehicula augue, vitae tincidunt nisi faucibus et. Curabitur id massa arcu.
					In sit amet ex nec mauris sollicitudin laoreet.
					Integer fermentum nibh nisi, et pharetra augue fermentum elementum.
					Aliquam imperdiet lectus eu ante tempor, eu rutrum ex euismod.
					Nam neque purus, aliquet faucibus dui in, blandit volutpat velit.
				</div>
				<div style={ { padding: "30px" } }>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut pulvinar mi, ut rhoncus magna.
					Etiam eget massa sed urna vulputate vulputate non sed mi.
					Etiam sagittis vehicula augue, vitae tincidunt nisi faucibus et. Curabitur id massa arcu.
					In sit amet ex nec mauris sollicitudin laoreet.
					Integer fermentum nibh nisi, et pharetra augue fermentum elementum.
					Aliquam imperdiet lectus eu ante tempor, eu rutrum ex euismod.
					Nam neque purus, aliquet faucibus dui in, blandit volutpat velit.
				</div>
				<div style={ { padding: "30px" } }>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut pulvinar mi, ut rhoncus magna.
					Etiam eget massa sed urna vulputate vulputate non sed mi.
					Etiam sagittis vehicula augue, vitae tincidunt nisi faucibus et. Curabitur id massa arcu.
					In sit amet ex nec mauris sollicitudin laoreet.
					Integer fermentum nibh nisi, et pharetra augue fermentum elementum.
					Aliquam imperdiet lectus eu ante tempor, eu rutrum ex euismod.
					Nam neque purus, aliquet faucibus dui in, blandit volutpat velit.
				</div>
				<div id="linklist" style={ { padding: "30px" } }>
					Here is a list of links with screen reader text added to them. Use a screen reader to see what is added:
					<ul>
						<li>
							<a href="https://yoast.com">Yoast.com<ScreenReaderText>, the main website of Yoast.</ScreenReaderText></a>
						</li>
						<li>
							<a href="https://yoast.nl">Yoast.nl<ScreenReaderText>, the Dutch home of Yoast.</ScreenReaderText></a>
						</li>
						<li>
							<a href="https://github.com/yoast">Github.com/Yoast<ScreenReaderText>,
								where all Yoast open source software is hosted.</ScreenReaderText></a>
						</li>
					</ul>
				</div>
				<div style={ { padding: "30px" } }>
					Aliquam dolor odio, ornare ac semper in, ornare a tellus. Sed et varius magna.
					Duis et eleifend sem, ac luctus justo. Donec vel eros aliquet, consequat odio ac, interdum tortor.
					Etiam placerat ex vel interdum gravida. In hac habitasse platea dictumst. Fusce nec egestas nisi.
					Aliquam in leo non justo consequat maximus. Morbi pellentesque et velit eu fringilla.
					Suspendisse cursus elit facilisis massa pharetra pellentesque.
					Vestibulum aliquam tortor nec lacus blandit laoreet. Cras et posuere elit, sit amet congue nisl.
					Donec dolor mauris, feugiat at ipsum venenatis, porttitor fringilla nisl.
				</div>
				<div style={ { padding: "30px" } }>
					Aliquam dolor odio, ornare ac semper in, ornare a tellus. Sed et varius magna.
					Duis et eleifend sem, ac luctus justo. Donec vel eros aliquet, consequat odio ac, interdum tortor.
					Etiam placerat ex vel interdum gravida. In hac habitasse platea dictumst. Fusce nec egestas nisi.
					Aliquam in leo non justo consequat maximus. Morbi pellentesque et velit eu fringilla.
					Suspendisse cursus elit facilisis massa pharetra pellentesque.
					Vestibulum aliquam tortor nec lacus blandit laoreet. Cras et posuere elit, sit amet congue nisl.
					Donec dolor mauris, feugiat at ipsum venenatis, porttitor fringilla nisl.
				</div>
				<div style={ { padding: "30px" } }>
					Aliquam dolor odio, ornare ac semper in, ornare a tellus. Sed et varius magna.
					Duis et eleifend sem, ac luctus justo. Donec vel eros aliquet, consequat odio ac, interdum tortor.
					Etiam placerat ex vel interdum gravida. In hac habitasse platea dictumst. Fusce nec egestas nisi.
					Aliquam in leo non justo consequat maximus. Morbi pellentesque et velit eu fringilla.
					Suspendisse cursus elit facilisis massa pharetra pellentesque.
					Vestibulum aliquam tortor nec lacus blandit laoreet. Cras et posuere elit, sit amet congue nisl.
					Donec dolor mauris, feugiat at ipsum venenatis, porttitor fringilla nisl.
				</div>
				<div style={ { padding: "30px" } }>
					Aliquam dolor odio, ornare ac semper in, ornare a tellus. Sed et varius magna.
					Duis et eleifend sem, ac luctus justo. Donec vel eros aliquet, consequat odio ac, interdum tortor.
					Etiam placerat ex vel interdum gravida. In hac habitasse platea dictumst. Fusce nec egestas nisi.
					Aliquam in leo non justo consequat maximus. Morbi pellentesque et velit eu fringilla.
					Suspendisse cursus elit facilisis massa pharetra pellentesque.
					Vestibulum aliquam tortor nec lacus blandit laoreet. Cras et posuere elit, sit amet congue nisl.
					Donec dolor mauris, feugiat at ipsum venenatis, porttitor fringilla nisl.
				</div>
				<div style={ { padding: "30px" } }>
					Aliquam dolor odio, ornare ac semper in, ornare a tellus. Sed et varius magna.
					Duis et eleifend sem, ac luctus justo. Donec vel eros aliquet, consequat odio ac, interdum tortor.
					Etiam placerat ex vel interdum gravida. In hac habitasse platea dictumst. Fusce nec egestas nisi.
					Aliquam in leo non justo consequat maximus. Morbi pellentesque et velit eu fringilla.
					Suspendisse cursus elit facilisis massa pharetra pellentesque.
					Vestibulum aliquam tortor nec lacus blandit laoreet. Cras et posuere elit, sit amet congue nisl.
					Donec dolor mauris, feugiat at ipsum venenatis, porttitor fringilla nisl.
				</div>
				<div style={ { padding: "30px" } }>
					Aliquam dolor odio, ornare ac semper in, ornare a tellus. Sed et varius magna.
					Duis et eleifend sem, ac luctus justo. Donec vel eros aliquet, consequat odio ac, interdum tortor.
					Etiam placerat ex vel interdum gravida. In hac habitasse platea dictumst. Fusce nec egestas nisi.
					Aliquam in leo non justo consequat maximus. Morbi pellentesque et velit eu fringilla.
					Suspendisse cursus elit facilisis massa pharetra pellentesque.
					Vestibulum aliquam tortor nec lacus blandit laoreet. Cras et posuere elit, sit amet congue nisl.
					Donec dolor mauris, feugiat at ipsum venenatis, porttitor fringilla nisl.
				</div>
				<div style={ { padding: "30px" } }>
					Aliquam dolor odio, ornare ac semper in, ornare a tellus. Sed et varius magna.
					Duis et eleifend sem, ac luctus justo. Donec vel eros aliquet, consequat odio ac, interdum tortor.
					Etiam placerat ex vel interdum gravida. In hac habitasse platea dictumst. Fusce nec egestas nisi.
					Aliquam in leo non justo consequat maximus. Morbi pellentesque et velit eu fringilla.
					Suspendisse cursus elit facilisis massa pharetra pellentesque.
					Vestibulum aliquam tortor nec lacus blandit laoreet. Cras et posuere elit, sit amet congue nisl.
					Donec dolor mauris, feugiat at ipsum venenatis, porttitor fringilla nisl.
				</div>
			</div>
		);
	}
}

ReactDOM.render( <App />, document.getElementById( "container" ) );
