# Using MongoDB with Node.js

This is an example of how to use **MongoDB** with **Node.js**.

> :warning: Previous installation of **MongoDB** is required.

---

### Steps:

- Create a new project:
  
  `npm init`

  The result should be a file named package.json.

> There are some values that you should set during the project creation such as **name of the package**, **version**, **Entry point (usually index.js)**, **git repository (if any)** and so on.

- Once the project was created, we need to install **MongoDB** package:
  
  `npm install mongodb`

- The initial configuration is done. Next, we need to create **app.js** at the same level of **package.json** that was created when **npm init** command was executed:
