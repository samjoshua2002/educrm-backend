Multi-Touch Attribution Model Used:
Linear Model: Every touchpoint gets equal credit.
Example:
Suppose a leads journey includes
●
Facebook Ad first interaction
●
Google Search Ad
●
Email Newsletter
●
Website Demo Form conversion
In a Linear Model each gets 25 credit
Touchpoints table:
The touchpoints table stores all marketing interactions ads emails page visits form submissions etc
that a person or lead experiences along their customer journey
Each touchpoint is an event that can later be used for multitouch attribution MTA and ROI analysis.
Basic Fields
Field Type Meaning / Use Case
touchpoint_i
d
BIGSERIAL
PRIMARY KEY
Unique identifier for each interaction. Automatically
increments.
journey_id UUID NOT NULL Groups all touchpoints belonging to the same customer
journey — used to normalize attribution weights.
lead_id UUID NOT NULL Connects this touchpoint to a known lead (after
identification).
occurred_at TIMESTAMPTZ
NOT NULL
The exact UTC timestamp when the event happened.
Used for sequencing and attribution windows.
event_type TEXT NOT NULL What happened — e.g., impression, click, visit,
form_submit, email_open, etc.
Channel Source fields:
Field Meaning / Use Case
channel Marketing channel classification (e.g., paid_search, organic, email, social).
Used for ROI by channel.
source Specific platform or vendor (google, linkedin, newsletter).
medium Marketing medium (cpc, cpm, email, social, referral). Usually aligns with
utm_medium.
campaign Name of the campaign (Spring2025, CRM_Launch). Critical for campaign-level
ROI reporting.
adgroup Optional sub-group within a campaign (used by Google Ads, etc.).
keyword Search keyword or matched phrase for search-based campaigns.
URL & Tracking Fields (UTM)
Field Meaning / Use Case
landing_url The page where the user first landed (e.g., /pricing). Useful for conversion
path analysis.
page_url The page where the event occurred (might differ from the landing page).
referrer_ur
The external page that referred the user to your site.
l
utm_source From UTM tracking: identifies the source (e.g., google, newsletter).
utm_medium From UTM tracking: identifies the medium (cpc, email).
utm_campaig
From UTM tracking: identifies campaign name (summer_sale).
n
utm_term From UTM tracking: keyword or ad target term.
utm_content From UTM tracking: creative variant or call-to-action label.
Attribution Fields
Field Meaning / Use Case
attribution_mode
l
The name of the model used (e.g., linear). Identifies how credit is
distributed.
weight Numeric value (0–1) showing how much credit this touchpoint received for
a conversion.
Quality Audit Fields
Field Meaning / Use Case
is_bot Marks automated/bot interactions to exclude from analytics.
is_test Marks test data (e.g., internal QA runs).
ingest_sourc
e
System that generated/imported the event (ga4, hubspot, marketo, etc.).
event_id The original unique event ID from the source platform — ensures idempotent
ingestion (no duplicates).
created_at Timestamp when this record was inserted into your database.
updated_at Timestamp of the last update (e.g., weight recalculation).
Scenario
A student named Riya Sharma is searching for MBA programs
She clicks a Google Ad for Top MBA Programs 2025 visits the colleges landing page and submits a
Request Info form
This event becomes a touchpoint in your database
Field Sample Value Meaning / Explanation
touchpoint
_
id 120345 Auto-generated ID for this marketing event.
journey_
id b7f21f66-9b42-4c1e-b32e-1
7cf3ed1b71b
Identifies Riya’s entire journey — from first ad click
to enrollment.
lead
_
id L2025-001 Linked once Riya fills out the form (her lead
record).
user
_
id (NULL) Not logged in; only identified via form.
occurred
_
at 2025-10-30 08:45:12+00 Time when Riya submitted the “Request Info”
form.
event
_
type form_submit The event being tracked — she filled out a lead
form.
channel paid_search Marketing channel through which she came.
source google Platform/source of the lead.
medium cpc Paid ad click (Cost Per Click).
campaign MBA_Admissions_2025 Campaign promoting the college’s MBA program.
adgroup mba-leadgen-keywords Group of related Google Ads.
keyword "mba colleges near me" The keyword she searched.
Field Sample Value Explanation
landing_
url https://collegecrm.edu/mba/admiss
ions?utm_source=google&utm_medium
=cpc&utm_campaign=MBA_Admissions_
2025
The page Riya landed on.
page
_
url https://collegecrm.edu/mba/reques
t-info
The specific page where she submitted
the form.
referrer
_
url https://www.google.com/search?q=m
ba+colleges+near+me
Where she came from before the visit.
utm
_
source google Matches the campaign’s UTM tag.
utm
mediu
_
cpc Matches ad medium.
m
utm
_
campai
MBA_Admissions_2025 Campaign name for attribution.
gn
utm
_
term mba+colleges+near+me Search keyword.
utm
_
content ad_variant_a Ad creative label.
Field Value Explanation
attribution
model _
linea
Each touchpoint in the journey will share equal credit for Riya’s
conversion.
r
weight 0.33 This form submission got 33% of conversion credit.
Field Value Explanation
is
bot _
FALSE Real visitor, not automated traffic.
is
test _
FALSE Production data, not a test event.
ingest
sourc
_
e
ga4 Data imported from Google Analytics 4.
event
_
id evt_9845621 Unique ID for this form submission event.
created
at _
2025-10-30
08:45:20+00
When the event was recorded in your database.
updated
at _
2025-10-31
00:00:00+00
Last time the record was updated (e.g., attribution
weight added).
Journeys Table:
Scenario Recap
Riya Sharma is exploring MBA programs online:
1. She searches “best MBA colleges in India” on Google.
2. Clicks a paid ad for your college.
3. Visits the landing page and reads program details.
4. Fills out a “Request Info” form.
5. Eventually enrolls in your MBA program.
This entire process — from first click to enrollment — is one “journey.
”
Field Type Meaning Example (Riya’s Journey)
journey_i
UUID PRIMARY
d
KEY
Unique identifier for this entire customer
journey. Every journey has one unique
b7f21f66-9b42-4c1e-b32
e-17cf3ed1b71b
ID.
lead_id UUID NULL References the lead (student) record
once she’s identified (e.g., after form
submission). It’s NULL at first
(anonymous visitor).
L2025-001 — assigned
once Riya fills the “Request
Info” form
started_a
t
TIMESTAMPTZ
NOT NULL
The exact timestamp when Riya’s
journey began — usually when she first
clicked an ad or visited your site.
2025-10-25 08:15:22+00
— when she first clicked your
Google Ad
ended_at TIMESTAMPTZ
NULL
When the journey ended — either by
2025-11-02 14:10:00+00
conversion (enrollment), drop-off, or
inactivity timeout.
— when she enrolled or the
journey closed
status TEXT NOT
NULL
Current stage of the journey. Common
values: pre_lead, lead_created,
converted, closed_lost,
inactive.
converted — because Riya
submitted the form and later
enrolled
created_a
TIMESTAMPTZ
When this record was created in your
2025-10-25 08:15:25+00
t
DEFAULT
database (for auditing).
NOW()
updated_a
TIMESTAMPTZ
t
DEFAULT
NOW()
When this record was last updated — for
example, when Riya’s journey moved
from pre_lead → converted.
2025-11-02 14:10:05+00
Stage Status Trigger / Event Example (Riya)
Anonymous
Visitor
pre_lead First ad click or visit Riya clicks “Top MBA Programs
2025” ad
Identified lead_created Fills form with contact info Submits “Request Info” form
Qualified Lead qualified Admission counselor
contacts her
Counselor call scheduled
Converted converted Enrolled in MBA program Enrolled on Nov 2, 2025
Closed Lost /
Inactive
closed_lost or
inactive
Did not respond or
missed intake deadline
(if she didn’t enroll)
Leads Table
Field What it means Riya’s example
lead_id (PK) Unique ID for the lead in your
DB.
9f2a1b5c-7c2e-4f0f-8b3b-2d1f8a6f0
c11
org_id Tenant/workspace this lead
belongs to.
c1b2-
…
-org-college
owner_user_i
d
The counselor/advisor currently
responsible.
counselor-uuid-001
Field What it means Riya’s example
first_name,
last_name
Contact name. Riya, Sharma
email Raw email entered. riya.sharma@example.c
om
email_normalized
(generated)
Lowercased, space-stripped version for
de-dupe.
riya.sharma@example.c
om
phone Raw phone as entered. +91 98 7654 3210
phone_e164 Normalized phone for dialing/dupe. +919876543210
company Company/school (if applicable). For
students, often previous college.
Delhi University
website Personal/company website (optional). NULL
country_code ISO-2 country. Useful for routing. IN
country_name Name of the country India
state Name of the state/region West Bengal
City Name of the city/area Kolkata
Field What it means Riya’s example
source_raw Original capture of source,
unstandardized.
Google Ads
source_channe
Standardized channel bucket. paid_search
l
utm_source From UTM. google
utm_medium From UTM. cpc
utm_campaign From UTM. MBA_Admissions_2025
utm_term Keyword term. mba colleges near me
utm_content Creative/variant tag. ad_variant_a
first_touch_i
FK to first touchpoint row (fast join). 120001
d
last_touch_id FK to most recent touchpoint row. 120004
journey_id Links all of Riya’s interactions. b7f21f66-9b42-4c1e-b32e-17cf3
ed1b71b
Field What it means Riya’s example
stage Lifecycle stage enum (e.g.,
new,mql,sql,oppty,customer).
customer
(enrolled)
status Working status enum (e.g.,
open,connected,qualified,converted).
qualified
lifecycle_sco
re
Overall score from profile + behavior. 78.00
intent_score Near-term buying intent from behavior. 85.00
grade Fit label (A/B/C…). A
Field What it means Riya’s example
created_at When the lead row was created. 2025-10-25 08:16:00+00
first_response_a
t
First counselor response time (SLA). 2025-10-25 09:05:00+00
last_contacted_a
Last outreach/contact time. 2025-10-30 07:30:00+00
t
next_action_at Next planned follow-up. 2025-10-31 06:00:00+00
owner_assigned_a
When ownership was assigned. 2025-10-25 08:20:00+00
t
Field What it means Riya’s example
became_mql_at When lead crossed the MQL threshold. 2025-10-26
10:00:00+00
became_sql_at When sales qualified the lead. 2025-10-28
13:30:00+00
opportunity_id Pipeline/opportunity FK (optional in higher-ed). NULL
converted_at When the key conversion happened (e.g.,
enrollment/fee).
2025-11-02
14:10:00+00
disqualified_at When disqualified (if applicable). NULL
disqualified_reas
on
Why disqualified. NULL
Field What it means Riya’s example
consent_marketin
Email/SMS marketing consent. TRUE
g
consent_sales Consent to be contacted by admissions. TRUE
gdpr_deleted Hard delete/anonymized for compliance. FALSE
Field What it means Riya’s example
enrichment JSON payload
from enrichment
{"gmat":690,
ce"}
"grad_year":2023,
"major":"Commer
(school, test
scores).
custom_field
Org-specific extra
{"intake":"Spring 2026"
,
"campus":"Mumbai"}
fields without
s
schema churn.
Field What it means Riya’s example
updated_a
t
Last updated timestamp (trigger maintains it). 2025-11-02 14:10:05+00
Field last_scored_at hotness_snapshot assigned_counsel
or
assignment_date assignment_rule followup_status program_interest country_code Column academic_score experience_score program_fit_scor
e
Meaning / Use Riya Sharma Example
When the system last recalculated her
lead-score or hot/warm/cold status.
2025-10-30 07:00:00 +00 →
Used to see if scoring is stale.
system re-scored after she opened
an email.
Snapshot of the current temperature of
the lead. Enum → hot, warm, or cold.
hot → because her score = 85 ≥ 50
and she filled out the MBA form.
UUID of the counselor who currently
owns this lead. FK to the counselors
counselor-uuid-001 (Amit
Mehta)
(or users) table.
Timestamp when ownership began. 2025-10-30 07:15:00 +00
Text description of the routing rule that
assigned her. Stored for
transparency/audits.
"geo:IN + program:MBA +
score≥50 → Team
Admissions-IN"
Pipeline stage of counselor follow-up.
Enum → pending, contacted,
scheduled, closed.
contacted → Amit has already
spoken with her once.
Which program she’s interested in
(helps routing).
MBA
Lead’s country in ISO-2 format – often
used in geographic routing.
IN
Type Meaning / Logic Example (Riya
Sharma)
NUMERIC(5,2) Points for academic quality
— e.g., test scores, GPA,
graduation university.
10.00 → Riya
scored 690 on
GMAT (≥650 gives
+10).
NUMERIC(5,2) Points for work experience
or professional background.
10.00 → 3+ years
work experience
adds +10.
NUMERIC(5,2) Measures alignment
between lead’s interests
5.00 → Interested
in your flagship MBA
and your offered programs.
program (+5).
engagement_score NUMERIC(5,2) Based on lead engagement
— email opens, form
submissions, webinar
attendance.
5.00 → She
attended a webinar
(+5).
geography_score NUMERIC(5,2) Points for location-based
preference — target or
non-target regions.
-10.00 → She’s
from outside target
region (-10).
data_quality_sco
re
NUMERIC(5,2) Penalty or bonus for lead
data quality — valid email,
phone, etc.
5.00 → All contact
details verified (+5).
lead_score NUMERIC(6,2)
generated
column
Automatically computed total
score = sum of the above
25.00 → (10 + 10 +
5 + 5 - 10 + 5)
(null-safe).
Enum Values Purpose / Example
lead_hotness 'hot' / 'warm' / 'cold' Riya’s high engagement makes her
hot. A casual visitor who only opened
one email would be cold.
followup_stat
us
'pending'
,
'scheduled'
'contacted'
,
'closed'
,
Reflects counselor activity. Riya =
contacted.
rule_type 'geography'
,
'program_interest'
'load_balancing'
,
'lead_score'
,
Classifies each routing rule in
assignment_rules. Riya’s rule =
geography.
Assignment Rules Table
Field Meaning / Use Riya Sharma Example
rule_id Primary key (ID). 12
rule_name Human-readable description.
"India + MBA → Team
Admissions-IN (RR)"
priority Evaluation order — lower runs first. 1 (highest priority)
type Category of rule (rule_type
enum).
geography
country_code Filter for country.
'IN'
program_equal
Filter for program.
'MBA'
s
min_lead_scor
Only apply if lead score ≥ this
value.
50.00
e
team_id Target team that will receive the
lead.
Admissions-IN team UUID
fixed_counsel
If set, always route to this specific
counselor.
or
NULL → team load-balancing decides
who.
action_note Extra instruction for audit/humans.
"Route to senior counselor if
high score"
active Whether rule is currently in use. TRUE
created_at When rule was created. 2025-10-20 09:00:00 +00
Result for Riya:
This rule caught her (country_code = IN, program_interest = MBA, lead_score = 78)
and assigned her to the Admissions – India team.
Assignment Logs Table
Field Meaning / Use Riya Sharma Example
log_id Auto increment ID. 3401
lead_id Which lead was routed. L2025-001
assigned_co
unselor
Counselor receiving the lead. counselor-uuid-001 (Amit Mehta)
team_id Team that owns this counselor. ADM-IN team UUID
rule_id Which rule matched. 12
rule_snapsh
ot
JSON copy of the rule at
assignment time (for forensics if
rules change).
{"country_code":"IN"
,
"program_equa
ls":"MBA"
,
"min_lead_score":50,
"tea
m_id":"ADM-IN"}
assigned_at Timestamp of assignment. 2025-10-30 07:15:00 +00
followup_st
atus
Status at assignment time.
'pending'
Organisation Table
Field Meaning Example (College CRM)
org_id Primary key. Unique identifier for each
organisation/workspace.
11111111-aaaa-bbbb-cccc-222
222222222
org_name The official name of the college or
institution.
"Sunrise Business School"
org_code Short reference code (used internally
or in URLs).
"SUNBS"
domain Email/web domain associated with the
"sunrise.edu"
college.
website College’s main website. https://www.sunrise.edu
country_code Two-letter ISO country code for the
org’s location.
IN
timezone Default timezone for workflows and
Asia/Kolkata
reports.
currency Default currency for billing and ROI
reporting.
INR
primary_contact_
id
Points to the user who administers this
uuid-of-riya-admin
org (FK to users.user_id).
billing_email Where invoices or billing alerts go. accounts@sunrise.edu
support_email Default contact for support tickets. crm-support@sunrise.edu
phone Main office phone number. +91 22 5555 1234
attribution_mode
Default model for calculating
"linear"
l
marketing ROI.
crm_tier Subscription level (for SaaS CRM
deployment).
"standard"
max_users_allowe
User limit for plan. 25
d
max_leads_allowe
Lead limit for plan. 10000
d
is_active Whether the org is active. TRUE
created_at Timestamp when record was created. 2025-10-01 09:00:00+00
updated_at Last updated timestamp. 2025-10-25 09:15:00+00
Example Relationship Overview
Table Relationship Key
organisations → leads One-to-many leads.org_id
organisations → users One-to-many users.org_id
organisations → journeys One-to-many (through leads) journeys → leads.org_id
Users Table
The users table stores all people who work inside the CRM — typically staff at a college or
university, such as:
●
Admissions counselors
●
●
●
Program specialists
Admin users
CRM managers
Each user belongs to an organisation (org_id), can belong to a team, and can own or handle
leads.
Field Type Purpose / Meaning Example (College CRM)
user_i
d
UUID
PRIMARY
KEY
Unique ID for each user. 2b1f2c3d-45e6-7890-ab12-3
cd4ef567890
org_id UUID NOT
NULL
Which college or institution the user
belongs to. (FK to
organisations.org_id)
11111111-aaaa-bbbb-cccc-2
22222222222 (Sunrise Business
School)
Field Purpose Example
email Login / contact email for the user. counselor.a@sunrise.e
du
email_normalized Auto-generated lowercase version for
de-duplication.
counselor.a@sunrise.e
du
first_name,
last_name
Display name fields. Amit, Mehta
phone_e164 Phone number in international E.164
format.
+919812345678
Field Purpose Example
password_has
h
Encrypted password if your CRM handles logins directly. If
using SSO, this may be NULL.
$2b$12$Xas...
sso_provider Indicates login provider (if Single Sign-On used). google or
azuread
sso_subject The user’s unique ID within the SSO system. 11784528392161
2
status Enum: current account status —
'active'
'invited'
,
,
'suspended'
'disabled'
,
.
active
role Enum: user’s role in the CRM —
'counselor'
,
'specialist'
,
'admin'
,
'analyst'
'manager'
,
'viewer'
,
.
counselor
Use Case:
●
●
●
●
admin: full control (can configure org, users, and routing).
counselor: can view, contact, and update assigned leads.
specialist: handles specific programs or geographies.
viewer: read-only access (analytics or auditors).
Field Purpose Example
team_id FK to the teams table (for grouping counselors by region or
program).
Admissions-IN
title Job title or position. Admissions
Counselor
timezon
e
User’s preferred timezone (for scheduling and SLAs). Asia/Kolkata
locale Language/region preference. en-IN
Field Purpose Example
can_receive_lea
ds
Whether this user can be assigned new leads. TRUE
capacity_daily How many new leads they can handle per day. 35
workload_weight A multiplier to bias load balancing (e.g., senior counselors can
handle more).
1.0
How it works:
When routing new leads, your system checks who is active, has capacity left today, and
can_receive_leads = TRUE.
Then it assigns the next lead accordingly.
Field Purpose Example
calendar_link Link to booking/scheduling page
(Calendly, Google Meet, etc.).
https://cal.sunrise.edu/amit
meeting_buffer_
min
Minimum time between scheduled
meetings (to prevent back-to-back
overload).
15
work_hours_json JSON specifying working hours per
day.
{"mon":[["09:00"
:[]}
,
"17:00"]],
"sat"
comm_channels JSON with contact preferences. {"email":true,
"whatsapp":"+91981
2345678"
,
"sms":false}
Field Purpose Example
created_at When the user was created. 2025-10-10 08:00:00+00
updated_at When user details were last modified. 2025-10-30 15:00:00+00
last_login_a
When the user last logged into the CRM. 2025-11-05 09:30:00+00
t
Related Table Key Meaning
organisations org_id Each user belongs to an
organisation (college).
teams team_id Groups counselors into teams
“MBA Admissions –
(e.g.,
India”).
leads owner_user_id The user who currently owns
the lead (assigned counselor).
organisations.primary_c
ontact_id
Points to the user who
manages the college’s CRM
workspace.
Teams Table:
●
●
●
●
●
●
●
●
●
●
●
●
●
team
_
id: Primary key.
org_
id: Tenant scoping (ties team to a college/institution).
team
name/team
code: Human-readable + short handle for rules/dashboards.
_
_
type: Classify teams (e.g., admissions, program, region) for reporting and default rules.
can
receive
_
_
leads: Whether the router may assign to this team right now.
capacity_
daily: Soft daily cap across the team (helps avoid overload).
round
robin
_
_
offset: Cursor/index for simple round-robin selection among counselors.
load
_
strategy: How this team wants members selected (round_robin / least_load /
weighted).
weight
_
multiplier: If doing weighted team selection across multiple eligible teams.
country_
codes/programs
_
supported/timezones: Coverage metadata; your rule engine
can match leads by geography/program/availability.
owner
user
_
_
id: Team lead/manager (for approvals and dashboards).
slack
_
channel/notes: Ops convenience.
is
active/created
_
_
at/updated
_
at: Lifecycle + audit.
ENUM: degree
_
level
CREATE TYPE degree
_
level AS ENUM ('phd'
'masters'
'bachelors'
,
,
,
'diploma'
,
'hs');
Represents the level of education:
●
●
●
●
●
'phd'
'masters'
'bachelors'
'diploma'
'hs'
– Doctorate (PhD, DBA, etc.)
– Master’s (MBA, M.Tech, M.Sc, MA, etc.)
– Undergraduate (BBA, B.Tech, B.Com, etc.)
– Diploma or PG Diploma
– High school / 12th grade
Lead
education table
_
Column Type Require
d?
Meaning / Use Example (Riya
Sharma)
edu_id UUID Yes (PK) Unique ID for this education
record. One row per degree /
qualification.
3f2a9c1d-7b23-4d8
e-9c10-1a2b3c4d5e
6f
lead_id degree_lev
el
field_of_s
tudy
institutio
n
country_co
de
start_date end_date grad_year gpa UUID degree_l
evel
TEXT TEXT CHAR(2) DATE DATE INTEGER NUMERIC(
4,2)
Yes (FK) Links this education record to a
lead. One lead → many
education rows.
Yes Standardized level of education:
phd, masters, bachelors,
etc.
No Main subject / stream of the
degree.
No Name of the college/university. No Country of the institution
(ISO-2).
No When this program started. No When the program ended (or is
expected to end).
No Graduation year (easy to
query/sort).
No GPA value in the institution’s
scale.
L2025-001 (Riya’s
lead ID)
bachelors (for her
B.Com)
Commerce
Delhi University
IN
2019-07-01
2023-05-31
2023
3.50
gpa_scale NUMERIC(
4,2)
percentage NUMERIC(
5,2)
grade_lett
er
TEXT is_highest BOOLEAN verified BOOLEAN
Lead
_
experiences table
Column Type exp_id UUID lead_id UUID No No No Yes
(default
FALSE)
Require
d?
Yes (PK) Yes (FK) Maximum value of the GPA
scale (e.g., 4.00, 10.00).
4.00
Percentage score (if available,
alternate to GPA).
78.50
Grade as text: letter or
classification.
First Class with
Distinction
Marks this as the highest
completed degree for the lead.
Helps quickly pick main degree.
TRUE for her
Bachelors if she has
no Masters yet
Meaning / Use Example (Riya Sharma)
Unique ID for this experience
record. One row per job / role.
8f3a9b7c-1d22-4b8e-9a
10-7c1c2a3b4d55
Links this job to a specific lead.
One lead → many experiences.
L2025-001 (Riya’s lead
ID)
org_name title industry country_c
ode
start_dat
e
end_date full_time verified TEXT TEXT TEXT CHAR(2) DATE DATE BOOLEAN BOOLEAN Yes Yes No No Yes No No Yes Name of the
organization/company where
the lead worked.
FinServe Pvt Ltd
Job title / role held at that
organization.
Business Analyst
Industry or sector (for
filters/scoring).
Financial Services
Country where this job was
located (ISO-2).
IN
When the role started. Used to
calculate total experience.
2022-06-01
When the role ended. NULL
means current job.
2025-08-31 (or NULL if
still working there)
Whether this was a full-time
role. Can affect scoring or
eligibility.
TRUE
Whether this experience has
been verified (docs, reference,
etc.).
TRUE if HR verified;
FALSE if just self-reported
created_a
t
TIMESTAM
PTZ
Yes When this experience row was
inserted into your system.
Lead Test Scores Table
Column Type Require
d?
Meaning / Use test_id UUID Yes (PK) Unique ID for this test record.
One row per exam attempt.
lead_id UUID Yes (FK) Links the test score to a
specific lead. One lead →
many test rows.
test_type test_type
ENUM
Yes Which standardised test this is:
GMAT, GRE, CAT, SAT, IELTS,
etc.
test_date DATE No Date when the test was taken. total_sco
re
NUMERIC(6
,2)
No Overall score on that test.
Used for academic scoring or
eligibility.
2025-10-25
09:30:00+00
Example (Riya
Sharma –
GMAT)
7c2a9b1d-3e4
4-4f8e-9c10-
1a2b3c4d5e6f
L2025-001
(Riya’s lead ID)
GMAT
2025-09-10
690.00
section_j
son
percentil
e
attempt_n
o
verified created_a
t
JSONB NUMERIC(5
,2)
INTEGER BOOLEAN TIMESTAMP
TZ
No No No Yes
(default
FALSE)
Yes Breakdown by section as
JSON (flexible per exam).
Percentile rank (if available) for
extra context or scoring.
Attempt number for this test
type (1 = first attempt, 2 =
retake, etc.).
Whether this test score has
been verified (official score
report).
When this test record was
created in your system.
{"quant":47,
"verbal":38}
88.00 (88th
percentile)
1
TRUE once the
GMAT report is
uploaded/check
ed
2025-10-25
09:25:00+00
ENUM: test_type
Value Meaning
GMAT Graduate Management Admission Test
GRE Graduate Record Examination
CAT Common Admission Test (India)
SAT Scholastic Assessment Test
IELTS English language proficiency test
TOEFL English language proficiency test