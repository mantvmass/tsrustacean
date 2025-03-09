# RustyTS

## 🤔 What is this?

This is a **TypeScript library** that shamelessly tries to **imitate Rust features**. Do I know why I’m doing this? **Nope.** Do I gain anything from it? **Also nope.**

But hey, **it exists now!** 😂

If you have **too much free time**, feel free to contribute! I won’t stop you. 🤣

---

## Features ✨

This library implements Rust-like features in TypeScript, including:

- `Option<T>` and `Result<T, E>` types for safer handling of nullable values.
- `Match` utility for pattern matching.
- `Derive` system to extend class functionality dynamically.

## Usage 🚀

### `Option<T>`

```typescript
import { Option } from "rustyts";

const someValue = Option.some(42);
console.log(someValue.unwrap()); // 42

const noneValue = Option.none<number>();
console.log(noneValue.unwrapOr(0)); // 0

const mapped = someValue.map((x) => x * 2);
console.log(mapped.unwrap()); // 84
```

#### Real-world use case

```typescript
function findUserById(id: number): Option<string> {
  const users = { 1: "Alice", 2: "Bob" };
  return users[id] ? Option.some(users[id]) : Option.none();
}

const user = findUserById(1);
console.log(user.unwrapOr("Guest")); // "Alice"

const unknownUser = findUserById(99);
console.log(unknownUser.unwrapOr("Guest")); // "Guest"
```

### `Result<T, E>`

```typescript
import { Result } from "rustyts";

const success = Result.ok<number, string>(100);
console.log(success.unwrap()); // 100

const failure = Result.err<number, string>("Something went wrong");
console.log(failure.unwrapErr()); // "Something went wrong"

const mapped = success.map((x) => x * 2);
console.log(mapped.unwrap()); // 200
```

#### Real-world use case

```typescript
function divide(a: number, b: number): Result<number, string> {
  return b === 0 ? Result.err("Division by zero") : Result.ok(a / b);
}

const result1 = divide(10, 2);
console.log(result1.unwrap()); // 5

const result2 = divide(10, 0);
console.log(result2.unwrapErr()); // "Division by zero"
```

### Pattern Matching with `Match`

```typescript
import { Match, Option, Result } from "rustyts";

const opt = Option.some(42);
const result = Match.on(opt)
  .some((value) => value * 2)
  .none(() => 0)
  .default(() => -1);
console.log(result); // 84

const res = Result.ok<number, string>(10);
const resMatch = Match.on(res)
  .ok((value) => value + 1)
  .err((error) => error.length)
  .default(() => -1);
console.log(resMatch); // 11
```

#### Real-world use case

```typescript
function processResponse(response: Result<number, string>): string {
  return Match.on(response)
    .ok((value) => `Success with value: ${value}`)
    .err((error) => `Error occurred: ${error}`)
    .default(() => "Unknown state");
}

console.log(processResponse(Result.ok(42))); // "Success with value: 42"
console.log(processResponse(Result.err("Network error"))); // "Error occurred: Network error"
```

### Derive Plugins

You can extend classes dynamically with features using `@derive`.

```typescript
import { derive } from "./derive";
import { serde, Serialize, Deserialize } from "./lib/serde";

@derive([Serialize, Deserialize] as const)
class User {
    id: string;
    @serde({ serialize_with: (v: number) => v / 100 })
    balance: number;
    @serde({ default: "Sun, 09 Mar 2025 14:58:21 GMT", rename: "createdAt" })
    created_at?: string;
    password: string;

    constructor(id: string, balance: number, password: string) {
        this.id = id;
        this.balance = balance;
        this.password = password;
    }
}

@derive([Serialize, Deserialize] as const)
class UserResponseDTO {
    id: string;
    @serde({ serialize_with: (v: number) => v / 100 })
    balance: number;
    @serde({ default: "Sun, 09 Mar 2025 14:58:21 GMT", rename: "createdAt" })
    created_at?: string;

    constructor(id: string, balance: number) {
        this.id = id;
        this.balance = balance;
    }
}

const raw = new User("1", 1000, "1234");
console.log(raw);
// Output:
// DerivedClass {
//   id: '1',
//   balance: 1000,
//   created_at: 'Sun, 09 Mar 2025 14:58:21 GMT',
//   password: '1234'
// }

// @ts-expect-error
const response = UserResponseDTO.from(raw);
console.log(response);
// Output:
// DerivedClass {
//   id: '1',
//   balance: 1000,
//   created_at: 'Sun, 09 Mar 2025 14:58:21 GMT',
//   password: '1234'
// }

console.log(response.serialize());
// Output: { id: '1', balance: 10, createdAt: 'Sun, 09 Mar 2025 14:58:21 GMT' }

// I haven't found a way to make TypeScript recognize methods injected with @derive yet,
// so for now, I'm using @ts-expect-error as a workaround...
```

## Creating a Derive Plugin

```typescript
import { registerPlugin, DerivePlugin } from "../derive";

/**
 * Feature flag for enabling the Loggable feature.
 * "Loggable" is the name used in @derive.
 */
export const Loggable = "Loggable" as const;

/**
 * Interface for classes that support the Loggable feature.
 * Defines a log() method that returns a string.
 */
export interface Loggable {
    log(): string;
}

/**
 * Plugin for the Loggable feature.
 */
const loggablePlugin: DerivePlugin = {
    feature: Loggable,
    extendPrototype: (prototype) => {
        Object.defineProperty(prototype, "log", {
            value: function (this: any): string {
                const props = Object.entries(this)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ");
                return `Loggable instance: { ${props} }`;
            },
            writable: true,
            configurable: true,
        });
    },
    instanceType: {
        log: (): string => "",
    },
};

// Register the plugin with the derive system
registerPlugin(loggablePlugin);
```

## Installation 📦

```sh
npm install rustyts
```

## Contributing 🤝

Feel free to contribute if you want to add more Rust-like features to this crazy project. Open an issue or create a pull request! 🦀🚀

## License 📜

The RustyTS is open-sourced software licensed under the [MIT license](LICENSE).