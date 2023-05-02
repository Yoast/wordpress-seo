In addition to the default, hover, and focus states, two other button states have been specified:

1. **Loading state**<br>
The loading state is used when a button click triggers a process that takes some time to complete, such as running a data optimization or uploading a file. It is important to indicate to the user that an action is happening, and the loading state provides feedback that the system is working. The loading state will be represented by a spinner to indicate to the user that the process is ongoing.

2. **Disabled state**<br>
The disabled state, represented by a transparent button, is used when the button cannot be clicked due to a certain condition. The disabled state should be used when the user is not eligible to perform the action due to reasons such as insufficient permissions, lack of connectivity, or a disabled setting.

<div class="alert" style="background-color:#DBEAFE; color:#1E40AF; padding:16px; border-radius:6px; display:flex; align-items:center;">
  <div>
    <font size="2">**Note:** The disabled state does not remove pointer-events. If you want to remove pointer-events, do it manually using a `className`.</font>
  </div>
</div>
