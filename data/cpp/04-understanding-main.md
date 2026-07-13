# Understanding `main()`

## Introduction

Every C++ program has a place where it begins running.

That place is a function called:

```cpp
main()
```

No matter how large your program becomes, execution will always begin here.

Understanding `main()` is extremely important because it teaches us how programs actually run.

---

# The Smallest Possible Program

A minimal C++ program looks like this:

```cpp
int main()
{
    return 0;
}
```

This program does nothing.

It starts, immediately returns, and then exits.

Even though it seems simple, there are several important ideas here.

---

# Breaking It Apart

## `int`

```cpp
int main()
```

The word:

```cpp
int
```

means:

> This function returns an integer value.

Later we will learn more about functions and return values.

For now, simply remember:

```cpp
return 0;
```

usually means:

> The program finished successfully.

---

## `main`

```cpp
main
```

This is the special name of the starting function.

When your executable starts running, the operating system looks for:

```cpp
main()
```

and begins execution there.

If `main()` does not exist, your program cannot start.

---

## Parentheses

```cpp
main()
```

The parentheses are used to pass information into a function.

For now they are empty:

```cpp
()
```

Later we will learn how functions can receive information.

---

## Curly Braces

```cpp
{
}
```

Curly braces create a **block of code**.

Everything inside these braces belongs to `main()`.

Example:

```cpp
int main()
{
    std::cout << "Hello";
    return 0;
}
```

Everything between the braces runs when the program starts.

---

# Program Flow

Programs execute from top to bottom.

Consider this program:

```cpp
#include <iostream>

int main()
{
    std::cout << "One\n";
    std::cout << "Two\n";
    std::cout << "Three\n";

    return 0;
}
```

Output:

```text
One
Two
Three
```

The computer performs the instructions in exactly this order:

```text
1. Print One
2. Print Two
3. Print Three
4. Return 0
```

The computer does **not** look ahead.

It simply follows instructions one by one.

---

# Execution Example

Consider:

```cpp
#include <iostream>

int main()
{
    std::cout << "Starting Program\n";

    std::cout << "Doing Some Work\n";

    std::cout << "Program Finished\n";

    return 0;
}
```

Execution looks like this:

```text
Program Starts
       ↓
Enter main()
       ↓
Print first line
       ↓
Print second line
       ↓
Print third line
       ↓
Return 0
       ↓
Program Ends
```

---

# Statements

Most lines of code inside `main()` are called **statements**.

Examples:

```cpp
std::cout << "Hello";
return 0;
```

Statements are instructions.

Most statements end with a semicolon:

```cpp
;
```

The semicolon tells C++:

> This instruction is complete.

---

# Why Do Programs Need `main()`?

Imagine a huge game containing thousands of functions:

```cpp
LoadTextures();
UpdateEnemies();
RenderWorld();
PlayMusic();
SpawnPlayer();
```

How would the computer know where to begin?

The answer is:

```cpp
main()
```

`main()` acts as the entry point for the entire program.

---

# The Program Stack

As programs become larger, execution will eventually look like this:

```text
main()
   ↓
Update()
   ↓
MovePlayer()
   ↓
CheckCollisions()
```

But everything always begins with:

```text
main()
```

Think of it as the front door of your program.

---

# Common Beginner Mistakes

## Forgetting Parentheses

Incorrect:

```cpp
int main
{
}
```

Correct:

```cpp
int main()
{
}
```

---

## Forgetting Curly Braces

Incorrect:

```cpp
int main()

return 0;
```

Correct:

```cpp
int main()
{
    return 0;
}
```

---

## Writing Code Outside `main()`

Incorrect:

```cpp
std::cout << "Hello";

int main()
{
}
```

Most code for now should be written inside `main()`.

---

# Try It Yourself

Create a program:

```cpp
#include <iostream>

int main()
{
    std::cout << "Program Started\n";

    std::cout << "Loading...\n";

    std::cout << "Finished!\n";

    return 0;
}
```

Run it.

Try changing the order of the lines.

Notice how the output changes.

---

# Mini Challenge

Create a program that prints:

```text
Welcome!
Initializing...
Ready!
```

Then add another line before `return 0`.

---

# Summary

In this lesson you learned:

- Every C++ program starts in `main()`
- `main()` is called the entry point
- Curly braces define blocks of code
- Programs execute from top to bottom
- Statements are individual instructions
- `return 0;` usually means success

Understanding execution order is one of the most important concepts in programming.

In the next lesson, we will learn how to display text and values using `std::cout`.
