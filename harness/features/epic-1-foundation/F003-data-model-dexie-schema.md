# F003: Local data store

**Epic**: 1. Foundation · **Status**: Specified · **Depends on**: F001

## Goal

A place on the phone where everything the user enters is kept: profile, goals, foods, diary entries, saved meals and weigh-ins, exactly as described in `DATA-MODEL.md`. There is no server, so this store is the product. Two rules make it trustworthy: what you logged never changes when you later edit a food, and changing your goal never re-scores days that are already behind you.

## Acceptance criteria

1. A fresh install creates an empty store with the six kinds of records from the data model.
2. A logged entry keeps its own name, amount and nutrition. Editing, archiving or deleting the food later leaves the entry exactly as it was.
3. Each day is measured against the goal that was valid on that day, not against today's goal.
4. Nutrition for any amount is calculated the same way everywhere, so a preview never disagrees with what gets saved, and a day's total is the sum of its entries.

## Layout & design

None — F003 has no screens.
