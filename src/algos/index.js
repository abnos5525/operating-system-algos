const fcfs = (processes) => {
  processes = processes.map((process, index) => ({
    ...process,
    originalIndex: index + 1, // ذخیره شماره اصلی پروسه
  }));

  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

  let currentTime = 0;
  let schedulingResult = [];

  processes.forEach((process) => {
    const startTime = Math.max(currentTime, process.arrivalTime);
    const completionTime = startTime + process.burstTime;
    const turnaroundTime = completionTime - process.arrivalTime;
    const waitingTime = turnaroundTime - process.burstTime;
    const responseTime = startTime - process.arrivalTime;

    schedulingResult.push({
      processNumber: process.originalIndex, // شماره اصلی پروسه
      arrivalTime: process.arrivalTime,
      burstTime: process.burstTime,
      startTime: startTime,
      completionTime: completionTime,
      turnaroundTime: turnaroundTime,
      waitingTime: waitingTime,
      responseTime: responseTime,
    });

    currentTime = completionTime;
  });

  return schedulingResult;
};

const sjf = (processes) => {
  processes = processes.map((process, index) => ({
    ...process,
    originalIndex: index + 1, // ذخیره شماره اصلی پروسه
  }));
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  let currentTime = 0;
  let completed = 0;
  let schedulingResult = [];
  let isVisited = Array(sortedProcesses.length).fill(false);
  while (completed < sortedProcesses.length) {
    let index = -1;
    let minBurstTime = Infinity;
    sortedProcesses.forEach((process, i) => {
      if (!isVisited[i] && process.arrivalTime <= currentTime && process.burstTime < minBurstTime) {
        minBurstTime = process.burstTime;
        index = i;
      }
    });
    if (index !== -1) {
      const process = sortedProcesses[index];
      const startTime = currentTime;
      const completionTime = startTime + process.burstTime;
      const turnaroundTime = completionTime - process.arrivalTime;
      const waitingTime = turnaroundTime - process.burstTime;
      const responseTime = startTime - process.arrivalTime;
      schedulingResult.push({
        processNumber: process.originalIndex, // شماره اصلی پروسه
        arrivalTime: process.arrivalTime,
        burstTime: process.burstTime,
        startTime: startTime,
        completionTime: completionTime,
        turnaroundTime: turnaroundTime,
        waitingTime: waitingTime,
        responseTime: responseTime,
      });
      currentTime = completionTime;
      isVisited[index] = true;
      completed++;
    } else {
      currentTime++;
    }
  }
  return schedulingResult.sort((a, b) => a.startTime - b.startTime);
};

const ljf = (processes) => {
  processes = processes.map((process, index) => ({
    ...process,
    originalIndex: index + 1, // ذخیره شماره اصلی پروسه
  }));
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  let currentTime = 0;
  let completed = 0;
  let schedulingResult = [];
  let isVisited = Array(sortedProcesses.length).fill(false);
  while (completed < sortedProcesses.length) {
    let index = -1;
    let maxBurstTime = -Infinity;
    sortedProcesses.forEach((process, i) => {
      if (!isVisited[i] && process.arrivalTime <= currentTime && process.burstTime > maxBurstTime) {
        maxBurstTime = process.burstTime;
        index = i;
      }
    });
    if (index !== -1) {
      const process = sortedProcesses[index];
      const startTime = currentTime;
      const completionTime = startTime + process.burstTime;
      const turnaroundTime = completionTime - process.arrivalTime;
      const waitingTime = turnaroundTime - process.burstTime;
      const responseTime = startTime - process.arrivalTime;
      schedulingResult.push({
        processNumber: process.originalIndex, // شماره اصلی پروسه
        arrivalTime: process.arrivalTime,
        burstTime: process.burstTime,
        startTime: startTime,
        completionTime: completionTime,
        turnaroundTime: turnaroundTime,
        waitingTime: waitingTime,
        responseTime: responseTime,
      });
      currentTime = completionTime;
      isVisited[index] = true;
      completed++;
    } else {
      currentTime++;
    }
  }
  return schedulingResult.sort((a, b) => a.startTime - b.startTime);
};

