---
layout: post
title: "Videri Quam Esse: Is Node Single-Threaded?"
date: 2015-02-11 19:06:12
category: computers
---
I was talking to my brother, a .NET developer, and he wanted to know
what the buzz was about Node. He admitted to ignorance, but, as it
stood, he just couldn't wrap his head around the fact that Node runs
in a single thread. Or, more specifically, why in the world that would
be good.

I handwaved some unspecified-orders-of-magnitude difference in speed
between accessing cache or memory versus disk I/O, not to mention
network I/O. Node doesn't bother waiting around for that, I
explained. It just registers a callback and gets back to its main
event loop - accepting requests and routing ready responses.

I asked him to imagine it like a hostess at a restaurant. If a hostess were in
charge of welcoming customers, seating them, taking and placing their
orders, delivering their food, and refilling their drinks, a
restaurant could only handle more than a few customers if they hired
more hostesses. And that's the traditional model of a web
server. Apache's solution to handling more requests is to spawn new
threads for each connection - to hire a new hostess.

In contrast, Node works more like a real restaurant. A hostess greets
customers and seats them at a table and that's it. She's ready to help
the next customer right away. That, as I understood it, is why Node
can handle thousands of concurrent connections without breaking a sweat. While
waiting for a database call to return, it's free to accept the next
connection instead of returning a 500-level error.

I wrote up a little glossed over code to describe the event loop. It
looked something like this:

{% gist c2a13a09444a8c936dc9 %}

Obviously, it wasn't the whole story, and certainly wrong in a couple
details, but I thought it got the main point across: the Node event
loop is, at the end of the day, an infinite `while` loop that sends
off asynchronous calls so that it can focus on its only two jobs,
which are accepting new requests and running callbacks whose data is
ready.

My brother was not satisfied, and rightfully so.

From the Node level of abstraction, the above code is a good mental
model of the most basic operations of the event loop. But what
actually happens when we register an asynchronous function in
`pendingCallbacks`? What do we *mean* when we say Node delegates the
work so it doesn't have to wait?

The answer to this question, and to my brother's confusion, is that we
are indeed
spawning new threads. Node's event loop is actually an instance of a
default [libuv](https://github.com/libuv/libuv) event loop. The libuv
library, written in C (which I don't know - so, keep that in mind),
performs all the registration and heap management of our callback
functions. More importantly - it spawns threads to make blocking
tasks, such as disk I/O
only *appear* nonblocking.

So why do we say that Node is nonblocking and single-threaded? Is it
all just a gimmick? No. But to be more precise, we aren't talking
about Node itself when we talk about it being single-threaded. It is
the code we write on top of Node - our app - that is
single-threaded. That is why we still spawn child processes for
computationally expensive operations. Otherwise, the event loop, in
its single thread, will be blocked.

So it's not that Node found a way to handle multiple processes on a
single thread. It's that Node abstracts away the thread pool from our
application. And it's not that the Node programs we write are
inherently blocking. It's that provides a task management system
like an OS kernel, which handles all asynchronous operations via a
thread pool, and it provides an API for delegating these tasks. So, as
long as our application is written in a style that uses this API
correctly, the underlying threading system prevents the main loop from
being blocked. The result is that, as Node core developer Felix
Geisendorfer said,
"[everything runs in parallel, except your code](http://www.debuggable.com/posts/understanding-node-js:4bd98440-45e4-4a9a-8ef7-0f7ecbdd56cb)."

