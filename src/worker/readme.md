## Analysis Webworker
The purpose of the Analysis Webworker is to not block the UI with the execution of analyses.

#### Plugin
The role of the plugin is fulfilled by wordpress-seo or the webpack example of this repository.

#### AnalysisWrapper
The wrapper is the API for the worker. Meaning that the plugin should not have to know about there being a worker. It should just be able to request a command and get a result back asynchronously.

#### AnalysisWorker
The worker actually does all the work. It does this in it’s own workspace, so it relies on messages (from and to the Wrapper) for what to do. The worker picks up the last queued task to work on and (still to be implemented!) throws away the rest of the tasks in the queue.


### Command flow

![Command flow](http://www.plantuml.com/plantuml/png/SoWkIImgAStDuGh8AKtFp5FGjLC8BqeiA4Wjib9mp4lCgQnAvO8AWENoYxAHfI1yJ5t5cSKAHQd5fJabnSZQ8PPWKUEGcfS2T0K0)
See this on [PlantUML](http://www.plantuml.com/plantuml/png/SoWkIImgAStDuGh8AKtFp5FGjLC8BqeiA4Wjib9mp4lCgQnAvO8AWENoYxAHfI1yJ5t5cSKAHQd5fJabnSZQ8PPWKUEGcfS2T0K0)

The Wrapper returns a Promise which resolves to data and possible rejects to an error message.
The Wrapper encodes the payload when sending the message to the Worker, and vice versa.
