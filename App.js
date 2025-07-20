import React, { useState, useEffect } from "react";
import { RRule } from "rrule";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import "./App.css"; // Ensure Tailwind CSS is imported in App.css or index.css

function App() {
  const WEEKDAYS = [
    { label: "Sun", value: RRule.SU },
    { label: "Mon", value: RRule.MO },
    { label: "Tue", value: RRule.TU },
    { label: "Wed", value: RRule.WE },
    { label: "Thu", value: RRule.TH },
    { label: "Fri", value: RRule.FR },
    { label: "Sat", value: RRule.SA },
  ];

  const ORDINALS = [
    { label: "First", value: 1 },
    { label: "Second", value: 2 },
    { label: "Third", value: 3 },
    { label: "Fourth", value: 4 },
    { label: "Last", value: -1 },
  ];

  const [frequency, setFrequency] = useState("WEEKLY");
  const [interval, setInterval] = useState(1);
  const [selectedWeekdays, setSelectedWeekdays] = useState([]);
  const [nthWeekday, setNthWeekday] = useState({ pos: 1, weekday: RRule.MO });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [previewDates, setPreviewDates] = useState([]);
  const [rruleString, setRRuleString] = useState("");

  const handleWeekdayChange = (day) => {
    setSelectedWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  useEffect(() => {
    try {
      const options = {
        freq: RRule[frequency],
        interval: interval,
        dtstart: startDate,
        until: endDate || undefined,
      };

      if (frequency === "WEEKLY") {
        options.byweekday = selectedWeekdays;
      }

      if (frequency === "MONTHLY" && nthWeekday) {
        options.byweekday = [nthWeekday.weekday.nth(nthWeekday.pos)];
      }

      const rule = new RRule(options);
      setRRuleString(rule.toString());
      const nextDates = rule.all().slice(0, 6);
      setPreviewDates(nextDates);
    } catch (e) {
      console.error("RRULE error", e);
    }
  }, [frequency, interval, selectedWeekdays, nthWeekday, startDate, endDate]);

  return (
    <div className="min-h-screen p-8 bg-gray-100 text-gray-900">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Recurring Date Picker</h2>

        {/* Frequency */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Recurrence:</label>
          <select
            className="p-2 border rounded w-full"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </div>

        {/* Interval */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Every:</label>
          <input
            type="number"
            className="p-2 border rounded w-full"
            min={1}
            value={interval}
            onChange={(e) => setInterval(parseInt(e.target.value, 10))}
          />
        </div>

        {/* Weekly */}
        {frequency === "WEEKLY" && (
          <div className="mb-4">
            <label className="block font-medium mb-2">Days of Week:</label>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map((day) => (
                <label key={day.label} className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={selectedWeekdays.includes(day.value)}
                    onChange={() => handleWeekdayChange(day.value)}
                  />
                  <span>{day.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Monthly */}
        {frequency === "MONTHLY" && (
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block mb-1">Occurrence:</label>
              <select
                className="p-2 border rounded w-full"
                value={nthWeekday.pos}
                onChange={(e) =>
                  setNthWeekday((prev) => ({
                    ...prev,
                    pos: parseInt(e.target.value, 10),
                  }))
                }
              >
                {ORDINALS.map((ord) => (
                  <option key={ord.value} value={ord.value}>
                    {ord.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block mb-1">Weekday:</label>
              <select
                className="p-2 border rounded w-full"
                value={nthWeekday.weekday.weekday}
                onChange={(e) =>
                  setNthWeekday((prev) => ({
                    ...prev,
                    weekday: WEEKDAYS[parseInt(e.target.value, 10)].value,
                  }))
                }
              >
                {WEEKDAYS.map((day, idx) => (
                  <option key={day.label} value={idx}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-1">Start Date:</label>
            <DatePicker
              className="p-2 border rounded w-full"
              selected={startDate}
              onChange={setStartDate}
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1">End Date (optional):</label>
            <DatePicker
              className="p-2 border rounded w-full"
              selected={endDate}
              onChange={setEndDate}
              isClearable
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>

        {/* RRULE Summary */}
        <div className="text-sm text-gray-600 italic mb-4">
          RRULE: <code>{rruleString}</code>
        </div>

        {/* Preview */}
        <div>
          <label className="block font-medium mb-2">Next 6 Dates:</label>
          <ul className="list-disc pl-5">
            {previewDates.map((date, idx) => (
              <li key={idx}>{format(date, "yyyy-MM-dd")}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;

