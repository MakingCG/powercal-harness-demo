# PowerCal — master harness

[English](README.md)

Tento repozitár **nie je appka**. Je to *harness*, z ktorého AI coding agent appku skompiluje: definícia produktu, roadmapa so specmi featur, dátový model, kostra pravidiel pre kód, nakódovaný design systém so živým showcase a dva audity. Naklonuj si ho, daj Claude Code jeden prompt a postaví od nuly **PowerCal** — offline-first PWA na sledovanie kalórií a makier pre iPhone.

Je to sprievodný repozitár k článku **Prekompiluj, nerefaktoruj** — o tom, ako stavať softvér s AI tak, že neudržiavaš appku, ale systém, ktorý ju kompiluje:

- Slovensky: https://peterpapp.sk/blog/2026-09-22-prekompiluj-nerefaktoruj
- Anglicky: https://peterpapp.sk/en/blog/recompile-dont-refactor

Samotný harness je po anglicky — rovnako ako appka, ktorá z neho vznikne.

## Čo je vnútri

```
CLAUDE.md                     vstupný bod pre agenta: index harnessu, hlavné pravidlá, „Building the app"
harness/
  PRD.md                      čo staviame a prečo
  roadmap.md                  6 epík, F001–F072, stavy (všetko Specified)
  features/                   krátky spec pre každú featuru
  DATA-MODEL.md               entity, hotový vstup
  ARCHITECTURE.md             z čoho sa appka skladá a ako časti spolu hovoria, plus živý zoznam postaveného
  BOUNDARIES.md               čo smie importovať čo a čo zámerne nepoužívame
  DESIGN_SYSTEM.md            záväzný dizajn manuál vrátane textov a locale
  COMPONENTS.md               katalóg nakódovaných stavebných blokov
  ROUTES.md                   mapa obrazoviek
  ERRORS.md                   jeden spôsob, ako sa chyby dostanú k používateľovi
  DECISIONS.md                už prijaté rozhodnutia a prečo
.claude/commands/
  design-audit.md             /design-audit — UI oproti dizajn manuálu
  code-audit.md               /code-audit — kód oproti coding harnessu a specom
src/
  components/                 design systém (už nakódovaný)
  pages/DesignSystem.tsx      živý showcase na /design-system
```

## Rýchly štart

Potrebuješ Node.js 20.19+ (alebo 22+) a [Claude Code](https://claude.com/claude-code).

```bash
git clone https://github.com/MakingCG/powercal-harness-demo.git
cd powercal-harness-demo
npm install
npm run dev
```

Otvor http://localhost:5173/design-system — design systém, z ktorého sa appka postaví, so šablónami stránok a referenčnými kompozíciami.

Potom v repozitári otvor Claude Code a napíš:

```
Build the whole app from the roadmap.
```

## Čo čakať

- Agent si prečíta `CLAUDE.md`, otvára súbory harnessu, ktoré práve potrebuje, a stavia **epiku po epike** (Foundation → Food Library → Day Page → Weight & Progress → Backup & Settings → Polish).
- Hlavný agent je **orchestrátor**: každú epiku deleguje na subagenta a potom sám spustí bránu — `npm run lint`, `npm run build`, `/design-audit` a `/code-audit` s **nulou blokujúcich nálezov** — až potom ide ďalej.
- Po každej epike sa featury v `harness/roadmap.md` prepnú zo `Specified` na `Built` a epika sa commitne. Roadmapa sa ti pred očami postupne zapĺňa.
- F072 (QA na iOS zariadení) ostáva `Specified`: je to ručná kontrola na skutočnom iPhone.

<!-- TODO: build duration/usage -->

Keď skončí, `npm run dev` ti ukáže celú appku. Naplno si ju vyskúšaš, keď ju nasadíš na ľubovoľný statický hosting s HTTPS (napr. Vercel) a pridáš si ju na plochu iPhonu.

## Slučka prekompilovania

Appka je na jedno použitie, udržiavaš harness.

1. Postav appku z harnessu.
2. Používaj ju. Zapíš si, čo je zle alebo čo chýba.
3. Appku zahoď (`git reset` / `git checkout` späť na commit s harnessom).
4. Zmeň harness — spec, pravidlo kontraktu, pole v dátovom modeli, kontrolu v audite.
5. Postav znova. Zmena je všade, kde má byť, bez technického dlhu z lepenia.

Bug, ktorému chýba pravidlo, si zaslúži pravidlo, nie záplatu.

## Bez backendu, zámerne

PowerCal drží všetko v IndexedDB prehliadača (cez Dexie). Žiadny server, žiadne konto, žiadny Docker, nič na konfiguráciu. Trvácnosť dát zabezpečuje JSON záloha, ktorú exportuješ cez iOS zdieľanie a importuješ späť. Harness tak ostáva malý a prvý build rýchly — a architektúra drží úložisko za službami a hookmi, takže ho neskôr môže nahradiť backend bez zásahu do UI.

## Demo dáta

Po builde `Settings › Data › Load demo data` (alebo `Explore with demo data` na prvej obrazovke) naplní appku zhruba šiestimi týždňami realistických vygenerovaných jedál, uložených jedál, obľúbených potravín a vážení — deterministicky a relatívne k dnešku. Hodí sa na preskúmanie appky aj na nahrávanie screencastu. Sú to bežné dáta: export aj „Delete all data" fungujú ako zvyčajne.

## Príspevky

Pull requesty, ktoré zlepšujú **harness**, sú vítané — jasnejší spec, chýbajúce pravidlo kontraktu, lepšia kontrola v audite, ponaučenie z tvojho vlastného buildu. Kód appky prosím neposielaj: appka sa stavia z harnessu. Viac v [CONTRIBUTING.md](CONTRIBUTING.md).

## Poďakovanie

- Inšpirované autorovou fitness appkou [PowerUp](https://powerup.makingcg.com).
- Dáta o potravinách z [Open Food Facts](https://openfoodfacts.org) (ODbL; „Data © Open Food Facts contributors").
- Generické potraviny odvodené z USDA FoodData Central SR Legacy (public domain).

## Licencia

[MIT](LICENSE) © 2026 Peter Papp
