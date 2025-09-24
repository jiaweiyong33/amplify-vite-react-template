import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  // Tasks & To-Do Lists
  Task: a
    .model({
      title: a.string().required(),
      description: a.string(),
      priority: a.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
      status: a.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
      dueDate: a.datetime(),
      reminderDate: a.datetime(),
      category: a.string(),
      tags: a.string().array(),
      estimatedHours: a.float(),
      actualHours: a.float(),
      isRecurring: a.boolean(),
      recurringPattern: a.string(),
      completedAt: a.datetime(),
      parentTaskId: a.id(), // For subtasks
    })
    .authorization((allow) => [allow.owner()]),

  // Calendar & Events
  Event: a
    .model({
      title: a.string().required(),
      description: a.string(),
      startDate: a.datetime().required(),
      endDate: a.datetime().required(),
      location: a.string(),
      category: a.string(),
      color: a.string(),
      isAllDay: a.boolean(),
      isRecurring: a.boolean(),
      recurringPattern: a.string(),
      reminderMinutes: a.integer(),
    })
    .authorization((allow) => [allow.owner()]),

  // Goals & Tracking
  Goal: a
    .model({
      title: a.string().required(),
      description: a.string(),
      type: a.enum(['SHORT_TERM', 'LONG_TERM']),
      targetDate: a.datetime(),
      currentProgress: a.float(),
      targetValue: a.float(),
      unit: a.string(),
      category: a.string(),
      isCompleted: a.boolean(),
    })
    .authorization((allow) => [allow.owner()]),

  // Habits
  Habit: a
    .model({
      name: a.string().required(),
      description: a.string(),
      frequency: a.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
      targetCount: a.integer(),
      category: a.string(),
      color: a.string(),
      icon: a.string(),
      isActive: a.boolean(),
    })
    .authorization((allow) => [allow.owner()]),

  HabitEntry: a
    .model({
      habitId: a.id().required(),
      date: a.date().required(),
      completed: a.boolean(),
      notes: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  // Notes & Journaling
  Note: a
    .model({
      title: a.string(),
      content: a.string().required(),
      type: a.enum(['NOTE', 'JOURNAL', 'VOICE', 'IMAGE']),
      tags: a.string().array(),
      category: a.string(),
      mood: a.enum(['VERY_HAPPY', 'HAPPY', 'NEUTRAL', 'SAD', 'VERY_SAD']),
      isPrivate: a.boolean(),
    })
    .authorization((allow) => [allow.owner()]),

  // Health & Wellness
  HealthEntry: a
    .model({
      type: a.enum(['SLEEP', 'WATER', 'EXERCISE', 'MEAL', 'WEIGHT']),
      value: a.float(),
      unit: a.string(),
      date: a.date().required(),
      notes: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  // Finance & Budgeting
  Expense: a
    .model({
      amount: a.float().required(),
      description: a.string().required(),
      category: a.string(),
      date: a.date().required(),
      type: a.enum(['INCOME', 'EXPENSE']),
      isRecurring: a.boolean(),
      recurringPattern: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  Budget: a
    .model({
      category: a.string().required(),
      monthlyLimit: a.float().required(),
      currentSpent: a.float(),
      month: a.string().required(), // YYYY-MM format
    })
    .authorization((allow) => [allow.owner()]),

  // Categories & Organization
  Category: a
    .model({
      name: a.string().required(),
      type: a.enum(['TASK', 'EVENT', 'GOAL', 'HABIT', 'NOTE', 'EXPENSE']),
      color: a.string(),
      icon: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  // User Preferences
  UserPreference: a
    .model({
      key: a.string().required(),
      value: a.string().required(),
      type: a.enum(['THEME', 'NOTIFICATION', 'PRIVACY', 'GENERAL']),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    // This tells the data client in your app (generateClient())
    // to sign API requests with the user authentication token.
    defaultAuthorizationMode: 'userPool',
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
