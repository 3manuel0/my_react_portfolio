import React, { useEffect, useState } from "react";

const Clock: React.FC = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const date = now.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const time = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="flex shrink-0 flex-col items-end px-2 leading-tight"
      aria-label={`${date} ${time}`}
      aria-live="off"
    >
      <span className="text-[0.62rem] text-os-dim">{date}</span>
      <span className="text-[0.7rem] text-os-text">{time}</span>
    </div>
  );
};

export default Clock;