// Club facts synthesized from the field-level research catalog; original photos have separate provenance.
import photoManifest from '../public/club/manifest.json' with { type: 'json' }

export interface ClubPhoto {
  id: string
  src: string
  originalSrc: string
  width: number
  height: number
  alt: string
  caption: string
  sourceUrl: string
  sourcePageUrl: string
  sourcePageTitle: string
  credit: string
  rights: string
}
export interface ClubFact { label: string; text: string; status: string; sourceIds: string[] }
export interface ClubProfile {
  id: string
  name: string
  fullName: string
  checkedAt: string
  intro: string[]
  introSourceIds: string[]
  freshnessNote: string
  sections: { id: string; title: string; summary: string; sourceIds: string[]; facts: ClubFact[] }[]
  roster: { label: string; note: string; count: number; sourceIds: string[]; roleCategories: string[]; people: { name: string; publishedRole: string; bio?: string; sourceIds: string[] }[] }
  contacts: { label: string; url: string; sourceIds: string[] }[]
  sources: { id: string; title: string; url: string; note: string; checkedAt: string; publishedDate: string | null }[]
  gallery: ClubPhoto[]
  galleryNote: string
  assetManifestUrl: string
}

export const clubProfile: ClubProfile = {
  "id": "timber-whales",
  "name": "UNBC TimberWhales",
  "fullName": "UNBC TimberWhales Underwater Hockey Team",
  "checkedAt": "2026-10-02",
  "intro": [
    "The UNBC TimberWhales are a student-led underwater hockey club in Prince George, British Columbia. Recognized by the Northern Undergraduate Student Society (NUGSS), the club brings together pool practices, national competition, a recurring three-on-three tournament and team socials.",
    "The present team restarted in fall 2023, building on an earlier UNBC team documented by 2009. Its fall 2026 announcement welcomes new and returning players to Canfor Leisure Pool."
  ],
  "introSourceIds": [
    "nugss_status",
    "club_home",
    "club_team",
    "unbc_history",
    "fall_2026_schedule",
    "tournament_3v3_2026",
    "latest_social"
  ],
  "freshnessNote": "Fall 2026 practice hours come from the club’s September 12, 2026 announcement. Research checked October 2, 2026. The website’s membership plans and roster are undated.",
  "sections": [
    {
      "id": "practice",
      "title": "Fall 2026 practices",
      "summary": "All session times below are local Prince George time. Contact the club before a first visit to confirm any one-off changes.",
      "sourceIds": [
        "fall_2026_schedule",
        "city_aquatics",
        "instagram_profile",
        "club_schedule"
      ],
      "facts": [
        {
          "label": "Venue",
          "text": "Canfor Leisure Pool, 670 Quebec Street, Prince George, British Columbia.",
          "status": "Fall 2026",
          "sourceIds": [
            "fall_2026_schedule",
            "city_aquatics"
          ]
        },
        {
          "label": "Sunday",
          "text": "5:45–6:45 pm (17:45–18:45).",
          "status": "Fall 2026",
          "sourceIds": [
            "fall_2026_schedule",
            "instagram_profile"
          ]
        },
        {
          "label": "Wednesday",
          "text": "9–10 pm (21:00–22:00).",
          "status": "Fall 2026",
          "sourceIds": [
            "fall_2026_schedule",
            "instagram_profile"
          ]
        },
        {
          "label": "Season",
          "text": "The announcement gives September 13, 2026 as the first practice and describes a fall-semester schedule. An exact last session and holiday exceptions were not published in the reviewed announcement.",
          "status": "Season end unconfirmed",
          "sourceIds": [
            "fall_2026_schedule"
          ]
        },
        {
          "label": "Calendar",
          "text": "The official website’s calendar showed no upcoming events or October 2026 entries when checked. The dated fall announcement supplies the practice hours above.",
          "status": "Checked October 2, 2026",
          "sourceIds": [
            "club_schedule",
            "fall_2026_schedule"
          ]
        }
      ]
    },
    {
      "id": "join",
      "title": "Trying the club",
      "summary": "The club invites new and returning players. Use its public club email or Instagram to arrange a first visit and confirm the details that are not dated on the website.",
      "sourceIds": [
        "club_contact",
        "fall_2026_schedule",
        "club_prices",
        "club_schedule",
        "club_gear"
      ],
      "facts": [
        {
          "label": "First contact",
          "text": "Email timberwhales@unbc.ca or message @unbctimberwhales on Instagram.",
          "status": "Public club contacts",
          "sourceIds": [
            "club_contact",
            "fall_2026_schedule"
          ]
        },
        {
          "label": "Trial sessions",
          "text": "The website advertises the first two practices as free. Confirm that this offer still applies to the session you plan to attend.",
          "status": "Undated offer; confirm",
          "sourceIds": [
            "club_prices"
          ]
        },
        {
          "label": "Before playing",
          "text": "The schedule page says participants must sign a waiver before playing. Ask the club for the current form and joining process.",
          "status": "Undated requirement; confirm",
          "sourceIds": [
            "club_schedule"
          ]
        },
        {
          "label": "Eligibility",
          "text": "The published invitation welcomes new players, but the reviewed sources do not establish non-student eligibility, age limits or a minimum swimming standard. Ask the club about your circumstances.",
          "status": "Not established in reviewed sources",
          "sourceIds": [
            "fall_2026_schedule"
          ]
        },
        {
          "label": "Loan equipment",
          "text": "The website’s membership text mentions sticks. It does not confirm a complete beginner loan kit; ask what is provided and what to bring.",
          "status": "Availability unconfirmed",
          "sourceIds": [
            "club_prices",
            "club_gear"
          ]
        }
      ]
    },
    {
      "id": "membership",
      "title": "Published membership information",
      "summary": "These are the website’s undated descriptions, not verified 2026–27 rates or a live checkout.",
      "sourceIds": [
        "club_prices"
      ],
      "facts": [
        {
          "label": "September–April",
          "text": "The text advertises $40 for the September–April membership.",
          "status": "Undated advertised rate",
          "sourceIds": [
            "club_prices"
          ]
        },
        {
          "label": "One semester",
          "text": "The text advertises $25 for a semester membership.",
          "status": "Undated advertised rate",
          "sourceIds": [
            "club_prices"
          ]
        },
        {
          "label": "Listed inclusions",
          "text": "Pool space and sticks are listed as covered by membership. The wording does not establish that every item of equipment or ordinary facility admission is included.",
          "status": "Undated inclusions",
          "sourceIds": [
            "club_prices"
          ]
        },
        {
          "label": "Details to confirm",
          "text": "Currency is not explicitly labeled. The pricing widget also displays $0; the annual card refers both to ten-month validity and to eight months of coverage. Confirm the actual fee, dates and payment instructions directly with the club.",
          "status": "Conflicting website fields",
          "sourceIds": [
            "club_prices"
          ]
        }
      ]
    },
    {
      "id": "equipment",
      "title": "Equipment on the club website",
      "summary": "The club’s sport page introduces the equipment used for underwater hockey. This list describes the sport; it is not a confirmed shopping or bring-your-own list for a first practice.",
      "sourceIds": [
        "club_gear",
        "club_prices"
      ],
      "facts": [
        {
          "label": "Playing equipment",
          "text": "Underwater hockey stick, mask, snorkel, fins, protective cap and glove.",
          "status": "General equipment overview",
          "sourceIds": [
            "club_gear"
          ]
        },
        {
          "label": "Get local guidance",
          "text": "Ask the club about fit, suitability, loan equipment and the current requirements before buying kit for a first session.",
          "status": "First-visit planning",
          "sourceIds": [
            "club_gear",
            "club_prices"
          ]
        }
      ]
    },
    {
      "id": "history",
      "title": "Club history and recognition",
      "summary": "The 2023 restart and the earlier UNBC team are separate points in the club’s history.",
      "sourceIds": [
        "unbc_history",
        "club_home",
        "club_team",
        "ckpg_2023",
        "nugss_status"
      ],
      "facts": [
        {
          "label": "By 2009",
          "text": "A UNBC university record establishes that a Timberwhales team existed by 2009. It does not establish the original founding year.",
          "status": "Historical",
          "sourceIds": [
            "unbc_history"
          ]
        },
        {
          "label": "Fall 2023 revival",
          "text": "The home page describes a fall 2023 start; the team page describes restarting the club. Contemporary local coverage also documents the 2023 organization of the team. “Revived in 2023” preserves that distinction.",
          "status": "Historical",
          "sourceIds": [
            "club_home",
            "club_team",
            "ckpg_2023"
          ]
        },
        {
          "label": "Student society recognition",
          "text": "NUGSS lists the UNBC TimberWhales Underwater Hockey Team as an established student-led organization with an approval date of October 21, 2025. This is a recognition date, not a founding date.",
          "status": "Recognition record",
          "sourceIds": [
            "nugss_status"
          ]
        }
      ]
    },
    {
      "id": "activities",
      "title": "Competition and club life",
      "summary": "The published record includes national tournaments, end-of-semester games and social activities. Dates here describe past events, not upcoming invitations.",
      "sourceIds": [
        "club_gear",
        "club_team",
        "nationals_2024_event",
        "nationals_2026_report",
        "ckpg_2026",
        "tournament_3v3_2026",
        "latest_social",
        "agm_2026"
      ],
      "facts": [
        {
          "label": "2024 Canadian Nationals",
          "text": "The website records the revived team’s participation in May 2024. The event record dates the tournament to May 18–19 at UBC Aquatic Centre.",
          "status": "May 18–19, 2024",
          "sourceIds": [
            "club_gear",
            "club_team",
            "nationals_2024_event"
          ]
        },
        {
          "label": "2026 Canadian Nationals",
          "text": "The club described this as the revived team’s second Nationals, reported scoring in each game and thanked host NOVA. Local reporting placed the competition in Vancouver on May 16–17. The reviewed sources do not establish a finishing rank or medal.",
          "status": "May 16–17, 2026",
          "sourceIds": [
            "nationals_2026_report",
            "ckpg_2026"
          ]
        },
        {
          "label": "Three-on-three tournament",
          "text": "A March 30, 2026 club post recaps its third annual end-of-semester 3v3 tournament. March 30 is the publication date; the exact event date is not specified.",
          "status": "Reported March 30, 2026",
          "sourceIds": [
            "tournament_3v3_2026"
          ]
        },
        {
          "label": "Team social",
          "text": "A September 27, 2026 post describes a completed get-together at the Dudley after practice.",
          "status": "September 27, 2026",
          "sourceIds": [
            "latest_social"
          ]
        },
        {
          "label": "Annual general meeting",
          "text": "The club announced a March 25, 2026 AGM with executive positions available. The announcement does not establish the meeting’s results or current office holders.",
          "status": "Historical announcement",
          "sourceIds": [
            "agm_2026"
          ]
        }
      ]
    },
    {
      "id": "schedule-history",
      "title": "Earlier practice listings",
      "summary": "The older Aquatic Centre details remain here as historical context so they are not mistaken for current directions.",
      "sourceIds": [
        "cuga_directory",
        "fall_2026_schedule",
        "city_aquatics"
      ],
      "facts": [
        {
          "label": "Superseded directory entry",
          "text": "The undated CUGA listing gives Prince George Aquatic Centre, Wednesdays 8:30–9:30 pm and Sundays 6:30–7:30 pm. These conflict with the explicit fall 2026 club announcement and are not the current schedule.",
          "status": "Historical; superseded",
          "sourceIds": [
            "cuga_directory",
            "fall_2026_schedule"
          ]
        },
        {
          "label": "Facility change",
          "text": "The City of Prince George reports that Prince George Aquatic Centre closed for renovation effective January 1, 2026.",
          "status": "Municipal information",
          "sourceIds": [
            "city_aquatics"
          ]
        }
      ]
    },
    {
      "id": "contact",
      "title": "Club contacts and follow-up",
      "summary": "Use the club’s public channels for current joining details. External pages are optional source and contact links; the core profile is available here.",
      "sourceIds": [
        "club_contact",
        "nugss_status",
        "cuga_directory",
        "instagram_profile",
        "club_prices",
        "club_gear",
        "fall_2026_schedule",
        "club_team",
        "agm_2026",
        "unbc_history"
      ],
      "facts": [
        {
          "label": "Email",
          "text": "timberwhales@unbc.ca",
          "status": "Public club email",
          "sourceIds": [
            "club_contact",
            "nugss_status",
            "cuga_directory"
          ]
        },
        {
          "label": "Instagram",
          "text": "@unbctimberwhales; the dated fall announcement and recent club reports are published here.",
          "status": "Officially linked account",
          "sourceIds": [
            "club_contact",
            "instagram_profile"
          ]
        },
        {
          "label": "Facebook",
          "text": "The contact page also links a Facebook destination. Its content was not independently inspected in the source research.",
          "status": "Officially linked; content unchecked",
          "sourceIds": [
            "club_contact"
          ]
        },
        {
          "label": "Still to confirm",
          "text": "Current fees and currency; loan kit; non-student and age eligibility; minimum swimming ability; season end and holiday changes; the current roster and officers; and the original founding year of the earlier team.",
          "status": "Open questions",
          "sourceIds": [
            "club_prices",
            "club_gear",
            "fall_2026_schedule",
            "club_team",
            "agm_2026",
            "unbc_history"
          ]
        }
      ]
    }
  ],
  "roster": {
    "label": "Public website roster — undated",
    "note": "The website lists 20 players and staff, without a season or update date. Treat the roles as an undated website snapshot. A later 2025 leadership handover and a 2026 AGM announcement mean the page cannot establish the present officers or lineup.",
    "count": 20,
    "sourceIds": [
      "club_team",
      "leadership_2025",
      "agm_2026"
    ],
    "roleCategories": [
      "Co-captains / co-presidents",
      "Coach",
      "Treasurer",
      "Senior and junior executives",
      "Social media manager",
      "Forwards",
      "Defenders",
      "Players"
    ],
    "people": []
  },
  "contacts": [
    {
      "label": "Email the club",
      "url": "mailto:timberwhales@unbc.ca",
      "sourceIds": [
        "club_contact"
      ]
    },
    {
      "label": "Club Instagram",
      "url": "https://www.instagram.com/unbctimberwhales/",
      "sourceIds": [
        "club_contact",
        "instagram_profile"
      ]
    },
    {
      "label": "Original club website",
      "url": "https://timberwhales.wixsite.com/unbc-timberwhales",
      "sourceIds": [
        "club_home"
      ]
    },
    {
      "label": "Facebook (linked by the club)",
      "url": "https://www.facebook.com/share/XuauqpvVBcoMNBX5/",
      "sourceIds": [
        "club_contact"
      ]
    }
  ],
  "sources": [
    {
      "id": "club_home",
      "title": "UNBC TimberWhales official home",
      "url": "https://timberwhales.wixsite.com/unbc-timberwhales",
      "note": "Home describes a fall 2023 start; roster says restart. Home calendar had no October 2026 entries.",
      "checkedAt": "2026-10-02",
      "publishedDate": null
    },
    {
      "id": "club_team",
      "title": "Public team page",
      "url": "https://timberwhales.wixsite.com/unbc-timberwhales/team",
      "note": "Twenty public roster entries, with initials for most surnames; no roster season/update date.",
      "checkedAt": "2026-10-02",
      "publishedDate": null
    },
    {
      "id": "club_schedule",
      "title": "Official schedule and waiver page",
      "url": "https://timberwhales.wixsite.com/unbc-timberwhales/schedule",
      "note": "No upcoming events or October 2026 calendar events displayed. Requires waiver before playing; no recurring times shown.",
      "checkedAt": "2026-10-02",
      "publishedDate": null
    },
    {
      "id": "club_prices",
      "title": "Published membership plans",
      "url": "https://timberwhales.wixsite.com/unbc-timberwhales/plans-pricing",
      "note": "First two practices free; text rates $40 Sept–April and $25 semester. Widget also shows $0 and conflicting annual validity.",
      "checkedAt": "2026-10-02",
      "publishedDate": null
    },
    {
      "id": "club_contact",
      "title": "Official contact page",
      "url": "https://timberwhales.wixsite.com/unbc-timberwhales/contact",
      "note": "Public club email and Instagram/Facebook links.",
      "checkedAt": "2026-10-02",
      "publishedDate": null
    },
    {
      "id": "club_gear",
      "title": "Sport and equipment explanation",
      "url": "https://timberwhales.wixsite.com/unbc-timberwhales/underwater-hockey",
      "note": "Equipment overview and explicit May 2024 nationals mention.",
      "checkedAt": "2026-10-02",
      "publishedDate": null
    },
    {
      "id": "instagram_profile",
      "title": "Official Instagram profile",
      "url": "https://www.instagram.com/unbctimberwhales/",
      "note": "Bio agrees with dated fall 2026 schedule; recent practice/recruitment posts visible.",
      "checkedAt": "2026-10-02",
      "publishedDate": null
    },
    {
      "id": "fall_2026_schedule",
      "title": "Fall-semester practice announcement",
      "url": "https://www.instagram.com/p/DdNdRpuRzGU/",
      "note": "Displayed date September 12; DOM timestamp 2026-09-13T02:17:53.000Z. Specifies fall semester and first practice September 13.",
      "checkedAt": "2026-10-02",
      "publishedDate": "2026-09-12"
    },
    {
      "id": "latest_social",
      "title": "After-practice team social",
      "url": "https://www.instagram.com/p/Dd0TIBNAOkB/",
      "note": "Post timestamp 2026-09-28T04:14:18.000Z. Caption describes a completed after-practice social at the Dudley; date is local Pacific conversion.",
      "checkedAt": "2026-10-02",
      "publishedDate": "2026-09-27"
    },
    {
      "id": "nationals_2026_report",
      "title": "Club report from 2026 Canadian Nationals",
      "url": "https://www.instagram.com/unbctimberwhales/reel/DYgBTDwp0S-/",
      "note": "Displayed date May 18; post timestamp 2026-05-19T00:38:50.000Z. Reports second nationals for revived team, scoring in every game, and thanks NOVA.",
      "checkedAt": "2026-10-02",
      "publishedDate": "2026-05-18"
    },
    {
      "id": "leadership_2025",
      "title": "Public leadership handover",
      "url": "https://www.instagram.com/p/DIANciESja3/?img_index=1",
      "note": "Original timestamp 2025-04-03T23:43:20.000Z. Ella hands over co-presidency to Keegan and Phoenix. Does not establish October 2026 officers.",
      "checkedAt": "2026-10-02",
      "publishedDate": "2025-04-03"
    },
    {
      "id": "agm_2026",
      "title": "2026 AGM announcement",
      "url": "https://www.instagram.com/unbctimberwhales/p/DV4sXZrjzX6/",
      "note": "Announces March 25 AGM with executive positions open. Displayed March 14; timestamp 2026-03-15T00:59:10.000Z. Election results not found.",
      "checkedAt": "2026-10-02",
      "publishedDate": "2026-03-14"
    },
    {
      "id": "tournament_3v3_2026",
      "title": "Third annual 3v3 tournament report",
      "url": "https://www.instagram.com/unbctimberwhales/p/DWhHJkUiaZ0/",
      "note": "Timestamp 2026-03-30T17:42:47.000Z. Reports completed end-of-semester third annual 3v3 tournament; precise event day not stated.",
      "checkedAt": "2026-10-02",
      "publishedDate": "2026-03-30"
    },
    {
      "id": "nugss_status",
      "title": "NUGSS recognized student-led organizations",
      "url": "https://www.nugss.ca/slo-list",
      "note": "Lists UNBC TimberWhales Underwater Hockey Team as Established and gives approval date October 21, 2025. Page still visible October 2, 2026.",
      "checkedAt": "2026-10-02",
      "publishedDate": "2025-10-21"
    },
    {
      "id": "cuga_directory",
      "title": "CUGA where-to-play directory",
      "url": "https://cuga.org/where-to-play-hockey/",
      "note": "Outdated venue and times, retained as superseded evidence; public email/site/social links verified.",
      "checkedAt": "2026-10-02",
      "publishedDate": null
    },
    {
      "id": "city_aquatics",
      "title": "City of Prince George aquatics",
      "url": "https://www.princegeorge.ca/parks-recreation/aquatics",
      "note": "Current Sept–Dec 2026 facility information: Canfor at 670 Quebec Street. PG Aquatic Centre closed for renovation effective January 1, 2026.",
      "checkedAt": "2026-10-02",
      "publishedDate": null
    },
    {
      "id": "city_map",
      "title": "Canfor Leisure Pool map linked by City",
      "url": "https://www.google.com/maps/place/Canfor%2BLeisure%2BPool/@53.9144313,-122.7498719,17z/data=!3m1!4b1!4m5!3m4!1s0x538899683bc1a4a1:0x9493fa07ccfd0ab6!8m2!3d53.9144691!4d-122.7478262",
      "note": "Destination coordinates encoded in City-linked place URL; use !3d/!4d values, not map viewport coordinates.",
      "checkedAt": "2026-10-02",
      "publishedDate": null
    },
    {
      "id": "ckpg_2026",
      "title": "Timberwhales prepare for 2026 nationals",
      "url": "https://ckpgtoday.ca/2026/05/08/unbc-timberwhales-ready-to-capsize-their-competition/",
      "note": "Search returned article text; direct web open returned 403. Names Taryn Atkinson and Shayden Hiebert as team members; nationals May 16–17 in Vancouver.",
      "checkedAt": "2026-10-02",
      "publishedDate": "2026-05-08"
    },
    {
      "id": "unbc_history",
      "title": "UNBC October 4, 2024 board package",
      "url": "https://www.unbc.ca/sites/default/files/sections/governance/2024-10-04-board-public-session-meeting-package-minus-minutes-corrected.pdf",
      "note": "Memorial award description says Vincent Budac was an early Timberwhales member while a student; graduated 2009. Establishes existence by 2009, not exact foundation year.",
      "checkedAt": "2026-10-02",
      "publishedDate": "2024-10-04"
    },
    {
      "id": "ckpg_2023",
      "title": "Contemporary report on 2023 team start",
      "url": "https://ckpgtoday.ca/2023/11/21/hockey-takes-a-dive-with-the-unbc-timberwhales/",
      "note": "Stephen Rader proposed a team to biochemistry students; Naomi Cole and Ella Stratton organized it. Current revival interpretation supported by club roster restart wording.",
      "checkedAt": "2026-10-02",
      "publishedDate": "2023-11-21"
    },
    {
      "id": "nationals_2024_event",
      "title": "2024 Canadian Nationals event record",
      "url": "https://uwhportal.com/events/ca-2024-canada-underwater-hockey-nationals",
      "note": "Tournament dates May 18–19, 2024 at UBC Aquatic Centre; club participation separately supported by official club site.",
      "checkedAt": "2026-10-02",
      "publishedDate": null
    }
  ],
  "galleryNote": "Club website photographs are reused with the user’s explicit permission. Captions describe only visible content or text expressly published by the club.",
  "assetManifestUrl": "club/manifest.json",
  gallery: photoManifest.photos as ClubPhoto[],
}
