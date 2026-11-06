"""One-off editorial seed, researched 6 Nov 2026. Prices marked as estimates unless sourced."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
places = []
def add(id, name, category, area, address, cost, tagline, best, tip, source, phone='', maps='', **extra):
    places.append(dict(id=id,name=name,category=category,area=area,address=address,
        budget=cost,priceKind='estimate',host=len(places)<30,
        tagline=tagline,best=best,tip=tip,website=source if source.startswith('https://') else '',
        phone=phone,mapsUrl=maps,sources=[dict(label='Recherche / Anbieter',url=source)],
        checkedAt='2026-11-06',duration=60,tags=[],image=category,**extra))

add('favas',"Fava’s Bar e Cucina",'cafe','Capo','Via Nicolò Turrisi 2',[3,12],
    'Der unkomplizierte Start um die Ecke.','Espresso & süßes Frühstück',
    'Deine Host empfiehlt ausdrücklich das Frühstück. Gut für einen schnellen Start vor dem Capo-Markt.',
    'https://restaurantguru.it/Favas-Bar-e-Cucina-Palermo','+393479958885','https://g.co/kgs/hk6UCgh')
add('doba','DoBa Restaurant & Terrace','rooftop','Olivella','Via Bara all’Olivella 78',[45,85],
    'Ein besonderer Abend über den Dächern.','Terrasse mit Blick zum Teatro Massimo',
    'Zum Abendessen reservieren und nach einem Terrassenplatz fragen. Saisonale Menüs direkt beim Restaurant prüfen.',
    'https://www.dobarestaurant.it/','+393277661682','https://g.co/kgs/Sm6MBGD')
add('terrazze','Le Terrazze del Sole','rooftop','Cassaro','Via Vittorio Emanuele 291',[25,50],
    'Dachterrasse über der Piazza Pretoria.','Ausblick & Aperitivo nach bestätigter Wiedereröffnung',
    'Die offizielle Website kündigt eine Wiedereröffnung an. Vor dem Besuch unbedingt anrufen; vorerst kein spontaner Tipp.',
    'https://www.leterrazzedelsole.it/','+393703036507','https://g.co/kgs/V96ccHm',status='check',warning='Wiedereröffnung angekündigt · Betrieb vorab bestätigen')
add('branciforte','Ristorante Palazzo Branciforte','food','Castellammare','Largo Gae Aulenti 2',[55,100],
    'Sizilianische Küche im restaurierten Palazzo.','Degustationsmenü im Innenhof',
    'Für einen längeren, ruhigeren Abend reservieren. Das publizierte Sechs-Gänge-Menü kostet 90 €; Coperto 5 €.',
    'https://www.ristorantepalazzobranciforte.it/en/menu/menu-a-la-carte-spring-summer-2026/','+393668096244','https://g.co/kgs/rQTcNF4')
add('lumia','Lumia Restaurant','food','Capo','Via Sant’Agostino 136',[35,65],
    'Ein ruhiger Innenhof mitten im Zentrum.','Saisonales Abendessen im Boutiquehotel',
    'Teil von Casa Nostra Boutique Hotel. Nach dem aktuellen Menü und einem Tisch im Hof fragen.',
    'https://www.thefork.it/ristorante/lumia-restaurant-r708173','+39091327003','https://g.co/kgs/JEn82AH')
add('canopia','Canopia · Giungla Urbana','food','Cassaro','Via Vittorio Emanuele 198',[25,45],
    'Palermo auf dem Teller, mit einem modernen Dreh.','Menù Vucciria · fünf Gänge für 35 €',
    'Guter Einstieg in die lokale Küche. Das 35-€-Menü schließt Getränke und Coperto aus; à la carte z. B. Bucatini con le sarde.',
    'https://www.canopiapalermo.it/menu/','+393289190387','https://maps.app.goo.gl/KGTQeKog7wCpcaFP9')
add('angeliche','Le Angeliche','food','Capo','Vicolo Abbadia 10–14',[25,45],
    'Ein kleiner Rückzugsort im lebhaften Capo.','Saisonale sizilianische Marktküche',
    'Laut deiner Host ganz in der Nähe der Unterkunft. Die Küche kauft am Capo-Markt ein; lieber die Tagesempfehlung erfragen.',
    'https://www.leangeliche.it/cucina/','+393756874492','https://g.co/kgs/MCm3mY9')
add('ponticello','Ponticello Taverna Gastronomica','food','Albergheria','Vicolo Viola 2',[20,35],
    'Sizilianische Taverne in einer kleinen Seitengasse.','Polpette di pane & lokaler Käse',
    'Gut mit Ballarò oder Quattro Canti kombinierbar. Das aktuelle Menü liegt beim verlinkten digitalen Anbieter.',
    'https://www.leggimenu.it/menu/79pkbf2l71r1','+390917371417','https://g.co/kgs/v2drU7j')
add('fud','FUD Bottega Sicula','food','Olivella','Piazza Olivella 4',[15,25],
    'Sizilianische Zutaten, große Panini, lockere Stimmung.','Panini & sizilianische Produkte',
    'Praktisch vor dem Teatro Massimo. Der Anbieter führt auch vegetarische und vegane Gerichte; keine klassische Trattoria.',
    'https://www.fud.it/palermo/','+390916112184','https://share.google/u6uZL6XelfnHc2d64')
add('alivaru','Osteria Alivàru','food','Kalsa','Via della Vetriera 1',[25,40],
    'Familienküche mit Zutaten vom Ballarò.','Sizilianische Küche & ein lokaler Wein',
    'Carlo Napolis Osteria liegt an der Piazza Magione. Reservierung empfohlen; danach ein Spaziergang durch die Kalsa.',
    'https://www.alivaru.com/','+393403081048','https://g.co/kgs/uHfXiLA')
add('kassaro','Caffè del Kassaro','food','Cassaro','Via Vittorio Emanuele 390',[8,18],
    'Der günstige Mittagstipp deiner Host.','Einfaches sizilianisches Mittagessen',
    'Laut Host nur mittags geöffnet und sonntags geschlossen. Nicht für das Abendessen einplanen; aktuelle Zeiten telefonisch prüfen.',
    'https://www.tripadvisor.com/Restaurant_Review-g187890-d4097600-Reviews-Caffe_del_Kassaro-Palermo_Province_of_Palermo_Sicily.html','+390915070023','https://g.co/kgs/7JNhcF')
add('basile','Basile Focacceria del Massimo','street','Olivella','Via Bara all’Olivella',[5,12],
    'Ein schneller, herzhafter Stopp am Massimo.','Focaccia & palermitanische Snacks',
    'Ein günstiger Host-Tipp für zwischendurch. Die genaue Hausnummer ist noch nicht unabhängig bestätigt; Original-Maps-Link nutzen.',
    'https://yandex.com/maps/org/basile_focacceria_del_massimo/54345863408/','+39091335628','https://g.co/kgs/ZU5u2fZ')
add('buatta','Buatta Cucina Popolana','food','Cassaro','Via Vittorio Emanuele 176',[25,40],
    'Sizilianische Hausküche in einer alten Kofferhandlung.','Saisonale Klassiker & Sfincione zum Auftakt',
    'Im Michelin Guide geführt. Der historische Ladenraum ist ein Teil des Erlebnisses; für abends reservieren.',
    'https://www.buattapalermo.it/menu-di-palermo/','+39091322378','https://g.co/kgs/h72LTi')
add('scjabaca','Scjabaca','food','Kalsa','Vicolo San Carlo 42',[35,55],
    'Kreative Küche in den Gassen der Kalsa.','Glasierte Parmigiana · laut Menü 14 €',
    'Für einen bewussten Restaurantabend. Das publizierte Menü bietet auch pochiertes Ei und gerösteten Oktopus.',
    'https://www.scjabacaristorante.it/menu/','+390915076739','https://g.co/kgs/KGUB7KZ')
add('ottava','L’Ottava Nota','food','Kalsa','Via Butera 55',[65,120],
    'Ein Abend mit Zeit für mehrere Gänge.','Sette Note · sieben Gänge für 110 €',
    'Die offizielle Karte führt auch ein vegetarisches Degustationsmenü. Vorher reservieren; Weinbegleitung kostet extra.',
    'https://ristoranteottavanota.it/menu/','+390916168601','https://g.co/kgs/1mSzMwf')
add('bisso','Bisso Bistrot','food','Quattro Canti','Via Maqueda 172A',[15,30],
    'Ein lebendiges Bistrot direkt an den Quattro Canti.','Panelle & ein saisonales Pastagericht',
    'Unkomplizierter Stopp mitten im Zentrum. Die veröffentlichte Küche-Karte listet Panelle für 8 €; weitere Gerichte saisonal.',
    'https://bissobistrot.it/menu/','+393281314595','https://g.co/kgs/9pBuujH')
add('santa-cecilia','Real Teatro Santa Cecilia','culture','Kalsa','Piazza Teatro Santa Cecilia 5',[15,40],
    'Ein historisches Theater mit Jazz im Programm.','Ein Konzert des Brass Group',
    'Die Saison Brass in Jazz 2026/27 läuft laut Veranstalter von Oktober bis April. Konkreten Spieltag und Ticket direkt prüfen.',
    'https://www.brassgroup.it/brassainjazz26-27/','+390917782300','https://g.co/kgs/YCfxzGW')
add('cuticchio','Teatro dei Pupi · Cuticchio','culture','Olivella','Via Bara all’Olivella 95',[10,20],
    'Siziliens Puppentheater in einer lebendigen Tradition.','Eine Vorstellung der Figli d’Arte Cuticchio',
    'Das Programm vorher ansehen. Gut mit FUD, DoBa oder einem Abend am Teatro Massimo verbinden.',
    'https://www.figlidartecuticchio.com/','+39091323400','https://g.co/kgs/NCaEtEz')
add('argento','Opera dei Pupi · Famiglia Argento','culture','Cattedrale','Via Pietro Novelli 1',[12,12],
    'Paladine und Handwerkskunst gegenüber der Kathedrale.','Traditionelles Puppentheater im Palazzo Asmundo',
    'Die Stadt nennt 12 € für Erwachsene und 17:30 Uhr als tägliche Spielzeit. Vorher telefonisch bestätigen.',
    'https://turismo.comune.palermo.it/palermo-welcome-luogo-dettaglio.php?det=18&id=385&tp=68','+393491353267','https://g.co/kgs/T8gAEeHT')
add('ciccio','Ciccio Passami l’Olio','pizza','Kalsa','Via Castrofilippo 4',[12,22],
    'Pizza, sizilianische Mehle und die Piazza Magione.','Pizza Ciccio passami l’olio · laut Karte 11 €',
    'Die Hauspizza kommt mit Büffelmozzarella, Pilzen und Speck. Für den Start empfiehlt das Haus seine frittierten Donzelle.',
    'https://www.ciccio-passamilolio.it/menu/','+390916167109','https://g.co/kgs/T1bqjqz')
add('funnaco','Fúnnaco PizzaLab','pizza','Castellammare','Via Pantelleria 19',[15,25],
    'Pizza als kleines Teig-Experiment.','Verschiedene Teige & sizilianisches Craft Beer',
    'Der Anbieter nennt glutenfreie und laktosefreie Angebote. Bei Unverträglichkeiten die konkrete Zubereitung direkt abklären.',
    'https://www.funnaco.it/menu/','+393518767650','https://g.co/kgs/BrChjqE')
add('frida','Frida Pizzeria','pizza','Capo','Piazza Sant’Onofrio 37–38',[15,25],
    'Kreative Pizza an einer kleinen Altstadtpiazza.','Eine der kreativen Pizzen des Hauses',
    'Die Pizzeria experimentiert mit Formen und Zutaten. Abends reservieren, danach durch die Gassen zum Teatro Massimo.',
    'https://www.fridapizzeria.it/chi-siamo/','+390915505440','https://g.co/kgs/TBRV7QU')
add('stagnitta','Casa Stagnitta','cafe','Cassaro','Discesa dei Giudici 46',[3,10],
    'Eine Kaffeepause mit Geschichte.','Espresso oder Kaffeegranita',
    'Tagsüber vorbeischauen: Die offizielle Website nennt Montag bis Samstag 7–18 Uhr für die Caffetteria.',
    'https://www.casastagnitta.it/','+390916172819','https://g.co/kgs/34Fd5Bo')
add('enoteco','ENOTÈCO','wine','Kalsa','Via Giuseppe Garibaldi · Palazzo Aiutamicristo',[10,25],
    'Der Wein-Tipp deiner Host, aktuell mit Fragezeichen.','Weinabend nach Bestätigung des Betriebs',
    'Ein Bericht vom August 2026 nennt behördliche Maßnahmen am Lokal. Der aktuelle Betrieb ist ungeklärt; zuerst anrufen.',
    'https://www.lasicilia.it/news/cronaca/2549918/palermo-sequestrato-un-pub-realizzato-in-un-palazzo-storico.html','+393896940903','https://g.co/kgs/D1M8xoX',status='check',warning='Betrieb ungeklärt · vor dem Besuch anrufen')
add('barone','Dal Barone','wine','Kalsa','Via Alessandro Paternostro 87',[8,22],
    'Naturwein und ein Abend auf der Gasse.','Ein sizilianischer Naturwein nach Beratung',
    'Nach einem lokalen Orange Wine oder Perricone fragen. Dazu etwas Käse; früh vorbeischauen, wenn du einen Platz möchtest.',
    'https://www.corner.inc/place/pBbVSSNwq6sy','','https://g.co/kgs/uTVdrZ')
add('buonivini','Enoteca Buonivini','wine','Politeama','Via Dante 8',[10,25],
    'Eine große Weinauswahl nahe dem Politeama.','Sizilianischen Wein glasweise entdecken',
    'Ideal, wenn du verschiedene Regionen vergleichen willst. Die Website führt unter anderem Etna- und Marsala-Produzenten.',
    'https://www.enotecabuonivini.com/negozi','+390917847054','https://g.co/kgs/JrUKYbu')
add('vinoveritas','Vinoveritas','wine','Libertà','Viale Piemonte 22',[20,60],
    'Der Host-Tipp außerhalb der direkten Altstadt.','Weinauswahl & ein längerer Abend',
    'Über die Telefonnummer der Host eindeutig der Adresse Viale Piemonte 22 zugeordnet. Nicht mit der gleichnamigen Enoteca in Via Sammartino verwechseln.',
    'https://addiopizzo.org/rete-imprese/azienda/vinoveritas/','+39091342117','https://g.co/kgs/GgWXwcT')
add('costa','Pasticceria Costa','sweet','Quattro Canti','Via Maqueda 174',[3,9],
    'Ein süßer Stopp direkt am barocken Stadtkreuz.','Cannolo oder sizilianische Pasticceria',
    'Die zentrale Filiale liegt direkt bei Bisso. Praktisch für ein Dessert nach einem Rundgang durch den Cassaro.',
    'https://www.pasticceriacosta.com/contactus','','https://g.co/kgs/qGCh9o')
add('cappello-rotta','Pasticceria Cappello · Colonna Rotta','sweet','Palazzo Reale','Via Colonna Rotta 68',[4,10],
    'Schokolade als guter Grund für einen kleinen Umweg.','Torta Setteveli',
    'Die historische Filiale ist westlich des Palazzo Reale. Deine Host verortet sie grob bei Ballarò; die Adresse ist Via Colonna Rotta 68.',
    'https://www.touringclub.it/destinazioni/palermo/fare/271670-pasticceria-cappello','+39091489601','https://g.co/kgs/4RWPvA6')
add('cappello-politeama','Pasticceria Cappello · Politeama','sweet','Politeama','Via Nicolò Garzilli 10',[4,10],
    'Die Setteveli-Pause im Norden des Zentrums.','Schokoladen-Torte oder kleine Pasticceria',
    'Mehrere Verzeichnisse nennen abweichende Hausnummern 10/19. Original-Maps-Link oder Telefon zur Orientierung nutzen.',
    'https://www.touringclub.it/destinazioni/palermo/fare/271670-pasticceria-cappello','+390916113769','https://g.co/kgs/N1Myv3a')

add('cattedrale','Cattedrale · Die Dächer','culture','Cattedrale','Corso Vittorio Emanuele',[7,7],
    'Einmal über Palermo stehen.','Der Rundgang über die Dächer',
    'Das offizielle Ticket für die Dächer kostet regulär 7 €. Letzter Einlass 35 Minuten vor Schließung; Treppen einplanen.',
    'https://www.ticket-shop-cattedraledipalermo.it/amc/prodotto/tetti/')
add('palatina','Cappella Palatina & Palazzo Reale','culture','Palazzo Reale','Piazza del Parlamento 1',[15,25],
    'Goldene Mosaike, die lange im Kopf bleiben.','Die Mosaike der Cappella Palatina',
    'Der Anbieter weist aktuell auf Restaurierungsarbeiten hin. Verfügbarkeit und Ticketumfang vor dem Kauf prüfen.',
    'https://www.federicosecondo.org/visita/',warning='Restaurierung · Zugänglichkeit vorab prüfen')
add('massimo','Teatro Massimo','culture','Olivella','Piazza Verdi',[12,15],
    'Hinter die Fassade des großen Opernhauses schauen.','Eine Führung durch das Theater',
    'Führungen laut Anbieter täglich 9:30–19 Uhr, letzte Tour 18:20. Kombiticket mit Palazzo Butera: 19 €, 72 Stunden gültig.',
    'https://www.teatromassimo.it/visite-guidate/')
add('ballaro','Mercato di Ballarò','street','Albergheria','Piazza Ballarò',[0,12],
    'Laut, bunt und mitten im Alltag.','Tagsüber über den Markt schlendern & Streetfood probieren',
    'Unsere Empfehlung: vormittags kommen und kleine Portionen teilen. Markteintritt frei; Snacks extra. Mit Ponticello kombinieren.',
    'https://albergheriaecapoinsieme.chiesadipalermo.it/itinerario-di-visita-dei-quartieri-capo-ed-albergheria-contrade-e-monumenti/')
add('capo','Mercato del Capo','street','Capo','Via Porta Carini',[0,12],
    'Marktstände und sizilianische Straßenszenen.','Ein Vormittag zwischen Obst, Fisch & kleinen Snacks',
    'Unsere Empfehlung: tagsüber mit Zeit zum Schauen kommen. Le Angeliche ist ein schöner Anschluss für die Mittagspause.',
    'https://www.capomercato.eu/')
add('quattro','Quattro Canti','culture','Quattro Canti','Piazza Vigliena',[0,0],
    'Vier Fassaden. Das ganze Zentrum um dich herum.','Die barocke Kreuzung aus allen vier Richtungen ansehen',
    'Öffentlicher Platz, Eintritt frei. Von hier sind Piazza Pretoria, Costa und Bisso nur einen kurzen Spaziergang entfernt.',
    'https://turismo.comune.palermo.it/palermo-welcome-luogo-dettaglio.php?det=17&id=269&tp=68')
add('butera','Palazzo Butera','culture','Kalsa','Via Butera 8',[10,10],
    'Kunst, Palazzoräume und ein Blick aufs Meer.','Die Sammlung Valsecchi & die Aussicht',
    'Regulär 10 €, Dienstag bis Sonntag 10–20 Uhr, letzter Einlass 19 Uhr. Kombiticket mit Teatro Massimo: 19 €.',
    'https://www.palazzobutera.it/en/visit-us/')
add('botanico','Orto Botanico','outdoors','Kalsa','Via Lincoln 2',[8,10],
    'Riesige Wurzeln, Schatten und einmal durchatmen.','Ein langsamer Spaziergang durch die Pflanzensammlungen',
    'Öffnungszeiten sind saisonal; letzten Einlass und aktuellen Eintritt beim Anbieter prüfen. Danach zum nahen Foro Italico.',
    'https://musei.unipa.it/it/musei/orto-botanico')
add('foro','Foro Italico','outdoors','Kalsa','Foro Italico Umberto I',[0,0],
    'Meerluft ohne großen Plan.','Die Promenade zwischen Kalsa und Meer',
    'Öffentliche Grünfläche am Wasser. Unsere Empfehlung: später Nachmittag, dann durch die Kalsa zu einem Glas Wein.',
    'https://www.comune.palermo.it/vivere-il-comune/luoghi/foro-italico/')
add('mondello','Mondello','outdoors','Mondello','Viale Regina Elena · Mondello',[0,15],
    'Ein halber Tag zwischen Stadt und Strand.','Die Bucht und das alte Badehaus anschauen',
    'Außerhalb des Zentrums: Anfahrt separat planen. Strandspaziergang frei, Liegen und Gastronomie kosten extra; im November wetterabhängig.',
    'https://turismo.comune.palermo.it/palermo-welcome-mare-dettaglio.php?det=26&id=373&tp=158')

# Exact landmark coordinates; restaurants are geocoded separately and labelled.
known={'cattedrale':[38.1144,13.3560],'palatina':[38.1109,13.3537], 'massimo':[38.1202,13.3572],
 'ballaro':[38.1105,13.3619],'capo':[38.1188,13.3542],'quattro':[38.1158,13.3615],
 'butera':[38.1173,13.3718],'botanico':[38.1120,13.3731],'foro':[38.1178,13.3758], 'mondello':[38.2024,13.3243]}
fallback={'Capo':[38.1185,13.3547],'Olivella':[38.1202,13.3589], 'Cassaro':[38.1163,13.3638],
 'Castellammare':[38.1201,13.3648],'Albergheria':[38.1115,13.3615],'Kalsa':[38.1147,13.3692],
 'Quattro Canti':[38.1157,13.3616],'Cattedrale':[38.1140,13.3554], 'Politeama':[38.1268,13.3552],
 'Libertà':[38.1383,13.3505], 'Palazzo Reale':[38.1114,13.3508]}
hours={
 'favas':{str(d):[['07:00','16:00']] for d in range(1,7)},
 'angeliche':{'2':[['10:00','23:00']],'3':[['10:00','23:00']],'4':[['10:00','23:00']],'5':[['10:00','23:00']],'6':[['18:30','23:00']],'0':[['18:30','23:00']]},
 'fud':{str(d):[['12:00','00:30']] for d in range(7)},
 'branciforte':{**{str(d):[['12:30','15:00'],['19:30','23:00']] for d in range(2,7)},'0':[['19:30','23:00']]},
 'bisso':{str(d):[['09:00','00:00']] for d in range(7)},
 'stagnitta':{str(d):[['07:00','18:00']] for d in range(1,7)},
 'ciccio':{**{str(d):[['18:00','00:00']] for d in range(7)},'5':[['18:00','01:00']],'6':[['18:00','02:00']]},
 'buonivini':{str(d):[['09:30','13:30'],['16:00','00:00']] for d in range(7)},
 'massimo':{str(d):[['09:30','18:20']] for d in range(7)},
 'butera':{str(d):[['10:00','19:00']] for d in [0,2,3,4,5,6]},
 'costa':{str(d):[['08:30','23:00']] for d in range(7)},
}
tags={
 'favas':['Frühstück','Schnell','Host um die Ecke'],'doba':['Aussicht','Date Night','Reservieren'],
 'angeliche':['Marktküche','Vegetarische Optionen','Host um die Ecke'],
 'stagnitta':['Kaffee','Granita','Schnell'],'frida':['Pizza','Reservieren'],
 'funnaco':['Pizza','Besondere Teige'],'fud':['Vegan möglich','Schnell','Panini'],
 'costa':['Cannoli','Schnell'],'barone':['Naturwein','Aperitivo'],
 'buatta':['Sizilianisch','Michelin Guide','Reservieren'],
 'ballaro':['Markt','Tagsüber','Streetfood'],'capo':['Markt','Tagsüber','Streetfood'],
 'massimo':['Architektur','Bei Regen'],'butera':['Kunst','Bei Regen'],
 'palatina':['Mosaike','Bei Regen'],'foro':['Am Meer','Kostenlos'],'quattro':['Architektur','Kostenlos'],
 'mondello':['Strand','Ausflug'],'botanico':['Natur','Entspannen']}
for p in places:
    p['coords']=known.get(p['id'],fallback.get(p['area']))
    p['locationPrecision']='landmark' if p['id'] in known else 'area'
    p['tags']=tags.get(p['id'],[])
    if p['id'] in hours:p['hours']=hours[p['id']]
    if not p['mapsUrl']:p['mapsUrl']='https://www.google.com/maps/search/?api=1&query='+__import__('urllib.parse',fromlist=['quote']).quote(p['name']+' '+p['address']+' Palermo')
    if p['id'] in ['argento','cattedrale','butera','quattro','foro']:p['priceKind']='published'
    if p['category'] in ['cafe','sweet','street']:p['duration']=30
    if p['category']=='culture':p['duration']=75
    if p['id'] in ['doba','ottava','branciforte','palatina']:p['duration']=120
    if p['id']=='mondello':p['duration']=180
    if p['id'] in ['foro','quattro','mondello']:p['alwaysAccessible']=True
    if p['id']=='buatta':p['sources'].append({'label':'Michelin Guide','url':'https://guide.michelin.com/us/en/sicilia/palermo/restaurant/buatta-cucina-popolana'})

ratings={
 'favas':(4.7,5,None,'Google via Restaurant Guru','https://restaurantguru.it/Favas-Bar-e-Cucina-Palermo'),
 'doba':(4.5,5,132,'Tripadvisor','https://www.tripadvisor.it/Restaurant_Review-g187890-d26271547-Reviews-Doba_Restaurant_and_Terrace-Palermo_Province_of_Palermo_Sicily.html'),
 'fud':(9.1,10,34,'TheFork','https://www.thefork.com/restaurant/fud-bottega-sicula-palermo-r865750/menu'),
 'ponticello':(9.0,10,432,'TheFork','https://www.thefork.it/ristorante/ponticello-taverna-gastronomica-r697793'),
 'buonivini':(3.8,5,177,'Tripadvisor','https://www.tripadvisor.com/Restaurant_Review-g187890-d3621717-Reviews-Enoteca_Buonivini-Palermo_Province_of_Palermo_Sicily.html')}
for p in places:
    if p['id'] in ratings:
        v,s,c,l,u=ratings[p['id']];p['rating']={'value':v,'scale':s,'count':c,'source':l,'url':u,'checkedAt':'2026-11-06'}
    p['related']=[q['id'] for q in places if q['id']!=p['id'] and q['area']==p['area']][:4]

data={'version':1,'updatedAt':'2026-11-06','city':'Palermo','places':places}
(ROOT/'public/data/places.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print(f'Seeded {len(places)} places ({sum(p["host"] for p in places)} host recommendations)')
