---
layout: post
title: "Think Like A Computer to Talk To a Computer"
date: 2014-12-02 16:24:16
category: computers
---
The plan was to build a program that would take a string and return a list of valid anagrams. Given a dictionary list of valid words to check against, and given Python's handy <code>itertools.permutations</code> function, it would be pretty easy to do it for a single word: just generate a list of all the permutations of the input word, and filter it by only those which appear in the dictionary.

{% highlight python %}
import itertools
DICT = [...] # A dictionary or list datatype of valid words
def generate_anagrams(string):
    candidates = [p for p in itertools.permutations(string)]
    return [valid_word for valid_word in candidates if valid_word in DICT]
{% endhighlight %}
    

But this would only be feasible on small string. The number of permutations available in a set of size x is <code>x!</code>, or *x factorial*. Generating a list of permutations on a string of 7 letters would result in <code>7! = 5,040</code> permutations, each of which would be checked against the dictionary. Not too bad.

But if that string was only three more letters long, we now have to check <code>10! = 3,628,800</code> permutations. Soon it takes so long to compute the function that it's effectively impossible to get a result.

And what if we want to allow the input string to contain multiple words? (I did want that.) It would be hard to keep the size of the input within reasonable bounds. Not to mention, having spaces would require the algorithm to be much more complex and inefficient.

Clearly, trying to code an implementation based on my (fragile) understanding of permutations would not work. I'd have to find another way.
