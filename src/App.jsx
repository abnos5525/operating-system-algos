import { useState } from "react";
import { cscan, fcfs, ljf, lrtf, mlfq, multiCpu, priorityNonPreemptive, priorityPreemptive, rr, scan, sjf, srtf } from "./algos";
import { operations } from "./algos/data";

const App = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(1);
  const [numProcesses, setNumProcesses] = useState(0);
  const [processes, setProcesses] = useState([]);
  const [result, setResult] = useState([]);
  const [quantumTime, setQuantumTime] = useState(1);
  const [extraMetrics, setExtraMetrics] = useState({});
  const [numCPUs, setNumCPUs] = useState(1);
  const [numRequests, setNumRequests] = useState(0);
  const [requests, setRequests] = useState([]);
  const [initialPosition, setInitialPosition] = useState(0);
  const [direction, setDirection] = useState('up');

  const handleProcessChange = (index, field, value) => {
    const updatedProcesses = [...processes];
    updatedProcesses[index] = {
      ...updatedProcesses[index],
      [field]: field === "priority" ? value : Number(value),
    };
    setProcesses(updatedProcesses);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let schedulingResult;
    switch (selectedAlgorithm) {
      case 1:
        schedulingResult = fcfs(processes);
        break;
      case 2:
        schedulingResult = sjf(processes);
        break;
      case 3:
        schedulingResult = ljf(processes);
        break;
      case 4:
        schedulingResult = srtf(processes);
        break;
      case 5:
        schedulingResult = lrtf(processes);
        break;
      case 6:
        schedulingResult = rr(processes, quantumTime);
        break;
      case 7:
        schedulingResult = multiCpu(processes, numCPUs);
        break;
      case 8:
        schedulingResult = priorityNonPreemptive(processes);
        break;
      case 9:
        schedulingResult = priorityPreemptive(processes);
        break;
      case 10:
        schedulingResult = scan(requests.map((request) => ({ request })), initialPosition, direction);
        break;
      case 11:
        schedulingResult = cscan(requests.map((request) => ({ request })), initialPosition, direction);
        break;
        case 12:
        schedulingResult = mlfq(processes, quantumTime);
        break;
      default:
        schedulingResult = [];
        break;
    }
    setResult(schedulingResult);

    if (schedulingResult.length > 0) {
      let totalCompletionTime = 0;
      let totalTurnaroundTime = 0;
      let totalWaitingTime = 0;
      let totalResponseTime = 0;
      let totalBurstTime = 0;
      let totalIdleTime = 0;

      schedulingResult.forEach((process, idx) => {
        totalCompletionTime += process.completionTime;
        totalTurnaroundTime += process.turnaroundTime;
        totalWaitingTime += process.waitingTime;
        totalResponseTime += process.responseTime;
        totalBurstTime += process.burstTime;

        if (idx > 0) {
          totalIdleTime += process.startTime - schedulingResult[idx - 1].completionTime;
        }
      });

      const cpuUtilization = (
        (totalBurstTime / (totalCompletionTime + totalIdleTime)) *
        100
      ).toFixed(2);
      const throughput = (
        schedulingResult.length / totalCompletionTime
      ).toFixed(2);
      const averageCompletionTime = (
        totalCompletionTime / schedulingResult.length
      ).toFixed(2);
      const averageTurnaroundTime = (
        totalTurnaroundTime / schedulingResult.length
      ).toFixed(2);
      const averageWaitingTime = (
        totalWaitingTime / schedulingResult.length
      ).toFixed(2);
      const averageResponseTime = (
        totalResponseTime / schedulingResult.length
      ).toFixed(2);

      setExtraMetrics({
        cpuUtilization,
        throughput,
        averageCompletionTime,
        averageTurnaroundTime,
        averageWaitingTime,
        averageResponseTime,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto text-center rtl p-4 bg-gradient-to-r from-blue-200 to-purple- 200">
      <div className="col-span-1 md:col-start-1 border-l-2 border-slate-500 p-6 bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <button
            type="submit"
            className="w-full h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out shadow-md"
          >
            محاسبه
          </button>
          <div>
            <label className="block text-lg font-semibold">الگوریتم:</label>
            <select
              className="h-10 rounded-md px-2 border border-slate-800 text-center w-full"
              onChange={(e) => {
                const algoId = Number(e.target.value);
                setSelectedAlgorithm(algoId);
                if (algoId === 6) setQuantumTime(1);
                if (algoId === 7) setNumCPUs(1);
              }}
            >
              {operations.map((op) => (
                <option key={op.id} value={op.id}>
                  {op.label}
                </option>
              ))}
            </select>
          </div>

          {selectedAlgorithm === 10 || selectedAlgorithm === 11 ? (
            <div>
              <label className="block text-lg font-semibold">تعداد درخواست‌ها:</label>
              <input
                type="number"
                min="1"
                value={numRequests}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setNumRequests(value);
                  setRequests(Array(value).fill(0));
                }}
                className="h-10 rounded-md px-2 border border-slate-800 text-center w-full"
              />
              <div>
                <label className="block text-lg font-semibold">موقعیت اولیه:</label>
                <input
                  type="number"
                  value={initialPosition}
                  onChange={(e) => setInitialPosition(Number(e.target.value))}
                  className="h-10 rounded-md px-2 border border-slate-800 text-center w-full"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold">جهت:</label>
                <select
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                  className="h-10 rounded-md px-2 border border-slate-800 text-center w-full"
                >
                  <option value="up">بالا</option>
                  <option value="down">پایین</option>
                </select>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-lg font-semibold">تعداد پروسه‌ها:</label>
              <input
                type="number"
                min="1"
                value={numProcesses}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setNumProcesses(value);
                  setProcesses(Array(value).fill({ arrivalTime: 0, burstTime: 0 }));
                }}
                className="h-10 rounded-md px-2 border border-slate-800 text-center w-full"
              />
            </div>
          )}

          {selectedAlgorithm === 6 && (
            <div>
              <label>زمان کوآنتومی:</label>
              <input
                type="number"
                value={quantumTime}
                onChange={(e) => setQuantumTime(Number(e.target.value))}
                min="1"
                required
                className="h-10 rounded-md px-2 border border-slate-800 text-center w-full"
              />
            </div>
          )}
          {selectedAlgorithm === 7 && (
            <div>
              <label className="block text-lg font-semibold">تعداد CPU:</label>
              <input
                type="number"
                min="1"
                value={numCPUs}
                onChange={(e) => setNumCPUs(Number(e.target.value))}
                className="h-10 rounded-md px-2 border border-slate-800 text-center w-full"
              />
            </div>
          )}

          {Array.from({ length: numProcesses || numRequests }, (_, index) => (
            <div key={index} className="border p-4 rounded-md shadow-sm bg-gray-50 mt-4">
              <label className="block text-lg font-semibold">
                {selectedAlgorithm === 10 || selectedAlgorithm === 11 ? `درخواست ${index + 1}:` : `پروسه ${index + 1}:`}
              </label>
              {selectedAlgorithm === 10 || selectedAlgorithm === 11 ? (
                <input
                  type="number" value={requests[index] || ""}
                  onChange={(e) => {
                    const updatedRequests = [...requests];
                    updatedRequests[index] = Number(e.target.value);
                    setRequests(updatedRequests);
                  }}
                  className="h-10 rounded-md px-2 border border-slate-800 w-full"
                />
              ) : (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm">زمان آغاز:</label>
                    <input
                      type="number"
                      value={processes[index]?.arrivalTime || ""}
                      onChange={(e) => handleProcessChange(index, "arrivalTime", e.target.value)}
                      className="h-10 rounded-md px-2 border border-slate-800 w-full"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="text-sm">زمان پروسه:</label>
                    <input
                      type="number"
                      value={processes[index]?.burstTime || ""}
                      onChange={(e) => handleProcessChange(index, "burstTime", e.target.value)}
                      className="h-10 rounded-md px-2 border border-slate-800 w-full"
                    />
                  </div>

                  {(selectedAlgorithm === 8 || selectedAlgorithm === 9) && (
                    <div className="flex-1">
                      <label className="text-sm">ارجحیت:</label>
                      <select
                        value={processes[index]?.priority || "low"}
                        onChange={(e) => handleProcessChange(index, "priority", e.target.value)}
                        className="h-10 rounded-md px-2 border border-slate-800 w-full"
                      >
                        <option value="low">کم</option>
                        <option value="high">زیاد</option>
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </form>
      </div>
      <div className="col-span-3 p-6 bg-white rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="bg-blue-500 text-white flex">
              {selectedAlgorithm === 10 || selectedAlgorithm === 11 ? (
                <>
                  <div className="flex-1 border px-4 py-2">درخواست</div>
                  <div className="flex-1 border px-4 py-2">فاصله</div>
                </>
              ) : (
                <>
                  <div className="flex-1 border px-4 py-2">پروسه</div>
                  <div className="flex-1 border px-4 py-2">زمان ورود</div>
                  <div className="flex-1 border px-4 py-2">زمان پردازش</div>
                  <div className="flex-1 border px-4 py-2">زمان شروع</div>
                  <div className="flex-1 border px-4 py-2">زمان اتمام</div>
                  <div className="flex-1 border px-4 py-2">زمان چرخش</div>
                  <div className="flex-1 border px-4 py-2">زمان انتظار</div>
                  <div className="flex-1 border px-4 py-2">زمان پاسخ</div>
                </>
              )}
            </div>
            <div>
              {result.length ? (
                result.map((process) => (
                  <div key={process.processNumber} className="flex hover:bg-gray-100 transition duration-200">
                    {selectedAlgorithm === 10 || selectedAlgorithm === 11 ? (
                      <>
                        <div className="flex-1 border px-4 py-2">{process.request}</div>
                        <div className="flex-1 border px-4 py-2">{process.distance}</div>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 border px-4 py-2">{process.processNumber}</div>
                        <div className="flex-1 border px-4 py-2">{process.arrivalTime}</div>
                        <div className="flex-1 border px-4 py-2">{process.burstTime}</div>
                        <div className="flex-1 border px-4 py-2">{process.startTime}</div>
                        <div className="flex-1 border px-4 py-2">{process.completionTime}</div>
                        <div className="flex-1 border px-4 py-2">{process.turnaroundTime}</div>
                        <div className="flex-1 border px-4 py-2">{process .waitingTime}</div>
                        <div className="flex-1 border px-4 py-2">{process.responseTime}</div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div className="border px-4 py-6 text-center font-bold">اطلاعاتی یافت نشد</div>
              )}
            </div>
          </div>
        </div>
        {extraMetrics.cpuUtilization && selectedAlgorithm !== 10 && selectedAlgorithm !== 11 ? (
          <div className="mt-4">
            <p className="font-semibold">استفاده پردازنده: {extraMetrics.cpuUtilization}%</p>
            <p className="font-semibold">تعداد پردازش در ثانیه: {extraMetrics.throughput}</p>
            <p className="font-semibold">میانگین زمان اتمام: {extraMetrics.averageCompletionTime}</p>
            <p className="font-semibold">میانگین زمان چرخش: {extraMetrics.averageTurnaroundTime}</p>
            <p className="font-semibold">میانگین زمان انتظار: {extraMetrics.averageWaitingTime}</p>
            <p className="font-semibold">میانگین زمان پاسخ: {extraMetrics.averageResponseTime}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default App;