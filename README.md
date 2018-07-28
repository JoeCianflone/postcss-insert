# PostCSS Insert [![Build Status][ci-img]][ci]

A [PostCSS] plugin that inserts CSS properties from one class into another, like Sass' @extend only better!

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/JoeCianflone/postcss-insert.svg
[ci]:      https://travis-ci.org/JoeCianflone/postcss-insert

Alright, if you've used Sass before you know about `@extend` the concept is pretty simple: you take one classes properties and add them to another class in a simple way. In theory, `@extend` is awesome, but it doesn't work the way you expect. See [this](https://www.sassmeister.com/gist/3ff2cf9f8f676f36bc4a07fe8b724fcb) to see how Sass handles extend.

Mixins with Sass work better, you create a bunch of properties in a mixin and you just `@include` them wherever you want. But, you now have this extra thing...the mixin itself, it feels kinda dirty to me. This really should be a solved problem, but it's not for some reason.

What I wanted was a way to have the simplicity of `@extend` with the behavior of a `@mixin`.

Funny thing is I wasn't the only one thinking of it. [Adam Wathen](https://github.com/adamwathan) was thinking about this when he created [Tailwinds](https://tailwindcss.com/). Adam created a PostCSS plugin called `@apply` which did almost everything I wanted it to do...except it was part of a framework. Now, Tailwinds is great, I have no issue with it, but I wanted this without *needing* a framework. Also, I didn't like the name `@apply` because that name was being used with custom properties in CSS. I think its been deprecated, but there's a chance it will be taken up again in the future. To me, `@apply` is a great name, but it comes with some potential baggage that I'd have to deal with later on, also I feel like `@insert` is more descriptive of what the plugin is doing.

## Install

```bash
$ npm install postcss-insert`
```

## CSS Usage

Alright, so how do we use this thing? Take a look below:

```css
.bar {
  color: green;
}

.foo {
  @insert .bar;
}
```

Output

```css
.bar {
  color: green;
}

.foo {
  color: green;
}
```

Obviously this is a pretty contrived example, but you can see what we're doing here. A better example may be extending a button class:

```css

.btn {
  padding: 5px 15px;
  text-transform: uppercase;
  font-size: 18px;
}

.btn-primary {
  @insert .btn;
  background-color: blue;
}
```

Output

```css
.btn {
  padding: 5px 15px;
  text-transform: uppercase;
  font-size: 18px;
}

.btn-primary {
  padding: 5px 15px;
  text-transform: uppercase;
  font-size: 18px;
  background-color: blue;
}
```

### All props come over, even `!important`...unless you disable it

By default, `@insert` will *not* strip `!important`, but there's an option `stripImportant` that you can set to `true` and it will...well strip the `!important`:

```css
.bar {
  color: green;
  font-size: 22px !important;
  border: 1px solid red;
}

.foo {
  @insert .bar;
}
```

Output:

```css
.bar {
  color: green;
  font-size: 22px !important;
  border: 1px solid red;
}

.foo {
  color: green;
  font-size: 22px !important;
  border: 1px solid red;
}
```

With `stripImportant: true` you'd get the following:

```css
.bar {
  color: green;
  font-size: 22px !important;
  border: 1px solid red;
}

.foo {
  @insert .bar;
}
```

Output:

```css
.bar {
  color: green;
  font-size: 22px !important;
  border: 1px solid red;
}

.foo {
  color: green;
  font-size: 22px;
  border: 1px solid red;
}
```

### This works inside of media queries...unless you disable it

```css

@media (min-width: 400px) {
  .bar {
    color: green;
    font-size: 22px !important;
    border: 1px solid red;
  }
}


.foo {
  @insert .bar;
}
```

Output:

```css

@media (min-width: 400px) {
  .bar {
    color: green;
    font-size: 22px !important;
    border: 1px solid red;
  }
}


.foo {
    color: green;
    font-size: 22px !important;
    border: 1px solid red;
}
```

## General Plugin Usage

```js
  postcss([ require('postcss-insert')
]);
```

### Recommendation

I recommend that this plugin run last in your PostCSS stack. If you're doing any sort of transforms where a class doesn't exist `@insert` would fail because it can't find the class. If you run this last (or second-to-last right before something like mqpacker) you'll ensure that all classes are there and ready to go. I may eventually add some sort of silent fail option if it can't find a class, but right now that is not the case. Happy coding!

See [PostCSS] docs for examples for your environment.