const srtf = (processes) => {
  let currentTime = 0;
  let completed = 0;
  let schedulingResult = [];
  let remainingBurstTimes = processes.map((process) => process.burstTime);
  let isVisited = Array(processes.length).fill(false);
  while (completed < processes.length) {
    let index = -1;
    let minRemainingTime = Infinity;
    for (let i = 0; i < processes.length; i++) {
      if (!isVisited[i] && processes[i].arrivalTime <= currentTime && remainingBurstTimes[i] < minRemainingTime) {
        minRemainingTime = remainingBurstTimes[i];
        index = i;
      }
    }
    if (index !== -1) {
      const process = processes[index];
      const startTime = currentTime;
      const executionTime = Math.min(remainingBurstTimes[index], 1);
      currentTime += executionTime;
      remainingBurstTimes[index] -= executionTime;
      if (remainingBurstTimes[index] === 0) {
        const completionTime = currentTime;
        const turnaroundTime = completionTime - process.arrivalTime;
        const waitingTime = turnaroundTime - process.burstTime;
        const responseTime = startTime - process.arrivalTime;
        schedulingResult.push({
          processNumber: index + 1,
          arrivalTime: process.arrivalTime,
          burstTime: process.burstTime,
          startTime: startTime,
          completionTime: completionTime,
          turnaroundTime: turnaroundTime,
          waitingTime: waitingTime,
          responseTime: responseTime,
        });
        isVisited[index] = true;
        completed++;
      }
    } else {
      currentTime++;
    }
  }
  return schedulingResult.sort((a, b) => a.startTime - b.startTime); // مرتب‌سازی بر اساس زمان شروع
};

const lrtf = (processes) => {
  const schedulingResult = [];
  const n = processes.length;
  let currentTime = 0;
  let completed = 0;
  const remainingBurstTime = processes.map((proc) => proc.burstTime);
  const isVisited = Array(n).fill(false);
  while (completed < n) {
    let maxIndex = -1;
    let maxRemainingTime = -1;
    for (let i = 0; i < n; i++) {
      if (processes[i].arrivalTime <= currentTime && !isVisited[i] && remainingBurstTime[i] > maxRemainingTime) {
        maxRemainingTime = remainingBurstTime[i];
        maxIndex = i;
      }
    }
    if (maxIndex !== -1) {
      const process = processes[maxIndex];
      const startTime = currentTime;
      const executionTime = Math.min(remainingBurstTime[maxIndex], 1);
      currentTime += executionTime;
      remainingBurstTime[maxIndex] -= executionTime;
      if (remainingBurstTime[maxIndex] === 0) {
        const completionTime = currentTime;
        const turnaroundTime = completionTime - process.arrivalTime;
        const waitingTime = turnaroundTime - process.burstTime;
        const responseTime = startTime - process.arrivalTime;
        schedulingResult.push({
          processNumber: maxIndex + 1,
          arrivalTime: process.arrivalTime,
          burstTime: process.burstTime,
          startTime: startTime,
          completionTime: completionTime,
          turnaroundTime: turnaroundTime,
          waitingTime: waitingTime,
          responseTime: responseTime,
        });
        isVisited[maxIndex] = true;
        completed++;
      }
    } else {
      currentTime++;
    }
  }
  return schedulingResult.sort((a, b) => a.startTime - b.startTime); // مرتب‌سازی بر اساس زمان شروع
};

const rr = (processes, quantumTime) => {
  let currentTime = 0;
  const schedulingResult = [];

  // مرتب‌سازی اولیه بر اساس زمان ورود
  const queue = processes
    .map((p, i) => ({
      ...p,
      processNumber: i + 1,
      remainingTime: p.burstTime,
      firstResponse: null,
    }))
    .sort((a, b) => a.arrivalTime - b.arrivalTime);

  let completedProcesses = 0;

  while (completedProcesses < processes.length) {
    let processFound = false;

    for (let i = 0; i < queue.length; i++) {
      const process = queue[i];

      if (process.remainingTime > 0 && process.arrivalTime <= currentTime) {
        processFound = true;

        const startTime = currentTime;
        const executionTime = Math.min(process.remainingTime, quantumTime);
        currentTime += executionTime;
        process.remainingTime -= executionTime;

        if (process.firstResponse === null) {
          process.firstResponse = startTime;
        }

        if (process.remainingTime === 0) {
          completedProcesses++;
          const completionTime = currentTime;
          const turnaroundTime = completionTime - process.arrivalTime;
          const waitingTime = turnaroundTime - process.burstTime;
          const responseTime = process.firstResponse - process.arrivalTime;

          schedulingResult.push({
            processNumber: process.processNumber,
            arrivalTime: process.arrivalTime,
            burstTime: process.burstTime,
            startTime: startTime,
            completionTime: completionTime,
            turnaroundTime: turnaroundTime,
            waitingTime: waitingTime,
            responseTime: responseTime,
          });
        } else {
          queue.push(queue.splice(i, 1)[0]);
        }

        break;
      }
    }

    if (!processFound) {
      currentTime++;
    }
  }

  // حفظ ترتیب پروسه‌ها در خروجی بر اساس شماره پروسه
  return schedulingResult.sort((a, b) => a.processNumber - b.processNumber);
};

