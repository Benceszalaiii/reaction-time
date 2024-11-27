"use client";

import { Chart } from "@/components/chart";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Gauge } from "@/components/ui/gauge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { calculateAveragePercentageImprovement, cn } from "@/lib/utils";
import { ResetIcon } from "@radix-ui/react-icons";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import ReactionBox from "../components/reaction-box";
import ThemeSwitcher from "../components/themebutton";

export default function Page() {
  const [times, setTimes] = useState<number[]>([]);
  const [timesLoaded, setTimesLoaded] = useState(false);
  useEffect(() => {
    if (!timesLoaded) {
      const times = localStorage.getItem("times");
      if (times) {
        setTimes(JSON.parse(times));
      }
      setTimesLoaded(true);
      return;
    }
    if (times.length > 0) {
      localStorage.setItem("times", JSON.stringify(times));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [times]);
  const [lastTime, setLastTime] = useState<number | null>(null);
  const timerContext = createContext<{
    getter: number[];
    setter: Dispatch<SetStateAction<number[]>>;
    lastTime: number | null;
    setLastTime: Dispatch<SetStateAction<number | null>>;
  }>({ getter: times, setter: setTimes, lastTime, setLastTime });
  const averageText = (times: number[]) => {
    let sum = 0;
    for (const time of times) {
      sum += time;
    }
    const avg = sum / times.length;
    if (isNaN(avg)) {
      return "-";
    }
    const formatted = Intl.NumberFormat("en-US", {
      maximumFractionDigits: 1,
    }).format(avg);
    return formatted + " ms";
  };
  const getConsistency = (times: number[]) => {
    if (times.length < 2) return 0; // Can't calculate SD with less than two times

    const mean = times.reduce((sum, time) => sum + time, 0) / times.length; // Calculate mean
    const variance =
      times.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) /
      times.length; // Variance calculation
    const standardDeviation = Math.sqrt(variance); // Standard deviation = square root of variance

    return Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(
      standardDeviation
    );
  };
  const getImprovementPrc = (times: number[]) => {
    if (times.length > 0) {
      const improv = calculateAveragePercentageImprovement(times);
      return Math.round(improv);
    }
    return 0;
  };
  return (
    <main className="flex flex-col gap-2 mb-24 md:p-12">
      <TooltipProvider>
        <div className="flex flex-row w-full items-start justify-end gap-4">
          <ThemeSwitcher className="" />
        </div>
        <h1 className="font-caveat w-full text-center text-4xl mb-6 text-cyan-500 font-semibold">
          Reaction Time Test
        </h1>
        <timerContext.Provider
          value={{ getter: times, setter: setTimes, lastTime, setLastTime }}
        >
          <ReactionBox context={timerContext} />
        </timerContext.Provider>
        <header className="flex mt-16 flex-row justify-around w-full text-center items-center">
          <h2 className="text-2xl font-semibold ml-4 font-sfpro">Statistics</h2>
          {times.length > 0 && (
            <Tooltip>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button variant={"ghost"}>
                      <ResetIcon />
                    </Button>
                  </TooltipTrigger>
                </AlertDialogTrigger>
                <TooltipContent>
                  <p>Reset scores</p>
                </TooltipContent>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently remove
                      all your existing scores.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className={`${buttonVariants({
                        variant: "destructive",
                      })}`}
                      asChild
                    >
                      <Button
                        onClick={() => {
                          setTimes([]);
                          setLastTime(null);
                          localStorage.removeItem("times");
                          toast.success("Scores reset successfully");
                        }}
                        variant={"destructive"}
                      >
                        Reset score
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Tooltip>
          )}
        </header>
          <section className="grid grid-cols-2 grid-flow-row-dense mx-auto gap-2 md:gap-4 px-4 md:grid-cols-3">
            <BenchmarkCard
              title="Best time"
              color="text-cyan-500"
              description={`${times.length > 0 ? Math.min(...times) : "-"} ms`}
            />
            <BenchmarkCard
              title="Average time"
              description={averageText(times)}
              color="text-cyan-500"
            />
            <BenchmarkCard
              title="Average improvement"
              gauge={{
                size: "medium",
                value: getImprovementPrc(times),
                displayValue: `${getImprovementPrc(times)}%`,
              }}
            />
            <section className="col-span-full  w-full">
              <Chart times={times} />
            </section>
            <BenchmarkCard
              title="Worst time"
              description={`${times.length > 0 ? Math.max(...times) : "-"} ms`}
              color="text-cyan-500"
            />
            <BenchmarkCard
              title="Consistency"
              color="text-cyan-500"
              description={`${getConsistency(times)} ms`}
            />

            <BenchmarkCard
              title="Difference from previous"
              description={`${
                times.length < 2
                  ? "-"
                  :
                times[times.length - 1] - times[times.length - 2]
              } ms`}
              color="text-cyan-500"
            />
          </section>
      </TooltipProvider>
    </main>
  );
}

const BenchmarkCard = ({
  title,
  gauge,
  description,
  color,
}: {
  title: string;
  color?: string;
  gauge?: {
    value: number;
    displayValue?: string;
    size: "large" | "small" | "medium";
  };
  description?: string;
}) => {
  return (
    <Card className="min-w-full md:h-48 w-full h-40 flex flex-col gap-2 items-center justify-start p-4">
      <CardTitle className="text-base self-start">{title}</CardTitle>
      <CardContent
        className={`size-full flex items-center justify-center ${color}`}
      >
        {gauge && (
          <Gauge
            showValue
            size={gauge.size}
            displayValue={gauge.displayValue}
            color={color}
            value={gauge.value}
          />
        )}
        <p className={cn("text-2xl text-center")}>{description}</p>
      </CardContent>
    </Card>
  );
};
