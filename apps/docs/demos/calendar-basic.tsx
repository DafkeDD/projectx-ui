"use client";
import { useState } from "react";
import { Calendar, Card, CardContent, type DateRange, formatDate, formatDateRange } from "@projectx/ui";

export default function Demo() {
  const [single, setSingle] = useState<Date | null>(new Date());
  const [range, setRange] = useState<DateRange>({});

  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
      <Card>
        <CardContent>
          <Calendar
            selected={single}
            onSelect={setSingle}
            showWeekNumbers
            markers={(date) => date.getDay() === 3}
          />
          <p style={{ marginTop: 12, fontSize: 13 }}>
            Gekozen: <strong>{single ? formatDate(single) : "niets"}</strong>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            disabled={(date) => date.getDay() === 0}
          />
          <p style={{ marginTop: 12, fontSize: 13 }}>
            Periode: <strong>{range.from ? formatDateRange(range) : "niets"}</strong> — zondagen staan uit.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
