// Page copy for the date, currency and calculator tools, keyed by slug.
// Links inside paragraphs and list items are written as [anchor text](/path).
// FAQ answers stay plain text because they are also used in the FAQ schema.

const todayIslamicDate = {
  sections: [
    {
      title: "Today's Islamic date, in English, Urdu and Arabic",
      paras: [
        "This page answers one question quickly: what is the **today Islamic date**? The card at the top shows the Hijri day, month and year, the matching Gregorian date with its weekday, and the same Hijri date written in Urdu and Arabic. Nothing needs to be typed, and the date follows your phone or computer.",
        "If you need a different day, such as a birthday, a nikah date or a deadline printed on a form, open the [Hijri date converter](/hijri-date-converter) and convert it in either direction. To find out how old someone is in years, months and days, there is also an [age calculator](/age-calculator).",
      ],
    },
    {
      title: "When does the Islamic date change?",
      paras: [
        "In the Islamic calendar a new day begins at sunset, so the night comes before the daytime that shares its date. That is why the first Tarawih prayers are held on the evening before the first fast. This page changes its date at midnight on your device, so after Maghrib the religious date may already be one day ahead of the card.",
      ],
    },
    {
      title: "Why Pakistan and Saudi Arabia can show different dates",
      paras: [
        "The calculation here uses Umm al-Qura, the civil calendar of Saudi Arabia, which is worked out in advance. Pakistan starts each month after the crescent is sighted and the Central Ruet-e-Hilal Committee announces it. The two often differ by a day. The -1 and +1 buttons let you match the date announced where you live, and the announcement should always come first for fasting and Eid.",
      ],
    },
    {
      title: "Important days in the Islamic year",
      paras: [
        "These dates are fixed in the Hijri calendar, while their Gregorian dates move every year. To see when one falls, choose Hijri to Gregorian in the [Islamic date converter](/hijri-date-converter).",
      ],
      list: [
        "1 Muharram: start of the Islamic new year",
        "10 Muharram: Ashura",
        "12 Rabi al-Awwal: widely marked as the Prophet's birth date",
        "1 Ramadan: beginning of the month of fasting",
        "1 Shawwal: Eid al-Fitr",
        "9 Dhu al-Hijjah: Day of Arafah",
        "10 Dhu al-Hijjah: Eid al-Adha",
      ],
    },
    {
      title: "Sharing today's date",
      paras: [
        "Press Copy to paste the date into a message or caption. You can also send it through a ready-made chat link with the [WhatsApp link generator](/whatsapp-link-generator), put it on a printable notice with [Text to PDF](/text-to-pdf), or add it to a greeting picture with [Add Watermark](/add-watermark).",
      ],
    },
  ],
  uses: [
    "Writing the Islamic date on a letter or application",
    "Planning Ramadan, Eid and Hajj related leave",
    "Preparing masjid notice boards and school diaries",
    "Adding both dates to invitations",
    "Checking the date before posting a greeting",
    "Learning Islamic month names in Urdu and Arabic",
  ],
  who: [
    "Students and teachers filling diaries and registers",
    "Office staff dating bilingual documents",
    "Families planning religious occasions",
    "Designers preparing Islamic calendars and posts",
    "Overseas Muslims comparing local and Saudi dates",
    "Anyone who wants the date without installing an app",
  ],
  features: [
    "Hijri and Gregorian date together",
    "Urdu and Arabic month names",
    "One day moon sighting adjustment",
    "Copy in one click",
    "Updates with your device date",
    "No signup required",
  ],
  faqs: [
    { q: "What is the Islamic date today?", a: "The card at the top of this page shows today's Hijri date with the matching Gregorian date, worked out from your device's date using the Umm al-Qura calendar." },
    { q: "Why is the date in Pakistan sometimes different?", a: "Pakistan begins each Islamic month after local moon sighting, while Umm al-Qura is calculated in advance for Saudi Arabia. Use the -1 or +1 buttons to match the announced date." },
    { q: "When does a new Islamic day start?", a: "A new Islamic day begins at sunset. This page changes the date at midnight, so after Maghrib you may already be in the next Islamic day." },
    { q: "How many months are in the Islamic calendar?", a: "There are twelve: Muharram, Safar, Rabi al-Awwal, Rabi al-Thani, Jumada al-Awwal, Jumada al-Thani, Rajab, Shaban, Ramadan, Shawwal, Dhu al-Qadah and Dhu al-Hijjah." },
    { q: "Which are the four sacred months?", a: "Muharram, Rajab, Dhu al-Qadah and Dhu al-Hijjah." },
    { q: "How many days are in a Hijri year?", a: "A Hijri year has 354 or 355 days, about 11 days fewer than a Gregorian year. Each month has 29 or 30 days." },
    { q: "What does AH mean?", a: "AH stands for Anno Hegirae, the year counted from the Hijrah, the Prophet's migration from Makkah to Madinah in 622 CE." },
    { q: "Can I use this date for official documents?", a: "Treat it as a guide. For legal or religious matters, confirm the date with the authority responsible in your country." },
    { q: "Does the page work on mobile?", a: "Yes. It works in current browsers on phones, tablets and computers, with no app or account." },
  ],
};

