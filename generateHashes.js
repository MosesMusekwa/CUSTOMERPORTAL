const bcrypt = require('bcrypt');

// List of employee passwords
const passwords = [
  { name: "John Doe", accountNumber: "EMP001", password: "SecurePassword123!" },
  { name: "Jane Smith", accountNumber: "EMP002", password: "MyStrongPassword456!" },
  { name: "Mark Johnson", accountNumber: "EMP003", password: "Password987!" },
  { name: "Emily Davis", accountNumber: "EMP004", password: "Secure@321Pass" },
  { name: "Michael Brown", accountNumber: "EMP005", password: "BrownPass2024!" }
];

// Generate hashed password for each employee
const generateHashedPasswords = async () => {
  for (const employee of passwords) {
    const saltRounds = 10; // Number of salt rounds for bcrypt

    // Hash the password using bcrypt
    try {
      const hashedPassword = await bcrypt.hash(employee.password, saltRounds);
      console.log(`Hashed Password for ${employee.name} (Account: ${employee.accountNumber}):`);
      console.log(hashedPassword);
      console.log('----------------------------');
    } catch (err) {
      console.error('Error hashing password:', err);
    }
  }
};

// Call the function to generate hashed passwords
generateHashedPasswords();