const mlfq = (processes, quantumTime) => {
  const queues = [[], [], []]; // سه صف برای MLFQ
  let currentTime = 0;
  let schedulingResult = [];
  let completedProcesses = 0;

  // افزودن تمام پردازش‌ها به صف اول
  processes.forEach((process, index) => {
    queues[0].push({
      ...process,
      remainingTime: process.burstTime,
      processNumber: index + 1,
      startTime: null, // برای محاسبه responseTime
    });
  });

  while (completedProcesses < processes.length) {
    let processExecuted = false;

    for (let i = 0; i < queues.length; i++) {
      const queue = queues[i];

      // بررسی صف بر اساس زمان ورود فرایندها
      while (queue.length > 0) {
        const process = queue.shift();

        // اگر زمان کنونی کمتر از زمان ورود فرایند باشد، CPU بیکار است
        if (currentTime < process.arrivalTime) {
          currentTime = process.arrivalTime;
        }

        processExecuted = true;

        // محاسبه زمان شروع اولین بار اجرا
        if (process.startTime === null) {
          process.startTime = currentTime;
        }

        const executionTime = Math.min(process.remainingTime, quantumTime);
        currentTime += executionTime;
        process.remainingTime -= executionTime;

        if (process.remainingTime === 0) {
          // محاسبه متریک‌ها
          const completionTime = currentTime;
          const turnaroundTime = completionTime - process.arrivalTime;
          const waitingTime = turnaroundTime - process.burstTime;
          const responseTime = process.startTime - process.arrivalTime;

          schedulingResult.push({
            processNumber: process.processNumber,
            arrivalTime: process.arrivalTime,
            burstTime: process.burstTime,
            startTime: process.startTime,
            completionTime,
            turnaroundTime,
            waitingTime,
            responseTime,
          });

          completedProcesses++;
        } else {
          // انتقال به صف بعدی یا ماندن در صف آخر
          if (i < queues.length - 1) {
            queues[i + 1].push(process);
          } else {
            queues[i].push(process);
          }
        }

        // اگر پردازشی اجرا شد، حلقه صف‌های بالاتر شکسته می‌شود
        if (processExecuted) break;
      }

      if (processExecuted) break;
    }

    // اگر هیچ پردازشی اجرا نشود (بیکاری CPU)
    if (!processExecuted) {
      currentTime++;
    }
  }

  return schedulingResult;
};

const multiCpu = (processes, numCPUs) => {
  const sortedProcesses = processes.map((process, index) => ({
    ...process,
    processNumber: index + 1, // شماره پروسه
  }));
  const cpus = Array.from({ length: numCPUs }, () => ({
    time: 0, // زمان فعلی CPU
    processes: [], // لیست فرآیندهای اختصاص‌یافته به CPU
  }));
  let currentTime = 0; // زمان فعلی
  while (sortedProcesses.length > 0) {
    const availableProcesses = sortedProcesses.filter(
      (process) => process.arrivalTime <= currentTime
    );
    if (availableProcesses.length === 0) {
      currentTime++; // زمان را افزایش می‌دهیم
      continue; // به دور بعدی بروید
    }
    const selectedCpu = cpus.reduce((prev, curr) =>
      prev.time < curr.time ? prev : curr
    );
    const process = availableProcesses[0];
    const startTime = Math.max(selectedCpu.time, process.arrivalTime);
    const completionTime = startTime + process.burstTime;
    selectedCpu.time = completionTime;
    selectedCpu.processes.push({
      processId: process.processId, // شماره پروسه
      ...process,
      startTime,
      completionTime,
      turnaroundTime: completionTime - process.arrivalTime,
      waitingTime: startTime - process.arrivalTime,
      responseTime: startTime - process.arrivalTime,
    });
    sortedProcesses.splice(sortedProcesses.indexOf(process), 1);
  }

  return cpus.flatMap((cpu) => cpu.processes);
};

