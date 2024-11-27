"use client";
import { cn } from "@/lib/utils";
import {
  Context,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function ReactionBox({
  context,
}: {
  context: Context<{
    getter: number[];
    setter: Dispatch<SetStateAction<number[]>>;
    lastTime: number | null;
    setLastTime: Dispatch<SetStateAction<number | null>>;
  }>;
}) {
  const [state, setState] = useState<0 | 1 | 2 | 3 | 4>(0);
  const timeOutRef = useRef<NodeJS.Timeout | null>(null);
  /*
    0: Start timer on click
    1: Countdown to reaction
    2: Waiting for reaction
    3: Reaction time displayed
    4: Clicked before green
  */
  const [startTime, setStartTime] = useState(new Date().getTime());
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const {
    getter: times,
    setter: setTimes,
    lastTime,
    setLastTime,
  } = useContext(context);
  useEffect(() => {
    if (reactionTime) {
      setTimes([...times, reactionTime]);
      setReactionTime(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reactionTime, setTimes]);
  const [currentStyles, setCurrentStyles] = useState("");
  useEffect(() => {
    switch (state) {
      case 0:
        setCurrentStyles("bg-sky-500");
        break;
      case 1:
        setCurrentStyles("bg-yellow-500");
        break;
      case 2:
        setCurrentStyles("bg-green-500");
        break;
      case 3:
        setCurrentStyles("bg-blue-500");
        break;
      case 4:
        setCurrentStyles("bg-red-500");
        break;
    }
  }, [state]);
  const onClickActions = () => {
    if (state === 1) {
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current);
      }
      setState(4);
      return;
    }
    if (state === 3) {
      console.log("State 3 clicked");
      setReactionTime(null);
      setState(0);
      return;
    }

    if (state === 0 || state === 4) {
      setState(1);
      timeOutRef.current = setTimeout(() => {
        setState(2);
        setStartTime(new Date().getTime());
      }, randomIntFromInterval(2500, 4000));
      return;
    }
    if (state === 2) {
      setState(3);
      const actualTime = new Date().getTime() - startTime;
      setLastTime(actualTime);
      setReactionTime(Math.min(5000, actualTime));
      if (times.length > 0) {
        const minBefore = Math.min(...times);
        if (minBefore > actualTime) {
          toast.success(
            `You beat your personal record of ${minBefore}ms by ${
              minBefore - actualTime
            }ms!`, {icon: "🎉"}
          );
        }
      }
      setTimes([...times, actualTime]);
      return;
    }
  };
  return (
    <div className=" h-72 max-w-screen-lg w-full px-4">
    <button
      className={cn(
        "size-full rounded-lg text-xl font-geistmono",
        currentStyles
      )}
      onClick={onClickActions}
    >
      {state === 0
        ? lastTime
          ? lastTime + "ms"
          : "Click to start"
        : state === 1
        ? "Click when this box turns green"
        : state === 2
        ? "Click now!"
        : state === 3
        ? `Your reaction time is ${reactionTime}ms`
        : state === 4
        ? "You clicked too early! Try again."
        : "Click to start"}
    </button>
    </div>
  );
}