const hijriDateConverter = {
  sections: [
    {
      title: "Free Islamic date converter",
      paras: [
        "Use this **Islamic date converter** when a form, certificate or invitation needs both calendars. It works as a **Hijri to Gregorian converter** and in the other direction too, showing the weekday and the Urdu form of the Hijri date. If you only want today's date, see the [today Islamic date](/today-islamic-date) page.",
      ],
    },
    {
      title: "How to convert Gregorian to Hijri",
      paras: [
        "Keep Gregorian to Hijri selected and pick a date from the calendar field. The result appears straight away. For example, you can enter a date of birth to find its Islamic equivalent, or enter a planned wedding date to see which Hijri month it falls in. To get your age in years, months and days instead, use the [age calculator](/age-calculator).",
      ],
    },
    {
      title: "How to convert Hijri to Gregorian",
      paras: [
        "Switch to Hijri to Gregorian, type the day, choose the month by its English or Urdu name and enter the year. Months have 29 or 30 days, so the converter tells you when a 30th did not exist in that particular month instead of quietly moving to the next one.",
      ],
    },
    {
      title: "How the Hijri calendar works",
      paras: [
        "The Hijri calendar is lunar. It counts from the Prophet's migration to Madinah in 622 CE and was adopted as the official reckoning during the caliphate of Umar. It has twelve months of 29 or 30 days. Because the lunar year is shorter than the solar year, Ramadan and both Eids come about eleven days earlier each Gregorian year and gradually pass through every season.",
      ],
    },
    {
      title: "Accuracy and moon sighting",
      paras: [
        "Results follow the Umm al-Qura calendar. Countries that rely on moon sighting can be a day ahead or behind it, and the difference is not the same in every month. Use the adjustment buttons only after checking what was actually announced for that month. A calculated date is useful for planning, but it is not a moon sighting announcement.",
      ],
    },
    {
      title: "Working with dates on documents",
      paras: [
        "If the date you need is on a scanned certificate, [Urdu OCR](/urdu-ocr) or [Arabic OCR](/arabic-ocr) can pull the text out for you to check. When you prepare a bilingual letter, save it with [Text to PDF](/text-to-pdf) and sign it using the [Signature Maker](/signature-maker). For other kinds of conversion, such as length or weight, use the [unit converter](/unit-converter), and keep invitation wording short with the [word counter](/word-counter).",
      ],
    },
  ],
  uses: [
    "Finding the Hijri date of birth for a form",
    "Reading a Hijri date on an old family record",
    "Putting both dates on a wedding card",
    "Estimating when Ramadan or Eid will fall",
    "Matching visa or contract dates written in Hijri",
    "Preparing school and office calendars",
  ],
  who: [
    "Pilgrims planning Hajj and Umrah dates",
    "Workers dealing with Saudi or Gulf paperwork",
    "Students and researchers reading historical dates",
    "Families recording births and marriages",
    "Event planners and card designers",
    "Anyone who uses both calendars",
  ],
  features: [
    "Conversion in both directions",
    "Weekday shown with the result",
    "Urdu month names",
    "Clear message for dates that do not exist",
    "One day adjustment",
    "Copy button, no signup",
  ],
  faqs: [
    { q: "How do I convert a Hijri date to Gregorian?", a: "Choose Hijri to Gregorian, enter the day, month and year, and the matching Gregorian date and weekday appear instantly." },
    { q: "How do I find my Islamic date of birth?", a: "Choose Gregorian to Hijri and pick your date of birth. If you were born after sunset, the Islamic date may be the following day." },
    { q: "Which Islamic calendar does this converter use?", a: "It uses Umm al-Qura, the civil calendar of Saudi Arabia, through your browser's built-in calendar support." },
    { q: "Can the result be wrong by a day?", a: "It can differ by a day from the date announced in your country, because many countries start months by moon sighting." },
    { q: "Why does it say my Hijri date does not exist?", a: "Hijri months have 29 or 30 days. If you enter the 30th of a month that had 29 days in that year, there is no such date." },
    { q: "Which years are supported?", a: "Gregorian dates from 1938 to 2076 and Hijri years from 1357 to 1499 AH." },
    { q: "Is Arabic date the same as Islamic date?", a: "People often say Arabic date or chand ki tareekh when they mean the Hijri date. This converter gives that Hijri date." },
    { q: "Why is the Hijri year shorter?", a: "It follows twelve cycles of the moon, which total 354 or 355 days, while the Gregorian year follows the sun." },
    { q: "Are the dates I enter saved?", a: "No. The conversion runs in your browser and the dates you enter are not sent to our server." },
  ],
};

