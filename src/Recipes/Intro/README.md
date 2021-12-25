# ⛩ Dojo-SDK - Recipe - Intro

## Context:
You're learning what [`dojo-sdk`](https://github.com/Livshitz/Dojo-SDK) is all about, what are the concepts and components available so you could solve real-world challenges in a simulated world with dojo-sdk. 

## Recipe:
You'll initiate and practice most of the components `dojo-sdk` offers to create a simple system that has:  
1. Simple HTTP micro service that will handle incoming requests and push the payload into MQ.
1. Message Queue to hold messages and consumers that will treat each message and write the payload to DB.
1. Database to store and retrieve the payloads.
1. Scheduler that will periodically check what was changes and will print a report.

## Validation:
In a Jest test, you're able to send requests (via `matrix.request`) to the HTTP micro services, they will push the payload to MQ and a MQ consumer that will treat each message by inserting the payload into DB.  

You'll use `recipe.journal` to store chronological traces of the activity and evaluate it in the Jest test.

## Solution:
Check [solution.ts](solution.ts)