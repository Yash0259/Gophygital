import bcrypt from "bcryptjs";

const users = [
  { name: "Admin User", password: "Admin123" },
  { name: "Student 1", password: "Student1" },
  { name: "Student 2", password: "Student2" },
  { name: "Student 3", password: "Student3" },
  { name: "Student 4", password: "Student4" },
  { name: "Student 5", password: "Student5" }
];

const saltRounds = 10;

const hashPasswords = async () => {
  for (const user of users) {
    const hash = await bcrypt.hash(user.password, saltRounds);
    console.log(`${user.name}: ${hash}`);
  }
};

hashPasswords();
