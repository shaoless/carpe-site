import Database from "better-sqlite3";
import bcrypt from "bcryptjs";

const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
  console.log("Usage: npx tsx src/lib/db/change-password.ts <username> <password>");
  process.exit(1);
}

if (password.length < 6) {
  console.log("Password must be at least 6 characters");
  process.exit(1);
}

const sqlite = new Database("data/sqlite.db");
const hash = bcrypt.hashSync(password, 10);

const existing = sqlite.prepare("SELECT id FROM users WHERE username = ?").get(username);

if (existing) {
  sqlite.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hash, (existing as any).id);
  console.log(`Password updated for user: ${username}`);
} else {
  sqlite.prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)").run(username, hash);
  console.log(`Created user: ${username}`);
}
