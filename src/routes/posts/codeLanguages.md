---
title: Code Languages
author: Benjamin Noah Beal
date: 2025-05-06
---

# Code Blocks

## Zig

```zig
const std = @import("std");

pub fn main() !void {
    std.debug.print("Hello World\n", .{});

    const x: i32 = 5;
    const y: i32 = 10;
    std.debug.print("Sum: {}\n", .{x + y});
}
```

## XWiki

```xwiki
= Hello World =

== Basic formatting ==

This is **bold** and this is //italic//.

* Item 1
* Item 2
* Item 3

[[https://www.example.com]]
```

## TypeScript

```typescript
interface Person {
  name: string;
  age: number;
}

function greet(person: Person): string {
  return `Hello, ${person.name}!`;
}

const user: Person = { name: 'World', age: 42 };
console.log(greet(user));
```

## SQL

```sql
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT,
  department TEXT
);

INSERT INTO employees VALUES (1, 'John', 'Engineering');

SELECT * FROM employees;
```

## Scala

```scala
object HelloWorld {
  def main(args: Array[String]): Unit = {
    println("Hello World")

    val numbers = List(1, 2, 3, 4, 5)
    val doubled = numbers.map(_ * 2)
    println(doubled)
  }
}
```

## Swift

```swift
import Foundation

print("Hello World")

// Simple function
func add(a: Int, b: Int) -> Int {
    return a + b
}

print("Sum: \(add(a: 2, b: 3))")
```

## Rust

```rust
fn main() {
    println!("Hello World");

    let x = 5;
    let y = 10;
    println!("Sum: {}", x + y);
}
```

## Ruby

```ruby
puts "Hello World"

# Simple class
class Person
  attr_accessor :name

  def initialize(name)
    @name = name
  end

  def greet
    "Hello, #{@name}!"
  end
end

person = Person.new("World")
puts person.greet
```

## Python

```python
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))

# List comprehension
numbers = [1, 2, 3, 4, 5]
squares = [n*n for n in numbers]
print(squares)
```

## Perl

```perl
#!/usr/bin/perl
use strict;
use warnings;

print "Hello World\n";

my %hash = (
    'name' => 'John',
    'age' => 30
);

print "Name: $hash{name}\n";
```

## PHP

```php
<?php
echo "Hello World";

function add($a, $b) {
    return $a + $b;
}

echo add(2, 3);
?>
```

## MySQL

```mysql
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50)
);

INSERT INTO users VALUES (1, 'John', 'john@example.com');

SELECT * FROM users;
```

## Lua

```lua
print("Hello World")

-- Simple function
function add(a, b)
    return a + b
end

print(add(2, 3))
```

## Kotlin

```kotlin
fun main() {
    val message = "Hello World"
    println(message)
}
```

## Julia

```julia
println("Hello World")

# Simple function
function add(a, b)
    return a + b
end

println(add(2, 3))
```

## JavaScript

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet('World'));
```

## Java

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}
```

## HTML

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Hello World</title>
  </head>
  <body>
    <h1>Hello World</h1>
    <p>This is a sample page.</p>
  </body>
</html>
```

## Haskell

```haskell
main :: IO ()
main = putStrLn "Hello World"
```

## Go

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello World")
}
```

## CSS

```css
.container {
  display: flex;
  background-color: #f5f5f5;
  padding: 20px;
}

.item {
  color: #333;
  margin: 5px;
}
```

## Objective-C

```objectivec
#import <Foundation/Foundation.h>

int main() {
    @autoreleasepool {
        NSLog(@"Hello World");
    }
    return 0;
}
```

## C#

```csharp
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello World");
    }
}
```

## C++

```cpp
#include <iostream>

int main() {
    std::cout << "Hello World" << std::endl;
    return 0;
}
```

## C

```c
#include <stdio.h>

int main() {
    printf("Hello World\n");
    return 0;
}
```

## Bash

```bash
#!/bin/bash
echo "Hello World"
ls -la
```
