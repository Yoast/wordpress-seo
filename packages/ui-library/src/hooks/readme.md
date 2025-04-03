# Hooks

## useBeforeUnload
The `useBeforeUnload` hook is fired when the window, the document and its resources are about to be unloaded.
This hook accept a boolean value that indicates when this functionality should be active.

### Related
* https://developer.mozilla.org/en-US/docs/Web/API/BeforeUnloadEvent

### Usage/Examples
~~~javascript
import { useBeforeUnload } from from "@yoast/ui-library";

const Component = () => {
    const [ hasUnsavedChanges, setHasUnsavedChanges ] = useState( false );

    useBeforeUnload( hasUnsavedChanges );

    return <div />;
};
~~~

## useDescribedBy
The `useDescribedBy` hook creates ids and describedBy based on an ID and the given list of "props".

This is a helper hook to create IDs and the `aria-describedby` for our form field components.

Accepts id (string) and list (object) and returns object with `ids` and `describedBy`.

### Related
* https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby

### Usage/Examples
~~~javascript
import { useDescribedBy } from from "@yoast/ui-library";

const Component = () => {
    const { ids, describedBy } = useDescribedBy( id, { error, description } );

    return <div />;
};
~~~

## useKeydown
The `useKeydown` hook adds and removes a listener to the document' `keydown` event.
The hook accepts a callback function that is called when the event is triggered.
The callback function receives the KeyboardEvent as an argument.

### Related
* https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
* https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent

### Usage/Examples
~~~javascript
import { useKeydown } from from "@yoast/ui-library";

const Component = () => {
  useKeydown( ( event ) => {
    if ( event.key === "Escape" ) {
      console.log( "Escape key pressed" );
    }
  }, document );

  return <div/>;
};

~~~

## useMediaQuery
The `useMediaQuery` hook creates a media query and returns a boolean that informs whether the query is met.

Accepts `mediaQueryString` (string) The media query to check against.
Returns an object with a .matches field that is true if the media query is met.

### Related
* https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia

### Usage/Examples
~~~javascript
import { useMediaQuery } from from "@yoast/ui-library";

const Component = () => {
    const isSingleColumn = ! useMediaQuery( "(min-width: 1536px)" ).matches;

    return <div />;
};
~~~

## usePrevious
The `usePrevious` hook accepts the initial value and return the previous value.

### Usage/Examples
~~~javascript
import { usePrevious } from from "@yoast/ui-library";

const Component = () => {
    const previousCompanyOrPerson = usePrevious( companyOrPerson );

    return <div />;
};
~~~

## useRootContext

The `useRootContext` hook returns the root context.

### Usage/Examples
~~~javascript
import { useRootContext } from from "@yoast/ui-library";

const Component = () => {
    const { isRtl } = useRootContext();

    return <div className={ isRtl ? "yst-ml-4" : "yst-mr-4" } />

};
~~~

## useSvgAria

The `useSvgAria` hook creates aria attributes for an SVG.
Accepts boolean value to indicate if it should be focusable, returns object with `role` and `aria-hidden` and optionally `focusable`.

### Related
* https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/img_role
* https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden
* https://www.w3.org/TR/SVGTiny12/interact.html#focusable-attr

### Usage/Examples
~~~javascript
import { useSvgAria } from from "@yoast/ui-library";

const Component = () => {
    const ariaSvgProps = useSvgAria();

    return <RandomIcon { ...ariaSvgProps } />;
};
~~~

## useToggleState

The `useToggleState` hook creates a toggle state.
Accepts boolean value the initial state, defaults to true, returns the state, toggleState, setState, setTrue and setFalse in that order.

The order of the returned values is significant. If you use only some values, and they are not in the beginning of the array, you have to leave empty space for the unused values.

Correct usage example:

~~~javascript
const [ state, toggleState ] = useToggleState();

const [ state, , , setTrue, setFalse ] = useToggleState();
~~~

### Usage/Examples

~~~javascript
import { useToggleState } from from "@yoast/ui-library";

const Component = () => {
   const [ state, toggleState, setState, setTrue, setFalse ] = useToggleState();

   return (
       <div>
           <button onClick={ toggleState }>Click Here to Toggle state</button>
           <button onClick={ setTrue }>Click Here to change state to true</button>
           <button onClick={ setFalse }>Click Here to change state to false</button>
           <button onClick={ () => setState( true ) }>setState to true</button>
           <button onClick={ () => setState( false ) }>setState to false</button>

           { state ? <div>State is true</div>:<div>State is false</div> }
        </div>
    );
};
~~~
