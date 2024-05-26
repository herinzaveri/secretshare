import {dbConnect} from './api/db/mongo';
import Metrics from './api/models/metric.model';

type MetricsType = {
  readCount: number;
  writeCount: number;
}

export async function fetchMetrics(): Promise<MetricsType> {
  await dbConnect();

  const metrics = await Metrics.findOne();

  if (!metrics) {
    const newMetrics = new Metrics({
      readCount: 0,
      writeCount: 0,
    });

    await newMetrics.save();

    return newMetrics;
  }

  return metrics;
}

export async function incrReadCount(): Promise<MetricsType> {
  const metrics = await Metrics.findOne();

  if (!metrics) {
    const newMetrics = new Metrics({
      readCount: 1,
      writeCount: 0,
    });

    await newMetrics.save();

    return newMetrics;
  }

  const updatedMetrics = await Metrics.findOneAndUpdate({_id: metrics._id}, {
    readCount: metrics.readCount + 1,
  }, {new: true});

  return updatedMetrics;
}

export async function incrWriteCount(): Promise<MetricsType> {
  const metrics = await Metrics.findOne();

  if (!metrics) {
    const newMetrics = new Metrics({
      readCount: 0,
      writeCount: 1,
    });

    await newMetrics.save();

    return newMetrics;
  }

  const updatedMetrics = await Metrics.findOneAndUpdate({_id: metrics._id}, {
    writeCount: metrics.writeCount + 1,
  }, {new: true});

  return updatedMetrics;
}
