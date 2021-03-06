---
published: true
layout: post
title: "Why don't we have a concurrency control tool in javascript?"
description: ""
category: null
tags: 
  - javascript
---




We don't have semaphores, mutexes or any other concurrency control tool in javascript, ever wondered why? Having background in c++, when I moved to javascript, every other part of code left me wondering about race conditions, and questions like [these](http://stackoverflow.com/questions/7266918/are-there-any-atomic-javascript-operations-to-deal-with-ajaxs-asynchronous-natu) kept popping up in my mind. 

Lets consider a code snippet that sends all mouse movements to a server every 10 seconds.

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

Suppose line `sendMouseMovements(mouseLocations)` gets executed and sends pending values to the server but before clearing the queue `queue = []` it gets pre-empted to process mousemove event i.e. `queue.push("X:" + e.clientX + " Y:" + e.clientY)`. Now a new value is inserted to the queue which isn't yet sent to server. The previous event resumes from line `queue = []` and clears the queue including the newly inserted value which wasn't processed. That's a race condition, right? 

Well, that is a race condition but it's never gonna occur in javascript. Someone may have told you it's because javascript is single-threaded and single-threaded applications can never face such concurrency issues. This is true only in case of non-scripting languages. You can't have asynchronous code in single-threaded non-scripting languages. Javascript is, however, a scripting language and it's full of asynchronous code (i.e. ajax requests, timers etc.) and here interpreter is the boss which decides the sequence of asynchronous code blocks (if you're interested to know how it handles asynchronous code blocks, see [How Single Thread Handle Asynchronous Code](http://www.quora.com/How-does-a-single-thread-handle-asynchronous-code-in-JavaScript)). Then how come it does not have such race conditions?

#### Javascript code always [Run-to-Completion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#.22Run-to-completion.22)
There's this thing in javascript called Event Loop. You might have already heard about it. If not, you may consider reading [Event Loops in Javascript](http://blog.carbonfive.com/2013/10/27/the-javascript-event-loop-explained/). Programming will be much more fun once you understand what's going on behind the scene.
The way Event Loop works, provides us the [Run-to-Completion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#.22Run-to-completion.22) feature. It guarantees you that whenever a code runs, it cannot be pre-empted and runs to completion before any other code runs. So, in case of the above example, the pre-emption at line `queue = []` is never going to happen, hence the race condition won't occur, ever.

Confused? Here's an interesting example:

{% highlight javascript %}

var run = true;
setTimeout(function() {
    run = false;
}, 1000);

while(run) {
    console.log("Still running...");
}

{% endhighlight %}

Keep printing "Still running..." for 1 second and then stop. Simple? ... Guess what? It's a never-ending loop. Try it yourself in the console or check the [jsfiddle](http://jsfiddle.net/77udxwoc/) (**Warning: It may hang or crash your browser**)

So, what's happening here? The timer will be scheduled to trigger after 1 second but a code is already running i.e. the while loop. It'll wait for it to Run-to-Completion. But the loop is only going to stop if the timer callback gets executed and the timer will only fire when loop gets completed. See what the Run-to-Completion feature did there?
