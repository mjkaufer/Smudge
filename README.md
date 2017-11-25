# smudge

Smudge lets you clone an element along a path!

_This plugin was created using `skpm`. For a detailed explanation on how things work, checkout the [skpm Readme](https://github.com/skpm/skpm/blob/master/README.md)._

## Usage

After installing the plugin, use `ctrl-shift-m` to run smudge. Smudge runs using the object further up in the layer hierarchy as the object to clone, and the second highest object as the path to clone along. Make sure you select exactly two items before running `ctrl-shift-m`.

## Build Your Own

Install the dependencies

```bash
npm install
```

Build the plugin with

```bash
npm run build
```

## Todo

* Add more configuration options
    * Option to toggle rotation off
    * Change where midpoint is changed to
    * Make shape parallel vs perpendicular to path of shape
* Actually blend/transform shapes
    * Would select *three* shapes, and morph the first shape into looking like the second, using some path transforming magic
* Add a gif of real usage
* Make a cool trendy plugin site on gh-pages