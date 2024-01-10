import React, { createContext, useState, useEffect } from "react";
export const HistoryEventContext = createContext(
  {} as {
    historyEvent: string[];
    setHistoryEvent: React.Dispatch<React.SetStateAction<string[]>>;
  }
);
const HistoryEventProvider = ({ children }: { children: any }) => {
  const initialState = JSON.parse(
    localStorage.getItem("historyState") || "[]"
  ) as string[];

  const [historyEvent, setHistoryEvent] = useState<string[]>(initialState);
  useEffect(() => {
    localStorage.setItem("historyState", JSON.stringify(historyEvent));
  }, [historyEvent]);
  return (
    <HistoryEventContext.Provider value={{ historyEvent, setHistoryEvent }}>
      {children}
    </HistoryEventContext.Provider>
  );
};
export default HistoryEventProvider;
