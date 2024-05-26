import mongoose from 'mongoose';

const metricSchema = new mongoose.Schema(
    {
      readCount: {
        type: Number,
      },
      writeCount: {
        type: Number,
      },
    },
    {
      timestamps: true,
    },
);

const Metrics = mongoose.models.metrics || mongoose.model('metrics', metricSchema);

export default Metrics;
