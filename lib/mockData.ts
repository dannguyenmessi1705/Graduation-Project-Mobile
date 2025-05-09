import type { UserInfo } from "../types/UserData";
import type { TopicData } from "../types/TopicData";
import type { PostData } from "../types/PostData";

// Mock User Data
export const mockUsers: UserInfo[] = [
  {
    id: "1",
    username: "johndoe",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    gender: "Male",
    birthDay: "1990-01-01",
    country: "USA",
    city: "New York",
    phoneNumber: "+1234567890",
    postalCode: "10001",
    picture: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "2",
    username: "janedoe",
    email: "jane@example.com",
    firstName: "Jane",
    lastName: "Doe",
    gender: "Female",
    birthDay: "1992-05-15",
    country: "Canada",
    city: "Toronto",
    phoneNumber: "+1987654321",
    postalCode: "M5V 2A8",
    picture: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "3",
    username: "bobsmith",
    email: "bob@example.com",
    firstName: "Bob",
    lastName: "Smith",
    gender: "Male",
    birthDay: "1985-08-22",
    country: "UK",
    city: "London",
    phoneNumber: "+4412345678",
    postalCode: "EC1A 1BB",
    picture: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: "4",
    username: "alicegreen",
    email: "alice@example.com",
    firstName: "Alice",
    lastName: "Green",
    gender: "Female",
    birthDay: "1988-03-14",
    country: "Australia",
    city: "Sydney",
    phoneNumber: "+6198765432",
    postalCode: "2000",
    picture: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: "5",
    username: "mikebrown",
    email: "mike@example.com",
    firstName: "Mike",
    lastName: "Brown",
    gender: "Male",
    birthDay: "1991-11-30",
    country: "Germany",
    city: "Berlin",
    phoneNumber: "+4987654321",
    postalCode: "10115",
    picture: "https://randomuser.me/api/portraits/men/5.jpg",
  },
];

// Mock Topic Data
export const mockTopics: TopicData[] = [
  {
    id: "1",
    name: "Programming",
    description:
      "Discussions about programming languages, frameworks, and development techniques",
    totalPosts: 25,
    totalComments: 120,
  },
  {
    id: "2",
    name: "Mobile Development",
    description:
      "Mobile app development for iOS and Android platforms, including React Native, Flutter, and native development",
    totalPosts: 18,
    totalComments: 87,
  },
  {
    id: "3",
    name: "Web Development",
    description:
      "Frontend and backend web development topics, including HTML, CSS, JavaScript, and server-side technologies",
    totalPosts: 32,
    totalComments: 156,
  },
  {
    id: "4",
    name: "UI/UX Design",
    description:
      "User interface and experience design principles, tools, and best practices for creating engaging digital experiences",
    totalPosts: 15,
    totalComments: 64,
  },
  {
    id: "5",
    name: "Machine Learning",
    description:
      "AI and machine learning discussions, including algorithms, frameworks, and practical applications",
    totalPosts: 22,
    totalComments: 95,
  },
  {
    id: "6",
    name: "DevOps",
    description:
      "Continuous integration, deployment, and infrastructure as code discussions for modern software development",
    totalPosts: 14,
    totalComments: 72,
  },
  {
    id: "7",
    name: "Blockchain",
    description:
      "Discussions about blockchain technology, cryptocurrencies, smart contracts, and decentralized applications",
    totalPosts: 10,
    totalComments: 48,
  },
  {
    id: "8",
    name: "Game Development",
    description:
      "Game design, development, and optimization for various platforms and engines",
    totalPosts: 19,
    totalComments: 83,
  },
  {
    id: "9",
    name: "Career Advice",
    description:
      "Professional development, job hunting, interview preparation, and career growth in tech",
    totalPosts: 27,
    totalComments: 134,
  },
  {
    id: "10",
    name: "Tech News",
    description:
      "Latest news, trends, and discussions about technology and the tech industry",
    totalPosts: 30,
    totalComments: 112,
  },
];

// Mock Post Data
export const mockPosts: PostData[] = [
  {
    id: "1",
    title: "Getting started with React Native",
    content: `# Getting Started with React Native React Native is a powerful framework for building cross-platform mobile applications using JavaScript and React. Here's how to get started:`,
    createdAt: "2023-04-20T10:30:00Z",
    updatedAt: "2023-04-20T10:30:00Z",
    author: { id: "1", username: "johndoe" },
    totalComments: 5,
    totalUpvotes: 12,
    totalDownvotes: 2,
    topicId: "2",
    fileAttachments: [],
  },
  {
    id: "2",
    title: "Understanding Redux for state management",
    content: `Redux is a predictable state container for JavaScript apps. It helps you write applications that behave consistently across different environments.`,
    createdAt: "2023-04-18T14:22:00Z",
    updatedAt: "2023-04-19T08:15:00Z",
    author: { id: "2", username: "janedoe" },
    totalComments: 8,
    totalUpvotes: 24,
    totalDownvotes: 1,
    topicId: "1",
    fileAttachments: ["https://example.com/files/typescript-cheatsheet.pdf"],
  },
  {
    id: "3",
    title: "Exploring the latest features in JavaScript",
    content: `JavaScript is constantly evolving. In this post, we'll explore some of the latest features and how they can improve your code.`,
    createdAt: "2023-04-15T09:45:00Z",
    updatedAt: "2023-04-15T09:45:00Z",
    author: { id: "3", username: "bobsmith" },
    totalComments: 12,
    totalUpvotes: 18,
    totalDownvotes: 3,
    topicId: "3",
    fileAttachments: ["https://example.com/files/css-examples.zip"],
  },
  {
    id: "4",
    title: "Building responsive layouts with CSS Grid",
    content: `CSS Grid Layout is a two-dimensional layout system for the web. It allows you to create complex layouts with ease.`,
    createdAt: "2023-04-12T16:20:00Z",
    updatedAt: "2023-04-13T11:10:00Z",
    author: { id: "2", username: "janedoe" },
    totalComments: 6,
    totalUpvotes: 15,
    totalDownvotes: 0,
    topicId: "4",
    fileAttachments: [],
  },
  {
    id: "5",
    title: "Introduction to TypeScript",
    content: `TypeScript is a superset of JavaScript that adds static types. It helps catch errors at compile time and improves code quality.`,
    createdAt: "2023-04-10T13:15:00Z",
    updatedAt: "2023-04-10T13:15:00Z",
    author: { id: "1", username: "johndoe" },
    totalComments: 4,
    totalUpvotes: 21,
    totalDownvotes: 2,
    topicId: "5",
    fileAttachments: ["https://example.com/files/tensorflow-examples.ipynb"],
  },
];
