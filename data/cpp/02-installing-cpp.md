
# Installing C++

## Introduction

Before we can begin programming, we need to install a few tools.

Programming usually requires two things:

1. A place to write code.
2. A way to turn that code into a program.

In this lesson, we will install everything needed to begin writing C++ programs.

---

## What Is a Code Editor?

A **code editor** is a program used to write code.

Think of it like Microsoft Word, except it is designed specifically for programmers.

A good code editor can:

- Highlight your code with colors
- Help find mistakes
- Automatically format code
- Run programs quickly

For this course, we will use:

# Visual Studio Code (VSCode)

VSCode is:

- Free
- Easy to use
- Extremely popular
- Used by professional developers

---

## Downloading VSCode

Visit:

https://code.visualstudio.com/

Download the version for your operating system and install it.

Once installed, open VSCode.

You should see something similar to this:

```text
Explorer | Files
---------------------
main.cpp
```

Don't worry if it looks confusing right now.

We will learn everything step by step.

---

## What Is a Compiler?

Computers do **not** understand C++ directly.

They only understand machine instructions made up of numbers.

A **compiler** translates your C++ code into machine code.

The process looks like this:

```text
Your C++ Code
        ↓
     Compiler
        ↓
 Machine Instructions
        ↓
      Program
```

Without a compiler, your code cannot run.

---

# Installing a Compiler

The installation process depends on your operating system.

---

## Windows

We recommend installing **LLVM + Clang**.

Download LLVM:

https://github.com/llvm/llvm-project/releases

During installation, make sure to check:

```text
Add LLVM to PATH
```

After installation, open Command Prompt and type:

```bash
clang++ --version
```

You should see something similar to:

```text
clang version 22.x.x
```

If you see version information, everything is working correctly.

---

## MacOS

Mac already includes the Apple Clang compiler.

Open Terminal and run:

```bash
xcode-select --install
```

This installs the Xcode Command Line Tools.

After installation, test it:

```bash
clang++ --version
```

---

## Linux

Most Linux distributions can install a compiler using the package manager.

Ubuntu/Debian:

```bash
sudo apt update
sudo apt install clang
```

Fedora:

```bash
sudo dnf install clang
```

Arch Linux:

```bash
sudo pacman -S clang
```

After installation:

```bash
clang++ --version
```

---

## Installing Useful VSCode Extensions

Open the Extensions tab in VSCode.

Install:

### C/C++ Extension

This provides:

- Syntax highlighting
- Error checking
- Autocomplete
- Debugging support

You can also install:

### CMake Tools

This will become useful for larger projects later.

---

## Creating Your First Project Folder

Create a folder somewhere on your computer:

```text
LearningCPP
```

Inside it, create a file:

```text
main.cpp
```

Your folder should look like this:

```text
LearningCPP
│
└── main.cpp
```

Open this folder in VSCode.

---

## Opening the Terminal

Inside VSCode:

```text
Terminal → New Terminal
```

A terminal should appear at the bottom.

The terminal allows us to run commands.

---

## Compiling a Program

Later, when we write code, we will compile it like this:

### Clang

```bash
clang++ main.cpp -o program
```

### GCC

```bash
g++ main.cpp -o program
```

This means:

```text
Compile main.cpp
↓
Create an executable called "program"
```

---

## Running the Program

### Windows

```bash
program.exe
```

### Mac/Linux

```bash
./program
```

---

## Common Problems

### Error:

```text
clang++: command not found
```

This usually means:

- LLVM is not installed
- PATH was not configured correctly

---

### Error:

```text
No such file or directory
```

This usually means:

- You are in the wrong folder.
- The file name is incorrect.

Use:

```bash
ls
```

or:

```bash
dir
```

to view files in the current folder.

---

## Understanding the Workflow

Every program you create will usually follow these steps:

```text
1. Write Code
2. Save File
3. Compile
4. Run Program
5. Fix Errors
6. Repeat
```

Programming is largely repeating this process many times.

---

## Try It Yourself

Open your terminal and try:

```bash
clang++ --version
```

or:

```bash
g++ --version
```

If version information appears, congratulations!

Your development environment is ready.

---

## Summary

In this lesson you learned:

- What a code editor is
- What a compiler is
- How to install VSCode
- How to install Clang
- How to open a terminal
- How programs are compiled and run

You now have everything needed to begin writing C++ programs.

In the next lesson, we will write and run our very first C++ program.
