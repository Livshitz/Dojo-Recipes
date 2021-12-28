# ⛩ Dojo-SDK - Recipe - Report Generator

## Context:
You have a website that presents a page and a list of items. This list is paginated and as you scroll down you get the next page.   
The ask is to add a new button, "Download as CSV" that will generate a report of all of the underlying data and will send to user's email as a single file, regardless of size.  
Assume there're millions of records in the DB that are part of a single report, the request to the DB itself might take a while.  
The user clicks on the button and the generated report will be sent to his email.

## Recipe:
1. HTTP micro service
1. Database with predefined items
1. MQ

## Validation:
The query might take a while, so you should not stuck the request. If a generate request failed, you should retry as the user is no longer attentive and cannot get your 'please try again' toast.

<!-- ## Solution:
Check [solution.ts](solution.ts) -->