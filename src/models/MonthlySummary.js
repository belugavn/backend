import mongoose from 'mongoose';

const MonthlySummarySchema = new mongoose.Schema(
  {
    month: { type: String, required: true, unique: true }, // YYYY-MM
    counts: { type: mongoose.Schema.Types.Mixed, default: {} },
    fileId: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('MonthlySummary', MonthlySummarySchema);
