# travelator
A web app to simplify trip and itinerary planning

## Goals
Allow users to create trip plans, including travel and activities, with details such as cost, scheduling, and custom notes.  Allow users to save a trip plan to file (currently targeting JSON).  Allow users to load a trip plan into the web app from a saved file.

Add a light/dark theme.

## Line item types
Want to include:

### Travel
(e.g. car, taxi, plane, boat, walk, etc)

#### Fields:
Line type title "Travel" | subtype icon | subtype title (e.g. "Air" or "Rental Car", editable if custom) | origin | depart | destination | arrive | cost | move up, move down, remove line buttons

### Accommodation
(e.g. hotel, camp, airbnb, friend/fam house, etc)

#### Fields:
Line type title "Accommodations" | subtype icon | subtype title (e.g. "hotel" or "camping", editable if custom) | location | arrive date | depart date | cost | move up, move down, remove line buttons

### Activity
(probably custom text)

#### Fields:
Line type title "Activity" | subtype title (always custom, editable) | date | start time | duration | cost | move up, move down, remove line buttons

### Food
(bar, restaurant, take-out, cooking, etc)

#### Fields:
Line type title "Food" | subtype icon | subtype title (e.g. "drinks" or "food", editable if custom) | venue name | date | time | cost(ish) | move up, move down, remove line buttons
