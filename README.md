# @monesidn/typescript-utils

A collection of small utilities that I use almost everyday in TS projects. The best way to explore the project is checking the generated typedoc documentation.

## API

You can explore the generated API definition here:
https://monesidn.github.io/typescript-utils

## Most important pieces

While there are many small utilities in this library there a few larger ones that are worth documenting here.

### LoggerManager

This is a simple yet powerful logging utility. I created it because winston logger for too complicated to be used in the browser
and I did not need advanced features. If you need a complex API do not rely on this, but if you need a quick way to handle logs with the ability of disabling selectively you'll find it useful.

For more information see:
https://monesidn.github.io/typescript-utils/classes/LoggerManagerClass.html

### TaskRunner

Ever had the need of running an unknown number of async task concurrently? I got you covered. The TaskRunner class does
exactly this abstracting away all the complexity of orchestrating the workers and the error handling.

For more information see:
https://monesidn.github.io/typescript-utils/classes/TaskRunner.html

### Events

I don't know you, but I'm tired of node "event" package. How it interacts with typescript and the fact that is not available in browser (without an external library naturally) is terrible. Well I decided to come up with my own event API loosely based on the EventEmitter class defined by Angular 2+.

For more information see:
https://monesidn.github.io/typescript-utils/classes/EventsSource.html
