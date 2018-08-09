## Analysis Webworker
The purpose of the Analysis Webworker is to not block the UI with the execution of analyses.

#### Plugin
The role of the plugin is fulfilled by wordpress-seo or the webpack example of this repository.

#### AnalysisWorkerWrapper
The wrapper is the API for the worker. Meaning that the plugin should not have to know about there being a worker. It should just be able to request a command and get a result back asynchronously.

##### Request
A request holds the promise information (resolve & reject) along with optional extra data. Its purpose is to match a request with a response.

##### Result
A result object contains the payload and optional extra data. 

#### AnalysisWebWorker
The worker actually does all the work. It does this in it’s own workspace, so it relies on messages (from and to the Wrapper) for what to do. The worker picks up the last queued task to work on and (still to be implemented!) throws away the rest of the tasks in the queue.

##### Scheduler
The scheduler polls for if it has a task to run. This is meant to give control over the queue. Currently this gets emptied after a task ran.

##### Task
A task does the work (execute) and returns the result (done).

### Command flow

![Command flow](http://www.plantuml.com/plantuml/png/VP3FIiOm4CJlVOezLcXzW1wa1o_UYWgUbsQjeJ79bpyVLF7TtQqXH0Hlk-nl9fEPOyAGyhlf5fCtRM6yWvU0tbEO02sQuuDwM91tkEdA1SQMMWDXeaUwP8hfGVKDnfGB-oyhhGRu12-60wpElkej1qpQMVYI5qvUb4_h6wbiH1pBsBDIzCMi3lVEykBnC0xLQLF5ulICSMyI58ufEVmDANObQA2OJQgnQZd_myttVqgTeBHpoumpLnPKU2QhkFvl)
See this on [PlantUML](http://www.plantuml.com/plantuml/uml/VP3FIiOm4CJlVOezLcXzW1wa1o_UYWgUbsQjeJ79bpyVLF7TtQqXH0Hlk-nl9fEPOyAGyhlf5fCtRM6yWvU0tbEO02sQuuDwM91tkEdA1SQMMWDXeaUwP8hfGVKDnfGB-oyhhGRu12-60wpElkej1qpQMVYI5qvUb4_h6wbiH1pBsBDIzCMi3lVEykBnC0xLQLF5ulICSMyI58ufEVmDANObQA2OJQgnQZd_myttVqgTeBHpoumpLnPKU2QhkFvl)

The Wrapper returns a Promise which resolves to data and possible rejects to an error message.
The Wrapper encodes the payload when sending the message to the Worker, and vice versa.
