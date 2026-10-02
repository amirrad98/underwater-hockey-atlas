"""Rebuild normalized public content while preserving complete per-source provenance."""
import json
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode
ROOT=Path(__file__).resolve().parents[1]
def read(name): return json.loads((ROOT/'research'/f'uwh_{name}.json').read_text())
c,r,w,t=[read(n) for n in ['coaching_equipment','rules_safety','world_directory','timber_whales']]
def text(v):
 if v is None:return ''
 if isinstance(v,list):return ', '.join(map(str,v))
 if isinstance(v,dict):return '; '.join(f'{k}: {text(x)}' for k,x in v.items())
 return str(v)
def canon(url):
 p=urlsplit(url); host=p.netloc.lower().removeprefix('www.'); path=p.path.rstrip('/') or '/'
 # Known official index aliases checked during research.
 if host=='cmas.org' and path in ['/hockey','/hockey.html']:path='/hockey'
 if host=='underwaterhockeynz.com':path=path.lower()
 q=urlencode([(k,v) for k,v in parse_qsl(p.query) if not k.startswith('utm_') and k not in ['fbclid','img_index']])
 return urlunsplit(('https',host,path,q,''))
rows=[]; byurl={}; aliases={}
for catalog,records in [('coaching',c['sources']),('rules',r['resources']),('world',w['sources']),('club',t['sources'])]:
 for s in records:
  key=canon(s['url']); ident=f"{catalog}-{s['id']}".replace("_", "-"); aliases[f"{catalog}:{s['id']}"]=byurl.get(key,ident)
  if key in byurl:
   row=next(x for x in rows if x['id']==byurl[key]);row['sourceRecords'].append({'catalog':catalog,**s});continue
  byurl[key]=ident
  verify=text(s.get('verification',s.get('verification_status',s.get('verification_method',s.get('access_method','Unspecified')))))
  low=verify.lower()
  status='Snapshot conflict' if 'conflict' in low else 'Restricted' if 'login' in low or 'restricted' in low else 'Indexed' if any(x in low for x in ['indexed','search','timeout','error','cache miss','outgoing','page or indexed']) else 'Checked'
  if 'historical' in low:status='Historical'
  rows.append(dict(id=ident,title=s['title'],url=s['url'],publisher=text(s.get('publisher',s.get('publisher_type',s.get('authority',urlsplit(s['url']).netloc)))),topic=text(s.get('category',s.get('type','World' if catalog=='world' else 'Clubs' if catalog=='club' else 'Reference'))).capitalize(),language=text(s.get('languages',s.get('language',['en']))),audience=text(s.get('audience','Everyone')),authority=text(s.get('authority',s.get('publisher_type','Research source'))),access=text(s.get('access','Public source; platform restrictions may apply' if catalog=='club' else 'See source')),status=status,version=text(s.get('versionDate',s.get('date_or_version',s.get('source_date_or_version',s.get('published_date'))))),date=text(s.get('versionDate',s.get('date_or_version',s.get('source_date_or_version',s.get('published_date')))) or s.get('checkedAt',s.get('verified_at',s.get('checked_on',s.get('retrieved_at','2026-10-02'))))),note=' · '.join(filter(None,[text(s.get('summary',s.get('description',s.get('evidence_note')))),verify,text(s.get('notes',s.get('caveats',s.get('freshness'))))])),rights=text(s.get('rights',s.get('usage_license_constraints',s.get('licence','No reuse permission established; link to original')))),jurisdiction=text(s.get('country',s.get('region',s.get('geography','See source')))),sourceRecords=[{'catalog':catalog,**s}]))
# Surface every merged record's differing verification and rights instead of silently choosing the first.
for row in rows:
 if len(row['sourceRecords'])>1:
  states=[]
  for s in row['sourceRecords']:
   state=text(s.get('verification',s.get('verification_status',s.get('verification_method',s.get('access_method')))))
   if state and state not in states:states.append(state)
  row['note']+=' · Catalog evidence: '+' | '.join(states)
  if any('conflict' in x.lower() for x in states):row['status']='Snapshot conflict'
  if any('login' in x.lower() for x in states):row['status']='Restricted'
