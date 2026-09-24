---
clinic: Abaid Dental Care
dentist: Dr Abaid Khalil
credentials: BDS, C.Orth
siteUrl: https://abaiddental.com

phone:
  display: 0312 6617939
  tel: "tel:+923126617939"
  callLabel: Call 0312 6617939

# Opens an empty chat. Never add ?text=
whatsapp: https://wa.me/923126617939
replyTime: We reply within one to two hours.

address:
  # Approved line breaks, from the Contact page. Use these wherever the address is shown in lines.
  lines:
    - P-30, A Block, Gulshan Iqbal
    - Near Chakki Chowk, Risalewala Road
    - Faisalabad
  # Approved single-line form, from Home section 9
  oneLine: P-30, A Block, Gulshan Iqbal, near Chakki Chowk, Risalewala Road, Faisalabad.
  landmark: Sitara Colony is directly across the road.

maps:
  url: "[NEEDS: Google Maps share URL for the clinic]"
  embed: "[NEEDS: Google Maps <iframe> src URL]"
  geo: "[NEEDS: latitude, longitude]"

hours:
  # Structured, for the today's-hours line and JSON-LD. 0 = Sunday.
  week:
    0: Closed
    1: 10am to 1pm and 4pm to 8pm
    2: 10am to 1pm and 4pm to 8pm
    3: 10am to 1pm and 4pm to 8pm
    4: 10am to 1pm and 4pm to 8pm
    5: 4pm to 8pm
    6: 10am to 1pm and 4pm to 8pm
  todayLabel: "Today's hours:"
  # Server-rendered, and shown if JavaScript doesn't run. Approved wording, Home section 1.
  fallback: Open Monday to Saturday. Friday afternoons only. Closed Sunday.
  jummah: Friday mornings are closed for Jummah.
  timezone: Asia/Karachi

# Navigation, in approved sitemap order. Nav, footer and sitemap.xml read this and nothing else.
nav:
  - { title: Home, href: / }
  - { title: Your first visit, href: /first-visit }
  - { title: Treatments and prices, href: /treatments }
  - { title: Caps and bridges, href: /caps-and-bridges }
  - { title: Braces and clear aligners, href: /braces-and-aligners }
  - { title: Root canal, href: /root-canal }
  - { title: Tooth removal, href: /tooth-removal }
  - { title: Teeth cleaning, href: /teeth-cleaning }
  - { title: Teeth whitening, href: /teeth-whitening }
  - { title: Fillings, href: /fillings }
  - { title: About Dr Abaid, href: /about }
  - { title: Contact us, href: /contact }

# The seven treatment pages sit under "Treatments and prices" in the header menu.
treatmentGroup:
  - /caps-and-bridges
  - /braces-and-aligners
  - /root-canal
  - /tooth-removal
  - /teeth-cleaning
  - /teeth-whitening
  - /fillings

# The new design's header and footer (Home, from Sep 2026) split "Treatments and prices" in two:
# "Treatments" opens the seven treatment pages; "Prices" goes to /treatments, every treatment with its price.
navSplit:
  treatments: Treatments
  prices: Prices

social:
  facebook: https://www.facebook.com/AbaidDentalCare/
  instagram: https://www.instagram.com/abaiddentalcare/
  tiktok: https://www.tiktok.com/@abaid.dental.care
  youtube: https://www.youtube.com/@abaiddentalcare

# Default link preview when a page sets none. Clinic name and address, not a marketing line.
og:
  title: Abaid Dental Care
  description: P-30, A Block, Gulshan Iqbal, near Chakki Chowk, Risalewala Road, Faisalabad.
  image: "[NEEDS: choose an image — the exterior photograph is the likely one]"

# JSON-LD: one `Dentist` node, on Home only.
schema:
  include: [name, url, telephone, address, openingHoursSpecification, geo, hasMap, sameAs]
  exclude: [aggregateRating, review, priceRange, email, image of certificates]
  note: >
    Do not list services in schema. If you ever do, it is the seven in treatmentGroup and
    nothing else. No implants, no veneers.
---
