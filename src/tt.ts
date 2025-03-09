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

const raw = new User("1", 3000, "1234");
console.log(raw);

// @ts-expect-error
const response = UserResponseDTO.from(raw);
console.log(response);

console.log(response.serialize());