def refs(cat,ids):return list(dict.fromkeys(aliases[f'{cat}:{i}'] for i in ids))
article_alias={'start-with-a-club':'first-session','equipment-fit':'equipment','passing-receiving':'passing','rules-and-version-guide':'rules','safe-practice-and-emergency-plans':'safety'}
arts=[]
for a in c['chapters']:
 arts.append(dict(id=article_alias.get(a['id'],a['id']),title=a['title'],category=a['category'],summary=a['summary'],sections=[dict(heading=s['heading'],body=s['text']) for s in a['sections']]+[dict(heading='Editorial status',body=a['editorialStatus'])],sourceIds=refs('coaching',a['sourceIds']),related=[article_alias.get(i,i) for i in a['related']]))
for a in r['wiki_sections']:
 arts.append(dict(id=article_alias.get(a['slug'],a['slug']),title=a['title'],category='Safety' if any(x in a['slug'] for x in ['safe','concussion','fitness']) else 'Rules',summary=a['intro'],sections=[dict(heading='Reference guide',body=a['intro']),dict(heading='Explore this topic',body=' • '.join(a['subtopics']))]+([dict(heading='Evidence boundary',body=a['caveat'])] if a.get('caveat') else []),sourceIds=refs('rules',a['source_ids']),related=['rules','equipment','safety']))
arts.append(dict(id='timber-whales',title='UNBC Timber Whales',category='Clubs',summary=t['original_profile_text']['short'],sections=[dict(heading='Club profile',body=t['original_profile_text']['wiki']),dict(heading='Fall 2026 · source freshness',body=t['original_profile_text']['freshness_banner']),dict(heading='People and continuity',body='The public website lists 20 players and staff without a roster date. Current membership and 2026 leadership are unconfirmed. A leadership transition in 2025 is historical; no roster names or identities inferred from photos are published here.'),dict(heading='Schedule exceptions',body='Times are local to Prince George. An exact season end and holiday cancellations are not established; confirm with the club before visiting.')],sourceIds=refs('club',['club_home','club_team','fall_2026_schedule','club_prices','city_aquatics','nugss_status','unbc_history','leadership_2025','agm_2026']),related=['first-session','world-guide','history']))
places=[]
for a in w['representative_locations']:
 co=a['coordinates'] or {}
 places.append(dict(id='timber-whales' if 'timber' in a['name'].lower() else a['id'],name=a['name'],country=a['country'],region=a['continent'],lat=co.get('latitude'),lon=co.get('longitude'),precision=a['coordinate_precision'] + (' · unpinned' if not co else ''),description=' · '.join(filter(None,[a['city'],a['venue_or_area'],a['status'],a['notes']])),url=a['website'] or a['evidence_urls'][0],sourceIds=refs('world',a['source_ids']),metadata=a))
for a in w['national_organizations']:
 places.append(dict(id='nation-'+a['country_code'].lower(),name=a['hockey_organization'] or a['umbrella_organization'],country=a['country'],region='National organizations',lat=None,lon=None,precision='National organization · unpinned',description=a['status']+' · '+a['note'],url=next(x['url'] for x in rows if x['id']==refs('world',a['source_ids'])[-1]),sourceIds=refs('world',a['source_ids']),metadata=a))
# Prefer the club-specific municipality-linked point and dated schedule to older national listing.
for p in places:
 if p['id']=='timber-whales':
  co=t['practice']['coordinates']['value'];p.update(lat=co['latitude'],lon=co['longitude'],precision='Municipality-linked venue point; not separately surveyed',description='Canfor Leisure Pool, Prince George. Fall 2026 schedule from 12 September club announcement; older CUGA venue is historical.',url='#/wiki/timber-whales',metadata={'directoryRecord':p['metadata'],'practice':t['practice']})
for a in arts:a['related']=[x for x in a['related'] if x!=a['id']]
out='// Generated by scripts/import_research.py; edit original catalogs or importer.\nimport type { Article, Resource, Place } from "./data";\n'
for name,typ,obj in [('importedResources','Resource[]',rows),('importedArticles','Article[]',arts),('importedPlaces','Place[]',places)]:out+=f'export const {name}: {typ} = '+json.dumps(obj,ensure_ascii=False,indent=2)+';\n'
out+='export const researchStats = '+json.dumps(dict(sourceRecords=211,uniqueResources=len(rows),chapters=14,wikiSections=8,nationalOrganizations=29,representativeLocations=27))+';\n'
(ROOT/'src/research-data.ts').write_text(out)
(ROOT/'research/import-aliases.json').write_text(json.dumps(aliases,indent=2))
print(len(rows),'unique resources;',len(arts),'imported articles;',len(places),'places')