const currencyConverter = {
  sections: [
    {
      title: "Free online currency converter",
      paras: [
        "This **currency converter** gives a quick estimate for budgeting, invoices, online shopping and money sent home from abroad. Type an amount, choose two currencies and read the result. The last update time is printed under the result so you know how fresh the figure is.",
        "The most used pages from Pakistan are [USD to PKR](/usd-to-pkr), [SAR to PKR](/sar-to-pkr) and [AED to PKR](/aed-to-pkr), each with a ready conversion table.",
      ],
    },
    {
      title: "Which currencies are included",
      paras: [
        "You can convert between the Pakistani rupee, US dollar, Saudi riyal, UAE dirham, euro, British pound, Indian rupee, Bangladeshi taka, Qatari riyal, Kuwaiti dinar, Omani rial, Bahraini dinar, Canadian and Australian dollars, Chinese yuan, Japanese yen, Swiss franc, Turkish lira, Malaysian ringgit and Singapore dollar.",
      ],
    },
    {
      title: "Why your actual rate differs",
      paras: [
        "A reference rate is a guide, not an offer. When you exchange cash or send money, the provider usually applies its own buying or selling rate and may charge a fee as well. Card payments can add a foreign transaction charge. Compare the final amount the receiver gets, not only the headline rate. To see what a fee or margin of a few percent costs you, use the [percentage calculator](/percentage-calculator).",
      ],
    },
    {
      title: "Estimating an invoice or a purchase",
      paras: [
        "Freelancers can convert a quote before sending it, then save the invoice with [Text to PDF](/text-to-pdf) and sign it with the [Signature Maker](/signature-maker). If a price is only shown on a receipt photo, [Image to Text](/image-to-text) can read the figures for you to check. When the order also involves weight or size, the [unit converter](/unit-converter) handles kilograms, pounds, inches and centimetres.",
      ],
    },
  ],
  uses: [
    "Estimating rupees from a remittance",
    "Pricing freelance work in dollars",
    "Budgeting for Umrah or travel",
    "Checking the cost of an overseas order",
    "Comparing tuition or visa fees",
    "Preparing rough business quotations",
  ],
  who: [
    "Families receiving money from the Gulf",
    "Freelancers paid by international clients",
    "Students planning study abroad costs",
    "Small importers and online sellers",
    "Travellers and pilgrims",
    "Anyone comparing prices in two currencies",
  ],
  features: [
    "Twenty currencies",
    "Swap in one click",
    "Rates updated daily by the provider",
    "Last update time shown",
    "Copy the result",
    "No signup required",
  ],
  faqs: [
    { q: "Where do the exchange rates come from?", a: "Rates come from Exchange Rate API. The provider updates them once a day, and this page shows when they were last updated." },
    { q: "Are these the rates I will get at a bank or exchange company?", a: "No. They are indicative reference rates. Banks, exchange companies and remittance services set their own rates and fees." },
    { q: "Is the currency converter live?", a: "It is not a tick by tick trading feed. Rates refresh daily, which suits estimates and planning but not trading." },
    { q: "How is a conversion calculated?", a: "The amount is converted through the US dollar using the published rate for each of the two currencies." },
    { q: "Why does the rate change?", a: "Floating currencies move with supply and demand, trade, interest rates and economic news. Pegged currencies are held at a fixed rate by their central bank." },
    { q: "What is the difference between buying and selling rates?", a: "A dealer buys a currency from you at one rate and sells it to you at another. The gap is part of how the dealer earns." },
    { q: "Can I use these rates for accounting or contracts?", a: "No. Use the rate required by your bank, contract or tax authority. This tool is for estimates." },
    { q: "What happens if rates cannot be loaded?", a: "The page shows an error message. It does not fill in a guessed or old hardcoded number." },
    { q: "Is it free?", a: "Yes. The converter is free and needs no signup." },
  ],
};

