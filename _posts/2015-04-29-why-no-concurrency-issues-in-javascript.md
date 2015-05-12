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

Well, that is a race condition but it's never gonna occur in javascript. Someone may have told you it's because javascript is single-threaded ad single-threaded applications can never face such concurrency issues. This is true only in case of non-scripting languages because you don't have asynchronous code in single-threaded non-scripting languages. But in javascript you have a whole lot of asynchronous code i.e. ajax requests, timers etc (if you're interested to know how it handles asynchronous code blocks, see http://www.quora.com/How-does-a-single-thread-handle-asynchronous-code-in-JavaScript). Then how come it does not have such race conditions?

#### Threre's a feature in javascript called [Run-to-Completion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#.22Run-to-completion.22)
In simple words, it guarrenties that whenever a code runs (the code could be an async function), it cannot be pre-empted and will run entirely before any other code runs. So, in case of above example, the pre-emption at line `queue = []` is never gonna happen, hence the race condition won't occur, ever.