const priorityNonPreemptive = (processes) => {
  processes = processes.map((process, index) => ({
    ...process,
    isCompleted: false,
    processNumber: index + 1,
  }));
  let currentTime = 0;
  let schedulingResult = [];
  while (processes.some((p) => !p.isCompleted)) {
    const availableProcesses = processes
      .filter((p) => !p.isCompleted && p.arrivalTime <= currentTime)
      .sort((a, b) => {
        if (a.priority === b.priority) {
          if (a.arrivalTime === b.arrivalTime) {
            return a.processNumber - b.processNumber; // اولویت بر اساس شماره فرآیند
          }
          return a.arrivalTime - b.arrivalTime;
        }
        return a.priority === "low" ? 1 : -1;
      });
    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }
    const currentProcess = availableProcesses[0];
    currentProcess.isCompleted = true;
    currentProcess.startTime = currentTime;
    currentProcess.completionTime = currentTime + currentProcess.burstTime;
    currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
    currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
    currentProcess.responseTime = currentProcess.startTime - currentProcess.arrivalTime;
    schedulingResult.push({
      processNumber: currentProcess.processNumber,
      arrivalTime: currentProcess.arrivalTime,
      burstTime: currentProcess.burstTime,
      priority: currentProcess.priority,
      startTime: currentProcess.startTime,
      completionTime: currentProcess.completionTime,
      turnaroundTime: currentProcess.turnaroundTime,
      waitingTime: currentProcess.waitingTime,
      responseTime: currentProcess.responseTime,
    });
    currentTime = currentProcess.completionTime;
  }
  return schedulingResult;
};

const priorityPreemptive = (processes) => {
  processes = processes.map((process, index) => ({
    ...process,
    remainingBurstTime: process.burstTime,
    completionTime: 0,
    isCompleted: false,
    processNumber: index + 1,
  }));
  let currentTime = 0;
  let schedulingResult = [];
  let lastProcessIndex = -1;
  while (processes.some((p) => !p.isCompleted)) {
    const availableProcesses = processes
      .filter((p) => !p.isCompleted && p.arrivalTime <= currentTime)
      .sort((a, b) => {
        if (a.priority === b.priority) {
          if (a.arrivalTime === b.arrivalTime) {
            return a.processNumber - b.processNumber; // اولویت بر اساس شماره فرآیند
          }
          return a.arrivalTime - b.arrivalTime;
        }
        return a.priority === "low" ? 1 : -1;
      });
    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }
    const currentProcess = availableProcesses[0];
    if (lastProcessIndex !== currentProcess.processNumber - 1) {
      schedulingResult.push({
        processNumber: currentProcess.processNumber,
        arrivalTime: currentProcess.arrivalTime,
        burstTime: currentProcess.burstTime,
        startTime: currentTime,
      });
      lastProcessIndex = currentProcess.processNumber - 1;
    }
    currentProcess.remainingBurstTime--;
    if (currentProcess.remainingBurstTime === 0) {
      currentProcess.isCompleted = true;
      currentProcess.completionTime = currentTime + 1;
      const turnaroundTime =
        currentProcess.completionTime - currentProcess.arrivalTime;
      const waitingTime = turnaroundTime - currentProcess.burstTime;
      const responseTime =
        schedulingResult.find(
          (p) => p.processNumber === currentProcess.processNumber
        ).startTime - currentProcess.arrivalTime;
      schedulingResult = schedulingResult.map((p) =>
        p.processNumber === currentProcess.processNumber
          ? {
              ...p,
              completionTime: currentProcess.completionTime,
              turnaroundTime,
              waitingTime,
              responseTime,
            }
          : p
      );
      lastProcessIndex = -1; // ریست کردن مقدار
    }
    currentTime++;
  }
  return schedulingResult;
};

