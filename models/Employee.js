const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    gender: { type: String, required: true },
    designation: { type: String, required: true },
    salary: { type: Number, required: true },
    date_of_joining: { type: String, required: true },
    department: { type: String, required: true },
    employee_photo: { type: String }, // URL or file path
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
