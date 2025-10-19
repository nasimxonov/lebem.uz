import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { getQueueToken } from '@nestjs/bull';
import { INestApplication } from '@nestjs/common';

export async function setupBullBoard(app: INestApplication) {
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');

  const botQueue = app.get(getQueueToken('botQueue'));

  createBullBoard({
    queues: [new BullAdapter(botQueue)],
    serverAdapter,
  });

  app.use('/admin/queues', serverAdapter.getRouter());
}
