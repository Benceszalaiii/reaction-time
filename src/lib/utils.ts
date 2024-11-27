import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateImprovementOverTime(times: number[]) {
  let totalDifference = 0;

  for (let i = 1; i < times.length; i++) {
    totalDifference += times[i - 1] - times[i];
  }

  return totalDifference / (times.length - 1);
}

export function calculateAverage(times: number[]) {
  let sum = 0;
  for (const time of times) {
    sum += time;
  }
  return sum / times.length;
}

export function calculateAveragePercentageImprovement(times: number[]) {
  if (times.length < 2) return 0; // No improvement if less than 2 scores

  let totalPercentageImprovement = 0;
  let count = 0;

  for (let i = 1; i < times.length; i++) {
    const difference = times[i - 1] - times[i]; // Difference between consecutive scores
    if (difference > 0) { // Only count improvements (time decreased)
      const percentageImprovement = (difference / times[i - 1]) * 100;
      totalPercentageImprovement += percentageImprovement;
      count++;
    }
  }

  // Return the average percentage improvement, or 0 if no improvements
  return count > 0 ? totalPercentageImprovement / count : 0;
}