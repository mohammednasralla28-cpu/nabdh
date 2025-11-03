class PerformanceMonitor {
  constructor() {
    this.metrics = {
      apiCalls: [],
      renderTimes: [],
      componentLoadTimes: [],
    };
  }

  startTimer(label) {
    const startTime = performance.now();
    return {
      end: () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        this.metrics.apiCalls.push({ label, duration, timestamp: Date.now() });
        return duration;
      },
    };
  }

  measureComponentRender(componentName, renderFn) {
    const timer = this.startTimer(`Component: ${componentName}`);
    const result = renderFn();
    timer.end();
    return result;
  }

  measureApiCall(url, apiCall) {
    const timer = this.startTimer(`API: ${url}`);
    return apiCall().finally(() => timer.end());
  }

  getMetrics() {
    return {
      ...this.metrics,
      averageApiCallTime: this.calculateAverage(
        this.metrics.apiCalls.map((m) => m.duration)
      ),
      totalApiCalls: this.metrics.apiCalls.length,
      slowestApiCall: Math.max(...this.metrics.apiCalls.map((m) => m.duration)),
    };
  }

  calculateAverage(numbers) {
    return numbers.length > 0
      ? numbers.reduce((a, b) => a + b, 0) / numbers.length
      : 0;
  }

  logPerformanceReport() {
    const metrics = this.getMetrics();
  }

  clearMetrics() {
    this.metrics = {
      apiCalls: [],
      renderTimes: [],
      componentLoadTimes: [],
    };
  }
}

export default new PerformanceMonitor();