const usdToPkr = {
  sections: [
    {
      title: "Converting dollar earnings to rupees",
      paras: [
        "Freelancers and exporters paid in dollars rarely receive exactly the reference rate. A payment platform or bank may apply its own conversion rate, take a service fee, or both. Before you invoice, estimate the rupee amount here, then compare it with the rate your payment channel shows when you withdraw.",
      ],
    },
    {
      title: "Interbank and open market dollar",
      paras: [
        "In Pakistan you will often see two figures. The interbank rate applies to dealings between banks, while the open market rate is what exchange companies quote to the public, with separate buying and selling prices. The number on this page is neither of those quotes; it is a daily reference rate for estimates.",
      ],
    },
    {
      title: "Other conversions",
      paras: [
        "Receiving money from the Gulf instead? See [SAR to PKR](/sar-to-pkr) and [AED to PKR](/aed-to-pkr), or pick any pair in the main [currency converter](/currency-converter). You can prepare a client invoice with [Text to PDF](/text-to-pdf) and add your [digital signature](/signature-maker).",
      ],
    },
  ],
  uses: [
    "Estimating a freelance payout",
    "Pricing an imported item",
    "Planning subscription and software costs",
    "Checking fees quoted in dollars",
  ],
  who: ["Freelancers and remote workers", "Exporters and importers", "Students paying foreign fees", "Online shoppers"],
  features: ["Rates with last update time", "Table for 1 to 1000 dollars", "Swap to PKR to USD", "Copy the result"],
  faqs: [
    { q: "How do I convert USD to PKR?", a: "Enter the dollar amount. The page applies the latest daily reference rate and shows the result in rupees." },
    { q: "Is this the open market dollar rate?", a: "No. It is an indicative reference rate, not an interbank quote or a quote from a specific dealer." },
    { q: "Why did I receive fewer rupees than shown here?", a: "Banks and payment services usually convert at their own rate and may deduct fees." },
    { q: "How do I convert PKR to USD?", a: "Press the swap button, then enter the amount in rupees." },
    { q: "How often does the rate update?", a: "The data provider updates once a day, and the update time is shown under the result." },
    { q: "How many paisa are in a rupee?", a: "One Pakistani rupee is divided into 100 paisa, although paisa coins are no longer in everyday use." },
  ],
};

