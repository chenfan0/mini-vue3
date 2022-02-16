const queue: any[] = [];
let isFlushPending = false;
const p = Promise.resolve();

export function nextTick(fn) {
  return fn ? p.then(fn) : p;
}

export function queueJobs(fn) {
  // queue.in;
  if (!queue.includes(fn)) {
    queue.push(fn);
  }
  queueFlush();
}

function queueFlush() {
  if (isFlushPending) return;
  isFlushPending = true;
  nextTick(flushJobs);
}

function flushJobs() {
  isFlushPending = false;
  let job;
  while ((job = queue.shift())) {
    job && job();
  }
}
