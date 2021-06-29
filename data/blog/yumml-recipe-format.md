---
title: YumML - Yet Another Recipe Metadata
date: '2020-01-06'
spoiler: There are some recipe formats over the internet but they are old, not
  properly specified or license restrictions. YumML is an effort to make cooking
  recipes human and machine readable.
draft: true
tags:
  - Spec
  - Recipe
  - Cooking
  - YumML
---

Some time ago, talking with a friend we realized that there is not a "standard"
format to save cooking recipes. At that time I was learning React and one of the
first projects I tried to do was a recipe management app. I didn't success on
that project (as many others I started and never finished) but on the way I
found a draft spec of a recipe format: **YumML**.

This format was publish at that time on [vikingco.de](http://vikingco.de/) but
the site is not available anymore. The only references available are from the
[Internet Archive](https://web.archive.org/web/20160730232450/http://vikingco.de/)
and the [repository of the page](https://github.com/vikingcode/vikingcode.github.io)
that stills available.

> The key words “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”,
> “SHOULD NOT”, “RECOMMENDED”, “MAY”, and “OPTIONAL” in this document are to be
> interpreted as described in [RFC 2119](https://tools.ietf.org/html/rfc2119).

## History

The first draft of the YumML format is from September 21 of 2011 made by Paul
Jenkins, you can check the [original specification here](./original-yumml.md)
that I rescued from the old archives I found.

From my point of view, this draft it's really promising as a format for cooking
recipes, so I want to recover it from the forgiven archives of Internet and bring
it to live again, adding some extra functionalities/specifications.

## Motivation

As the original author of YumML mentioned on his original blog post, I've been
investigating a bit about recipe formats for cooking and been clear, most of
them sucks. The landscape of recipe interchange formats is quite fragmented, but
most of the have one think in common: they are not really human-friendly.

A lot of cooking-related software come with a format that usually only that
software is able to work with an understand. Although some of them can be
imported by other programs.
[Meal-Master](http://web.archive.org/web/20151029032924/http://episoft.home.comcast.net:80/~episoft/)
is one of these widely supported formats and due to that there is a
[huge collection of recipes](http://www.ffts.com/recipes.htm) available online.

But looking to an example, it doesn't seems something well specified:

```txt
MMMMM----- Now You're Cooking! v5.65 [Meal-Master Export Format]

      Title: Agua De Valencia
 Categories: beverages, spanish
      Yield: 4 servings

      1    bottle of spanish cava
           -(sparkling wine or; champag
           plenty fresh orange juice
           cointreau
           ice cubes

Put some ice cubes into a large jug and pour over lots of orange juice. Now
add the bottle of cava. Once the fizz subsides, stir in a good dash of the
cointreau and it?s ready to serve.

  Contributor:  Esther P�rez Solsona

  NYC Nutrilink: N0^00000,N0^00000,N0^00000,N0^00000
```

There are some other "famous" formats like:

- [RecipeML](http://www.formatdata.com/recipeml/index.html)
- [Recipe Exchange Markup Language](http://reml.sourceforge.net/)
- [CookML](http://www.kalorio.de/index.php?Mod=Ac&Cap=CE&SCa=../cml/CookML_EN)

But they are mainly XML based formats and it's impossible for a real human be
able to read and understand a recipe written on that format. If you're
interested on find other recipe formats there is a
[list of software related cooking formats](http://microformats.org/wiki/recipe-formats).

It's worth to mention some formats that came with the age of Internet. The HTML
microdata like [Google rich snippets](https://developers.google.com/search/docs/data-types/recipe)
and the [schema.org microdata](http://schema.org/Recipe), are widely used by
commercial recipe sites. Although the main objective of microdata is to make
content machine-readable (specially for SEO purposes), but recipes nowadays are
thought to be read and executed by a human.

Finally I found [pesto](https://6xq.net/pesto/) that aims to make a more
simpler human-readable format, but personally I find difficult to understand
for someone that is not used to the syntax.

## Original design considerations

The original author of YumML had some considerations in mind during the design
of the format:

- Does not need a long reference guide.
- Can be easily read by non-technical people in the "raw" format.
- Can be translatable between imperial and metric.
- Want something like the _markdown_ of recipes (but still easy to parse with software).

YumML is based on YAML to create a human _and_ system readable format.

**From [yaml.org](https://yaml.org/)**

> What It Is: YAML is a human friendly data serialization standard for all
> programming languages.

## Goals

From my side I want to define a more formal goals for the spec.

YumML format:

- **MUST** be human **and** system readable.
- **MUST** be self contained, so it **MUST NOT** require additional resources to be interpreted.
- **MUST** have support for different metric systems _(metric, imperial)_.
- **SHOULD** be easy to translate into different languages _(recipes have a strong cultural influence and language should not be a barrier to someone that wants to understand)_.
- **SHOULD** be easy to parse using already existing tools.
- **SHOULD** be easy to extend in the future.

## Basic Example

```yumml
name: Mrs Fields Choc-Chip Cookies
date: 2011-09-21
time: 25 minutes
ingredients:
  - quantity: 2.5
    unit: cups
    item: plain flour

  - quantity: 0.5
    unit: tsp
    item: bi-carb of soda

instructions:
  - step: Mix flour, bi-carb soda, and salt in a large bowl
  - step: Blend sugars with electric mixer, add margarine to form a grainy paste
```

## Spec

There are three main sections that very recipe must include: the header, the ingredients list, and the instructions.

### Header

The header is an implicit section where all the attributes are placed at the
root level of the file. All the attributes should be placed at the top of the
file.

- **name**:
  - description: `Name of the recipe.`
  - type: `string`
  - required: `true`
- `date`:
  - description: Date of the recipe.
  - type: `string` (full-date notation as defined by [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6), for example, _2017-07-21_)
  - required: false
- `time`: (_optional_) How long the recipe would take.
- `author`: (_optional_) Author of the recipe.
- `servings`: (_optional_) How many servings the recipe is sized for (eg: a
  tomato soup with 4 servings means is for 4 people, but chocolate cookies with
  20 servings means is going to make 20 cookies).
- `description`: (_optional_) A more detailed description about the recipe.
- `rating`: (_optional_) Rating of the recipe.

#### Example

```yumml:1-8
name: Mrs Fields Choc-Chip Cookies
date: 2011-09-21
time: 25 minutes
serves: 1
makes: 25
tags:
  - cookies
  - chocolate
ingredients:
  - quantity: 2.5
    unit: cups
    item: plain flour

  - quantity: 0.5
    unit: tsp
    item: bi-carb of soda

instructions:
  - step: Mix flour, bi-carb soda, and salt in a large bowl
  - step: Blend sugars with electric mixer, add margarine to form a grainy paste
```