const scan = (processes, initialPosition, direction) => {
  const sortedProcesses = processes.sort((a, b) => a.request - b.request);
  const result = [];
  let currentPosition = initialPosition;
  const moveDirection = direction === 'up' ? 1 : -1;
  const processedRequests = new Set();
  const processQueue = moveDirection === 1 
    ? sortedProcesses.filter(p => p.request >= currentPosition) 
    : sortedProcesses.filter(p => p.request <= currentPosition).reverse();

  if (processQueue.length === 0) {
    return [{ message: "هیچ درخواستی برای پردازش وجود ندارد." }];
  }
  processQueue.forEach(process => {
    if (!processedRequests.has(process.request)) {
      const distance = Math.abs(currentPosition - process.request);
      result.push({
        request: process.request,
        distance,
      });
      currentPosition = process.request;
      processedRequests.add(process.request);
    }
  });
  const remainingQueue = moveDirection === 1 
    ? sortedProcesses.filter(p => p.request < currentPosition).reverse() 
    : sortedProcesses.filter(p => p.request > currentPosition);
  remainingQueue.forEach(process => {
    if (!processedRequests.has(process.request)) {
      const distance = Math.abs(currentPosition - process.request);
      result.push({
        request: process.request,
        distance,
      });
      currentPosition = process.request;
      processedRequests.add(process.request);
    }
  });

  return result;
};

const cscan = (requests, initialPosition, direction) => {
  const sortedRequests = requests.sort((a, b) => a .request - b.request);
  const result = [];
  let currentPosition = initialPosition;
  const maxPosition = Math.max(...sortedRequests.map(r => r.request));
  const minPosition = Math.min(...sortedRequests.map(r => r.request));
  const processedRequests = new Set();
  if (direction === 'up') {
    const processQueue = sortedRequests.filter(r => r.request >= currentPosition);
    if (processQueue.length === 0) {
      return [{ message: "هیچ درخواستی برای پردازش وجود ندارد." }];
    }
    processQueue.forEach(request => {
      if (!processedRequests.has(request.request)) {
        const distance = Math.abs(currentPosition - request.request);
        result.push({
          request: request.request,
          distance,
        });
        currentPosition = request.request;
        processedRequests.add(request.request);
      }
    });
    if (processQueue.length > 0) {
      const wrapAroundDistance = Math.abs(currentPosition - maxPosition) + (maxPosition - minPosition);
      result.push({
        request: minPosition,
        distance: wrapAroundDistance,
      });
      currentPosition = minPosition;
    }
    sortedRequests.filter(r => r.request < currentPosition).forEach(request => {
      if (!processedRequests.has(request.request)) {
        const distance = Math.abs(currentPosition - request.request);
        result.push({
          request: request.request,
          distance,
        });
        currentPosition = request.request;
        processedRequests.add(request.request);
      }
    });
  } else {
    const processQueue = sortedRequests.filter(r => r.request <= currentPosition).reverse();
    if (processQueue.length === 0) {
      return [{ message: "هیچ درخواستی برای پردازش وجود ندارد." }];
    }
    processQueue.forEach(request => {
      if (!processedRequests.has(request.request)) {
        const distance = Math.abs(currentPosition - request.request);
        result.push({
          request: request.request,
          distance,
        });
        currentPosition = request.request;
        processedRequests.add(request.request);
      }
    });
    if (processQueue.length > 0) {
      const wrapAroundDistance = Math.abs(currentPosition - minPosition) + (maxPosition - minPosition);
      result.push({
        request: maxPosition,
        distance: wrapAroundDistance,
      });
      currentPosition = maxPosition;
    }
    sortedRequests.filter(r => r.request > currentPosition).forEach(request => {
      if (!processedRequests.has(request.request)) {
        const distance = Math.abs(currentPosition - request.request);
        result.push({
          request: request.request,
          distance,
        });
        currentPosition = request.request;
        processedRequests.add(request.request);
      }
    });
  }
  return result;
};

export {
  fcfs,
  sjf,
  ljf,
  srtf,
  lrtf,
  rr,
  mlfq,
  multiCpu,
  priorityNonPreemptive,
  priorityPreemptive,
  scan,
  cscan,
}