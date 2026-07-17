# MedFitIvan — веб-сајт

Целосно статичен, брз, SEO-оптимизиран сајт (чист HTML5/CSS3/JS — без build чекор, без зависности), изработен за д-р Иван (доктор по општа медицина и фитнес тренер).

## Зошто чист HTML/CSS/JS, а не React?

Сајтот е претежно статична содржина (текст, слики, форми, еден слајдер) без сложена интерактивна состојба. React + build процес би додале сложеност (bundler, node_modules, deploy pipeline) без реална придобивка, а притоа:
- секој HTML фајл е веднаш crawl-able од Google без server-side rendering,
- нема JS bundle кој мора прво да се превземе/изврши пред content да се прикаже (побрз first paint),
- може да се хостира буквално каде било (Netlify, Vercel, GitHub Pages, обичен shared hosting, Firebase Hosting — истото каде што е моменталниот сајт).

## Структура на фајлови

```
index.html              Главна страница (сите 11 секции + smooth-scroll анкери)
blog/
  vezhbi-za-rbet.html    Пример блог-напис 1
  brzi-dieti.html        Пример блог-напис 2
  preventiven-pregled.html  Пример блог-напис 3
  blog.css               Типографија само за блог-статии
css/
  style.css              Целосен дизајн систем (бои, layout, responsive, dark mode)
js/
  main.js                Мени, smooth scroll, reveal анимации, dark mode, слајдер, валидација форма
assets/
  fonts/                 Self-hosted Inter + Montserrat (cyrillic поддршка), без Google Fonts повик
  img/                   Лого (SVG) + placeholder слики (SVG) — замени со вистински фотографии
robots.txt, sitemap.xml  SEO
```

## Хостирање (3 опции)

### Netlify (најбрзо)
1. Одете на [app.netlify.com/drop](https://app.netlify.com/drop)
2. Влечете ја целата папка `websajt` во browser-от
3. Готово — сајтот е веднаш live на `*.netlify.app` адреса. Подоцна може да си додадете custom домен во Site settings → Domain management.

### Vercel
1. `npm i -g vercel` (или користете ја веб верзијата на vercel.com)
2. Во папката на проектот: `vercel --prod`
3. Следете ги упатствата (нема потреба од build command, ова е статичен сајт)

### Firebase Hosting (истиот сервис каде што веќе имате домен `medfitivan-55cac.web.app`)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting     # избери постоечки проект medfitivan-55cac, public directory = "."
firebase deploy
```

## Задолжителни замени пред да оди во продукција

| Локација | Што треба да се замени |
|---|---|
| `index.html` `<title>`, meta description, `og:url`, `canonical` | `medfitivan.example.com` → вистинскиот домен |
| JSON-LD (Person + MedicalBusiness, во `<head>`) | Презиме, точна адреса, телефон, е-мејл, GPS координати, работно време |
| Секција „Контакт“ | Адреса, телефон, е-мејл (сега се placeholder со видлива ознака) |
| Секција „Контакт“ → Google Maps `<iframe>` | `src="...q=Skopje,+North+Macedonia..."` → внесете ја вистинската адреса во `q=` параметарот |
| Социјални мрежи (header, footer, контакт секција) | `instagram.com/medfitivan`, `facebook.com/medfitivan`, `linkedin.com/company/medfitivan` → вистински профили |
| Секција „Закажување“ (`#booking`) | Замени го `.calendly-placeholder` блокот со вистинскиот Calendly embed код (инструкции се веќе испишани во кутијата на сајтот) |
| Контакт форма (`<form data-validate>`) | Моментално само валидира и прикажува „испратено“ порака (нема реален backend). Поврзи со Formspree, Netlify Forms или сопствен backend за навистина да пристигнуваат пораките |
| Сите слики во `assets/img/*.svg` | Замени со вистински фотографии (портрет, hero слика, testimonials, блог-слики). Задржи ги истите имиња на фајлови или ажурирај ги патеките во HTML |
| `assets/img/logo.svg` / `logo-mark.svg` | Ова е реконструкција на твоето лого според сликата што ја испрати. Ако имаш оригинален вектор (AI/SVG/PNG со проѕирност), замени го овој фајл за 100% точно лого |
| Секција „Сертификати“ | Точни имиња на институции, години, броеви на лиценци |
| Секција „Пакети“ | Цените се примери — прилагоди según твоите вистински услуги |
| Тестимонијали | Вистински имиња, изјави и (со дозвола) фотографии на клиенти |
| `robots.txt`, `sitemap.xml` | Замени го доменот `medfitivan.example.com` со вистинскиот |

## Функционалности вклучени

- Sticky header со smooth-scroll навигација + активна секција highlight
- Мобилно hamburger мени (fullscreen overlay)
- Sticky "Закажи термин" копче на мобилен
- Dark/Light mode (се памети во localStorage)
- Scroll-reveal анимации (fade/slide-up), почитува `prefers-reduced-motion`
- Тестимонијал слајдер (авто-play + ръчна навигација)
- Контакт форма со client-side валидација (име, е-мејл формат, телефон формат)
- Целосен SEO: semantic HTML5, meta tags, Open Graph, JSON-LD (Person + MedicalBusiness), sitemap, robots.txt
- Accessibility: skip-link, aria-labels, keyboard focus states, WCAG AA контраст-проверени бои (двете теми), alt текстови на сите слики
- Self-hosted фонтови (Inter + Montserrat, со кирилична поддршка) — нема надворешни повици кон Google Fonts, побрзо вчитување
- Responsive: тестирано на mobile (390px), tablet (768-820px) и desktop (1280px+)

## Локално тестирање пред deploy

```bash
cd websajt
python3 -m http.server 8000
# отвори http://localhost:8000
```
