The `ImageSelect` component provides a user-friendly interface for selecting, previewing, and managing images. It consists of a preview area that displays the selected image (or a placeholder when no image is selected) and action buttons for selecting, replacing, and removing images.

## Features

- **Image Preview**: Displays the selected image with customizable dimensions
- **Placeholder State**: Shows a photograph icon and optional description when no image is selected
- **Loading State**: Displays a loading indicator while images are being processed
- **Replace Functionality**: Allows users to replace an existing image
- **Remove Functionality**: Provides the ability to remove a selected image
- **Accessibility**: Fully accessible with proper ARIA labels and keyboard navigation
- **Disabled State**: Supports disabling all interactions when needed

## Usage

The component uses a compound component pattern with three main parts:

### Basic Usage

```javascript
import { ImageSelect } from "@yoast/ui-library";

function MyComponent() {
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectImage = () => {
    setIsLoading(true);
    // Your image selection logic here
    // Once image is selected:
    setImageUrl("https://example.com/image.jpg");
    setIsLoading(false);
  };

  const handleRemoveImage = () => {
    setImageUrl("");
  };

  return (
    <ImageSelect
      label="Social image"
      imageUrl={imageUrl}
      selectButtonLabel="Select image"
      replaceButtonLabel="Replace image"
      onSelectImage={handleSelectImage}
      isLoading={isLoading}
      isDisabled={false}
      id="my-image-select"
    >
      <ImageSelect.Preview 
        imageAltText="Selected image preview"
        size="medium-rect"
        selectDescription="No image selected"
      />
      <ImageSelect.Buttons 
        removeLabel="Remove image"
        onRemoveImage={handleRemoveImage}
      />
    </ImageSelect>
  );
}
```

## Component Structure

### ImageSelect (Root Component)

The root component manages the shared state and context for child components.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `string` | Yes | - | The label displayed above the image selector |
| `imageUrl` | `string` | Yes | - | The URL of the selected image |
| `selectButtonLabel` | `string` | Yes | - | The label for the select image button |
| `replaceButtonLabel` | `string` | Yes | - | The label for the replace image button (shown when image is selected) |
| `onSelectImage` | `function` | Yes | - | Callback called when the select or replace image button is clicked |
| `isDisabled` | `boolean` | Yes | - | Whether the image selector and buttons are disabled |
| `isLoading` | `boolean` | No | `false` | Whether the image is currently loading |
| `id` | `string` | Yes | - | The ID for the component and input elements |
| `className` | `string` | No | `""` | Additional CSS classes for the root element |
| `children` | `node` | Yes | - | Child components (Preview and Buttons) |

### ImageSelect.Preview

Displays the image preview or a placeholder when no image is selected.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `imageAltText` | `string` | Yes | - | The alt text for the image preview |
| `size` | `string` | No | `"default"` | Predefined size preset: `"default"` (8rem square), `"medium-rect"` (12rem × 24rem), or `"medium-square"` (12rem square) |
| `className` | `string` | No | `""` | Additional CSS classes for the preview container. Use this to override or customize the size beyond the presets |
| `selectDescription` | `string` | No | `""` | Optional description text shown in the placeholder state |

### ImageSelect.Buttons

Renders the action buttons for selecting, replacing, and removing images.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `removeLabel` | `string` | Yes | - | The label for the remove image button |
| `onRemoveImage` | `function` | Yes | - | Callback called when the remove image button is clicked |

## States

### Empty State
When `imageUrl` is empty:
- Shows a photograph icon
- Displays the `selectDescription` text (if provided)
- Shows a dashed border around the preview area
- Shows the "Select" button

### Image Selected State
When `imageUrl` contains a valid URL:
- Displays the selected image
- Shows the "Replace" button
- Shows the "Remove" button (as a link)

### Loading State
When `isLoading` is `true`:
- Adds a loading indicator to the button
- Shows a semi-transparent overlay on the image
- Changes cursor to wait state
- Disables all interactions

### Disabled State
When `isDisabled` is `true`:
- Disables all buttons and the preview area
- Visual feedback indicates disabled state

## Styling

The component provides two ways to control the preview area dimensions:

### Using the `size` Prop (Recommended)

Use predefined size presets via the `size` prop for the preview area:

| Size Value | Dimensions | CSS Classes |
|------------|------------|-------------|
| `"default"` | 8rem square with 5rem min height | `yst-max-h-32 yst-w-32 yst-min-h-20` |
| `"medium-rect"` | 12rem height × 24rem width | `yst-h-48 yst-w-96` |
| `"medium-square"` | 12rem square | `yst-h-48 yst-w-48` |
| `"custom"` | Custom dimensions via `className` | No default classes, use `className` to set dimensions |

## Accessibility

The component is built with accessibility in mind:

- **ARIA labels**: Proper `aria-labelledby` attributes connect labels with controls
- **Keyboard navigation**: All interactive elements are keyboard accessible
- **Screen reader support**: Hidden labels provide context for screen readers
- **Focus management**: Appropriate focus indicators for keyboard users
- **Disabled state**: Properly communicated to assistive technologies

## Best Practices

1. **Always provide meaningful labels**: Use descriptive text for buttons and image alt text
2. **Handle loading states**: Set `isLoading={true}` during async operations
3. **Validate image URLs**: Ensure the `imageUrl` prop contains a valid URL
4. **Error handling**: Implement proper error handling in your `onSelectImage` callback
5. **Size the preview appropriately**: Use the `size` prop for standard sizes, or `className` for custom dimensions
6. **Provide context**: Use `selectDescription` to guide users when no image is selected

## Example: With Loading State

```javascript
function ImageSelectWithLoading() {
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectImage = async () => {
    setIsLoading(true);
    try {
      // Simulate image upload or selection
      const newImageUrl = await uploadImage();
      setImageUrl(newImageUrl);
    } catch (error) {
      console.error("Failed to select image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
  };

  return (
    <ImageSelect
      label="Profile picture"
      imageUrl={imageUrl}
      selectButtonLabel="Choose photo"
      replaceButtonLabel="Change photo"
      onSelectImage={handleSelectImage}
      isLoading={isLoading}
      isDisabled={false}
      id="profile-picture"
    >
      <ImageSelect.Preview 
        imageAltText="Profile picture preview"
        size="medium-square"
        selectDescription="Choose a profile picture"
      />
      <ImageSelect.Buttons 
        removeLabel="Remove photo"
        onRemoveImage={handleRemoveImage}
      />
    </ImageSelect>
  );
}
```

## Context API

The component uses React Context to share state between the root component and its children. If you need to create custom child components, you can access the context using the `useImageSelectContext` hook:

```javascript
import { useImageSelectContext } from "./hooks";

function CustomComponent() {
  const { 
    imageUrl, 
    buttonLabel, 
    onSelectImage, 
    id, 
    isDisabled, 
    isLoading 
  } = useImageSelectContext();
  
  // Your custom component logic
}
```

## Notes

- The component is built using a compound component pattern for maximum flexibility
- The Preview component is clickable and triggers the same action as the Select/Replace button
- The Remove button only appears when an image is selected
- All child components must be used within the `ImageSelect` root component to access the shared context
