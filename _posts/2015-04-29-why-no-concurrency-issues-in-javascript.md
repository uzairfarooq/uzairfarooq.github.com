---
published: true
layout: post
title: "Why there are no concurrency issues in javascript?"
description: ""
category: null
tags: []
---

We don't have semaphores, mutexes or any other concurrency control tool in javascript, ever wondered why? Ever wondered why all the concurrency issues you were warned about in School don't apply to javascript?

Lets consider a code snippet that sends mouse movements to server every 10 seconds.

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

Suppose line `sendMouseMovements(mouseLocations);` gets executed and sends pending values to server but before clearing the queue `queue = [];` it gets pre-empted to process mousemove event i.e. `queue.push("X:" + e.clientX + " Y:" + e.clientY);`. Now a new value is inserted to queue which isn't yet sent to server. The previous event resumes from line `queue = [];` and clears the queue including the newly inserted value which wasn't processed.

That's a race condition, right? Well, that's true in many languages (C++, Java, etc) but not in javascript. Someone may have told you it's because javascript is single-threaded but that's not true either. Even though javascript is single-threaded you can still have asynchronous code blocks i.e. ajax requests, timers etc (if you're interested to know how it handles asynchronous code blocks, see http://www.quora.com/How-does-a-single-thread-handle-asynchronous-code-in-JavaScript). Then how come it does not have concurrency issues?

#### That's because of a feature in javascript called [Run-to-Completion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#.22Run-to-completion.22)
In simple words, it guarrenties that whenever a code runs (the code could be an async function), it cannot be pre-empted and will run entirely before any other code runs. In case of above example, it guarranties you that when the code block starts from line 1 it won't be pre-empted until it completes at line 10. Similarly, when the async function at line 8 starts executing, it won't be pre-empted until it completes at line 9, ans same is the case with event listener function at line 8.