import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    type: { type: String, enum: ['checkin', 'checkout'], default: 'checkin' },
    time: { type: Date, required: true },
    vnDate: { type: String, index: true } // YYYY-MM-DD
  },
  { timestamps: true }
);

export default mongoose.model('Attendance', AttendanceSchema);
