2.2 Attendance Raw Logs (Each Punch)

Store every punch:

attendance_logs

{
  "_id": "logId",
  "employeeId": "emp1",
  "punchType": "web" | "gps" | "biometric",
  "event": "IN" | "OUT",
  "timestamp": "2025-11-28T14:10:00",
  "geo": { "lat": 12.9, "lng": 80.2 },
  "locationId": "premise_6627",
  "isAdjusted": false
}

2.3 Attendance Day Summary (Final)

Exactly like your JSON.

attendance_summary

{
  "employeeId": "emp1",
  "date": "2025-11-28",
  "shiftId": "shift_2",
  "grossHours": 9.29,
  "effectiveHours": 8.35,
  "breakHours": 0.94,
  "arrivalTime": "14:10",
  "clockOutTime": "23:27",
  "isArrivedLate": true,
  "isAnomalyDetected": false,
  "attendanceDayStatus": 1,
  "inOutPairs": [
     { "in": "14:10", "out": "16:48", "duration": 2.64 }
  ],
  "pendingRegularization": false
}

⚙️ 3. Business Logic (Node.js)
3.1 Pairing Algorithm
Sort logs by time
Loop logs:
   If IN → push to stack
   If OUT → pair with last IN


Output → inOutPairs

3.2 Calculate Hours
Gross Hours:
lastOut - firstIn

Effective Hours:
Sum of all (out - in)

Break Hours:
break = grossHours - effectiveHours

3.3 Late Coming Calculation
arrival = firstIn
shiftStart = 14:00
if arrival > shiftStart → late

3.4 Half-Day | Absent | Present
if effectiveHours >= policy.presentHours → Present
else if effectiveHours >= policy.halfDayHours → Half Day
else → Absent

🛠 4. Admin Regularization Workflow
Why required:

Employee forgot to clock out

In/Out mismatch

Short punches (0 seconds)

Device switch anomalies

Flow:

Employee requests regularization with reason

Notification sent to admin

Admin approves & corrects logs:

{ "isAdjusted": true }


Attendance engine re-runs for that date

New summary stored

📍 5. Location Validation (GPS / Web Clock)
GPS Punch
Check distance between employee location & office geofence radius
If > radius → mark remoteClockIn = true

Web Punch

Track IP address

Track browser fingerprint

Valid only if in allowed IP list (optional)

🎉 6. Holiday Calculation

holiday_calendar

{
  "date": "2025-11-29",
  "type": "National"
}

Logic:
If date in holiday_calendar → mark holiday
If employee absent on holiday → no deduction

📌 Complete Attendance Flow

Employee punches IN/OUT

Raw logs saved

Cron job runs at midnight

Pairs IN/OUT

Detect anomalies

Calculate hours

Apply shift logic

Apply holiday logic

Save final summary

Dashboard shows summary + timeline