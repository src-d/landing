---
type: project/intro
classes: ["static"]
section: project
url: intro
title: Babelfish
description: Babelfish can parse any file, in any language, extract an AST and convertit it to an UAST.
---

# Get started in 90 seconds

Right now, 2017Q2, the easiest way to get started is to use a local driver development environment: manually clone and build a container for a language driver with an SDK, then run it through Docker in order to get source -> UAST.

i.e. for a [Python driver](#):

## prerequisites

* Docker
* Go for SDK build
* (macOS) coreutils and gettext for SDK to work

## build

Build sdk

```
go get -u -v github.com/bblfsh/sdk/...
```

## styles

Some `inline` code.

- List element
- List
  - Nested list

### h3 header

```
{
  "some": "more code"
}
```

#### H4 heading

1. Some
2. Ordered
3. List

##### H5 heading

Name    | Age  | Something
--------|------|-----------
Bob     | 27   | something
Alice   | 23   | some `inline` code
Jane    | 52   | some `inline` code

###### H6 heading

After this, goes an `<hr>`.

---
