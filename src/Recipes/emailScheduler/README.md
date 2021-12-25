# ⛩ Dojo-SDK - Recipe - Email Scheduler

## Context:
You're creating a system that is storing 'scheduled emails' definitions and periodically sends the emails needs to be sent. Each definition can store the email body, recipients and day of week + hour to be sent.

## Recipe:
1. db with predefined scheduled emails and tests verifying. Each definition has scheduled email time (hh:mm), email body, recipients and day of week for the weekly email.
1. scheduler that gets definitions that need to be treated and treats them. 
1. service that allow CRUD over the definitions

## Validation:
Definitions that define a point in time that is already in the past (today is Tuesday and we have a definition set for 13:00 Sunday) and haven't been treated yet should be treated on next scheduler tick.  
Write to `recipe.journal` to mimic actual email.  