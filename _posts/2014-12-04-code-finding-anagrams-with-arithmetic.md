---
layout: post
title: "Code: Finding Anagrams With Arithmetic"
date: 2014-12-02 16:24:16
category: computers
---
Let's say you think it would be fun to write a program that can find
all the anagrams of a given string. And let's also say that you think
it would be fun if your program could not only accept single words as
input, but it could take whole phrases and output whole phrases, or
sentences. How long until it's no longer fun?

My brother wrote a [novel](http://www.underangels.com) in which the
antagonist communicates with the hero through anagrams. I wondered if
I could write something that would solve the puzzles. I reasoned that
with some sort of probability distribution or semantic graph, we could
find the anagram that was most likely the intended phrase. But first,
I needed to be able to generate all valid anagrams, regardless of
relevance. That's what this post is about.

It was immediately clear that simply generating all the permutations
of the string and validating each one would be extremely
wasteful. After scratching my head for a while, I looked to see how
others had implemented anagram search. I found a
[Stack Overflow thread](http://stackoverflow.com/a/16872684) that
offered a slick solution: prime numbers.

Now, to state the obvious, a prime number is a number that is
divisible only by itself and 1. What is not as obvious is how this
property can be so useful. But if we take the product of some prime
numbers, we can factor them out again and know exactly which numbers
went in.

Consider a product: `24`. 

Can we know what factors were multiplied to produce that number?
Was it `2 × 12`?
Was it `3 × 2 × 4`?
Was it `6 × 2 × 2`?

We don't know, because 12 can be refactored in to `2 × 2 × 3`, and so
on. This is grade-school Lowest Common Factor stuff. We can always
factor out a non-prime number until it is in its prime factors. 

But what about the number 15? Aside from itself and 1, it has only two
factors, which are *already* prime: `3 × 5`. Since prime factors, by
definition, can't be factored into anything else, we are certain that
`3` and `5` were the inputs to our product.

So that's the abstract stuff. How does it help us find anagrams?

{% gist 42ab2618b8e95dea97f6 %}

The above `encode` function takes a string and returns an
integer. Note that the `table` simply maps every letter to a unique
prime number. So all we need to do is map each letter in our input
string to its corresponding prime number and then take the product of
all. The return value is an integer. If we input a word, we will
always get the same integer back. 

Something else you learned in grade school: the commutative
property. Recall that `31 × 7 = 7 × 31`. That means we can multiply
the factors of a number in any order and still get the same number.

Which is why this works. We can put "bat" and "tab" through our
`encode` function, and we will always get `426` as a result. So we
don't need to generate all permutations of the characters in a string
to find its anagrams. We just take a list of all the known words in
English, and encode each one. If the product is the same as that of
our original input, the two words are anagrams. Pretty cool.

Only one problem: I wanted to be able to find anagrams of entire
phrases. Unless we have a list of every possible combination of
English words, this wouldn't work. I had to find something
else. Again, middle-school math came to the rescue.

We can find substrings contained in our input by the same factoring
method, except instead of simple division, we use modulo
arithmetic. When you divide a number by any or all of its factors, you
will have a remainder of 0. If you divide it by anything other than
its factors, you will have a remainder.

{% gist 692a87f6ca02279e86f7 %}

The above `build_candidates` should be understandable. Line 2
transforms the input string into an integer hash using our `encode`
function, disregarding the spaces (if any) between words. It then
checks every known word (which have been pre-hashed) against the
input string's hash. If any word's hash divides evenly (it has a remainder of
0) into the input hash, then it is a substring of our input string,
and we set it aside in our list to return.

So that's some good progress. Now we can take any string with an
arbitrary number of words and get a list of all known words that exist
as a substring in that string. But that's not the whole story. In
order to use this list of substrings to build a full anagram, we'll
have to find a way to ensure all letters are used, and to ensure that
we avoid substrings that overlap each other.

That's for a later post. But maybe you can already see how it will
work. The strategy follows from the grade school math we've already
laid out. You can see the code on [GitHub](https://github.com/lukealbao/anagrams/blob/master/anagrams.py#L91-L150).

