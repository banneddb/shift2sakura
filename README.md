# shift2sakura
Web Application Program Final


(Placeholder for data flow)
POST /transform — User uploads resume, AI extracts what it can, backend identifies missing fields, sends back JSON + missingFields array
POST /complete — Frontend sends back the user's answers to the missing fields. Backend takes the original JSON, merges in the user's answers, and optionally runs the AI again to translate/format the new inputs into proper Japanese (like converting a date of birth to 和暦, or polishing a rough 志望動機 into 敬語)
POST /convert — Frontend sends the completed JSON. Puppeteer generates the rirekisho PDF. User downloads it.