const sarToPkr = {
  sections: [
    {
      title: "Sending riyals home",
      paras: [
        "If you send money from Saudi Arabia, compare what your family will actually receive from each remittance service, including any transfer fee. A better looking rate with a higher fee can leave less in rupees, especially on small transfers.",
      ],
    },
    {
      title: "Why the riyal rate follows the dollar",
      paras: [
        "The Saudi riyal is pegged to the US dollar at 3.75 riyals per dollar. So changes in the riyal to rupee rate mostly follow how the rupee moves against the dollar, which you can watch on the [USD to PKR](/usd-to-pkr) page.",
      ],
    },
    {
      title: "Budgeting for Umrah and Hajj",
      paras: [
        "Pilgrims can use the table on this page to get a feel for hotel, food and transport prices in rupees. Plan the travel dates with the [Hijri date converter](/hijri-date-converter) and check the [today Islamic date](/today-islamic-date) while you are there. The [currency converter](/currency-converter) covers other pairs.",
      ],
    },
  ],
  uses: [
    "Estimating a remittance from Saudi Arabia",
    "Planning Umrah spending money",
    "Comparing a salary offer with costs at home",
    "Converting shop and hotel prices",
  ],
  who: ["Pakistanis working in Saudi Arabia", "Families receiving remittances", "Umrah and Hajj pilgrims", "Job seekers comparing offers"],
  features: ["Rates with last update time", "Table for 1 to 1000 riyals", "Swap to PKR to SAR", "Copy the result"],
  faqs: [
    { q: "How do I convert Saudi riyal to Pakistani rupee?", a: "Enter the riyal amount and the rupee value appears using the latest daily reference rate." },
    { q: "Why does SAR to PKR change if the riyal is pegged?", a: "The riyal is fixed against the US dollar, but the rupee is not, so the riyal to rupee rate moves with the rupee." },
    { q: "Will my remittance arrive at this rate?", a: "Not necessarily. Each remittance service sets its own rate and fee. Check the receivable amount before you confirm." },
    { q: "How do I convert PKR to SAR?", a: "Press the swap button, then enter the amount in rupees." },
    { q: "How many halalas are in a riyal?", a: "One Saudi riyal is divided into 100 halalas." },
    { q: "Should I carry riyals or exchange them in Saudi Arabia?", a: "Compare the rates and charges offered in both places, including your bank card's foreign transaction fee, before deciding." },
  ],
};

const aedToPkr = {
  sections: [
    {
      title: "Dirham salaries and remittances",
      paras: [
        "When comparing exchange houses in the UAE, look at the final rupee amount for your own transfer size, because a better rate with a higher fee can still leave less for the receiver. Ask how long delivery takes and whether the quoted rate is locked.",
      ],
    },
    {
      title: "Why the dirham rate follows the dollar",
      paras: [
        "The UAE dirham is pegged to the US dollar at about 3.6725 dirhams per dollar. A move in the [USD to PKR](/usd-to-pkr) rate therefore usually shows up in the dirham to rupee rate too.",
      ],
    },
    {
      title: "Dubai travel and shopping",
      paras: [
        "Travellers can use the table to translate shop, hotel and taxi prices into rupees before paying. Shoppers comparing gold or electronics by weight or size may also find the [unit converter](/unit-converter) useful. For the riyal, open [SAR to PKR](/sar-to-pkr), and for other pairs use the [currency converter](/currency-converter).",
      ],
    },
  ],
  uses: [
    "Estimating a remittance from the UAE",
    "Converting a Dubai salary offer",
    "Checking shopping prices in rupees",
    "Planning a visit budget",
  ],
  who: ["Pakistanis working in the UAE", "Families receiving remittances", "Visitors to Dubai and Abu Dhabi", "Traders dealing with UAE suppliers"],
  features: ["Rates with last update time", "Table for 1 to 1000 dirhams", "Swap to PKR to AED", "Copy the result"],
  faqs: [
    { q: "How do I convert AED to PKR?", a: "Type the dirham amount and the converter shows the value in rupees using the latest daily reference rate." },
    { q: "Is the dirham rate the same at every exchange house?", a: "No. Exchange houses set their own rates and charges." },
    { q: "How often is this AED to PKR rate updated?", a: "The data provider updates once a day, and the page shows the time of the last update." },
    { q: "How do I convert PKR to AED?", a: "Press the swap button, then enter the amount in rupees." },
    { q: "How many fils are in a dirham?", a: "One UAE dirham is divided into 100 fils." },
    { q: "Why is my card payment in Dubai different from this figure?", a: "Your card network and bank use their own conversion rate and may add a foreign transaction fee." },
  ],
};

