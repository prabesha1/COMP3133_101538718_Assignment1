const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");

const createToken = (user) => {
  return jwt.sign(
    { userId: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

module.exports = {
  // ---------------------------
  // AUTH
  // ---------------------------
  signup: async ({ input }) => {
    try {
      const { username, email, password } = input;

      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });

      if (existingUser) {
        throw new Error("User with same username or email already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      const token = createToken(user);

      return {
        token,
        user,
        message: "Signup successful",
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  login: async ({ input }) => {
    try {
      const { usernameOrEmail, password } = input;

      const user = await User.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      });

      if (!user) {
        throw new Error("User not found");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid password");
      }

      const token = createToken(user);

      return {
        token,
        user,
        message: "Login successful",
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // ---------------------------
  // EMPLOYEE QUERIES
  // ---------------------------
  employees: async () => {
    try {
      return await Employee.find().sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  employeeById: async ({ id }) => {
    try {
      const employee = await Employee.findById(id);
      if (!employee) throw new Error("Employee not found");
      return employee;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  employeesByDepartment: async ({ department }) => {
    try {
      return await Employee.find({ department });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  employeesByDesignation: async ({ designation }) => {
    try {
      return await Employee.find({ designation });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // ---------------------------
  // EMPLOYEE MUTATIONS
  // ---------------------------
  addEmployee: async ({ input }, req) => {
    try {
      // Optional auth check:
      // if (!req.user) throw new Error("Unauthorized");

      const existing = await Employee.findOne({ email: input.email });
      if (existing) throw new Error("Employee email already exists");

      const employee = await Employee.create(input);
      return employee;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateEmployee: async ({ id, input }, req) => {
    try {
      // Optional auth check:
      // if (!req.user) throw new Error("Unauthorized");

      const employee = await Employee.findByIdAndUpdate(id, input, {
        new: true,
        runValidators: true,
      });

      if (!employee) throw new Error("Employee not found");
      return employee;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  deleteEmployee: async ({ id }, req) => {
    try {
      // Optional auth check:
      // if (!req.user) throw new Error("Unauthorized");

      const employee = await Employee.findByIdAndDelete(id);
      if (!employee) throw new Error("Employee not found");

      return { message: "Employee deleted successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
