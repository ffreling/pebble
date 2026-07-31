import Poco from "commodetto/Poco";
import parseBMF from "commodetto/parseBMF";
import parseRLE from "commodetto/parseRLE";

const render = new Poco(screen);

// Fonts
const hourFont = getFont("foo", 128);
const minuteFont = new render.Font("Bitham-Bold", 42);
const dateFont = new render.Font("Gothic-Bold", 24);

// Colors
const black = render.makeColor(0, 0, 0);
const white = render.makeColor(255, 255, 255);

// Day and month names for date formatting
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getFont(name, size) {
    const font = parseBMF(new Resource(`${name}-${size}.fnt`));
    font.bitmap = parseRLE(new Resource(`${name}-${size}-alpha.bm4`));
    return font;
}

function draw(event) {
    const now = event.date;

    render.begin();
    render.fillRectangle(black, 0, 0, render.width, render.height);

    // Format time as HH:MM
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    // Center the time vertically (shifted up slightly to make room for date)
    let width = render.getTextWidth(hours, hourFont);
    render.drawText(hours, hourFont, white,
        (render.width - width) / 2,
                    (render.height / 2) - hourFont.height + 5);

    // Format date as "Mon Jan 01"
    const dayName = DAYS[now.getDay()];
    const monthName = MONTHS[now.getMonth()];
    const dateStr = `${dayName} ${monthName} ${String(now.getDate()).padStart(2, "0")}`;

    // Draw date below the time
    width = render.getTextWidth(dateStr, dateFont);
    render.drawText(dateStr, dateFont, white,
        (render.width - width) / 2,
        (render.height / 2) + 10);

    render.end();
}

// Update every minute (fires immediately when registered)
watch.addEventListener("minutechange", draw);
