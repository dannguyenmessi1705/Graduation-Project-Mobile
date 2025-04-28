import type React from "react";
import { createContext, useContext, useState } from "react";

interface TopicContextType {
    topicName: string;
    setTopicName: (name: string) => void;
}

const TopicContext = createContext<TopicContextType>({
    topicName: "",
    setTopicName: () => {},
});

export const useTopicContext = () => useContext(TopicContext);

export const TopicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [topicName, setTopicName] = useState<string>("");

    return (
        <TopicContext.Provider value={{ topicName, setTopicName }}>
            {children}
        </TopicContext.Provider>
    );
}