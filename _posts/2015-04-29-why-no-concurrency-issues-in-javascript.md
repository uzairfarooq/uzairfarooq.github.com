---
published: true
layout: post
title: "Why there are no concurrency issues in javascript?"
description: ""
category: null
tags: []
---



We don't have semaphores, mutexes or any other concurrency control tool in javascript, ever wondered why? Having background in c++, when I moved to javascript, every other part of code left me wondering about race conditions.

Lets consider a code snippet that sends all mouse movements to server every 10 seconds.

{% highlight javascript %}
var queue = [];

setInterval(function() {
    sendMouseMovements(mouseLocations);
    queue = [];
}, 10000);

$(document).mousemove(function(e) {
    queue.push("X:" + e.clientX + " Y:" + e.clientY);
});

{% endhighlight %}

Suppose line `sendMouseMovements(mouseLocations)` gets executed and sends pending values to server but before clearing the queue `queue = []` it gets pre-empted to process mousemove event i.e. `queue.push("X:" + e.clientX + " Y:" + e.clientY)`. Now a new value is inserted to queue which isn't yet sent to server. The previous event resumes from line `queue = []` and clears the queue including the newly inserted value which wasn't processed. There's a race condition, right? 

Well, that is a race condition but it's never gonna occur in javascript. Someone may have told you it's because javascript is single-threaded and single-threaded applications can never face such concurrency issues. This is true only in case of non-scripting languages because you can't have asynchronous code in single-threaded non-scripting languages. But in javascript you have a whole lot of asynchronous code i.e. ajax requests, timers etc (if you're interested to know how it handles asynchronous code blocks, see [How Single Thread Handle Asynchronous Code](http://www.quora.com/How-does-a-single-thread-handle-asynchronous-code-in-JavaScript)). Then how come it does not have such race conditions?

#### Threre's a feature in javascript [Run-to-Completion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#.22Run-to-completion.22)
There's this thing in javascript called Event Loop you might have already heard about. If not, go ahead and read [Event Loops in Javascript](http://blog.carbonfive.com/2013/10/27/the-javascript-event-loop-explained/), programming will be much more fun when you understand what's going on behind the scene.
The way Event Loop works provides us the [Run-to-Completion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#.22Run-to-completion.22) feature. It guarrenties you whenever a code runs, it cannot be pre-empted and will run entirely before any other code runs. So, in case of above example, the pre-emption at line `queue = []` is never gonna happen, hence the race condition won't occur, ever.

Confused? Here's an interesting example:

{% highlight javascript %}

var stop = false;
setTimeout(function() {
    stop = true;
}, 1000);

while(!stop) {
    console.log("Still running...");
}

{% endhighlight %}

Simple enough? Keep printing "Still running..." for 1 second and then stop. Guess what? It's a never-ending loop. Try it yourself in the console or check the [jsfiddle](http://jsfiddle.net/raL53b7s/3/) **Warning: It may hang or crash your browser.**

The timer will be scheduled to trigger after 1 second but a code is already running i.e. the while loop, so it'll wait for it to Run-to-Completion. But the loop is only gonna stop if the timer callback gets executed.