const ageCalculator = {
  sections: [
    {
      title: "Free age calculator by date of birth",
      paras: [
        "This **age calculator** tells you how old someone is in completed years, months and days. Enter the date of birth and the result appears straight away, along with the weekday of birth, the time left until the next birthday and the same age counted in months, weeks and days.",
        "Forms often ask for age on a particular day rather than today, for example on the closing date of a job application or the first day of a school session. Change the **Age on date** field and every figure is worked out for that day.",
      ],
    },
    {
      title: "How age is calculated",
      paras: [
        "The calculator first counts the full years and months between the two dates, then counts the days left over. This is why the answer reads like the way people say their age, instead of dividing the total number of days by an average year.",
        "Total days are counted from the date of birth up to the chosen date, so on the day of birth itself the total is zero. If a form counts both the first and last day, add one.",
      ],
    },
    {
      title: "Born on 29 February or at the end of a month",
      paras: [
        "A 29 February birthday only appears in leap years. In other years this calculator counts the new age as completed on 1 March. The same rule applies to month ends: for someone born on 31 January, the first month is completed on 1 March because February has no 31st.",
        "Rules for legal age can differ between countries and organisations. If a deadline depends on it, check the rule used by the office concerned.",
      ],
    },
    {
      title: "Age in the Hijri calendar",
      paras: [
        "Below the main result you will also see the age counted in the Islamic calendar, with the Hijri date of birth. Hijri years are about 11 days shorter than Gregorian years, so the Hijri age grows a little faster. To convert a single date, use the [Hijri date converter](/hijri-date-converter), or check the [today Islamic date](/today-islamic-date).",
      ],
    },
  ],
  uses: [
    "Filling job, school and passport forms",
    "Checking an age limit on a closing date",
    "Counting down to a birthday",
    "Working out a child's age in months",
    "Finding the age on an old record",
    "Seeing age in both calendars",
  ],
  who: [
    "Applicants checking eligibility",
    "Parents tracking a child's age",
    "Teachers and school admission staff",
    "HR and office staff",
    "Families keeping birth records",
    "Anyone curious about their age in days",
  ],
  features: [
    "Age in years, months and days",
    "Age on any date you choose",
    "Days left until the next birthday",
    "Total months, weeks and days",
    "Hijri age and Hijri date of birth",
    "Leap year birthdays handled",
  ],
  faqs: [
    { q: "How do I calculate my age from my date of birth?", a: "Enter your date of birth in the first field. The calculator uses today's date and shows your age in years, months and days." },
    { q: "Can I find my age on a past or future date?", a: "Yes. Change the Age on date field. It can be any date from your date of birth up to the year 2100." },
    { q: "How is a 29 February birthday counted?", a: "In a year without 29 February, this calculator counts the new age as completed on 1 March." },
    { q: "How many days until my next birthday?", a: "The table under your age shows the number of days left, the age you will complete and the weekday it falls on." },
    { q: "Does the total number of days include today?", a: "It counts the days passed since the date of birth, so the day of birth is day zero. Add one if you need to count both ends." },
    { q: "Why is my Hijri age higher than my Gregorian age?", a: "A Hijri year has 354 or 355 days, so more Hijri years fit into the same span of time." },
    { q: "Why is the Hijri age missing?", a: "It is shown for dates from 1938 to 2076, and only in browsers that support the Islamic calendar." },
    { q: "Is my date of birth saved or uploaded?", a: "No. The calculation runs in your browser and the dates you enter are not sent to our server." },
  ],
};

