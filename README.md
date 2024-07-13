# programmer-type

As a developer, I’ve been on a quest to find a keyboard that offers me the least resistance to programming. This journey
has taken me through various keyboard form factors and layouts, as well as different tools, all in pursuit of a seamless
keyboard-only setup. Despite my progress, one persistent challenge has been the testing and compatibility of new
layouts.

While there are numerous typing tests available online, I haven't found any that match the finesse of `Monkeytype.com`
that are tailored for programming. Programming often uses special characters, numbers, etc, and most common layouts do
not put these keys in easy reach.

`programmer-type` is designed to be a similar typing test to `Monkeytype`, but with a focus on programming and
keyboard-based navigation. Instead of words and paragraphs, users will encounter random code snippets, navigation
challenges, and command sequences. This allows developers to practice and refine their keyboard-centric development
skills in a realistic and practical context.

By integrating real-world programming scenarios and navigation tasks, `programmer-type` offers a unique and practical
approach to typing tests. Whether you’re a seasoned developer looking to optimize your workflow or a beginner aiming to
build strong keyboard habits, `programmer-type` will help you achieve your goals. Join me in this journey to create a
more efficient and enjoyable programming experience.

## For Contributors

The style of development of this front end application is through `separation of concern`. What this means is that
`.html` files are responsible declaring static elements, `.css` files are responsible for state-based styling, and `.js`
files are responsible for all non-static components.

### HTML Break Down:

The basic idea for all `.html` files is that they declare elements on screen. Whilst it's important to structure this
document in a coherent way, the use of "id" attributes ensures that when necessary, elements can have their style and
state updated. Every "id" attribute should be unique and descriptive; Enough so that references to this element in JS do
not require looking back through the HTML code (at least, as much as is reasonable).

It's also important to note that unless absolutely necessary, `.html` files are responsible for the starting state of
each element. This is because the HTML is loaded first, then the CSS, then the JS. So, the HTML should load with the
starting state of the application. Even though we load this information in with JS on startup, having this duplicate
information ensures two things: First, that our expected starting state matches our loaded starting state; Visual
changes become apparent if the text flickers from the "expected" stating state of the HTML and the "actual" starting
state loaded in with JS.

Take the following example ...

```html
<div id="problem-set-description">
  <table>
    <caption>
      <h3 id="problem-set-description-type">Programming</h3>
    </caption>
    <tbody>
      <tr>
        <th>Description</th>
        <td id="problem-set-description-outline"></td>
      </tr>
      <tr>
        <th>Addition Info</th>
        <td id="problem-set-description-info"></td>
      </tr>
    </tbody>
  </table>
</div>
```

In this code snippet we have created a pre-filled template with as much information we can possibly provide at this
time. We know that the first loaded test will be in "TypeScript" (as we have programmed the JS to do), and so, we
pre-fill the template with as much information as possible. Furthermore, all non-static elements are given lengthy
descriptive names. Read more under the [JS Break Down](#javascript-break-down) header.

In CSS, it's unlikely that we will reference these ID's, but rather, reference the parent div, and then reference by
TAG. Read more under the [CSS Break Down](#css-break-down) header.

### CSS Break Down:

You may notice that there is only one CSS file; `./css/style.css`. As it currently stands, this web application does not
have complicated animation logic, or any other reason for there to be more than one CSS file. However, in the case where
we have multiple `.html` files, it could be useful to migrate some pieces into more reusable components, and separate
pages to avoid reference overlaps. Read more under the [Basic File Philosophy](#basic-file-philosophy) header.

When building CSS components, we ideally want to work with:

- **Synchronous Topology**: Matching the order of the HTML file, we can give rough estimates for orientation around the
  file. Global declarations will come first, then more specific implementations will follow in order of their
  declaration in the HTML file.
- **Generic References**: References should be as generic as possible. Reference by HTML TAG, then Class, then ID. What
  this ensures is that components are styled similarly, and exceptional cases need to be specifically implemented /
  added. Some developers may argue that this style of programming CSS makes it hard to read. However:
  - **Declarative**: CSS is a declarative programming "language". Meaning, that reading the code top to bottom, inside
    to out, does not work nearly as well as it would in imperative languages. There are no references being passed
    around, nor is there an easy way to understand what rules overlap until runtime.
  - **Refactoring**: Changing the look and feel of your website will be done almost completely through CSS. As the site
    changes it's UI, you are most likely going to be refactoring the CSS. By utilizing the most generic value first, you
    can quickly see if the change you're looking to make is a unique case, thus, creating an additional rule for this
    specific element, or if it applies to all elements.
  - **F12**: Developer tools in the browser break down which CSS rules have been applied to your element and in which
    order. Ultimately, the best way to see how your CSS will work is just to run the application and inspect the
    element. Having these compiled lists that tell you exactly which rules applied to your element goes a lot further
    with CSS than being super conservative with what elements your CSS applies to.

Here is an examples:

```html
<!-- Example One -->
<div class="dropdown" id="duration-select">
  <button>[D] Duration &#9013;</button>
  <!-- ... -->
</div>

<!-- Example Two -->
<div class="dropdown" id="help">
  <button>&#8505; [H] Help</button>
  <div class="dropdown-content">
    <!-- Message -->
  </div>
</div>
```

```css
.dropdown {
  /* ... */
}

.dropdown > button {
  /* ... */
}

.dropdown-content {
  /* ... */

  > button {
    /* ... */
  }
}

.dropdown:hover,
.dropdown:focus {
  .dropdown-content {
    /* ... */
  }
}

/* ... */

header {
  /* ... */
  nav {
    /* ... */
    #help {
      /* HERE */
    }
  }
}
```

In the example provided, we have used a class to define drop-down menus. We have multiple of them, and they're not
identifiable through their HTML TAG. All in the base CSS, we apply certain rules to all `.dropdown` elements. It doesn't
matter where the drop-down element is in the HTML document, just that it is intended to be a drop-down menu. However,
there is one specific case where we want a drop-down menu to act differently to it's counterparts. The "help" drop-down
doesn't present a sub-menu, but rather, helpful information to the user. In this exceptional case, we define alternative
rules for this specific element.

When we look to the browser inspect element, under "styles", we get the following:

```css
/* JavaScript applied styling : none */
element.style {
}

/* style.css:203 */
header {
  & nav {
    & #help {
      .dropdown-content {
        top: calc(200% + var(--s-m) * 2);
        right: 0;
        border: var(--border) solid var(--highlight-high);
        padding: var(--s-3xs) var(--s-m);
        width: calc(100vw - (var(--s-m) * 2));
      }
    }
  }
}

/* style.css:198 */
header {
  & nav {
    .dropdown-content {
      ~~top: calc(100% - var(--fs-0));~~
    }
  }
}

/* style.css:117 */
.dropdown-content {
  display: none;
  position: absolute;
  top: 100%;
  flex-direction: column;
  z-index: 1;
  border: var(--border) solid var(--highlight-high);
  border-top: none;
  background-color: var(--surface);
  min-width: 100%;
}

/* style.css:78 */
* {
  box-sizing: border-box;
  outline: none;
  border-radius: var(--border);
  background-color: transparent;
  color: var(--text);
  font-size: var(--fs-0);
  font-family: "M PLUS 1 Code", monospace;
}
```

### JavaScript Break Down:

As it currently stands, the

### Basic File Philosophy
