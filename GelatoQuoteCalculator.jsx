import { useState } from 'react';
import { jsPDF } from 'jspdf';

export default function GelatoQuoteCalculator() {
  const [guests, setGuests] = useState(100);
  const [roundTripKm, setRoundTripKm] = useState(0);
  const [staff, setStaff] = useState(2);
  const [supervisors, setSupervisors] = useState(1);

  const [sprinkleCones, setSprinkleCones] = useState(false);
  const [sprinkleCups, setSprinkleCups] = useState(false);
  const [waffleBar, setWaffleBar] = useState(false);
  const [lemonade, setLemonade] = useState(false);
  const [water, setWater] = useState(false);
  const [customGraphic, setCustomGraphic] = useState(false);
  const [plannerFee, setPlannerFee] = useState(false);
  const [eventType, setEventType] = useState("standard");

  const [overtimeCost, setOvertimeCost] = useState(0);
  const [tollCost, setTollCost] = useState(0);
  const [mealCost, setMealCost] = useState(0);
  const [accommodationCost, setAccommodationCost] = useState(0);

  const [quote, setQuote] = useState(null);

  const calculateQuote = () => {
    const gelatoKg = Math.ceil(guests / 10);
    const gelatoCost = gelatoKg * 7.5;
    const consumablesCost = guests * 0.2;
    const staffCost = staff * 50;
    const supervisorCost = supervisors * 100;
    const fuelLiters = (roundTripKm * 10) / 100;
    const transportCost = fuelLiters * 2;

    let baseTotal = gelatoCost + consumablesCost + staffCost + supervisorCost + transportCost;
    const profitMargin = guests * 3;
    let offerBase = baseTotal + profitMargin;

    if (sprinkleCones) offerBase += guests * 0.8;
    if (sprinkleCups) offerBase += guests * 1.0;
    if (waffleBar) offerBase += guests * 4.5;
    if (lemonade) offerBase += guests * 1.2;
    if (water) offerBase += guests * 0.3;
    if (customGraphic) offerBase += 50;

    offerBase += Number(overtimeCost) + Number(tollCost) + Number(mealCost) + Number(accommodationCost);

    if (plannerFee) offerBase *= 1.1;
    if (eventType === "premium") offerBase *= 1.1;
    if (eventType === "vip") offerBase *= 1.3;

    const vat = offerBase * 0.24;
    const total = offerBase + vat;

    setQuote({ baseTotal: offerBase, vat, total });
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Gelato Bar - Quotation Summary", 20, 20);
    doc.setFontSize(12);
    doc.text(`Guests: ${guests}`, 20, 30);
    doc.text(`Net: €${quote.baseTotal.toFixed(2)}`, 20, 40);
    doc.text(`VAT: €${quote.vat.toFixed(2)}`, 20, 50);
    doc.setFontSize(14);
    doc.text(`Total: €${quote.total.toFixed(2)}`, 20, 60);
    doc.save("gelato_bar_quote.pdf");
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>Gelato Bar Quote Calculator</h2>
      <label>Guests: <input type="number" value={guests} onChange={e => setGuests(+e.target.value)} /></label><br />
      <label>Distance (km round trip): <input type="number" value={roundTripKm} onChange={e => setRoundTripKm(+e.target.value)} /></label><br />
      <label>Staff: <input type="number" value={staff} onChange={e => setStaff(+e.target.value)} /></label><br />
      <label>Supervisors: <input type="number" value={supervisors} onChange={e => setSupervisors(+e.target.value)} /></label><br /><br />
      <fieldset>
        <legend>Extras</legend>
        <label><input type="checkbox" checked={sprinkleCones} onChange={() => setSprinkleCones(!sprinkleCones)} /> Sprinkle Cones</label><br />
        <label><input type="checkbox" checked={sprinkleCups} onChange={() => setSprinkleCups(!sprinkleCups)} /> Sprinkle Cups</label><br />
        <label><input type="checkbox" checked={waffleBar} onChange={() => setWaffleBar(!waffleBar)} /> Waffle Bar</label><br />
        <label><input type="checkbox" checked={lemonade} onChange={() => setLemonade(!lemonade)} /> Lemonade</label><br />
        <label><input type="checkbox" checked={water} onChange={() => setWater(!water)} /> Water</label><br />
        <label><input type="checkbox" checked={customGraphic} onChange={() => setCustomGraphic(!customGraphic)} /> Custom Graphic</label><br />
      </fieldset><br />
      <fieldset>
        <legend>Logistics</legend>
        <label>Overtime Cost: <input type="number" value={overtimeCost} onChange={e => setOvertimeCost(+e.target.value)} /></label><br />
        <label>Toll Cost: <input type="number" value={tollCost} onChange={e => setTollCost(+e.target.value)} /></label><br />
        <label>Meal Cost: <input type="number" value={mealCost} onChange={e => setMealCost(+e.target.value)} /></label><br />
        <label>Accommodation Cost: <input type="number" value={accommodationCost} onChange={e => setAccommodationCost(+e.target.value)} /></label><br />
        <label><input type="checkbox" checked={plannerFee} onChange={() => setPlannerFee(!plannerFee)} /> Include Planner Fee (+10%)</label><br />
        <label>Event Type:
          <select value={eventType} onChange={e => setEventType(e.target.value)}>
            <option value="standard">Standard</option>
            <option value="premium">Premium (+10%)</option>
            <option value="vip">VIP (+30%)</option>
          </select>
        </label><br />
      </fieldset><br />
      <button onClick={calculateQuote}>Calculate</button>
      {quote && (
        <div>
          <h3>Summary</h3>
          <p>Net: €{quote.baseTotal.toFixed(2)}</p>
          <p>VAT: €{quote.vat.toFixed(2)}</p>
          <p><strong>Total: €{quote.total.toFixed(2)}</strong></p>
          <button onClick={exportPDF}>Export PDF</button>
        </div>
      )}
    </div>
  );
}