const percentageCalculator = {
  sections: [
    {
      title: "Free percentage calculator",
      paras: [
        "This **percentage calculator** covers the four questions that come up most: a percentage of a number, what percent one number is of another, the percentage increase or decrease between two values, and a number with a percentage added or taken off. The answer updates as you type.",
      ],
    },
    {
      title: "Percentage formulas",
      paras: ["Each mode uses a short formula that you can also work out by hand."],
      list: [
        "X% of Y: Y multiplied by X, divided by 100",
        "X is what percent of Y: X divided by Y, multiplied by 100",
        "Percentage change: new value minus old value, divided by the old value, multiplied by 100",
        "Add or subtract X%: find X% of the number, then add it or take it away",
      ],
    },
    {
      title: "Common mistakes with percentages",
      paras: [
        "An increase and a decrease of the same percentage do not cancel out. Raise 1,000 by 20% and you get 1,200. Take 20% off 1,200 and you get 960, not 1,000, because the second percentage is worked out on a bigger number.",
        "**Percent** and **percentage points** are also different. If a rate moves from 10% to 12%, it has risen by 2 percentage points, which is a 20% increase.",
        "To find the price before a discount, divide instead of adding the percentage back. A price of 800 after 20% off was 800 divided by 0.8, which is 1,000.",
      ],
    },
    {
      title: "Zero and negative numbers",
      paras: [
        "Nothing can be expressed as a percentage of zero, and there is no percentage change from a starting value of zero, so the calculator shows a message in both cases. When the starting value is negative, the change is measured against its size without the minus sign: moving from -50 to -25 is shown as a 50% increase. Check which convention your report or course expects.",
      ],
    },
    {
      title: "Percentages with money and measurements",
      paras: [
        "For prices in another currency, convert the amount with the [currency converter](/currency-converter) first and then apply the percentage. If your figures are in different units, such as grams and kilograms, bring them to the same unit with the [unit converter](/unit-converter) before comparing them.",
      ],
    },
  ],
  uses: [
    "Working out a discount while shopping",
    "Turning exam marks into a percentage",
    "Comparing a salary before and after a raise",
    "Adding tax or a service charge",
    "Checking how much a price has gone up",
    "Splitting a budget into shares",
  ],
  who: [
    "Students and teachers",
    "Shoppers and shop owners",
    "Freelancers preparing quotes",
    "Office and accounts staff",
    "People comparing offers or bills",
    "Anyone doing quick maths on a phone",
  ],
  features: [
    "Four calculation types",
    "Worked example for each",
    "Decimals and negative numbers",
    "Clear message instead of a wrong answer",
    "Copy the result",
    "No signup required",
  ],
  faqs: [
    { q: "How do I calculate a percentage of a number?", a: "Multiply the number by the percentage and divide by 100. For example, 15% of 2,000 is 300." },
    { q: "How do I find what percentage one number is of another?", a: "Divide the part by the total and multiply by 100. For example, 45 out of 60 is 75%." },
    { q: "How do I calculate percentage increase?", a: "Subtract the old value from the new value, divide by the old value and multiply by 100. From 800 to 1,000 is a 25% increase." },
    { q: "How do I calculate percentage decrease?", a: "Use the same formula. If the new value is lower, the answer is a decrease. From 1,000 to 800 is a 20% decrease." },
    { q: "How do I take a discount off a price?", a: "Choose Add / Subtract %, select Subtract, enter the price and the discount percentage." },
    { q: "Why can't I use zero as the starting value?", a: "The formula divides by the starting value, and division by zero has no answer." },
    { q: "Can the percentage be more than 100?", a: "Yes. 150% of 200 is 300, and a value that triples has increased by 200%." },
    { q: "Are my numbers saved?", a: "No. The calculation runs in your browser and the numbers are not sent to our server." },
  ],
};

export const TOOL_CONTENT = {
  "age-calculator": ageCalculator,
  "percentage-calculator": percentageCalculator,
  "today-islamic-date": todayIslamicDate,
  "hijri-date-converter": hijriDateConverter,
  "currency-converter": currencyConverter,
  "usd-to-pkr": usdToPkr,
  "sar-to-pkr": sarToPkr,
  "aed-to-pkr": aedToPkr,
};
