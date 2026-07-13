# Your First Program

## Introduction

It is finally time to write some code.

Traditionally, the first program that programmers write is called **Hello World**.

The goal of this program is simple:

> Display some text on the screen.

Although the program itself is small, it introduces several important ideas that appear in almost every C++ program.

---

## Creating the File

Create a new file called:

```text
main.cpp
```

Inside the file, write the following code:

```cpp
#include <iostream>

int main()
{
    std::cout << "Hello, World!" << std::endl;

    return 0;
}
```

Save the file.

---

## Compiling the Program

Open a terminal inside your project folder.

### Using Clang

```bash
clang++ main.cpp -o program
```

### Using GCC

```bash
g++ main.cpp -o program
```

This creates an executable program.

---

## Running the Program

### Windows

```bash
program.exe
```

### Mac / Linux

```bash
./program
```

You should see:

```text
Hello, World!
```

Congratulations!

You have officially written your first C++ program.

---

# Understanding the Code

At first, this code probably looks confusing.

That is completely normal.

Let's examine it one piece at a time.

---

## `#include <iostream>`

```cpp
#include <iostream>
```

This line tells C++ that we want to use the **Input / Output Stream Library**.

This library contains useful tools for:

- Printing text
- Reading user input
- Working with the console

Without this line, `std::cout` would not exist.

For now, you can simply remember:

> `#include` lets us use additional functionality.

---

## `int main()`

```cpp
int main()
{
}
```

Every C++ program starts running here.

Think of `main()` as:

> The starting point of the program.

When your program launches, the computer immediately looks for `main()`.

No `main()` means there is nowhere for the program to begin.

---

## Curly Braces

```cpp
{
}
```

Curly braces define a **block of code**.

Everything inside these braces belongs to the `main()` function.

```cpp
int main()
{
    // code goes here
}
```

As programs become larger, curly braces help organize code into sections.

---

## Statements

Most lines in C++ are called **statements**.

Statements usually end with a semicolon:

```cpp
std::cout << "Hello";
return 0;
```

The semicolon tells C++:

> This instruction is finished.

Forgetting semicolons is one of the most common beginner mistakes.

---

## Printing Text

This line:

```cpp
std::cout << "Hello, World!";
```

prints text to the console.

You can think of it as:

```text
console << thing_to_print
```

The `<<` symbols can be read as:

> Send this into the console.

---

## Strings

Text inside quotation marks is called a **string**.

Examples:

```cpp
"Hello"
"My name is Liam"
"123"
```

Even though `"123"` contains numbers, it is still considered text because it is surrounded by quotation marks.

---

## `std::endl`

```cpp
std::endl
```

This means:

> Move to the next line.

Example:

```cpp
std::cout << "Hello" << std::endl;
std::cout << "World";
```

Output:

```text
Hello
World
```

You can also write:

```cpp
std::cout << "Hello\n";
```

Both approaches create a new line.

---

## `return 0;`

```cpp
return 0;
```

This tells the operating system:

> The program finished successfully.

Most programs will end with:

```cpp
return 0;
```

You do not need to fully understand this yet.

For now, simply remember:

> `return 0;` means everything went well.

---

# Program Execution Order

Programs execute from top to bottom.

The computer performs instructions in order:

```cpp
std::cout << "One";
std::cout << "Two";
std::cout << "Three";
```

Output:

```text
OneTwoThree
```

Adding new lines:

```cpp
std::cout << "One\n";
std::cout << "Two\n";
std::cout << "Three\n";
```

Output:

```text
One
Two
Three
```

Understanding execution order is extremely important.

Programming is largely about understanding:

> What happens first?
>
> What happens next?

---

# Experimenting

Programming is learned by trying things.

Change the text:

```cpp
std::cout << "I like programming!";
```

Try printing multiple lines:

```cpp
std::cout << "Hello!\n";
std::cout << "Welcome!\n";
std::cout << "This is my first program!\n";
```

Try removing a semicolon.

What error appears?

Experimentation is one of the best ways to learn.

---

# Common Mistakes

## Forgetting Semicolons

Incorrect:

```cpp
std::cout << "Hello"
```

Correct:

```cpp
std::cout << "Hello";
```

---

## Forgetting Quotation Marks

Incorrect:

```cpp
std::cout << Hello;
```

Correct:

```cpp
std::cout << "Hello";
```

---

## Misspelling `main`

Incorrect:

```cpp
int mian()
```

Correct:

```cpp
int main()
```

---

# Mini Challenge

Try making the program print:

```text
My name is Liam.
I am learning C++.
Programming is fun!
```

---

# Summary

In this lesson you learned:

- How to create a C++ file
- How to compile a program
- How to run a program
- What `main()` is
- What statements are
- How to print text
- What strings are
- How programs execute from top to bottom

You have officially written your first C++ program.

In the next lesson, we will learn more about `main()` and how C++ programs are structured.
